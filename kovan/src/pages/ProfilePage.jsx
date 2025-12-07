import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';
import { useDocument, useCollection } from '../hooks/useFirestoreCRUD';

const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function ProfilePage() {
  const { userId } = useParams();
  const { data: profileUser, loading } = useDocument('users', userId);
  const { data: userPosts } = useCollection('posts', {
    whereConditions: [{ field: 'authorId', operator: '==', value: userId }],
    orderByField: 'createdAt',
    orderDirection: 'desc'
  });
  
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Profil yükleniyor...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!profileUser) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600">Kullanıcı bulunamadı</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 min-h-screen py-6">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            {/* Banner */}
            <div 
              className="h-48 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600"
              style={profileUser.bannerUrl ? { 
                backgroundImage: `url(${profileUser.bannerUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {}}
            />
            
            {/* Profile Info */}
            <div className="px-8 pb-6">
              <div className="flex items-end -mt-16 mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white text-5xl font-bold shadow-lg overflow-hidden">
                  {profileUser.avatarUrl ? (
                    <img src={profileUser.avatarUrl} alt={profileUser.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(profileUser.name)
                  )}
                </div>
                <div className="ml-6 flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">{profileUser.name}</h1>
                  <p className="text-lg text-gray-600 mt-1">{profileUser.headline || 'Gönüllü'}</p>
                  <p className="text-sm text-gray-500 mt-1">📍 {profileUser.location || 'Türkiye'}</p>
                </div>
                
                {/* Follow Button */}
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                  Takip Et
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setShowFollowersModal(true)}
                  className="text-center hover:bg-gray-50 px-4 py-2 rounded-lg transition"
                >
                  <div className="text-2xl font-bold text-gray-900">{profileUser.stats?.followers || 0}</div>
                  <div className="text-sm text-gray-600">Takipçi</div>
                </button>
                <button 
                  onClick={() => setShowFollowingModal(true)}
                  className="text-center hover:bg-gray-50 px-4 py-2 rounded-lg transition"
                >
                  <div className="text-2xl font-bold text-gray-900">{profileUser.stats?.following || 0}</div>
                  <div className="text-sm text-gray-600">Takip</div>
                </button>
                <div className="text-center px-4 py-2">
                  <div className="text-2xl font-bold text-gray-900">{userPosts.length}</div>
                  <div className="text-sm text-gray-600">Gönderi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* About */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hakkında</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {profileUser.bio || 'Henüz bilgi eklenmemiş.'}
                </p>
                
                {profileUser.website && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-2">
                      🌐 {profileUser.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Badges */}
              {profileUser.badges && profileUser.badges.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Rozetler</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {profileUser.badges.map((badge) => (
                      <div key={badge.id} className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl shadow-md">
                          {badge.emoji || '🏆'}
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{badge.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content - Posts */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gönderiler</h2>
              
              {userPosts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-gray-500">Henüz gönderi yok</p>
                </div>
              ) : (
                userPosts.map(post => (
                  <article key={post.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                        {profileUser.avatarUrl ? (
                          <img src={profileUser.avatarUrl} alt={profileUser.name} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(profileUser.name)
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{profileUser.name}</p>
                        <p className="text-sm text-gray-500">{profileUser.headline || 'Gönüllü'}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-600">👍 {post.likes || 0}</span>
                      <span className="text-sm text-gray-600">💬 {post.commentCount || 0}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowFollowersModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Takipçiler</h3>
            <p className="text-gray-600 text-center py-8">Takipçi listesi yükleniyor...</p>
            <button onClick={() => setShowFollowersModal(false)} className="w-full mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowFollowingModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Takip Edilenler</h3>
            <p className="text-gray-600 text-center py-8">Takip listesi yükleniyor...</p>
            <button onClick={() => setShowFollowingModal(false)} className="w-full mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
              Kapat
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
