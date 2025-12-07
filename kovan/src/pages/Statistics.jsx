import React, { useState } from 'react';
import PageLayout from '../layouts/PageLayout';
import TurkeySVGMap from '../components/sections/TurkeySVGMap';
import WorldSVGMap from '../components/sections/WorldSVGMap';
import useContentLoader from '../hooks/useContentLoader';

// Mock İstatistik Verileri
const TURKEY_STATS = {
  totalVolunteers: 156789,
  activeProjects: 1245,
  totalHours: 2456789,
  citiesReached: 81,
  organizations: 456
};

const WORLD_STATS = {
  totalVolunteers: 45678901,
  activeProjects: 234567,
  totalHours: 987654321,
  countriesReached: 195,
  organizations: 12345
};

// Ekonomik Etki Verileri
const ECONOMIC_IMPACT_TURKEY = [
  { category: 'Eğitim', value: 45000000, currency: '₺', volunteers: 23456, projects: 345 },
  { category: 'Sağlık', value: 38000000, currency: '₺', volunteers: 18234, projects: 289 },
  { category: 'Çevre', value: 29000000, currency: '₺', volunteers: 15678, projects: 234 },
  { category: 'Sosyal Yardım', value: 52000000, currency: '₺', volunteers: 31245, projects: 412 },
  { category: 'Kültür & Sanat', value: 18000000, currency: '₺', volunteers: 9876, projects: 156 }
];

const ECONOMIC_IMPACT_WORLD = [
  { category: 'Education', value: 125000000000, currency: '$', volunteers: 12345678, projects: 45678 },
  { category: 'Healthcare', value: 98000000000, currency: '$', volunteers: 9876543, projects: 38901 },
  { category: 'Environment', value: 76000000000, currency: '$', volunteers: 7654321, projects: 29876 },
  { category: 'Social Aid', value: 142000000000, currency: '$', volunteers: 15678901, projects: 52345 },
  { category: 'Culture & Arts', value: 45000000000, currency: '$', volunteers: 4567890, projects: 18234 }
];

// Bölgesel Dağılım Verileri
const REGIONAL_DATA_TURKEY = [
  { region: 'Marmara', volunteers: 45678, projects: 456, impact: '₺85M' },
  { region: 'Ege', volunteers: 23456, projects: 289, impact: '₺42M' },
  { region: 'Akdeniz', volunteers: 19876, projects: 234, impact: '₺36M' },
  { region: 'İç Anadolu', volunteers: 18234, projects: 198, impact: '₺32M' },
  { region: 'Karadeniz', volunteers: 15678, projects: 167, impact: '₺28M' },
  { region: 'Doğu Anadolu', volunteers: 12345, projects: 123, impact: '₺21M' },
  { region: 'Güneydoğu Anadolu', volunteers: 11234, projects: 145, impact: '₺24M' }
];

const REGIONAL_DATA_WORLD = [
  { region: 'North America', volunteers: 12345678, projects: 45678, impact: '$245B' },
  { region: 'Europe', volunteers: 10987654, projects: 38901, impact: '$198B' },
  { region: 'Asia Pacific', volunteers: 15678901, projects: 67890, impact: '$312B' },
  { region: 'Latin America', volunteers: 5678901, projects: 23456, impact: '$98B' },
  { region: 'Middle East', volunteers: 3456789, projects: 15678, impact: '$67B' },
  { region: 'Africa', volunteers: 4567890, projects: 19876, impact: '$82B' }
];

export default function Statistics() {
  const { content: heatmapContent, loading: mapLoading } = useContentLoader('heatmap.json');
  const [activeTab, setActiveTab] = useState('turkey'); // 'turkey' or 'world'

  const currentStats = activeTab === 'turkey' ? TURKEY_STATS : WORLD_STATS;
  const currentEconomic = activeTab === 'turkey' ? ECONOMIC_IMPACT_TURKEY : ECONOMIC_IMPACT_WORLD;
  const currentRegional = activeTab === 'turkey' ? REGIONAL_DATA_TURKEY : REGIONAL_DATA_WORLD;

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📊 İstatistikler & Ekonomik Etki
            </h1>
            <p className="text-gray-600">
              Gönüllülük faaliyetlerinin toplumsal ve ekonomik etkisini keşfedin
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
              <button
                onClick={() => setActiveTab('turkey')}
                className={`px-8 py-3 rounded-md font-semibold transition-all ${
                  activeTab === 'turkey'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🇹🇷 Türkiye
              </button>
              <button
                onClick={() => setActiveTab('world')}
                className={`px-8 py-3 rounded-md font-semibold transition-all ${
                  activeTab === 'world'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🌍 Dünya
              </button>
            </div>
          </div>

          {/* Genel İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(currentStats.totalVolunteers)}</div>
              <div className="text-sm text-gray-600">Toplam Gönüllü</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="text-3xl mb-2">📋</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(currentStats.activeProjects)}</div>
              <div className="text-sm text-gray-600">Aktif Proje</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-500">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(currentStats.totalHours)}</div>
              <div className="text-sm text-gray-600">Toplam Saat</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="text-3xl mb-2">📍</div>
              <div className="text-2xl font-bold text-gray-900">{currentStats.citiesReached || currentStats.countriesReached}</div>
              <div className="text-sm text-gray-600">{activeTab === 'turkey' ? 'Şehir' : 'Ülke'}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="text-3xl mb-2">🏢</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(currentStats.organizations)}</div>
              <div className="text-sm text-gray-600">Organizasyon</div>
            </div>
          </div>

          {/* Harita Bölümü */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🗺️</span>
              {activeTab === 'turkey' ? 'Türkiye Gönüllülük Haritası' : 'World Volunteering Map'}
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              {activeTab === 'turkey' ? (
                !mapLoading && heatmapContent && (
                  <TurkeySVGMap provinces={heatmapContent?.provinces?.data || []} />
                )
              ) : (
                <WorldSVGMap />
              )}
            </div>
          </div>

          {/* Ekonomik Etki */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">💰</span>
              Kategorilere Göre Ekonomik Etki
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentEconomic.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{item.category}</h3>
                    <div className="text-2xl font-bold text-teal-600">
                      {item.currency}{formatNumber(item.value)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Gönüllüler</div>
                      <div className="font-semibold text-gray-900">{formatNumber(item.volunteers)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Projeler</div>
                      <div className="font-semibold text-gray-900">{formatNumber(item.projects)}</div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full"
                      style={{ width: `${(item.volunteers / (activeTab === 'turkey' ? 35000 : 16000000)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bölgesel Dağılım */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📍</span>
              Bölgesel Dağılım
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Bölge
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Gönüllüler
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Projeler
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Ekonomik Etki
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentRegional.map((region, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{region.region}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-gray-900">{formatNumber(region.volunteers)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-gray-900">{formatNumber(region.projects)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="font-semibold text-teal-600">{region.impact}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
