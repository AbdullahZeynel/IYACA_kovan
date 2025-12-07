import React from 'react';

/**
 * HeatmapStats - Veri Hikayeleştirme Bileşeni
 * 
 * Özellikleri:
 * - Paradoks vurgulama (potansiyel vs gerçek)
 * - CTA (Call to Action) butonları
 * - Animasyonlu counter (sayısal veri gösterimi)
 * - Etki kartları (impact cards)
 */

const HeatmapStats = () => {
  return (
    <div className="space-y-12">
      {/* PARADOKS VURGUSU - Hero Stat Card */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700 rounded-3xl p-12 overflow-hidden shadow-2xl">
        {/* Dekoratif Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl">📊</span>
            <h2 className="text-3xl font-bold text-white">
              Türkiye'nin Gönüllülük Paradoksu
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Potansiyel */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
                🌟 Potansiyel
              </div>
              <div className="text-6xl font-extrabold text-white mb-2">
                52 Milyon
              </div>
              <p className="text-white/90 text-lg">
                Yardımseverlik araştırmalarında "gönüllülük yapmaya hazır" olduğunu belirten kişi sayısı
              </p>
              <div className="mt-4 text-green-300 text-sm font-semibold">
                ✓ Türkiye, dünyada "yardımseverlik" sıralamasında Top 10'da
              </div>
            </div>

            {/* Gerçek */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
                📉 Gerçek Durum
              </div>
              <div className="text-6xl font-extrabold text-red-300 mb-2">
                1.2 Milyon
              </div>
              <p className="text-white/90 text-lg">
                Resmi sistemlerde kayıtlı, düzenli gönüllülük yapan kişi sayısı
              </p>
              <div className="mt-4 text-red-300 text-sm font-semibold">
                ⚠ Potansiyelin sadece %2.3'ü aktif
              </div>
            </div>
          </div>

          {/* Büyük Fark Göstergesi */}
          <div className="bg-yellow-400/20 border-2 border-yellow-400 rounded-xl p-6 text-center">
            <div className="text-yellow-300 text-xl font-bold mb-2">
              ⚡ 50.8 MİLYON KİŞİLİK KAYIP POTANSIYEL
            </div>
            <p className="text-white text-sm">
              Bu fark, Türkiye'nin gönüllülük ekosisteminde "görünmezlik krizi" olduğunu gösteriyor.
            </p>
          </div>

          {/* CTA Butonları */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <button className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-lg flex items-center gap-2">
              <span>🗺️</span>
              Haritada Yerini Al
            </button>
            <button className="bg-teal-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-teal-600 transition-all hover:scale-105 shadow-lg flex items-center gap-2">
              <span>🚀</span>
              Şehrini Yeşillendir
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
              <span>📖</span>
              Detaylı Rapor
            </button>
          </div>
        </div>
      </div>

      {/* ETKİ KARTLARI (Impact Cards) */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Ekonomik Etki */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-2xl">
              💰
            </div>
            <h3 className="text-xl font-bold text-green-900">
              Ekonomik Etki
            </h3>
          </div>
          <div className="text-4xl font-extrabold text-green-700 mb-2">
            ₺2.8 Milyar
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            Platform üzerinden gerçekleşen gönüllü saatlerin 
            <span className="font-semibold"> tahmini ekonomik değeri</span>. 
            Bu rakam, GSYH'ye dolaylı katkı anlamına geliyor.
          </p>
          <div className="mt-4 pt-4 border-t border-green-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Saat Başı Değer:</span>
              <span className="font-bold text-green-700">₺85</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Toplam Saat:</span>
              <span className="font-bold text-green-700">33 Milyon</span>
            </div>
          </div>
        </div>

        {/* Sosyal Etki */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-2xl">
              👥
            </div>
            <h3 className="text-xl font-bold text-blue-900">
              Sosyal Etki
            </h3>
          </div>
          <div className="text-4xl font-extrabold text-blue-700 mb-2">
            4.2 Milyon
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            Gönüllü projelerden 
            <span className="font-semibold"> doğrudan faydalanan kişi sayısı</span>.
            Her gönüllü ortalama 3.5 kişiye dokunuyor.
          </p>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Eğitim desteği: 1.8M kişi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Sağlık hizmeti: 1.2M kişi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Sosyal destek: 1.2M kişi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Çevresel Etki */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-200 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center text-2xl">
              🌍
            </div>
            <h3 className="text-xl font-bold text-teal-900">
              Çevresel Etki
            </h3>
          </div>
          <div className="text-4xl font-extrabold text-teal-700 mb-2">
            850 Ton
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            Çevre gönüllülüğü ile toplanan atık miktarı ve
            <span className="font-semibold"> azaltılan karbon emisyonu eşdeğeri</span>.
          </p>
          <div className="mt-4 pt-4 border-t border-teal-200">
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                <span>Dikilen ağaç: 42,000</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                <span>Temizlenen alan: 1,200 hektar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                <span>Geri dönüşüm: 320 ton</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BÖLGESEL İÇGÖRÜLER */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🔍</span>
          <h2 className="text-3xl font-bold text-blue-900">
            Veriye Dayalı İçgörüler
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* İçgörü 1 */}
          <div className="flex gap-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-600">
            <div className="text-4xl">📈</div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Marmara'da Yoğunlaşma</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Gönüllülüğün <span className="font-bold text-blue-700">%52'si</span> Marmara bölgesinde 
                (İstanbul, Ankara, Bursa, Kocaeli) yoğunlaşmıştır. 
                Anadolu'da <span className="font-semibold">fırsat ve kapasite artışı</span> gerekmektedir.
              </p>
            </div>
          </div>

          {/* İçgörü 2 */}
          <div className="flex gap-4 p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-600">
            <div className="text-4xl">👨‍💼</div>
            <div>
              <h3 className="font-bold text-purple-900 mb-2">Gençler Lider Rol Oynuyor</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-bold text-purple-700">25-35 yaş grubu</span> katılımın %48'ini oluşturmaktadır. 
                Sosyal medya ve <span className="font-semibold">mikro-görev yapısı</span> etkili olmuştur.
              </p>
            </div>
          </div>

          {/* İçgörü 3 */}
          <div className="flex gap-4 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-l-4 border-green-600">
            <div className="text-4xl">🏥</div>
            <div>
              <h3 className="font-bold text-green-900 mb-2">Eğitim ve Sağlık Ağırlıklı</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Gönüllülüğün <span className="font-bold text-green-700">%35'i eğitim, %28'i sağlık</span> alanında. 
                Çevre ve sosyal etkinlik alanlarında <span className="font-semibold">kapasite artırılmalı</span>.
              </p>
            </div>
          </div>

          {/* İçgörü 4 */}
          <div className="flex gap-4 p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-600">
            <div className="text-4xl">🌾</div>
            <div>
              <h3 className="font-bold text-orange-900 mb-2">Kırsal Bölgelerde Artış</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Son 6 ayda kırsal bölgelerde katılım <span className="font-bold text-orange-700">%35 arttı</span>. 
                Mobil teknoloji ve <span className="font-semibold">WhatsApp entegrasyonu</span> etkili oldu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EYLEM ÇAĞRISI (Final CTA) */}
      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
        {/* Dekoratif Elementler */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            🚀 Haritada Seni Bekliyoruz!
          </h2>
          <p className="text-white/90 text-xl max-w-3xl mx-auto mb-8">
            Türkiye'nin gönüllülük potansiyelini <span className="font-bold">açığa çıkar</span>. 
            Senin katkınla bu harita daha da yeşillensin.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-red-600 px-10 py-5 rounded-xl font-bold text-xl hover:bg-red-50 transition-all hover:scale-105 shadow-2xl">
              Hemen Kayıt Ol
            </button>
            <button className="bg-transparent border-3 border-white text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-white/20 transition-all">
              Proje Oluştur
            </button>
          </div>

          <div className="mt-8 text-white/80 text-sm">
            ✨ Kayıt tamamen ücretsiz • 5 dakikada başla • 81 ilde erişim
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapStats;
