import React from 'react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Gizlilik Politikası</h1>
            <p className="text-sm text-gray-500 mb-8">Son güncelleme: 7 Aralık 2025</p>

            <div className="space-y-8 text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giriş</h2>
                <p>
                  Türkiye Dijital Gönüllülük Platformu olarak, kullanıcılarımızın gizliliğine saygı duyuyor ve kişisel verilerinizi korumayı taahhüt ediyoruz. Bu Gizlilik Politikası, platformumuz üzerinden toplanan, kullanılan ve paylaşılan kişisel bilgiler hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Toplanan Bilgiler</h2>
                <p className="mb-3">Platformumuzda aşağıdaki bilgiler toplanabilir:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Kişisel Bilgiler:</strong> Ad, soyad, e-posta adresi, telefon numarası</li>
                  <li><strong>Profil Bilgileri:</strong> Biyografi, yetenekler, ilgi alanları</li>
                  <li><strong>Kullanım Verileri:</strong> Platform üzerindeki aktiviteleriniz, tıklamalar, oturum süreleri</li>
                  <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı türü, cihaz bilgileri</li>
                  <li><strong>İletişim Verileri:</strong> Mesajlaşma, yorum ve etkileşim içerikleri</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Bilgilerin Kullanımı</h2>
                <p className="mb-3">Toplanan bilgiler aşağıdaki amaçlarla kullanılır:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Platform hizmetlerinin sağlanması ve iyileştirilmesi</li>
                  <li>Kullanıcı hesaplarının yönetimi ve güvenliğinin sağlanması</li>
                  <li>Gönüllülük projelerinin eşleştirilmesi ve koordinasyonu</li>
                  <li>İletişim ve bildirim gönderimi</li>
                  <li>Analiz ve istatistik çalışmaları</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Bilgi Paylaşımı</h2>
                <p>
                  Kişisel bilgileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. Ancak, platform üzerinde oluşturduğunuz profil bilgileri diğer kullanıcılar tarafından görülebilir. Ayrıca, gönüllülük projeleri kapsamında proje yöneticileri ve ilgili kuruluşlarla bilgi paylaşımı yapılabilir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Veri Güvenliği</h2>
                <p>
                  Kişisel verilerinizin güvenliğini sağlamak için endüstri standartlarında teknik ve idari önlemler alınmaktadır. Verileriniz şifreli bağlantılar (SSL/TLS) üzerinden iletilir ve güvenli sunucularda saklanır. Ancak, internet üzerinden yapılan hiçbir veri iletiminin %100 güvenli olmadığını unutmamalısınız.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Çerezler (Cookies)</h2>
                <p>
                  Platformumuz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. Çerezler, tarayıcınız tarafından cihazınızda saklanan küçük veri dosyalarıdır. Tarayıcı ayarlarınızdan çerezleri yönetebilir veya devre dışı bırakabilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Haklarınız</h2>
                <p className="mb-3">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
                  <li>Kişisel verilerinizin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                  <li>Kişisel verilerinizin düzeltilmesini veya silinmesini talep etme</li>
                  <li>İşleme faaliyetlerine itiraz etme</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. İletişim</h2>
                <p>
                  Gizlilik politikamız hakkında sorularınız veya talepleriniz için bizimle iletişime geçebilirsiniz:
                </p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold">Türkiye Dijital Gönüllülük Platformu</p>
                  <p>E-posta: gizlilik@gonulluluk.gov.tr</p>
                  <p>Adres: Ankara, Türkiye</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Politika Değişiklikleri</h2>
                <p>
                  Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler yapıldığında kullanıcılarımız bilgilendirilecektir. Politikayı düzenli olarak gözden geçirmenizi öneririz.
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <a 
                href="/login" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                ← Giriş Sayfasına Dön
              </a>
            </div>
          </div>
        </div>
      </div>
  );
}
