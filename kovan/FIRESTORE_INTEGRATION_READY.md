# 🎯 Firestore Entegrasyon Hazırlığı Tamamlandı!

## ✅ Yapılan İşlemler

### 1. **Dummy Veriler İyileştirildi** ✨
- Post içerikleri daha profesyonel ve detaylı hale getirildi
- Author bilgilerine `isVerified` ve `avatarUrl` eklendi
- Engagement metrics iyileştirildi (views eklendi)
- Daha gerçekçi içerikler ve emojiler

### 2. **Firestore Service Katmanı Oluşturuldu** 🔧

#### `src/services/userService.js`
Kullanıcı işlemleri:
- ✅ Get/Create/Update user
- ✅ Update stats (followers, posts, hours, etc.)
- ✅ Add skills & badges
- ✅ Leaderboard query
- ✅ Search users
- ✅ Real-time listeners

#### `src/services/postService.js`
Post işlemleri:
- ✅ Create/Read/Update/Delete posts
- ✅ Get posts by user/hashtag
- ✅ Like/Unlike functionality
- ✅ Comments (add, get, delete)
- ✅ Increment views
- ✅ Real-time feed listeners

#### `src/services/storageService.js`
Dosya yükleme işlemleri:
- ✅ Upload profile/banner images
- ✅ Upload post images
- ✅ Upload program images
- ✅ Delete files
- ✅ Progress tracking
- ✅ File validation (type, size)

### 3. **Dummy Data Upload Script** 📤
`scripts/uploadDummyData.js` oluşturuldu:
- Test user oluşturma
- Posts + comments yükleme
- Programs yükleme
- Hashtags yükleme
- Badges yükleme

---

## 🚀 Şimdi Yapılacaklar

### Adım 1: Firestore'da Database Oluştur

Firebase Console'a git:
https://console.firebase.google.com/project/kovan-25458/firestore

"Create Database" → Production Mode → Region: europe-west3

### Adım 2: Dummy Verileri Yükle

```bash
npm run upload:dummy
```

Bu komut şunları yükleyecek:
- 1 test kullanıcısı
- 3 post + yorumları
- 6 gönüllü programı
- 8 trending hashtag
- 4 badge

### Adım 3: React Hooks Oluştur (Sonraki Aşama)

`src/hooks/` klasöründe:
- `useAuth.js` - Authentication
- `usePosts.js` - Post feed
- `useUser.js` - User profile
- `usePrograms.js` - Volunteer programs

### Adım 4: Sayfaları Bağla

Her sayfayı Firestore'a bağla:

**Home.jsx:**
```javascript
import { usePosts } from '../hooks/usePosts';

// Replace MOCK_POSTS with:
const { posts, loading } = usePosts();
```

**Me.jsx:**
```javascript
import { useUser } from '../hooks/useUser';
import { updateUserProfile } from '../services/userService';

// Get user from Firestore
const { user, loading } = useUser(userId);

// Update profile
await updateUserProfile(userId, editData);
```

---

## 📸 Image Upload Örneği

```javascript
import { uploadProfileImage } from '../services/storageService';

const handleImageUpload = async (file) => {
  try {
    const url = await uploadProfileImage(
      userId, 
      file, 
      (progress) => setUploadProgress(progress)
    );
    
    // Update user profile with new image URL
    await updateUserProfile(userId, { avatarUrl: url });
    
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

---

## 💬 Yorum Ekleme Örneği

```javascript
import { addComment } from '../services/postService';

const handleAddComment = async (postId, commentText) => {
  try {
    const newComment = await addComment(postId, {
      authorId: currentUserId,
      authorInfo: {
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl
      },
      text: commentText
    });
    
    console.log('Comment added:', newComment);
  } catch (error) {
    console.error('Failed to add comment:', error);
  }
};
```

---

## ❤️ Like/Unlike Örneği

```javascript
import { togglePostLike, hasUserLikedPost } from '../services/postService';

const handleLike = async (postId) => {
  try {
    const isLiked = await togglePostLike(postId, currentUserId);
    setIsLiked(isLiked);
  } catch (error) {
    console.error('Failed to toggle like:', error);
  }
};

// Check if user already liked
const checkLike = async () => {
  const liked = await hasUserLikedPost(postId, currentUserId);
  setIsLiked(liked);
};
```

---

## 🔄 Real-time Updates Örneği

```javascript
import { listenToPosts } from '../services/postService';

useEffect(() => {
  // Subscribe to real-time updates
  const unsubscribe = listenToPosts((newPosts) => {
    setPosts(newPosts);
  }, 20);
  
  // Cleanup subscription
  return () => unsubscribe();
}, []);
```

---

## 📋 Öncelik Sırası

1. ✅ **Dummy verileri yükle** - `npm run upload:dummy`
2. ⏳ **Custom hooks oluştur** - useAuth, usePosts, useUser
3. ⏳ **Home.jsx'i bağla** - Posts feed Firestore'dan gelsin
4. ⏳ **Me.jsx'i bağla** - Profile CRUD işlemleri
5. ⏳ **Image upload entegrasyonu** - Profile picture değiştirme
6. ⏳ **Comment sistem** - Yorum ekleme/silme
7. ⏳ **Like sistem** - Post beğenme

---

## ⚡ Hızlı Test

Firestore Console'dan manuel test:
1. Console'a git: https://console.firebase.google.com/project/kovan-25458/firestore
2. `users` koleksiyonunu aç
3. `test-user-001` document'ini gör
4. `posts` koleksiyonunda 3 post olmalı
5. Her post'un altında `comments` subcollection'ı var

---

## 🎯 Sonraki Adım

**Şimdi ne yapmak istersiniz?**

A) Dummy verileri Firestore'a yükleyelim (`npm run upload:dummy`)
B) React hooks oluşturup sayfaları bağlamaya başlayalım
C) Önce image upload entegrasyonunu yapalım

Hangisini tercih edersiniz? 🚀
