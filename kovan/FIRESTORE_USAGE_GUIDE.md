# Firebase Firestore - Quick Reference Guide
## Project: kovan-25458

---

## 📚 Collections Structure

```
/users                  - User profiles and stats
/posts                  - Main feed posts
  /{postId}/comments    - Comments subcollection
  /{postId}/likes       - Likes subcollection
/programs               - Volunteer programs
/hashtags               - Trending hashtags
/followers              - Follow relationships
/notifications          - User notifications
/badges                 - Achievement badges
/statistics             - Platform analytics
/activities             - Activity logs
```

---

## 🔥 React Hooks Usage

### 1. Fetch Collection (One-time)
```javascript
import { useCollection } from '../hooks/useFirestore';

const { data, loading, error } = useCollection('posts', {
  orderBy: ['createdAt', 'desc'],
  limit: 10
});
```

### 2. Fetch with Filter
```javascript
const { data, loading, error } = useCollection('posts', {
  where: ['authorId', '==', 'user-001'],
  orderBy: ['createdAt', 'desc']
});
```

### 3. Fetch Single Document
```javascript
import { useDocument } from '../hooks/useFirestore';

const { data, loading, error } = useDocument('users', userId);
```

### 4. Real-time Collection
```javascript
import { useCollectionRealtime } from '../hooks/useFirestore';

const { data, loading, error } = useCollectionRealtime('notifications', {
  where: ['userId', '==', currentUserId],
  where: ['isRead', '==', false],
  orderBy: ['createdAt', 'desc']
});
```

### 5. Real-time Document
```javascript
import { useDocumentRealtime } from '../hooks/useFirestore';

const { data, loading, error } = useDocumentRealtime('users', userId);
```

---

## 💻 Vanilla JavaScript Usage

### Fetch All Documents
```javascript
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './config/firebase';

const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
const querySnapshot = await getDocs(q);
const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

### Fetch Single Document
```javascript
import { doc, getDoc } from 'firebase/firestore';

const docRef = doc(db, 'posts', 'post-123');
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  const post = { id: docSnap.id, ...docSnap.data() };
}
```

### Real-time Listener
```javascript
import { onSnapshot } from 'firebase/firestore';

const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log('Posts updated:', posts);
});

// Stop listening
unsubscribe();
```

---

## 🎯 Common Queries

### Get User's Posts
```javascript
const { data } = useCollection('posts', {
  where: ['authorId', '==', userId],
  orderBy: ['createdAt', 'desc']
});
```

### Get Active Programs
```javascript
const { data } = useCollection('programs', {
  where: ['isActive', '==', true],
  where: ['status', '==', 'open']
});
```

### Get Unread Notifications
```javascript
const { data } = useCollectionRealtime('notifications', {
  where: ['userId', '==', userId],
  where: ['isRead', '==', false],
  orderBy: ['createdAt', 'desc']
});
```

### Get Post Comments (Subcollection)
```javascript
const { data } = useCollection(`posts/${postId}/comments`, {
  orderBy: ['createdAt', 'asc']
});
```

### Get Top Posts by Hashtag
```javascript
const { data } = useCollection('posts', {
  where: ['hashtags', 'array-contains', '#Gönüllülük'],
  orderBy: ['engagement.likes', 'desc'],
  limit: 10
});
```

---

## 📊 Data Display Examples

### Display in React
```jsx
function PostsList() {
  const { data: posts, loading } = useCollection('posts');
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.authorInfo.name}</h3>
          <p>{post.content}</p>
          <span>👍 {post.engagement.likes}</span>
        </div>
      ))}
    </div>
  );
}
```

### Display in Vanilla JS
```javascript
async function displayPosts() {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  const container = document.getElementById('posts');
  container.innerHTML = '';
  
  snapshot.forEach(doc => {
    const post = doc.data();
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${post.authorInfo.name}</h3>
      <p>${post.content}</p>
    `;
    container.appendChild(div);
  });
}
```

---

## ⚡ Performance Tips

1. **Use Indexes**: Composite queries need indexes (already configured in firestore.indexes.json)
2. **Limit Results**: Always use `limit()` to reduce data transfer
3. **Clean Up Listeners**: Always call `unsubscribe()` when component unmounts
4. **Cache Strategy**: Firestore automatically caches data for offline access

---

## 🔐 Security Rules (Already Configured)

- ✅ Users can only edit their own data
- ✅ Posts are publicly readable
- ✅ Authenticated users can create posts
- ✅ Only post owners can delete their posts
- ✅ Admin role for program management

---

## 📁 Files Created

- ✅ `src/hooks/useFirestore.js` - React hooks for Firestore
- ✅ `src/examples/FirestoreExamples.jsx` - React component examples
- ✅ `src/examples/vanillaFirestore.js` - Vanilla JS examples
- ✅ `src/config/firebase.js` - Firebase initialization (existing)
- ✅ `src/services/postService.js` - Post CRUD operations (existing)
- ✅ `src/services/userService.js` - User CRUD operations (existing)

---

## 🚀 Next Steps

1. Upload dummy data to Firestore:
   ```bash
   npm run upload:dummy
   ```

2. Test hooks in your components:
   ```jsx
   import { useCollection } from './hooks/useFirestore';
   
   const { data: posts } = useCollection('posts');
   ```

3. Connect existing pages to Firestore:
   - Replace mock data in `Home.jsx` with `useCollectionRealtime('posts')`
   - Replace user data in `Me.jsx` with `useDocumentRealtime('users', userId)`
   - Connect programs in `Applications.jsx`

---

## 📞 Collection Examples

### /posts
```javascript
{
  id: "post-123",
  authorId: "user-001",
  authorInfo: {
    name: "Ayşe Yılmaz",
    title: "Gönüllü",
    avatarUrl: "...",
    isVerified: true
  },
  content: "Post content...",
  media: ["url1", "url2"],
  hashtags: ["#Gönüllülük"],
  engagement: {
    likes: 124,
    comments: 18,
    shares: 7,
    views: 1247
  },
  createdAt: "2024-12-07T...",
  isActive: true
}
```

### /users
```javascript
{
  id: "user-001",
  profile: {
    name: "Mehmet Korkmaz",
    headline: "Gönüllü",
    bio: "...",
    avatarUrl: "...",
    location: "İstanbul"
  },
  stats: {
    followers: 248,
    following: 312,
    posts: 15,
    projectsCompleted: 3
  },
  gamification: {
    level: 2,
    xp: 450,
    badges: ["badge-1"]
  },
  skills: ["Takım Çalışması"],
  isActive: true
}
```

### /programs
```javascript
{
  id: "program-001",
  title: "Ağaç Dikme Kampanyası",
  description: "...",
  category: "Çevre",
  location: {
    city: "İstanbul",
    district: "Beşiktaş"
  },
  participants: {
    current: 45,
    max: 50
  },
  dates: {
    start: "2024-12-15",
    end: "2024-12-17"
  },
  isActive: true,
  status: "open"
}
```
