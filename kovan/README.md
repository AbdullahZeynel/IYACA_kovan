# Türkiye Dijital Gönüllülük Dönüşüm Projesi

**Official Digital Volunteering Platform for Turkey**

## 🎯 Proje Hakkında

Türkiye'de gönüllülüğü sistematik, ölçülebilir ve görünür kılmak için tasarlanmış ulusal bir dijital platform.

### Misyon
Gönüllülüğü dijitalleştirerek, bireylerin yeteneklerini fırsatlarla buluşturan, kuruluşların etkisini ölçen ve politika yapıcılara veri-temelli kararlar sunan bir platform geliştirmek.

### Vizyon
Türkiye'de, her vatandaşın gönüllü çalışmasını tanınan, ölçülen ve takdir edilen bir ekosistem oluşturmak.

## 🗂️ Proje Yapısı

```
via/
├── public/                      # Statik dosyalar
│   └── images/                 # Görseller
├── src/
│   ├── components/             # React bileşenleri
│   │   ├── common/             # Header, Footer, Layout
│   │   └── sections/           # HeroSection, DataCard, ProfileCard, EventCard
│   ├── pages/                  # Sayfa bileşenleri (Home, About, Platform, vb.)
│   ├── layouts/                # PageLayout, Dashboard Layout
│   ├── hooks/                  # Custom React hooks (useContentLoader)
│   ├── styles/                 # CSS (globals.css)
│   ├── utils/                  # Yardımcı fonksiyonlar
│   ├── App.jsx                 # Ana uygulama
│   └── main.jsx                # Entry point
├── content/
│   ├── pages/                  # JSON içerik dosyaları
│   │   ├── home.json
│   │   ├── about.json
│   │   ├── mission.json
│   │   ├── platform.json
│   │   ├── harita.json
│   │   ├── profiles.json
│   │   ├── events.json
│   │   ├── register.json
│   │   ├── contact.json
│   │   ├── blog-index.json
│   │   └── demo.json
│   └── blog/                   # Blog yazıları
│       ├── post-001.json
│       └── post-003.json
├── index.html                  # HTML giriş noktası
├── package.json               # Proje bağımlılıkları
├── vite.config.js            # Vite konfigürasyonu
├── tailwind.config.js         # Tailwind CSS konfigürasyonu
└── README.md                  # Bu dosya
```

## 🚀 Başlangıç

### Ön Gereksinimler
- Node.js 18+ ve npm

### Kurulum

1. **Depoyu Klonlayın**
```bash
cd via
npm install
```

2. **Geliştirme Sunucusunu Başlatın**
```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılacaktır.

3. **Üretim İçin Derleyin**
```bash
npm run build
```

Derlenen dosyalar `dist/` klasöründe olacaktır.

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Ana Mavi**: #1F4E79 (Kurumsal)
- **Türk Mavisi**: #E30A17 (Aksent)
- **Turquaz**: #00A896 (Büyüme & Güven)
- **Beyaz & Açık Griler**: Neutral background

### Typography
- **Font**: Inter, Roboto, sans-serif
- **H1**: 2.5rem, Bold, 1.2 line-height
- **H2**: 2rem, Bold, 1.3 line-height
- **Body**: 1rem, Regular, 1.6 line-height

### Bileşenler
- **Header**: Başlık, navigasyon, CTA butonları
- **Footer**: İçerik linkleri, sosyal medya, copyright
- **HeroSection**: Büyük başlık, açıklama, CTA
- **DataCard**: İstatistik göstergesi
- **ProfileCard**: Gönüllü profili
- **EventCard**: Etkinlik duyurusu
- **InteractiveMap**: Türkiye haritası (ileride)

## 📄 İçerik Yönetimi

Tüm sayfa içeriği, JSON dosyalarından dinamik olarak yüklenmektedir:

```javascript
import useContentLoader from '../hooks/useContentLoader';

const MyPage = () => {
  const { content, loading, error } = useContentLoader('home.json');
  
  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;
  
  return <div>{content.hero.title}</div>;
};
```

### JSON Yapısı Örneği

```json
{
  "pageTitle": "Ana Sayfa",
  "hero": {
    "title": "Başlık",
    "subtitle": "Alt Başlık",
    "ctaButton": "Buton Metni",
    "ctaLink": "/link"
  }
}
```

## 🛣️ Rotalar

| Rota | Dosya | Açıklama |
|------|-------|----------|
| `/` | `Home.jsx` | Ana sayfa |
| `/about` | `About.jsx` | Hakkımızda |
| `/mission` | `Mission.jsx` | Proje Misyonu |
| `/platform` | `Platform.jsx` | Platform Özellikleri |
| `/harita` | `Heatmap.jsx` | Gönüllülük Haritası |
| `/profiller` | `Profiles.jsx` | Gönüllü Profilleri |
| `/etkinlikler` | `Events.jsx` | Etkinlikler |
| `/register` | `Register.jsx` | Kayıt Formları |
| `/blog` | `Blog.jsx` | Blog Sayfası |
| `/blog/:id` | `BlogPost.jsx` | Blog Yazısı |
| `/contact` | `Contact.jsx` | İletişim |
| `/demo` | `Demo.jsx` | Jüri Demo Paneli |

## 📱 Responsive Tasarım

Platform, tüm cihazlarda mükemmel çalışır:
- **Desktop**: 1920px ve üzeri
- **Tablet**: 768px - 1024px
- **Mobile**: 320px - 767px

Tailwind CSS breakpoints kullanılmaktadır:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## ♿ Erişilebilirlik

Platform, WCAG 2.1 Level AA standartlarına uygundur:
- Ekran okuyucu desteği
- Klavye navigasyonu
- Yüksek kontrast modu
- Metin boyutu ayarlama
- Focus indicators

## 🔒 Güvenlik & Gizlilik

- KVKK uyumluluğu
- GDPR uyumluluğu
- End-to-end şifreleme
- Düzenli güvenlik denetimleri

## 🚀 Deployment

### Vercel'e Deploy
```bash
vercel deploy
```

### Netlify'ye Deploy
```bash
netlify deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📊 Sayfalar ve İçerik

### 1. **Ana Sayfa** (`/`)
- Hero bölümü
- Gönüllülüğün paradoksu
- Canlı istatistikler
- Platform özellikleri
- Blog öne çıkanları

### 2. **Hakkımızda** (`/about`)
- Vizyon & Misyon
- Proje arka planı
- Hedef kitle
- Kurumsal iş birlikleri
- Ekip bilgileri

### 3. **Proje Misyonu** (`/mission`)
- Küresel bağlam
- Sorunların anatomisi (9 ana sorun)
- Araştırma metodolojisi
- Beklenen çıktılar

### 4. **Platform Özellikleri** (`/platform`)
- Dört adımlı iş akışı
- 6 ana özellik detayı
- Oyunlaştırma (rozetler & seviyeler)
- Erişilebilirlik
- Teknik mimari

### 5. **Türkiye Gönüllülük Haritası** (`/harita`)
- İnteraktif ısı haritası
- Renglemesi lejant
- İller sıralaması (tablosu)
- Veriye dayalı içgörüler
- Bölgesel analiz

### 6. **Gönüllü Profilleri** (`/profiller`)
- Filtreleme seçenekleri
- Profil kartları grid'i
- Öne çıkan gönüllü
- Topluluk hikayelerindən alıntılar

### 7. **Etkinlikler & Duyurular** (`/etkinlikler`)
- Aktif etkinlikler listesi
- Geçmiş etkinlikler arşivi
- Takvim görünümü
- Filtreleme

### 8. **Kayıt Formları** (`/register`)
- Bireysel Gönüllü Kaydı
- Kurumsal Kaydı
- Etkinliğe Başvuru Formu

### 9. **Blog** (`/blog`)
- Blog yazıları grid'i
- Kategori filtresi
- Ayrıntılı yazı sayfası
- Yazar bilgisi

### 10. **İletişim** (`/contact`)
- İletişim formu
- Kurumsal bilgiler
- SSS (Sıkça Sorulan Sorular)
- Basın materyalleri

### 11. **Jüri Demo Paneli** (`/demo`)
- Gönüllü profili demo
- Kurum paneli demo
- Canlı istatistikler
- Sunum talimatları

## 🔌 API Entegrasyonu

Gelecekte, aşağıdaki API'lar eklenecektir:

```javascript
// Gönüllü Kaydı
POST /api/volunteers/register

// Gönüllü Profili
GET /api/volunteers/:id

// Etkinlikler Listesi
GET /api/events

// Etkinliğe Başvur
POST /api/events/:id/apply

// Harita Verileri
GET /api/heatmap/provinces

// Blog Yazıları
GET /api/blog/posts
GET /api/blog/posts/:id
```

## 🤝 Katkı

Projeye katkıda bulunmak için:

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/new-feature`)
3. Commit edin (`git commit -m 'Add new feature'`)
4. Push edin (`git push origin feature/new-feature`)
5. Pull Request açın

## 📝 Lisans

MIT License - Bkz. LICENSE dosyası

## 📞 İletişim

- **E-posta**: info@gonullulukplatformu.gov.tr
- **Website**: https://gonullulukplatformu.gov.tr
- **Twitter**: @gonulluluktr
- **Instagram**: @gonullulukplatformu

---

**Yapılı**: Proje ekibi tarafından 2024
**Son Güncelleme**: Aralık 2024
