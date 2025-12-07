# Firestore Test Rehberi - Hızlı Başlangıç

## 🚀 Adım 1: Firestore Database Oluştur (2 dakika)

1. https://console.firebase.google.com/project/kovan-25458/firestore adresine git
2. **"Create Database"** butonuna tıkla
3. **"Start in TEST MODE"** seç (önemli!)
4. Region: **europe-west3 (Frankfurt)** seç
5. **Enable** butonuna tıkla

Test Mode Rules (30 gün geçerli):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 1, 6);
    }
  }
}
```

---

## 🧪 Adım 2: Manuel Test Data Ekle (3 dakika)

### Test Post Ekle:

1. Firestore Console'da **"Start collection"** tıkla
2. Collection ID: `posts`
3. Document ID: **Auto-ID** kullan
4. Şu JSON'u ekle:

```json
{
  "authorId": "user-001",
  "authorInfo": {
    "name": "Test User",
    "title": "Gönüllü",
    "avatarUrl": "",
    "isVerified": false
  },
  "content": "Bu bir test postudur. Firebase entegrasyonu çalışıyor! 🎉",
  "media": [],
  "hashtags": ["#test", "#firebase"],
  "engagement": {
    "likes": 5,
    "comments": 2,
    "shares": 0,
    "views": 10
  },
  "createdAt": "2024-12-07T12:00:00Z",
  "updatedAt": "2024-12-07T12:00:00Z",
  "isActive": true,
  "isPinned": false
}
```

5. **Save** tıkla

### Test User Ekle:

1. **Add collection** → Collection ID: `users`
2. Document ID: `user-001`
3. JSON:

```json
{
  "profile": {
    "name": "Test User",
    "headline": "Gönüllü",
    "bio": "Test hesabı",
    "location": "İstanbul",
    "avatarUrl": ""
  },
  "stats": {
    "followers": 10,
    "following": 15,
    "posts": 1,
    "projectsCompleted": 0,
    "hoursVolunteered": 0
  },
  "gamification": {
    "level": 1,
    "xp": 0,
    "badges": [],
    "achievements": []
  },
  "skills": ["Test"],
  "isActive": true,
  "isVerified": false
}
```

4. **Save** tıkla

---

## ✅ Adım 3: Test Sayfası Oluştur

Projede yeni bir test sayfası oluşturacağız.

---

## 🎯 Adım 4: Localhost'ta Test Et

1. Terminal'de:
   ```bash
   npm run dev
   ```

2. Tarayıcıda aç:
   ```
   http://localhost:3001/test
   ```

3. Console'u aç (F12) ve şu logları göreceksin:
   - "Fetching posts..."
   - "Posts fetched: [...]"

4. Sayfada göreceksin:
   - Test post'un içeriği
   - Like/comment sayıları
   - Gerçek zamanlı güncellemeler

---

## 🔥 Adım 5: Gerçek Zamanlı Test

Console'da başka bir sekmede:
1. https://console.firebase.google.com/project/kovan-25458/firestore
2. Posts collection'ı aç
3. Bir post'un `engagement.likes` sayısını değiştir (örn: 5 → 10)
4. **Save**

Web sayfan **otomatik** güncellenecek! 🎉

---

## 🐛 Sorun Giderme

### "Permission denied" hatası alırsanız:
- Firestore'u **Test Mode** ile oluşturduğunuzdan emin olun
- Rules sekmesinden kontrol edin

### "No documents found" mesajı:
- Console'da post eklediğinizden emin olun
- Collection adının tam olarak `posts` olduğunu kontrol edin

### Hiçbir şey görünmüyorsa:
- Browser console'u açın (F12)
- Network sekmesinde Firestore isteklerini kontrol edin
- `.env.local` dosyasının doğru olduğundan emin olun

---

## 📱 Ne Test Edebilirsiniz?

✅ Posts listesi (Home sayfası)
✅ User profile (Me sayfası)  
✅ Real-time updates (Notifications)
✅ Single post detail
✅ Comments
✅ Programs list

Her biri için Console'da manuel veri ekleyebilirsiniz!
