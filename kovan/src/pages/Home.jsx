import React, { useState, useEffect } from 'react';
import PageLayout from '../layouts/PageLayout';
import { useCollection, useFirestoreCRUD } from '../hooks/useFirestoreCRUD';

// Get user data from localStorage
const getUserData = () => {
  const saved = localStorage.getItem('userData');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    name: 'Mehmet Korkmaz',
    headline: 'Gönüllü',
    bio: 'Gönüllülük faaliyetlerine katılmayı seven, topluma katkı sağlamaktan mutluluk duyan biriyim.'
  };
};

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to format relative time
const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  const now = new Date();
  const postDate = new Date(timestamp);
  const diffMs = now - postDate;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const TRENDING_TOPICS = [
  { tag: '#Gönüllülük', posts: 156, slug: 'gonulluluk' },
  { tag: '#Yazılım', posts: 89, slug: 'yazilim' },
  { tag: '#ÇevreKoruma', posts: 67, slug: 'cevre-koruma' },
  { tag: '#Eğitim', posts: 54, slug: 'egitim' },
  { tag: '#SosyalSorumluluk', posts: 42, slug: 'sosyal-sorumluluk' },
  { tag: '#SağlıkDestek', posts: 38, slug: 'saglik-destek' },
  { tag: '#HayvanHakları', posts: 31, slug: 'hayvan-haklari' },
  { tag: '#TeknolojEğitimi', posts: 27, slug: 'teknoloji-egitimi' }
];

const Home = () => {
  const [userData, setUserData] = useState(getUserData());
  const [postText, setPostText] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [commentInputs, setCommentInputs] = useState({}); // Her post için ayrı input
  const [postComments, setPostComments] = useState({}); // Her post'un yorumları
  const [isPosting, setIsPosting] = useState(false);

  // Fetch posts from Firestore with real-time updates
  const { data: firestorePosts, loading: postsLoading } = useCollection('posts', {
    orderByField: 'createdAt',
    orderDirection: 'desc',
    realtime: true
  });

  // CRUD operations
  const { create, incrementField } = useFirestoreCRUD('posts');

  // Update user data when component mounts or localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUserData(getUserData());
    };
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on mount
    setUserData(getUserData());
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handlePost = async () => {
    if (postText.trim()) {
      // Check if user is logged in
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        alert('Post paylaşmak için giriş yapmalısınız!');
        window.location.href = '/login';
        return;
      }

      setIsPosting(true);
      try {
        await create({
          content: postText.trim(),
          authorId: currentUserId,
          authorName: userData.name,
          authorTitle: userData.headline,
          avatarUrl: userData.avatarUrl || '',
          likes: 0,
          comments: 0,
          shares: 0,
          commentCount: 0
        });
        setPostText('');
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Post paylaşılamadı. Lütfen tekrar deneyin.');
      } finally {
        setIsPosting(false);
      }
    }
  };

  const toggleComments = async (postId) => {
    const isExpanding = !expandedComments[postId];
    
    setExpandedComments(prev => ({
      ...prev,
      [postId]: isExpanding
    }));

    // Yorumları Firestore'dan çek
    if (isExpanding && !postComments[postId]) {
      try {
        const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
        const { db } = await import('../config/firebase');
        
        const commentsRef = collection(db, 'posts', postId, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const comments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPostComments(prev => ({
          ...prev,
          [postId]: comments
        }));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
  };

  const handleLike = async (postId, currentLikes) => {
    // Optimistic UI update
    setLikedPosts(prev => {
      const isCurrentlyLiked = prev[postId];
      const newLikedState = { ...prev, [postId]: !isCurrentlyLiked };
      
      // Update like count based on new state
      setLikeCounts(prevCounts => ({
        ...prevCounts,
        [postId]: prevCounts[postId] !== undefined 
          ? prevCounts[postId] + (isCurrentlyLiked ? -1 : 1)
          : currentLikes + 1
      }));
      
      return newLikedState;
    });

    // Update in Firestore
    try {
      await incrementField(postId, 'likes', 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const openPostModal = (post) => {
    setSelectedPost(post);
  };

  const closePostModal = () => {
    setSelectedPost(null);
  };

  const handleAddComment = async (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    try {
      const { collection, addDoc, serverTimestamp, doc, updateDoc, increment } = await import('firebase/firestore');
      const { db } = await import('../config/firebase');
      
      const currentUserId = localStorage.getItem('currentUserId') || 'user-temp-' + Date.now();
      
      // Yorumu ekle
      const commentsRef = collection(db, 'posts', postId, 'comments');
      await addDoc(commentsRef, {
        text: commentText,
        authorId: currentUserId,
        authorName: userData.name,
        avatarUrl: userData.avatarUrl || '',
        createdAt: serverTimestamp()
      });

      // Post'un comment count'unu artır
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentCount: increment(1)
      });

      // Input'u temizle
      setCommentInputs(prev => ({
        ...prev,
        [postId]: ''
      }));

      // Yorumları yeniden yükle
      const { getDocs, query, orderBy } = await import('firebase/firestore');
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const comments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPostComments(prev => ({
        ...prev,
        [postId]: comments
      }));

    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Yorum eklenemedi. Lütfen tekrar deneyin.');
    }
  };

  return (
    <PageLayout showSearch={true} userData={userData}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-6">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Sidebar - Profile & Stats */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sticky top-6">
                {/* Profile Section */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl mb-3 overflow-hidden">
                    {userData.avatarUrl ? (
                      <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(userData.name)
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{userData.name}</h3>
                  <p className="text-sm text-gray-500">{userData.headline}</p>
                </div>

                {/* About Section */}
                <div className="pt-4 mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Hakkında</h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {userData.bio}
                  </p>
                </div>

                {/* Stats */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">Takipçiler</span>
                    <span className="font-bold text-blue-600">248</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Takip Edilenler</span>
                    <span className="font-bold text-teal-600">312</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Alınan Rozetler</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {userData.badges && userData.badges.length > 0 ? (
                      userData.badges.map((badge) => (
                        <div key={badge.id} className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden bg-gray-50" title={badge.name}>
                          <img src={badge.imageUrl} alt={badge.name} className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">Henüz rozet yok</p>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* Center Feed */}
            <main className="lg:col-span-6">
              
              {/* Post Input Box */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
                <div className="flex gap-3">
                  <a 
                    href="/me"
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0 hover:scale-110 transition-transform overflow-hidden"
                  >
                    {userData.avatarUrl ? (
                      <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(userData.name)
                    )}
                  </a>
                  <div className="flex-1">
                    <textarea
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      placeholder="Type and post your ideas..."
                      className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="3"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handlePost}
                        disabled={isPosting || !postText.trim()}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${
                          isPosting || !postText.trim()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isPosting ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Stream */}
              {postsLoading && firestorePosts.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading posts...</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Render All Posts from Firestore Database */}
                {firestorePosts.map(post => (
                  <article key={post.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
                    
                    {/* Post Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <a 
                        href={`/profile/${post.authorId}`}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold flex-shrink-0 hover:scale-110 transition-transform overflow-hidden"
                      >
                        {post.avatarUrl ? (
                          <img src={post.avatarUrl} alt={post.authorName} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(post.authorName || 'User')
                        )}
                      </a>
                      <div className="flex-1 min-w-0">
                        <a 
                          href={`/profile/${post.authorId}`}
                          className="font-bold text-gray-900 text-base hover:text-blue-600 transition"
                        >
                          {post.authorName || 'User'}
                        </a>
                        <p className="text-sm text-gray-500">{post.authorTitle || 'Gönüllü'}</p>
                      </div>
                      <span className="text-xs text-gray-400">{getTimeAgo(post.createdAt)}</span>
                    </div>

                    {/* Post Content */}
                    <p 
                      className="text-gray-700 mb-4 leading-relaxed cursor-pointer"
                      onClick={() => openPostModal(post)}
                    >
                      {post.content}
                    </p>

                    {/* Post Actions */}
                    <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                      <button 
                        onClick={() => handleLike(post.id, post.likes || 0)}
                        className={`flex items-center gap-2 transition-all duration-300 ${
                          likedPosts[post.id] 
                            ? 'text-blue-600' 
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                      >
                        <span className={`relative inline-flex items-center justify-center ${
                          likedPosts[post.id] 
                            ? 'animate-bounce' 
                            : ''
                        }`}>
                          <span className={`absolute inset-0 rounded-full transition-all duration-300 ${
                            likedPosts[post.id] 
                              ? 'bg-blue-100 scale-150' 
                              : 'bg-transparent scale-100'
                          }`}></span>
                          <span className="text-lg relative z-10">👍</span>
                        </span>
                        <span className="text-sm font-medium">{likeCounts[post.id] ?? post.likes ?? 0}</span>
                      </button>
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                      >
                        <span className="text-lg">💬</span>
                        <span className="text-sm font-medium">{post.commentCount ?? post.comments ?? 0}</span>
                      </button>
                    </div>

                    {/* Comments Section - Toggle */}
                    {expandedComments[post.id] && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h5 className="font-semibold text-gray-900 mb-3 text-sm">Yorumlar</h5>
                        <div className="space-y-3 mb-4">
                          {postComments[post.id] && postComments[post.id].length > 0 ? (
                            postComments[post.id].map(comment => (
                              <div key={comment.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
                                  {comment.avatarUrl ? (
                                    <img src={comment.avatarUrl} alt={comment.authorName} className="w-full h-full object-cover" />
                                  ) : (
                                    getInitials(comment.authorName || 'User')
                                  )}
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-gray-900 text-sm">{comment.authorName}</p>
                                    <span className="text-xs text-gray-400">{getTimeAgo(comment.createdAt)}</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.text}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-3 text-center text-sm text-gray-600">
                              <p>Henüz yorum yok. İlk yorumu sen yap!</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Yorum yaz..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id);
                              }
                            }}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button 
                            onClick={() => handleAddComment(post.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                          >
                            Gönder
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </main>

            {/* Right Sidebar - Trending */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sticky top-6">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Gündem</h3>
                <div className="space-y-4 bg-gradient-to-br from-gray-50 to-slate-100 p-4 rounded-xl">
                  {TRENDING_TOPICS.map((topic, index) => (
                    <a 
                      key={index} 
                      href={`/hashtag/${topic.slug}`}
                      className="block hover:bg-white p-3 rounded-lg transition cursor-pointer"
                    >
                      <p className="font-semibold text-blue-600 text-sm">{topic.tag}</p>
                      <p className="text-xs text-gray-500 mt-1">{topic.posts} gönderi</p>
                    </a>
                  ))}
                </div>

                {/* Suggestions */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 text-base mb-4">Önerilen Profiller</h4>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        EB
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">Elif Başaran</p>
                        <p className="text-xs text-gray-500">Proje Lideri</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition flex-shrink-0">
                        Takip Et
                      </button>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        CA
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">Can Arslan</p>
                        <p className="text-xs text-gray-500">Gönüllü</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition flex-shrink-0">
                        Takip Et
                      </button>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        SK
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">Selin Kılıç</p>
                        <p className="text-xs text-gray-500">Sosyal Medya</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition flex-shrink-0">
                        Takip Et
                      </button>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        BT
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">Burak Tekin</p>
                        <p className="text-xs text-gray-500">Yazılım Geliştirici</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition flex-shrink-0">
                        Takip Et
                      </button>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        DA
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">Deniz Aydın</p>
                        <p className="text-xs text-gray-500">UX Designer</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition flex-shrink-0">
                        Takip Et
                      </button>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        EY
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">Emre Yıldız</p>
                        <p className="text-xs text-gray-500">Proje Yöneticisi</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition flex-shrink-0">
                        Takip Et
                      </button>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        GS
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">Gizem Şahin</p>
                        <p className="text-xs text-gray-500">Grafik Tasarımcı</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition flex-shrink-0">
                        Takip Et
                      </button>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-green-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        HÖ
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">Hakan Özdemir</p>
                        <p className="text-xs text-gray-500">İçerik Üreticisi</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition flex-shrink-0">
                        Takip Et
                      </button>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        İK
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">İpek Kaya</p>
                        <p className="text-xs text-gray-500">Etkinlik Koordinatörü</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition flex-shrink-0">
                        Takip Et
                      </button>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        KM
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">Kemal Mutlu</p>
                        <p className="text-xs text-gray-500">Gönüllü Mentor</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition flex-shrink-0">
                        Takip Et
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closePostModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-end">
              <button 
                onClick={closePostModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-4">
                <a 
                  href={`/profile/${selectedPost.author.userId}`}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold flex-shrink-0 hover:scale-110 transition-transform"
                >
                  {selectedPost.author.avatar}
                </a>
                <div className="flex-1 min-w-0">
                  <a 
                    href={`/profile/${selectedPost.author.userId}`}
                    className="font-bold text-gray-900 text-base hover:text-blue-600 transition"
                  >
                    {selectedPost.author.name}
                  </a>
                  <p className="text-sm text-gray-500">{selectedPost.author.title}</p>
                </div>
                <span className="text-xs text-gray-400">{selectedPost.timestamp}</span>
              </div>

              {/* Post Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">{selectedPost.content}</p>

              {/* Post Stats */}
              <div className="flex items-center gap-6 pb-4 mb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👍</span>
                  <span className="text-sm font-medium text-gray-600">{likeCounts[selectedPost.id] || selectedPost.likes} beğeni</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  <span className="text-sm font-medium text-gray-600">{selectedPost.comments} yorum</span>
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-4">Yorumlar ({selectedPost.commentList?.length || 0})</h5>
                <div className="space-y-4 mb-6">
                  {selectedPost.commentList?.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {comment.avatar}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900 text-sm">{comment.author}</p>
                          <span className="text-xs text-gray-400">{comment.time}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    MK
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Yorumunuzu yazın..."
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="3"
                    />
                    <div className="flex justify-end mt-2">
                      <button 
                        onClick={handleAddComment}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                      >
                        Yorum Yap
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Home;
