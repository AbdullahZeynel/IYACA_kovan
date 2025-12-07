import React from 'react';
import { useParams } from 'react-router-dom';
import useContentLoader from '../hooks/useContentLoader';
import PageLayout from '../layouts/PageLayout';

export default function UserProfile() {
  const { userId } = useParams();
  const { content, loading, error } = useContentLoader('users.json');
  const [isFollowing, setIsFollowing] = React.useState(false);

  if (loading) return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Profil yükleniyor...</p>
        </div>
      </div>
    </PageLayout>
  );

  if (error) return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <p className="text-red-600 font-semibold">⚠️ Profil bulunamadı</p>
      </div>
    </PageLayout>
  );

  const user = content?.users?.find(u => u.id === (userId || 'user-001'));
  if (!user) return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <p className="text-gray-600">Kullanıcı bulunamadı</p>
      </div>
    </PageLayout>
  );

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 min-h-screen py-6 md:py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 text-white py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-300 to-teal-300 flex items-center justify-center text-4xl md:text-6xl border-4 border-white shadow-lg flex-shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
                  {user.verified && <span className="text-2xl md:text-3xl">✓</span>}
                </div>
                <p className="text-lg md:text-xl text-blue-100 mb-1">{user.title}</p>
                <p className="text-sm md:text-base text-blue-100">📍 {user.location}</p>
                <p className="text-xs md:text-sm text-blue-200 mt-1">Üye olduğu tarih: {user.joinDate}</p>
              </div>
              <div className="flex gap-2 md:gap-3 flex-col md:flex-row md:pb-4">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-6 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base ${
                    isFollowing 
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-500 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? '✓ Takip Ediliyor' : 'Takip Et'}
                </button>
                <button className="px-6 py-2 md:py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition text-sm md:text-base">
                  💬 Mesaj Gönder
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {user.bio && (
            <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">{user.bio}</p>
          )}
          {user.website && (
            <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mb-6 inline-block font-semibold">
              🔗 {user.website}
            </a>
          )}
        </div>

        {/* Stats Grid */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm hover:shadow-md transition">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{user.stats.followers}</div>
                <p className="text-xs md:text-sm text-gray-600">Takipçi</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm hover:shadow-md transition">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{user.stats.following}</div>
                <p className="text-xs md:text-sm text-gray-600">Takip Edilen</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm hover:shadow-md transition">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{user.stats.posts}</div>
                <p className="text-xs md:text-sm text-gray-600">Post</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm hover:shadow-md transition">
                <div className="text-2xl md:text-3xl font-bold text-teal-600 mb-1">{user.stats.hoursVolunteered}</div>
                <p className="text-xs md:text-sm text-gray-600">Saat</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm hover:shadow-md transition col-span-2 md:col-span-1">
                <div className="text-2xl md:text-3xl font-bold text-amber-600 mb-1">Lvl {user.level}</div>
                <p className="text-xs md:text-sm text-gray-600">{user.xp} XP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Skills & Badges */}
            <div className="space-y-6">
              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">💡 Beceriler</h3>
                <div className="space-y-4">
                  {user.skills?.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-900">{skill}</span>
                        <span className="text-xs text-blue-600 font-bold">{user.endorsements?.[skill] || 0} onayla</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((user.endorsements?.[skill] || 0) / 80 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">🏅 Rozetler</h3>
                <div className="grid grid-cols-3 gap-3">
                  {user.badges?.map((badge, idx) => (
                    <div key={idx} title={badge} className="text-center p-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg hover:shadow-md transition">
                      <div className="text-3xl mb-1">🏆</div>
                      <p className="text-xs text-gray-600 font-semibold">{badge}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Column - Activity & Recent */}
            <div className="md:col-span-2 space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">📋 Son Aktiviteler</h3>
                <div className="space-y-3">
                  {user.recentActivity?.map((activity, idx) => (
                    <div key={idx} className="flex gap-3 pb-3 border-b border-gray-200 last:border-b-0">
                      <span className="text-2xl flex-shrink-0">✓</span>
                      <div>
                        <p className="text-gray-700 text-sm md:text-base">{activity}</p>
                        <p className="text-xs text-gray-500 mt-1">1 hafta önce</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connections */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">👥 Bağlantılar ({user.connections?.length || 0})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="text-center p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg hover:shadow-md transition">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mx-auto mb-2 flex items-center justify-center text-lg text-white">
                        👤
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Bağlantı {idx + 1}</p>
                      <p className="text-xs text-gray-600">Yazılım Mühendisi</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
