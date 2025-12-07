import React, { useState } from 'react';
import PageLayout from '../layouts/PageLayout';

export default function Applications() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [appliedPrograms, setAppliedPrograms] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Placeholder volunteer programs
  const programs = [
    {
      id: 1,
      title: 'Çevre Koruma Programı',
      category: 'environment',
      location: 'İstanbul, Ankara, İzmir',
      duration: '3 ay',
      volunteers: 250,
      description: 'Doğal alanların korunması ve çevre bilincinin artırılması için gönüllü çalışmalar.',
      requirements: ['18 yaş ve üzeri', 'Haftalık 5 saat'],
      image: '🌿',
      fullDescription: 'Çevre Koruma Programı kapsamında doğal alanların korunması, ağaçlandırma çalışmaları, atık yönetimi ve çevre bilincinin artırılması için çeşitli etkinlikler düzenlenecektir. Gönüllülerimiz hafta sonları düzenlenen temizlik kampanyalarına katılacak, eğitim seminerleri verecek ve sosyal medya kampanyalarında aktif rol alacaktır. Program süresince çevre koruma konusunda sertifikalı eğitimler verilecek ve katılımcılar deneyimli ekip liderleri eşliğinde çalışacaktır.'
    },
    {
      id: 2,
      title: 'Eğitim Destek Programı',
      category: 'education',
      location: 'Tüm İller',
      duration: '6 ay',
      volunteers: 420,
      description: 'Öğrencilere ders desteği ve mentorluk hizmeti sunma programı.',
      requirements: ['Üniversite öğrencisi/mezunu', 'Haftalık 4 saat'],
      image: '📚',
      fullDescription: 'Eğitim Destek Programı ile dezavantajlı bölgelerdeki öğrencilere ücretsiz ders desteği ve mentorluk hizmeti sunulacaktır. Gönüllülerimiz ilkokul ve ortaokul öğrencilerine Türkçe, matematik, fen bilimleri ve İngilizce derslerinde birebir veya grup çalışmaları yapacaktır. Program kapsamında eğitim teknikleri, çocuk psikolojisi ve etkili iletişim konularında sertifikalı eğitimler verilecek, ayrıca öğrencilerin kariyer planlamasına yönelik rehberlik desteği sağlanacaktır.'
    },
    {
      id: 3,
      title: 'Yaşlı Bakımı Gönüllülüğü',
      category: 'social',
      location: 'Ankara, Bursa, Antalya',
      duration: '2 ay',
      volunteers: 180,
      description: 'Yaşlı bireylere arkadaşlık ve sosyal destek sağlama programı.',
      requirements: ['Empati yeteneği', 'Haftalık 3 saat'],
      image: '❤️',
      fullDescription: 'Yaşlı Bakımı Gönüllülüğü programında yalnız yaşayan ve sosyal desteğe ihtiyaç duyan yaşlı bireylere ziyaretler düzenlenecek, günlük aktivitelerde yardımcı olunacak ve sosyal izolasyonun önlenmesi hedeflenecektir. Gönüllüler haftada bir kez düzenli ev ziyaretleri yapacak, kitap okuma, sohbet etme, market alışverişi ve doktor randevularına eşlik etme gibi aktivitelerde bulunacaktır. Programa katılanlara yaşlı bakımı, iletişim teknikleri ve acil durum müdahalesi konularında uzman eğitmenler tarafından sertifikalı eğitim verilecektir.'
    },
    {
      id: 4,
      title: 'Teknoloji Eğitimi',
      category: 'technology',
      location: 'İstanbul, İzmir',
      duration: '4 ay',
      volunteers: 320,
      description: 'Dezavantajlı gruplara temel bilgisayar ve teknoloji eğitimi verme.',
      requirements: ['Temel bilgisayar bilgisi', 'Haftalık 6 saat'],
      image: '💻',
      fullDescription: 'Teknoloji Eğitimi programı ile dijital uçurumun azaltılması ve dezavantajlı grupların teknolojiye erişiminin artırılması amaçlanmaktadır. Gönüllülerimiz yaşlılara, kadınlara ve düşük gelirli ailelere temel bilgisayar kullanımı, internet güvenliği, e-devlet hizmetleri, sosyal medya kullanımı ve ofis programları konularında eğitim verecektir. Program boyunca her katılımcıya özel ilerleme takibi yapılacak, pratik uygulamalarla öğrenme desteklenecek ve eğitim sonunda dijital okuryazarlık sertifikası verilecektir.'
    },
    {
      id: 5,
      title: 'Afet Yönetimi Ekibi',
      category: 'disaster',
      location: 'Bölgesel',
      duration: 'Sürekli',
      volunteers: 500,
      description: 'Afet durumlarında ilk müdahale ve koordinasyon desteği.',
      requirements: ['İlkyardım sertifikası', 'Esnek çalışma'],
      image: '🚨',
      fullDescription: 'Afet Yönetimi Ekibi gönüllüleri deprem, sel, yangın gibi doğal afetler ve acil durumlarda ilk müdahale ekiplerini desteklemek üzere eğitilecek ve organize edilecektir. Gönüllüler afet öncesi hazırlık çalışmalarında, afet anında koordinasyon ve lojistik desteğinde, afet sonrası ise yıkım bölgelerinde enkaz kaldırma, arama-kurtarma ve barınma merkezlerinde hizmet verecektir. Program kapsamında ileri düzey ilkyardım, arama-kurtarma teknikleri, kriz yönetimi ve travma destek eğitimleri uzman eğitmenler tarafından verilecek ve uluslararası geçerliliği olan sertifikalar düzenlenecektir.'
    },
    {
      id: 6,
      title: 'Hayvan Hakları Aktivizmi',
      category: 'animal',
      location: 'İstanbul, Ankara',
      duration: '3 ay',
      volunteers: 210,
      description: 'Sokak hayvanlarının bakımı ve hayvan haklarının savunulması.',
      requirements: ['Hayvan sevgisi', 'Haftalık 4 saat'],
      image: '🐾',
      fullDescription: 'Hayvan Hakları Aktivizmi programı ile sokak hayvanlarının yaşam koşullarının iyileştirilmesi, kısırlaştırma kampanyaları, tedavi ve rehabilitasyon çalışmaları yürütülecektir. Gönüllülerimiz sokak hayvanlarına mama-su temini yapacak, yaralı hayvanların tedavi süreçlerini takip edecek, sahiplendirme organizasyonları düzenleyecek ve hayvan hakları konusunda toplumsal farkındalık kampanyaları yürütecektir. Program boyunca hayvan davranışları, temel veterinerlik bilgisi, güvenli yaklaşım teknikleri ve hayvan hakları mevzuatı konularında sertifikalı eğitim verilecektir.'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tümü', icon: '📋' },
    { id: 'environment', name: 'Çevre', icon: '🌿' },
    { id: 'education', name: 'Eğitim', icon: '📚' },
    { id: 'social', name: 'Sosyal', icon: '❤️' },
    { id: 'technology', name: 'Teknoloji', icon: '💻' },
    { id: 'disaster', name: 'Afet', icon: '🚨' },
    { id: 'animal', name: 'Hayvan', icon: '🐾' }
  ];

  const filteredPrograms = selectedCategory === 'all' 
    ? programs 
    : programs.filter(p => p.category === selectedCategory);

  const handleApplyClick = (program) => {
    setSelectedProgram(program);
    setKvkkAccepted(false);
  };

  const handleCloseModal = () => {
    setSelectedProgram(null);
    setKvkkAccepted(false);
  };

  const handleConfirmApplication = () => {
    if (!kvkkAccepted) return;
    
    setAppliedPrograms([...appliedPrograms, selectedProgram.id]);
    setSelectedProgram(null);
    setKvkkAccepted(false);
    setShowSuccessMessage(true);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const isApplied = (programId) => appliedPrograms.includes(programId);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Gönüllü Başvuruları
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Size uygun gönüllülük programını seçin ve hemen başvurun
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-blue-600">
              <div className="text-4xl font-bold text-blue-600 mb-2">81</div>
              <div className="text-sm text-gray-600">İl Kapsamında</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-green-600">
              <div className="text-4xl font-bold text-green-600 mb-2">1.2M</div>
              <div className="text-sm text-gray-600">Aktif Gönüllü</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-purple-600">
              <div className="text-4xl font-bold text-purple-600 mb-2">33M</div>
              <div className="text-sm text-gray-600">Toplam Saat</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-orange-600">
              <div className="text-4xl font-bold text-orange-600 mb-2">{programs.length}</div>
              <div className="text-sm text-gray-600">Aktif Program</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Gönüllü Programları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Size uygun gönüllülük programını seçin ve başvurunuzu yapın
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map(program => (
              <div key={program.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow">
                {/* Program Header */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white">
                  <div className="text-5xl mb-3">{program.image}</div>
                  <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-blue-100">
                    <span>📍 {program.location}</span>
                  </div>
                </div>

                {/* Program Body */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {program.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-gray-700">Süre:</span>
                      <span className="text-gray-600">{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-gray-700">Gönüllü:</span>
                      <span className="text-gray-600">{program.volunteers} kişi</span>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mb-6">
                    <div className="font-semibold text-sm text-gray-700 mb-2">Gereksinimler:</div>
                    <ul className="space-y-1">
                      {program.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Apply Button */}
                  <button 
                    onClick={() => handleApplyClick(program)}
                    disabled={isApplied(program.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      isApplied(program.id)
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-teal-500 hover:bg-teal-600 text-white'
                    }`}
                  >
                    {isApplied(program.id) ? '✓ Başvuruldu' : 'Başvur'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedProgram.image}</span>
                <h2 className="text-2xl font-bold">{selectedProgram.title}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Program Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Program Hakkında</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProgram.fullDescription}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-gray-700">📍 Konum:</span>
                    <span className="text-gray-600 ml-2">{selectedProgram.location}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">⏱️ Süre:</span>
                    <span className="text-gray-600 ml-2">{selectedProgram.duration}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Gereksinimler:</h4>
                  <ul className="space-y-1">
                    {selectedProgram.requirements.map((req, idx) => (
                      <li key={idx} className="text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* KVKK Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Kişisel Verilerin Korunması ve İşlenmesi</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
                  <p className="mb-3">
                    <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</strong> kapsamında, başvuru formunda paylaşacağınız kişisel verileriniz (ad, soyad, iletişim bilgileri, eğitim durumu) gönüllü başvurunuzun değerlendirilmesi, programa kabul süreçlerinin yürütülmesi ve sizinle iletişime geçilmesi amacıyla işlenecektir.
                  </p>
                  <p className="mb-3">
                    Kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları dahilinde, bu başvuru süreciyle sınırlı olarak ve yasal saklama süreleri boyunca işlenecek ve saklanacaktır. Verileriniz üçüncü kişilerle paylaşılmayacak, yalnızca program koordinatörleri ve yetkili personel tarafından erişilebilir olacaktır.
                  </p>
                  <p>
                    KVKK kapsamında, kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, ilgili mevzuatta öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme ve bu haklarınızın kullanımıyla ilgili başvurularınızı <strong>kvkk@gönüllülük.org</strong> adresine iletebilirsiniz.
                  </p>
                </div>

                {/* KVKK Checkbox */}
                <div className="mt-4 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="kvkk-checkbox"
                    checked={kvkkAccepted}
                    onChange={(e) => setKvkkAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 text-teal-500 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                  />
                  <label htmlFor="kvkk-checkbox" className="text-sm text-gray-700 cursor-pointer">
                    <strong>KVKK metnini okudum, anladım ve kişisel verilerimin yukarıda belirtilen amaçlarla işlenmesini kabul ediyorum.</strong>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Kapat
                </button>
                <button
                  onClick={handleConfirmApplication}
                  disabled={!kvkkAccepted}
                  className={`flex-1 py-3 rounded-lg font-semibold transition ${
                    kvkkAccepted
                      ? 'bg-teal-500 hover:bg-teal-600 text-white cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Onaylıyorum
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <span className="text-2xl font-bold">✓</span>
          <span className="font-semibold">Başvurunuz başarıyla alınmıştır!</span>
        </div>
      )}
    </PageLayout>
  );
}
