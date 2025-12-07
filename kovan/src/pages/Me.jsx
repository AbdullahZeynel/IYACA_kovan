import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import PageLayout from '../layouts/PageLayout';

const getUserData = () => {
  const saved = localStorage.getItem('userData');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    name: 'Mehmet Korkmaz',
    headline: 'Gönüllü',
    bio: 'Gönüllülük faaliyetlerine katılmayı seven, topluma katkı sağlamaktan mutluluk duyan biriyim.',
    location: 'İstanbul',
    joinDate: 'Kasım 2024',
    website: '',
    stats: {
      followers: 248,
      following: 312,
      posts: 15,
      projectsCompleted: 3,
      hoursVolunteered: 45
    },
    skills: ['Takım Çalışması', 'İletişim', 'Organizasyon'],
    badges: [
      { id: 1, name: 'Başlangıç', imageUrl: '/images/badges/beginner.png' }
    ],
    level: 2,
    xp: 450
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

export default function Me() {
  const [userData, setUserData] = useState(getUserData());
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
    setEditData(data);
  }, []);

  const handleSave = () => {
    localStorage.setItem('userData', JSON.stringify(editData));
    setUserData(editData);
    setIsEditing(false);
    window.location.reload(); // Refresh to update header
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  return (
    <PageLayout userData={userData}>
      <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 min-h-screen py-6">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 text-white p-8">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-300 to-teal-300 flex items-center justify-center text-6xl border-4 border-white shadow-lg flex-shrink-0 overflow-hidden">
                  {userData.avatarUrl ? (
                    <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold">{getInitials(userData.name)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{userData.name}</h1>
                  <p className="text-xl text-blue-100 mb-1">{userData.headline}</p>
                  <p className="text-sm text-blue-100">📍 {userData.location || 'Konum belirtilmedi'}</p>
                  <p className="text-xs text-blue-200 mt-2">Üye olduğu tarih: {userData.joinDate || 'Bilinmiyor'}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    {isEditing ? '❌ İptal' : '✏️ Profili Düzenle'}
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Profil Bilgilerini Düzenle</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">İsim</label>
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Başlık</label>
                    <input
                      type="text"
                      value={editData.headline || ''}
                      onChange={(e) => setEditData({...editData, headline: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hakkında</label>
                    <textarea
                      value={editData.bio || ''}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                      rows="4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Konum</label>
                    <input
                      type="text"
                      value={editData.location || ''}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={editData.website || ''}
                      onChange={(e) => setEditData({...editData, website: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      💾 Kaydet
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      İptal Et
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Hakkında</h3>
            <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
            {userData.website && (
              <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-4 inline-block font-semibold">
                🔗 {userData.website}
              </a>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-md hover:shadow-lg transition text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{userData.stats?.followers || 0}</div>
              <p className="text-sm text-gray-600">Takipçi</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-md hover:shadow-lg transition text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{userData.stats?.following || 0}</div>
              <p className="text-sm text-gray-600">Takip Edilen</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-md hover:shadow-lg transition text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{userData.stats?.posts || 0}</div>
              <p className="text-sm text-gray-600">Gönderi</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-md hover:shadow-lg transition text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{userData.stats?.projectsCompleted || 0}</div>
              <p className="text-sm text-gray-600">Proje</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-md hover:shadow-lg transition text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{userData.stats?.hoursVolunteered || 0}</div>
              <p className="text-sm text-gray-600">Saat Gönüllülük</p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Yetenekler</h3>
            <div className="flex flex-wrap gap-2">
              {userData.skills?.map((skill, index) => (
                <span key={index} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Badges Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rozetler</h3>
            <div className="flex flex-wrap gap-4">
              {userData.badges && userData.badges.length > 0 ? (
                userData.badges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50 mb-2">
                      <img src={badge.imageUrl} alt={badge.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-gray-600 text-center">{badge.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Henüz rozet kazanılmadı</p>
              )}
            </div>
          </div>

          {/* Level & XP */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Seviye ve İlerleme</h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-blue-600">Lvl {userData.level || 1}</div>
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{userData.xp || 0} XP</span>
                  <span>{(userData.level || 1) * 1000} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((userData.xp || 0) / ((userData.level || 1) * 1000)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
            </div>
