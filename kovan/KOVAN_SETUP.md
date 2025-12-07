# Kovan - Türkiye Dijital Gönüllülük Platformu
# Firebase Kurulum Talimatları

## ✅ Yapılandırılan Ayarlar

### Firebase Proje Bilgileri
- **Proje Adı**: Kovan
- **Project ID**: kovan-25458
- **Project Number**: 906369026902

### Yapılandırılan Dosyalar
- ✅ `.firebaserc` - Project ID ayarlandı
- ✅ `.env.local` - Environment variables oluşturuldu
- ✅ `src/config/firebase.js` - Firebase config güncellendi

---

## 🔑 Eksik Adımlar (Firebase Console'dan almanız gerekenler)

`.env.local` dosyasını açın ve şu değerleri Firebase Console'dan alıp doldurun:

### 1. Firebase Console'a gidin
https://console.firebase.google.com/project/kovan-25458

### 2. Web App oluşturun (henüz yoksa)
- Project Overview > Add app > Web (</> ikonu)
- App nickname: "Kovan Web"
- Firebase Hosting'i işaretleyin
- Register app

### 3. Config değerlerini kopyalayın
Project Settings > General > Your apps > SDK setup and configuration bölümünden:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",           // ← Bunu kopyalayın
  authDomain: "kovan-25458.firebaseapp.com",
  projectId: "kovan-25458",
  storageBucket: "kovan-25458.appspot.com",
  messagingSenderId: "906369026902",
  appId: "1:906369026902:web:...",  // ← Bunu kopyalayın
  measurementId: "G-..."       // ← Bunu kopyalayın
};
```

### 4. `.env.local` dosyasını güncelleyin
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_APP_ID=1:906369026902:web:...
VITE_FIREBASE_MEASUREMENT_ID=G-...
```

---

## 🔥 Firebase Servislerini Aktifleştirin

### 1. Authentication
```
Build > Authentication > Get started
- Email/Password'u etkinleştirin
- (Opsiyonel) Google Sign-in ekleyin
```

### 2. Firestore Database
```
Build > Firestore Database > Create database
- Start in production mode seçin
- Location: europe-west (veya tercih ettiğiniz bölge)
```

### 3. Storage
```
Build > Storage > Get started
- Start in production mode seçin
```

### 4. Hosting
```
Build > Hosting > Get started
```

---

## 🚀 Deployment Komutları

### Firebase CLI ile giriş
```bash
firebase login
```

### Projeyi doğrulayın
```bash
firebase use kovan-25458
```

### Rules'ları deploy edin
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Tam deployment
```bash
npm run build
firebase deploy
```

---

## ✅ Checklist

- [ ] Firebase Console'da Web App oluşturuldu
- [ ] `.env.local` dosyası API Key ile güncellendi
- [ ] `.env.local` dosyası App ID ile güncellendi
- [ ] `.env.local` dosyası Measurement ID ile güncellendi
- [ ] Authentication etkinleştirildi
- [ ] Firestore Database oluşturuldu
- [ ] Storage etkinleştirildi
- [ ] Hosting ayarlandı
- [ ] Rules deploy edildi
- [ ] İlk deployment yapıldı

---

## 🆘 Yardım

Sorun yaşarsanız:
```bash
firebase --version  # CLI versiyonunu kontrol edin
firebase login --reauth  # Yeniden giriş yapın
firebase projects:list  # Projelerinizi listeleyin
```
