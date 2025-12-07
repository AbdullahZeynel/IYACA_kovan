# Firestore Manuel Veri Yükleme Rehberi

## ⚠️ Permission Error Çözümü

Script çalışmadı çünkü:
1. Firestore Database henüz oluşturulmamış OLABİLİR
2. Veya security rules çok kısıtlayıcı

## 🔧 İki Seçenek:

### Seçenek 1: Firebase Console'dan Manuel Yükleme (ÖNERİLEN)

#### Adım 1: Firestore Database Oluştur
1. https://console.firebase.google.com/project/kovan-25458/firestore
2. "Create Database" butonuna tıkla
3. **"Start in TEST MODE"** seç (geliştirme için)
4. Region: europe-west3 (Frankfurt)
5. Enable butonuna tıkla

#### Adım 2: Test User Ekle
1. Firestore Console'da "Start collection" tıkla
2. Collection ID: `users`
3. Document ID: `test-user-001`
4. Aşağıdaki JSON'u kopyala-yapıştır:

```json
{
  "auth": {
    "email": "test@example.com",
    "emailVerified": true,
    "createdAt": "2024-12-07T00:00:00Z",
    "lastLogin": "2024-12-07T00:00:00Z"
  },
  "profile": {
    "name": "Mehmet Korkmaz",
    "headline": "Gönüllü",
    "bio": "Gönüllülük faaliyetlerine katılmayı seven, topluma katkı sağlamaktan mutluluk duyan biriyim.",
    "location": "İstanbul",
    "phone": "",
    "website": "",
    "avatarUrl": "",
    "bannerUrl": "",
    "joinDate": "Kasım 2024"
  },
  "stats": {
    "followers": 248,
    "following": 312,
    "posts": 15,
    "projectsCompleted": 3,
    "hoursVolunteered": 45
  },
  "gamification": {
    "level": 2,
    "xp": 450,
    "badges": ["badge-1"],
    "achievements": []
  },
  "skills": ["Takım Çalışması", "İletişim", "Organizasyon"],
  "preferences": {
    "emailNotifications": true,
    "pushNotifications": true,
    "language": "tr"
  },
  "isActive": true,
  "isVerified": false
}
```

#### Adım 3: İlk Post Ekle
1. "Start collection" → Collection ID: `posts`
2. Auto-ID kullan
3. JSON:

```json
{
  "authorId": "user-001",
  "authorInfo": {
    "name": "Ayşe Yılmaz",
    "title": "Çevre Gönüllülüğü Koordinatörü",
    "avatarUrl": "",
    "isVerified": true
  },
  "content": "🌿 Bugün Beykoz sahilinde düzenlediğimiz çevre temizliği etkinliğimizi başarıyla tamamladık!\n\n50'den fazla gönüllümüzle sabah 08:00'de başlayıp öğlene kadar süren çalışmamızda toplam 200kg atık topladık. Bunların %60'ı plastik, %25'i cam ve %15'i metal atıktı.\n\nGönüllülerimizin özverisi ve ekip ruhu gerçekten takdire şayan. Herkese çok teşekkürler! 💚\n\n#Gönüllülük #ÇevreKoruma #SürdürülebilirYaşam",
  "media": [],
  "hashtags": ["#Gönüllülük", "#ÇevreKoruma", "#SürdürülebilirYaşam"],
  "engagement": {
    "likes": 124,
    "comments": 18,
    "shares": 7,
    "views": 1247
  },
  "createdAt": "2024-12-07T00:00:00Z",
  "updatedAt": "2024-12-07T00:00:00Z",
  "isActive": true,
  "isPinned": false
}
```

---

### Seçenek 2: Security Rules'u Geçici Olarak Gevşet

#### Adım 1: Test Mode Rules
Firestore → Rules sekmesi → Aşağıdaki rules'u yapıştır:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // SADECE TEST İÇİN!
    }
  }
}
```

⚠️ **UYARI:** Bu rules HERKESİN okuma/yazma yapmasına izin verir. Sadece geliştirme için!

#### Adım 2: Script'i Tekrar Çalıştır
```bash
npm run upload:dummy
```

#### Adım 3: Rules'u Geri Al
Test bittikten sonra orijinal production rules'u geri yükle!

---

## 🎯 Hangisini Öneriyorum?

**Seçenek 1 (Manuel)** - Daha güvenli ve kontrollü

Sadece birkaç test verisi yükleyeceğiz, manuel yapmak daha mantıklı.

---

## ✅ Sonraki Adım

Veriler yüklendikten sonra React'i Firestore'a bağlayacağız:
1. Custom hooks oluşturacağız
2. Sayfaları Firestore'a bağlayacağız
3. CRUD işlemlerini entegre edeceğiz

Hangi yöntemi tercih edersiniz? 🤔
