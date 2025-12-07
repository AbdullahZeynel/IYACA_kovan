import React, { useState } from 'react';
import useContentLoader from '../hooks/useContentLoader';
import PageLayout from '../layouts/PageLayout';

export default function Discover() {
  const { content, loading, error } = useContentLoader('users.json');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(content?.users || []);

  if (loading) return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Gönüllüler yükleniyor...</p>
        </div>
      </div>
    </PageLayout>
  );

  if (error) return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <p className="text-red-600 font-semibold">⚠️ Hata: {error}</p>
      </div>
    </PageLayout>
  );

  const allSkills = [...new Set((content?.users || []).flatMap(u => u.skills || []))];

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterUsersFunc(query, filterSkill);
  };

  const handleFilterSkill = (skill) => {
    setFilterSkill(skill);
    filterUsersFunc(searchQuery, skill);
  };

  const filterUsersFunc = (query, skill) => {
    let filtered = content?.users || [];
    
    if (query) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(query) ||
        u.title.toLowerCase().includes(query) ||
        u.location.toLowerCase().includes(query)
      );
    }

    if (skill) {
      filtered = filtered.filter(u => u.skills?.includes(skill));
    }

    setFilteredUsers(filtered);
  };

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 min-h-screen py-6 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">🔍 Gönüllüleri Keşfet</h1>
            <p className="text-gray-600 text-sm md:text-base">Becerilerine ve ilgilerine göre gönüllüleri bulun ve bağlantı kur</p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8 hover:shadow-md transition">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ad, başlık veya konum ara..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full p-3 md:p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                />
                <span className="absolute left-4 top-3.5 md:top-4 text-xl">🔍</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-gray-900 text-sm md:text-base">💡 Beceriye Göre Filtrele:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterSkill('')}
                  className={`px-3 md:px-4 py-2 rounded-full font-semibold text-xs md:text-sm transition ${
                    filterSkill === ''
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  Tümü
                </button>
                {allSkills.map((skill, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFilterSkill(skill)}
                    className={`px-3 md:px-4 py-2 rounded-full font-semibold text-xs md:text-sm transition ${
                      filterSkill === skill
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <p className="text-gray-600 mb-6 font-semibold text-sm md:text-base">
              <span className="text-blue-600 font-bold">{filteredUsers.length}</span> gönüllü bulundu
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredUsers.map((user, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
                  {/* Header Background */}
                  <div className="h-20 md:h-24 bg-gradient-to-r from-blue-400 to-teal-400"></div>

                  {/* User Info */}
                  <div className="p-4 md:p-6 pt-0">
                    {/* Avatar */}
                    <div className="flex flex-col items-center -mt-10 mb-3 md:mb-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl md:text-3xl border-4 border-white text-white shadow-md">
                        {user.avatar}
                      </div>
                      {user.verified && <span className="text-lg md:text-xl mt-1">✓</span>}
                    </div>

                    {/* Name & Title */}
                    <h3 className="font-bold text-center text-gray-900 text-base md:text-lg mb-1">{user.name}</h3>
                    <p className="text-xs md:text-sm text-gray-600 text-center mb-2">{user.title}</p>
                    <p className="text-xs text-gray-500 text-center mb-4">📍 {user.location}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-200 text-center">
                      <div>
                        <p className="font-bold text-blue-600 text-sm">{user.stats.followers}</p>
                        <p className="text-xs text-gray-600">Takipçi</p>
                      </div>
                      <div>
                        <p className="font-bold text-blue-600 text-sm">{user.stats.posts}</p>
                        <p className="text-xs text-gray-600">Post</p>
                      </div>
                      <div>
                        <p className="font-bold text-amber-600 text-sm">Lv.{user.level}</p>
                        <p className="text-xs text-gray-600">Seviye</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-900 mb-2">Beceriler</p>
                      <div className="flex flex-wrap gap-1">
                        {user.skills?.slice(0, 3).map((skill, sidx) => (
                          <span key={sidx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-col md:flex-row">
                      <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 md:py-3 rounded-lg font-semibold hover:shadow-lg transition text-xs md:text-sm">
                        Takip Et
                      </button>
                      <button className="flex-1 border-2 border-blue-600 text-blue-600 py-2 md:py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-xs md:text-sm">
                        Mesaj
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-gray-600 font-semibold mb-2">Gönüllü bulunamadı</p>
                <p className="text-gray-500 text-sm">Farklı arama kriterleri deneyin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
