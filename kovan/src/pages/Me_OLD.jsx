import React, { useState, useEffect } from 'react';
import PageLayout from '../layouts/PageLayout';
import { useDocument, useFirestoreCRUD, useCollection } from '../hooks/useFirestoreCRUD';

const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function Me() {
  const currentUserId = localStorage.getItem('currentUserId') || 'user-default';
  const { data: userData, loading } = useDocument('users', currentUserId);
  const { update } = useFirestoreCRUD('users');
  const { data: myPosts } = useCollection('posts', {
    whereConditions: [{ field: 'authorId', operator: '==', value: currentUserId }],
    orderByField: 'createdAt',
    orderDirection: 'desc'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (userData) {
      setEditData(userData);
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      await update(currentUserId, editData);
      setIsEditing(false);
      // Update localStorage for immediate UI updates
      localStorage.setItem('userData', JSON.stringify(editData));
      window.dispatchEvent(new Event('userDataUpdated'));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Profil güncellenemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

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

  if (!userData) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600">Profil bulunamadı. Lütfen giriş yapın.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout userData={userData}>
      <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 min-h-screen py-6">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            {/* Banner */}
            <div className="h-48 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 relative">
              {isEditing && (
                <label className="absolute bottom-4 right-4 cursor-pointer bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                  📷 Banner Değiştir
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setEditData({ ...editData, bannerUrl: reader.result });
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-6">
              <div className="flex items-end justify-between -mt-16 mb-4">
                <div className="flex items-end gap-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white text-5xl font-bold shadow-lg overflow-hidden">
                      {editData.avatarUrl ? (
                        <img src={editData.avatarUrl} alt={editData.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(editData.name)
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition shadow-lg">
                        <span className="text-white text-xl">📷</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                      </label>
                    )}
                  </div>
                  <div className="mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{editData.name}</h1>
                    <p className="text-lg text-gray-600 mt-1">{editData.headline || 'Gönüllü'}</p>
                    <p className="text-sm text-gray-500 mt-1">📍 {editData.location || 'Türkiye'}</p>
                  </div>
                </div>

                {/* Edit/Save Buttons */}
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
                        İptal
                      </button>
                      <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                        Kaydet
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                      ✏️ Profili Düzenle
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4 border-t border-gray-100">
                <div className="text-center px-4 py-2">
                  <div className="text-2xl font-bold text-gray-900">{editData.stats?.followers || 0}</div>
                  <div className="text-sm text-gray-600">Takipçi</div>
                </div>
                <div className="text-center px-4 py-2">
                  <div className="text-2xl font-bold text-gray-900">{editData.stats?.following || 0}</div>
                  <div className="text-sm text-gray-600">Takip</div>
                </div>
                <div className="text-center px-4 py-2">
                  <div className="text-2xl font-bold text-gray-900">{myPosts?.length || 0}</div>
                  <div className="text-sm text-gray-600">Gönderi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Profil Bilgilerini Düzenle</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İsim</label>
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                  <input
                    type="text"
                    value={editData.headline || ''}
                    onChange={(e) => setEditData({ ...editData, headline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konum</label>
                  <input
                    type="text"
                    value={editData.location || ''}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hakkında</label>
                  <textarea
                    value={editData.bio || ''}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={editData.website || ''}
                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* About */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hakkında</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {editData.bio || 'Henüz bilgi eklenmemiş.'}
                </p>
                
                {editData.website && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a href={editData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-2">
                      🌐 {editData.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Rozetler</h3>
                  {isEditing && (
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                      + Ekle
                    </button>
                  )}
                </div>
                
                {editData.badges && editData.badges.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {editData.badges.map((badge) => (
                      <div key={badge.id} className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl shadow-md">
                          {badge.emoji || '🏆'}
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{badge.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">Henüz rozet yok</p>
                )}
              </div>
            </div>

            {/* Main Content - Posts */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gönderilerim</h2>
              
              {!myPosts || myPosts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-gray-500">Henüz gönderi yok</p>
                </div>
              ) : (
                myPosts.map(post => (
                  <article key={post.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                        {editData.avatarUrl ? (
                          <img src={editData.avatarUrl} alt={editData.name} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(editData.name)
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{editData.name}</p>
                        <p className="text-sm text-gray-500">{editData.headline || 'Gönüllü'}</p>
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
    </PageLayout>
  );
}
