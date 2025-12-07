# Türkiye Dijital Gönüllülük Platformu - Firebase Deployment Guide

## 🚀 Firebase'e Taşıma Rehberi

Bu proje artık Firebase Hosting, Firestore, Authentication ve Storage servisleri ile kullanılmaya hazır!

### 📋 Önkoşullar

1. Node.js ve npm yüklü olmalı
2. Firebase CLI yüklü olmalı (yoksa: `npm install -g firebase-tools`)
3. Bir Firebase projesi oluşturulmuş olmalı

---

## 🔧 Kurulum Adımları

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Firebase Projesi Oluşturun

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Add project" butonuna tıklayın
3. Proje adı girin (örn: `turkiye-dijital-gonulluluk`)
4. Google Analytics'i etkinleştirin (opsiyonel)
5. Projeyi oluşturun

### 3. Firebase Web Uygulaması Ekleyin

1. Firebase Console'da projenize gidin
2. "Web" ikonuna (</>) tıklayın
3. Uygulama adı girin
4. "Firebase Hosting'i ayarla" seçeneğini işaretleyin
5. "Register app" butonuna tıklayın
6. Firebase yapılandırma bilgilerini kopyalayın

### 4. Environment Variables Ayarlayın

1. `.env.example` dosyasını `.env.local` olarak kopyalayın:

```bash
Copy-Item .env.example .env.local
```

2. `.env.local` dosyasını düzenleyin ve Firebase yapılandırma bilgilerinizi girin:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 5. Firebase CLI ile Giriş Yapın

```bash
firebase login
```

### 6. Firebase Projesini Bağlayın

`.firebaserc` dosyasını düzenleyin ve `your-project-id` kısmını gerçek proje ID'niz ile değiştirin:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

Veya otomatik olarak:

```bash
firebase use --add
```

### 7. Firebase Servislerini Etkinleştirin

Firebase Console'dan şu servisleri etkinleştirin:

- **Authentication**: Email/Password, Google, vb.
- **Firestore Database**: Veritabanı oluşturun (production mode)
- **Storage**: Dosya depolama için
- **Hosting**: Web hosting için

### 8. Firestore ve Storage Rules'u Deploy Edin

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

---

## 🏃 Geliştirme

### Lokal Geliştirme

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacak.

### Firebase Emulators ile Test

Tüm Firebase servislerini lokal olarak test etmek için:

```bash
npm run firebase:emulators
```

Emulator UI: http://localhost:4000

---

## 🚢 Deployment

### Tam Deployment (Build + Deploy)

```bash
npm run firebase:deploy
```

### Sadece Hosting Deploy

```bash
npm run firebase:deploy:hosting
```

### Manuel Deployment

```bash
# Build
npm run build

# Deploy
firebase deploy
```

---

## 📁 Oluşturulan Dosyalar

### Firebase Yapılandırma Dosyaları

- ✅ `firebase.json` - Firebase proje yapılandırması
- ✅ `.firebaserc` - Firebase proje ID'si
- ✅ `firestore.rules` - Firestore güvenlik kuralları
- ✅ `firestore.indexes.json` - Firestore index tanımları
- ✅ `storage.rules` - Storage güvenlik kuralları
- ✅ `src/config/firebase.js` - Firebase SDK yapılandırması
- ✅ `.env.example` - Environment variables şablonu

### Güncellenen Dosyalar

- ✅ `package.json` - Firebase bağımlılıkları ve scriptler
- ✅ `.gitignore` - Firebase dosyaları için güncellemeler

---

## 🔐 Güvenlik Kuralları

### Firestore Rules

`firestore.rules` dosyası şu koleksiyonlar için kurallar içerir:
- `users` - Kullanıcı profilleri
- `projects` - Projeler
- `applications` - Başvurular
- `posts` - Gönderiler ve yorumlar
- `events` - Etkinlikler
- `blog` - Blog yazıları
- `messages` - Mesajlar
- `notifications` - Bildirimler

### Storage Rules

`storage.rules` dosyası şu klasörler için kurallar içerir:
- `users/{userId}/profile/` - Profil fotoğrafları
- `users/{userId}/uploads/` - Kullanıcı yüklemeleri
- `projects/{projectId}/` - Proje görselleri
- `posts/{postId}/` - Gönderi görselleri
- `events/{eventId}/` - Etkinlik görselleri

---

## 🎯 Sonraki Adımlar

### 1. Firebase Authentication Entegrasyonu

`src/config/firebase.js` dosyasından `auth` objesini kullanarak:

```javascript
import { auth } from './config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Giriş
await signInWithEmailAndPassword(auth, email, password);

// Kayıt
await createUserWithEmailAndPassword(auth, email, password);
```

### 2. Firestore Kullanımı

```javascript
import { db } from './config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Veri ekleme
await addDoc(collection(db, 'users'), {
  name: 'Ahmet',
  email: 'ahmet@example.com'
});

// Veri okuma
const querySnapshot = await getDocs(collection(db, 'users'));
```

### 3. Storage Kullanımı

```javascript
import { storage } from './config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Dosya yükleme
const storageRef = ref(storage, 'users/profile.jpg');
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);
```

---

## 🛠️ Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusunu başlat |
| `npm run build` | Production build oluştur |
| `npm run preview` | Build'i önizle |
| `npm run firebase:emulators` | Firebase emulators'ı başlat |
| `npm run firebase:deploy` | Build ve deploy et |
| `npm run firebase:deploy:hosting` | Sadece hosting'i deploy et |

---

## 📚 Kaynak Dökümanlar

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)

---

## ⚠️ Önemli Notlar

1. **Environment Variables**: `.env.local` dosyasını asla Git'e commit etmeyin!
2. **Security Rules**: Production'a geçmeden önce güvenlik kurallarını gözden geçirin
3. **Pricing**: Firebase'in ücretsiz planı (Spark) limitleri var, kullanımı takip edin
4. **Indexes**: Karmaşık Firestore sorguları için index oluşturmanız gerekebilir

---

## 🐛 Sorun Giderme

### Firebase CLI Kurulumu

```bash
npm install -g firebase-tools
```

### Firebase Login Sorunları

```bash
firebase logout
firebase login --reauth
```

### Build Hataları

```bash
# Cache'i temizle
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

Başarılar! 🎉
