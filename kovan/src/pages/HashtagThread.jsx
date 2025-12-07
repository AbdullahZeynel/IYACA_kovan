import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';

// Hashtag içerikleri
const HASHTAG_DATA = {
  'gonulluluk': {
    tag: '#Gönüllülük',
    posts: [
      {
        id: 1,
        author: { name: 'Ayşe Yılmaz', title: 'Gönüllü Koordinatörü', avatar: 'AY', userId: 'user-001' },
        content: 'Bugün 30 çocukla bilim atölyesi düzenledik. Gözlerindeki merak ve heyecan muhteşemdi! 🔬 Her hafta Cumartesi devam ediyoruz. #Gönüllülük #Eğitim',
        timestamp: '2 saat önce',
        likes: 147,
        comments: 23,
        commentList: [
          { id: 1, author: 'Can Yılmaz', avatar: 'CY', text: 'Harika bir etkinlik! Devamını bekliyoruz 🎉', time: '1 saat önce' },
          { id: 2, author: 'Selin Kaya', avatar: 'SK', text: 'Çocukların bilimle tanışması çok önemli. Tebrikler!', time: '45 dk önce' }
        ]
      },
      {
        id: 2,
        author: { name: 'Murat Özkan', title: 'Sosyal Proje Lideri', avatar: 'MÖ', userId: 'user-004' },
        content: 'Deprem bölgesinde 1 haftalık gönüllü çalışmamız sona erdi. 500+ aileye yardım ulaştırdık. Ekip arkadaşlarıma teşekkürler! 🙏 #Gönüllülük #AfetYardım',
        timestamp: '4 saat önce',
        likes: 289,
        comments: 45,
        commentList: [
          { id: 1, author: 'Deniz Akar', avatar: 'DA', text: 'Sizler gibi insanlar sayesinde dünya daha güzel 💪', time: '3 saat önce' },
          { id: 2, author: 'Ece Demir', avatar: 'ED', text: 'Çok gurur verici bir çalışma!', time: '2 saat önce' }
        ]
      },
      {
        id: 3,
        author: { name: 'Zeynep Kara', title: 'Eğitim Gönüllüsü', avatar: 'ZK', userId: 'user-005' },
        content: 'Köy okulunda kitap okuma etkinliği düzenledik. 60 öğrenciye 200 kitap hediye ettik. Okuma sevgisi aşılamak harika! 📚 #Gönüllülük #Eğitim',
        timestamp: '6 saat önce',
        likes: 198,
        comments: 31,
        commentList: [
          { id: 1, author: 'Burak Şen', avatar: 'BŞ', text: 'Kitap okumak çok değerli! Tebrikler 📖', time: '5 saat önce' }
        ]
      }
    ]
  },
  'yazilim': {
    tag: '#Yazılım',
    posts: [
      {
        id: 1,
        author: { name: 'Mehmet Demir', title: 'Yazılım Gönüllüsü', avatar: 'MD', userId: 'user-002' },
        content: 'React ve Node.js ile yeni bir gönüllü yönetim sistemi geliştiriyorum. Açık kaynak olarak yayınlayacağım! 🚀 #Yazılım #AçıkKaynak',
        timestamp: '1 saat önce',
        likes: 234,
        comments: 42,
        commentList: [
          { id: 1, author: 'Ali Kaya', avatar: 'AK', text: 'Harika proje! GitHub linki paylaşır mısın?', time: '45 dk önce' },
          { id: 2, author: 'Fatma Demir', avatar: 'FD', text: 'Katkıda bulunmak isterim 👍', time: '30 dk önce' }
        ]
      },
      {
        id: 2,
        author: { name: 'Can Arslan', title: 'Frontend Developer', avatar: 'CA', userId: 'user-006' },
        content: 'Lise öğrencilerine HTML/CSS öğrettim. İlk projelerini tamamladılar, gurur verici! 💻 #Yazılım #Eğitim #TeknolojEğitimi',
        timestamp: '3 saat önce',
        likes: 167,
        comments: 28,
        commentList: [
          { id: 1, author: 'Zeynep Öz', avatar: 'ZÖ', text: 'Genç yetenekler çok önemli!', time: '2 saat önce' }
        ]
      },
      {
        id: 3,
        author: { name: 'Selin Koç', title: 'Mobil Geliştirici', avatar: 'SK', userId: 'user-007' },
        content: 'STK\'lar için ücretsiz mobil uygulama geliştirme workshop\'u verdim. 25 katılımcı React Native öğrendi! 📱 #Yazılım #Workshop',
        timestamp: '7 saat önce',
        likes: 312,
        comments: 56,
        commentList: [
          { id: 1, author: 'Mert Yılmaz', avatar: 'MY', text: 'Çok faydalı bir eğitim olmuş!', time: '6 saat önce' }
        ]
      }
    ]
  },
  'cevre-koruma': {
    tag: '#ÇevreKoruma',
    description: 'Çevre koruma, sürdürülebilirlik ve doğa etkinlikleri',
    posts: [
      {
        id: 1,
        author: { name: 'Deniz Şahin', title: 'Çevre Aktivisti', avatar: 'DŞ' },
        content: 'Sahil temizliğinde 80 gönüllüyle 300kg plastik atık topladık! Denizlerimiz için mücadeleye devam 🌊',
        timestamp: '2 saat önce',
        likes: 445,
        comments: 67
      },
      {
        id: 2,
        author: { name: 'Ece Yıldız', title: 'Doğa Gönüllüsü', avatar: 'EY' },
        content: 'Ağaç dikme kampanyamızın 2. gününde 500 fidan toprakla buluştu. Hedefe ulaştık! 🌳',
        timestamp: '5 saat önce',
        likes: 523,
        comments: 89
      },
      {
        id: 3,
        author: { name: 'Barış Tekin', title: 'Sürdürülebilirlik Uzmanı', avatar: 'BT' },
        content: 'Sıfır atık workshop\'unda 40 aileye kompost yapımı öğrettik. Küçük adımlar büyük değişim! ♻️',
        timestamp: '9 saat önce',
        likes: 278,
        comments: 43
      }
    ]
  },
  'egitim': {
    tag: '#Eğitim',
    description: 'Eğitim, öğretim ve gelişim projeleri',
    posts: [
      {
        id: 1,
        author: { name: 'Elif Aydın', title: 'Eğitim Koordinatörü', avatar: 'EA' },
        content: 'Köy okullarında İngilizce dersleri veriyorum. Bu hafta 120 öğrenciye ulaştık! 🎓',
        timestamp: '3 saat önce',
        likes: 189,
        comments: 34
      },
      {
        id: 2,
        author: { name: 'Burak Öztürk', title: 'Matematik Öğretmeni', avatar: 'BÖ' },
        content: 'Ücretsiz matematik kursumuzun 3. dönemi başladı. 50 öğrenci YKS\'ye hazırlanıyor! 📐',
        timestamp: '6 saat önce',
        likes: 267,
        comments: 41
      },
      {
        id: 3,
        author: { name: 'Gizem Yılmaz', title: 'Robotik Eğitmeni', avatar: 'GY' },
        content: 'Çocuklara robotik kodlama öğretiyorum. İlk robotlarını yaptılar, çok mutlular! 🤖',
        timestamp: '8 saat önce',
        likes: 345,
        comments: 52
      }
    ]
  },
  'sosyal-sorumluluk': {
    tag: '#SosyalSorumluluk',
    description: 'Toplumsal fayda ve sosyal sorumluluk projeleri',
    posts: [
      {
        id: 1,
        author: { name: 'Hakan Çelik', title: 'Proje Yöneticisi', avatar: 'HÇ' },
        content: 'Yaşlı bakım evinde sanat terapisi etkinliği düzenledik. Herkes resim yaptı, çok keyifliydi! 🎨',
        timestamp: '4 saat önce',
        likes: 312,
        comments: 48
      },
      {
        id: 2,
        author: { name: 'Özge Kaya', title: 'Sosyal Çalışmacı', avatar: 'ÖK' },
        content: 'Engelli bireylere yönelik spor etkinliği organize ettik. 40 katılımcı harika zaman geçirdi! ⚽',
        timestamp: '7 saat önce',
        likes: 456,
        comments: 71
      },
      {
        id: 3,
        author: { name: 'Serkan Acar', title: 'STK Gönüllüsü', avatar: 'SA' },
        content: 'Evsizlere sıcak yemek dağıtımı yaptık. 150 kişiye ulaştık, yarın da devam! 🍲',
        timestamp: '10 saat önce',
        likes: 589,
        comments: 93
      }
    ]
  },
  'saglik-destek': {
    tag: '#SağlıkDestek',
    description: 'Sağlık, psikolojik destek ve sağlıklı yaşam',
    posts: [
      {
        id: 1,
        author: { name: 'Dr. Aylin Kara', title: 'Gönüllü Doktor', avatar: 'AK' },
        content: 'Köyde ücretsiz sağlık taraması yaptık. 200 kişiye ulaştık, takip devam edecek. 🏥',
        timestamp: '2 saat önce',
        likes: 423,
        comments: 65
      },
      {
        id: 2,
        author: { name: 'Psk. Mert Yıldız', title: 'Psikolog', avatar: 'MY' },
        content: 'Üniversite öğrencilerine ücretsiz psikolojik danışmanlık veriyorum. Randevular doldu! 🧠',
        timestamp: '5 saat önce',
        likes: 378,
        comments: 54
      },
      {
        id: 3,
        author: { name: 'Dyt. Seda Arslan', title: 'Diyetisyen', avatar: 'SA' },
        content: 'Obezite ile mücadele programında 30 aileye beslenme eğitimi verdim. Harika ilerleme! 🥗',
        timestamp: '8 saat önce',
        likes: 291,
        comments: 47
      }
    ]
  },
  'hayvan-haklari': {
    tag: '#HayvanHakları',
    description: 'Hayvan hakları, barınak ve koruma çalışmaları',
    posts: [
      {
        id: 1,
        author: { name: 'Ceren Özkan', title: 'Hayvan Hakları Aktivisti', avatar: 'CÖ' },
        content: 'Sokak hayvanlarına 500kg mama dağıttık. Her hafta devam ediyoruz! 🐕',
        timestamp: '3 saat önce',
        likes: 567,
        comments: 82
      },
      {
        id: 2,
        author: { name: 'Veteriner Emre', title: 'Veteriner Hekim', avatar: 'VE' },
        content: 'Ücretsiz kısırlaştırma kampanyasında 50 sokak hayvanına müdahale ettik. 🏥',
        timestamp: '6 saat önce',
        likes: 489,
        comments: 71
      },
      {
        id: 3,
        author: { name: 'Berna Yılmaz', title: 'Barınak Gönüllüsü', avatar: 'BY' },
        content: 'Barınaktaki 12 köpeğimiz yeni ailelerine kavuştu. Mutluluğa bakın! 🐾',
        timestamp: '9 saat önce',
        likes: 712,
        comments: 105
      }
    ]
  },
  'teknoloji-egitimi': {
    tag: '#TeknolojEğitimi',
    description: 'Teknoloji eğitimi, dijital okuryazarlık ve kodlama',
    posts: [
      {
        id: 1,
        author: { name: 'Onur Şen', title: 'Yazılım Eğitmeni', avatar: 'OŞ' },
        content: 'İlkokul öğrencilerine Scratch ile kodlama öğretiyorum. İlk oyunlarını yaptılar! 🎮',
        timestamp: '4 saat önce',
        likes: 298,
        comments: 39
      },
      {
        id: 2,
        author: { name: 'Sibel Kaya', title: 'Dijital Eğitmen', avatar: 'SK' },
        content: 'Yaşlılara akıllı telefon kullanımı öğrettim. Artık torunlarıyla görüntülü konuşabiliyorlar! 📱',
        timestamp: '7 saat önce',
        likes: 445,
        comments: 68
      },
      {
        id: 3,
        author: { name: 'Kaan Demir', title: '3D Tasarım Eğitmeni', avatar: 'KD' },
        content: 'Lise öğrencilerine 3D modelleme öğrettim. İlk tasarımlarını 3D yazıcıda bastık! 🖨️',
        timestamp: '11 saat önce',
        likes: 367,
        comments: 53
      }
    ]
  }
};

const HashtagThread = () => {
  const { slug } = useParams();
  const hashtagData = HASHTAG_DATA[slug];
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState('');

  if (!hashtagData) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hashtag Bulunamadı</h1>
            <p className="text-gray-600">Aradığınız hashtag mevcut değil.</p>
            <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">Ana Sayfaya Dön</a>
          </div>
        </div>
      </PageLayout>
    );
  }

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newLiked = { ...prev, [postId]: !prev[postId] };
      setLikeCounts(prevCounts => ({
        ...prevCounts,
        [postId]: (prevCounts[postId] || hashtagData.posts.find(p => p.id === postId)?.likes || 0) + (newLiked[postId] ? 1 : -1)
      }));
      return newLiked;
    });
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedPost) {
      console.log('Yorum eklendi:', newComment);
      setNewComment('');
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Header - Hashtag Info */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">{hashtagData.tag}</h1>
                  <p className="text-sm text-gray-500 mt-1">{hashtagData.posts.length} gönderi</p>
                </div>
                <a 
                  href="/"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                  ← Ana Sayfa
                </a>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {hashtagData.posts.map(post => (
                <div key={post.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition">
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start gap-3 mb-4">
                      <a 
                        href={`/profile/${post.author.userId}`}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold flex-shrink-0 hover:scale-110 transition-transform"
                      >
                        {post.author.avatar}
                      </a>
                      <div className="flex-1 min-w-0">
                        <a 
                          href={`/profile/${post.author.userId}`}
                          className="font-bold text-gray-900 hover:text-blue-600 transition"
                        >
                          {post.author.name}
                        </a>
                        <p className="text-sm text-gray-500">{post.author.title}</p>
                      </div>
                      <span className="text-xs text-gray-400">{post.timestamp}</span>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">{post.content}</p>
                  </div>

                  {/* Post Actions */}
                  <div className="px-6 py-3 bg-gray-50 flex items-center gap-6 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        likedPosts[post.id] 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{likedPosts[post.id] ? '❤️' : '🤍'}</span>
                      <span className="text-sm font-medium">{likeCounts[post.id] || post.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                    >
                      <span className="text-lg">💬</span>
                      <span className="text-sm font-medium">{post.comments} yorum</span>
                    </button>
                  </div>

                  {/* Comments Preview */}
                  {expandedComments[post.id] && post.commentList && (
                    <div className="px-6 py-4 bg-white border-t border-gray-100">
                      <div className="space-y-3">
                        {post.commentList.map(comment => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {comment.avatar}
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-gray-900 text-sm">{comment.author}</p>
                                <span className="text-xs text-gray-400">{comment.time}</span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPost(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Gönderi Detayı</h3>
              <button onClick={() => setSelectedPost(null)} className="text-gray-400 hover:text-gray-600 transition text-2xl">
                ×
              </button>
            </div>

            <div className="p-6">
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

              <p className="text-gray-700 mb-6 leading-relaxed">{selectedPost.content}</p>

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

export default HashtagThread;
