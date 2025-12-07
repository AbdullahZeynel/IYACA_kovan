# Firebase Firestore Database Schema - Kovan Platform

## 📊 Veritabanı İhtiyaçları Analizi

### Temel Gereksinimler:
1. **Kullanıcı Yönetimi** - Profil bilgileri, istatistikler, rozetler
2. **Sosyal Feed** - Gönderiler, yorumlar, beğeniler
3. **Gönüllü Programları** - Başvurular, kategoriler
4. **İstatistikler & Analytics** - Kullanıcı aktiviteleri, gönüllülük saatleri
5. **Bildirimler** - Kullanıcı bildirimleri
6. **Hashtag/Trend Takibi** - Popüler konular
7. **Takipçi Sistemi** - Kullanıcılar arası bağlantılar

---

## 🗂️ Firestore Koleksiyon Yapısı

### 1. `users` Collection
Kullanıcı profil bilgileri ve ayarları

```javascript
{
  userId: "auto-generated-id",
  auth: {
    email: "user@example.com",
    emailVerified: true,
    createdAt: timestamp,
    lastLogin: timestamp
  },
  profile: {
    name: "Mehmet Korkmaz",
    headline: "Gönüllü | Sosyal Sorumluluk Projelerinde Aktif",
    bio: "Gönüllülük faaliyetlerine katılmayı seven...",
    location: "İstanbul, Türkiye",
    phone: "+90 555 123 4567",
    website: "www.example.com",
    avatarUrl: "storage-url",
    bannerUrl: "storage-url",
    joinDate: timestamp
  },
  stats: {
    followers: 248,
    following: 312,
    posts: 45,
    projectsCompleted: 3,
    hoursVolunteered: 45,
    commentsCount: 120,
    likesReceived: 450
  },
  gamification: {
    level: 2,
    xp: 450,
    badges: ["badge-id-1", "badge-id-2"],
    achievements: ["achievement-id-1"]
  },
  skills: ["Takım Çalışması", "İletişim", "Organizasyon"],
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    language: "tr"
  },
  isActive: true,
  isVerified: false
}
```

**Indexes Needed:**
- `profile.name` (for search)
- `stats.hoursVolunteered` (for leaderboards)
- `gamification.level` (for rankings)

---

### 2. `posts` Collection
Sosyal feed gönderileri

```javascript
{
  postId: "auto-generated-id",
  authorId: "user-id",
  authorInfo: {
    name: "Ayşe Yılmaz",
    title: "Gönüllü Koordinatörü",
    avatarUrl: "storage-url"
  },
  content: "Bugün çevre temizliği etkinliğimizi tamamladık!...",
  media: [
    {
      type: "image", // image, video, link
      url: "storage-url"
    }
  ],
  hashtags: ["#Gönüllülük", "#ÇevreKoruma"],
  engagement: {
    likes: 124,
    comments: 18,
    shares: 7,
    views: 450
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: true,
  isPinned: false
}
```

**SubCollection:** `posts/{postId}/comments`
```javascript
{
  commentId: "auto-generated-id",
  authorId: "user-id",
  authorInfo: {
    name: "Mehmet Kaya",
    avatarUrl: "storage-url"
  },
  text: "Harika bir çalışma! Tebrikler 👏",
  likes: 5,
  createdAt: timestamp,
  parentCommentId: null // for nested replies
}
```

**SubCollection:** `posts/{postId}/likes`
```javascript
{
  userId: "user-id",
  likedAt: timestamp
}
```

**Indexes Needed:**
- `createdAt` (desc) - for feed sorting
- `hashtags` (array-contains) - for hashtag filtering
- `authorId` + `createdAt` - for user profile posts

---

### 3. `programs` Collection
Gönüllü programları ve başvurular

```javascript
{
  programId: "auto-generated-id",
  title: "Çevre Koruma Programı",
  category: "environment", // environment, education, social, technology, disaster, animal
  description: "Doğal alanların korunması ve çevre bilincinin artırılması...",
  fullDescription: "Detaylı açıklama...",
  location: "İstanbul, Ankara, İzmir",
  duration: "3 ay",
  requirements: [
    "18 yaş ve üzeri",
    "Haftalık 5 saat"
  ],
  image: "🌿", // or storage-url
  stats: {
    totalVolunteers: 250,
    activeVolunteers: 180,
    completedVolunteers: 70,
    applicants: 320
  },
  coordinator: {
    userId: "user-id",
    name: "Koordinatör Adı",
    email: "coordinator@example.com"
  },
  status: "active", // active, paused, completed
  startDate: timestamp,
  endDate: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**SubCollection:** `programs/{programId}/applications`
```javascript
{
  applicationId: "auto-generated-id",
  userId: "user-id",
  userInfo: {
    name: "Mehmet Korkmaz",
    email: "user@example.com",
    phone: "+90 555 123 4567"
  },
  status: "pending", // pending, approved, rejected, completed
  answers: {
    motivation: "Neden katılmak istiyorsunuz?",
    experience: "İlgili deneyiminiz var mı?"
  },
  kvkkAccepted: true,
  appliedAt: timestamp,
  reviewedAt: timestamp,
  reviewedBy: "admin-user-id",
  hoursCompleted: 0
}
```

**Indexes Needed:**
- `category` + `status` - for filtering
- `startDate` (desc) - for sorting
- `stats.totalVolunteers` (desc) - for popular programs

---

### 4. `hashtags` Collection
Trend takibi için hashtag istatistikleri

```javascript
{
  hashtagId: "gonulluluk", // slug format
  tag: "#Gönüllülük",
  postsCount: 156,
  weeklyPosts: 23,
  monthlyPosts: 89,
  lastUsed: timestamp,
  trending: true,
  category: "general"
}
```

**Indexes Needed:**
- `postsCount` (desc) - for trending topics
- `weeklyPosts` (desc) - for weekly trends

---

### 5. `followers` Collection
Takipçi ilişkileri

```javascript
{
  followId: "auto-generated-id",
  followerId: "user-id", // takip eden
  followingId: "user-id", // takip edilen
  createdAt: timestamp
}
```

**Indexes Needed:**
- `followerId` - bir kullanıcının takip ettikleri
- `followingId` - bir kullanıcının takipçileri
- Composite: `followerId` + `followingId` - relationship check

---

### 6. `notifications` Collection
Kullanıcı bildirimleri

```javascript
{
  notificationId: "auto-generated-id",
  userId: "user-id",
  type: "like", // like, comment, follow, application, achievement
  title: "Yeni beğeni",
  message: "Ahmet Yılmaz gönderinizi beğendi",
  data: {
    postId: "post-id",
    fromUserId: "user-id"
  },
  isRead: false,
  createdAt: timestamp
}
```

**Indexes Needed:**
- `userId` + `isRead` + `createdAt` - unread notifications
- `userId` + `createdAt` (desc) - notification feed

---

### 7. `badges` Collection
Rozetler ve başarımlar

```javascript
{
  badgeId: "auto-generated-id",
  name: "İlk Proje",
  description: "İlk gönüllü projesini tamamla",
  imageUrl: "storage-url",
  category: "milestone", // milestone, hours, projects, engagement
  requirement: {
    type: "projects_completed",
    value: 1
  },
  rarity: "common", // common, rare, epic, legendary
  xpReward: 50
}
```

---

### 8. `statistics` Collection
Platform geneli istatistikler

```javascript
{
  date: "2024-12-07",
  stats: {
    totalUsers: 1250,
    activeUsers: 890,
    totalPosts: 4560,
    totalPrograms: 45,
    totalVolunteerHours: 12450,
    newSignups: 23,
    programApplications: 67
  },
  trends: {
    topHashtags: ["#Gönüllülük", "#Eğitim"],
    topPrograms: ["program-id-1", "program-id-2"],
    mostActiveUsers: ["user-id-1", "user-id-2"]
  }
}
```

---

### 9. `activities` Collection
Kullanıcı aktivite geçmişi (timeline için)

```javascript
{
  activityId: "auto-generated-id",
  userId: "user-id",
  type: "post_created", // post_created, comment_added, program_joined, badge_earned
  title: "Yeni gönderi paylaştı",
  data: {
    postId: "post-id",
    content: "Snippet of content..."
  },
  thumbnail: "emoji or url",
  createdAt: timestamp,
  isPublic: true
}
```

**Indexes Needed:**
- `userId` + `createdAt` (desc) - user timeline
- `userId` + `isPublic` + `createdAt` - public activities

---

## 🔐 Security Considerations

### Read Access:
- **Public**: Posts (with filters), Programs, Hashtags, Badges
- **Authenticated**: User profiles, Statistics
- **Owner Only**: Own notifications, own application details

### Write Access:
- **Owner Only**: Own profile, own posts, own applications
- **Authenticated**: Comments, likes, follows
- **Admin Only**: Programs management, badges creation

---

## 📈 Query Patterns

### Common Queries:

1. **Feed Generation:**
```javascript
posts
  .where('isActive', '==', true)
  .orderBy('createdAt', 'desc')
  .limit(20)
```

2. **User's Posts:**
```javascript
posts
  .where('authorId', '==', userId)
  .orderBy('createdAt', 'desc')
```

3. **Hashtag Posts:**
```javascript
posts
  .where('hashtags', 'array-contains', '#Gönüllülük')
  .orderBy('createdAt', 'desc')
```

4. **Active Programs:**
```javascript
programs
  .where('status', '==', 'active')
  .orderBy('startDate', 'desc')
```

5. **Leaderboard:**
```javascript
users
  .orderBy('stats.hoursVolunteered', 'desc')
  .limit(10)
```

6. **User Followers:**
```javascript
followers
  .where('followingId', '==', userId)
```

---

## 🚀 Next Steps

1. ✅ Create collections in Firestore
2. ✅ Update security rules
3. ✅ Create composite indexes
4. ✅ Migrate dummy data
5. ✅ Update React components to use Firestore
6. ✅ Test CRUD operations
7. ✅ Deploy and monitor

---

## 💾 Storage Structure

```
/users/{userId}/
  ├── profile/
  │   ├── avatar.jpg
  │   └── banner.jpg
  └── uploads/
      └── {uploadId}.jpg

/posts/{postId}/
  └── {mediaId}.jpg

/programs/{programId}/
  └── images/
      └── {imageId}.jpg

/badges/
  └── {badgeId}.png
```

---

Bu yapı ile tüm ihtiyaçlarınızı karşılayacak, ölçeklenebilir ve performanslı bir NoSQL veritabanı tasarımı elde ediyoruz! 🎉
