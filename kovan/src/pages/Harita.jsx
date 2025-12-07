import React from 'react';
import useContentLoader from '../hooks/useContentLoader';
import PageLayout from '../layouts/PageLayout';
import TurkeySVGMap from '../components/sections/TurkeySVGMap';
import HeatmapStats from '../components/sections/HeatmapStats';

export default function Harita() {
  const { content, loading, error } = useContentLoader('heatmap.json');

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Yükleniyor...</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><p>Hata: {error}</p></div>;

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 py-20 relative overflow-hidden">
        {/* Dekoratif Arka Plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
              {content?.hero?.title || content?.pageTitle}
            </h1>
            <p className="text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {content?.hero?.subtitle || content?.pageDescription}
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">81</div>
                <div className="text-blue-200 text-sm">İl Kapsamında</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">1.2M</div>
                <div className="text-blue-200 text-sm">Aktif Gönüllü</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">33M</div>
                <div className="text-blue-200 text-sm">Toplam Saat</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paradoks ve İstatistikler */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <HeatmapStats />
      </section>

      {/* İnteraktif Harita */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        {content?.provinces?.data ? (
          <TurkeySVGMap provinces={content.provinces.data} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Harita verileri yükleniyor...</p>
            <p className="text-sm text-gray-400 mt-2">Debug: {JSON.stringify(Object.keys(content || {}))}</p>
          </div>
        )}
      </section>

      {/* Metodoloji */}
      {content?.methodology && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🔬</span>
              <h2 className="text-3xl font-bold text-blue-900">Metodoloji</h2>
            </div>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {content.methodology.title}
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {content.methodology.content}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* İller Detaylı Sıralama */}
      {content?.provinces?.data && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">
              🏆 İller Liderlik Tablosu
            </h2>
            <p className="text-gray-600 text-lg">
              Gönüllülük endeksine göre sıralanmış 81 il
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="space-y-4">
              {content.provinces.data.map((province, idx) => {
                const getBadgeEmoji = (rank) => {
                  if (rank === 1) return '🥇';
                  if (rank === 2) return '🥈';
                  if (rank === 3) return '🥉';
                  return '🏅';
                };

                return (
                  <div 
                    key={idx} 
                    className="bg-gradient-to-r from-white to-blue-50 rounded-xl border-2 border-gray-200 p-6 hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{getBadgeEmoji(province.rank)}</div>
                        <span className="text-3xl font-bold text-blue-600 w-12">#{province.rank}</span>
                        <div>
                          <h3 className="text-2xl font-bold text-blue-900 group-hover:text-blue-600 transition">
                            {province.province}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {province.volunteers?.toLocaleString('tr-TR')} gönüllü • {province.projects} proje
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-extrabold text-blue-600">{province.index}</div>
                        <div className="text-xs text-gray-600">{province.hours?.toLocaleString('tr-TR')} saat</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-teal-500 h-3 rounded-full transition-all duration-500 shadow-md"
                        style={{ width: `${province.index}%` }}
                      ></div>
                    </div>

                    {/* Trend ve Ekonomik Değer */}
                    <div className="flex justify-between items-center mt-3">
                      {province.trend && (
                        <span className={`text-sm font-semibold flex items-center gap-1 ${
                          province.trend.includes('↑') ? 'text-green-600' : 
                          province.trend.includes('↓') ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {province.trend.includes('↑') ? '📈' : province.trend.includes('↓') ? '📉' : '➡️'} 
                          {province.trend}
                        </span>
                      )}
                      <span className="text-sm text-gray-600">
                        💰 Ekonomik Değer: <span className="font-bold text-green-600">
                          ₺{(province.hours * 85 / 1000000).toFixed(1)}M
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Bölgesel Analiz */}
      {content?.regionalAnalysis?.regions && (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-900 mb-4">
                🗺️ {content.regionalAnalysis.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.regionalAnalysis.regions.map((region, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all"
                >
                  <h3 className="text-2xl font-bold text-blue-900 mb-6">{region.name}</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">İl Sayısı:</span>
                      <span className="font-bold text-blue-600 text-lg">{region.provinces}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Toplam Gönüllü:</span>
                      <span className="font-bold text-blue-600 text-lg">
                        {region.volunteers?.toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ortalama Endeks:</span>
                      <span className="font-bold text-blue-600 text-lg">{region.avgIndex}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-teal-500 h-2 rounded-full"
                        style={{ width: `${region.avgIndex}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Zorluk/Fırsat */}
                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                    <p className="text-sm font-semibold text-orange-900 mb-1">⚠️ Öncelikli Alan:</p>
                    <p className="text-sm text-gray-700">{region.topChallenge}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gelecek Hedefler */}
      {content?.futureExpansion && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
                <span>🚀</span>
                {content.futureExpansion.title}
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {content.futureExpansion.description}
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {content.futureExpansion.goals.map((goal, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 flex items-start gap-3"
                  >
                    <span className="text-2xl">✨</span>
                    <p className="text-white/90 leading-relaxed">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
