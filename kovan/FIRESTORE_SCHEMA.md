# Firestore Data Structure Schema

## ✅ Recommended Architecture

### Collection: `posts`
Top-level collection for all posts.

```javascript
posts/{postId}
{
  id: "auto-generated",
  title: "Post Title",
  content: "Post content here...",
  authorId: "user123",
  authorName: "John Doe",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  likes: 0,
  commentCount: 0,
  tags: ["react", "firebase"],
  // For search optimization
  titleLowercase: "post title",
  contentLowercase: "post content here..."
}
```

### Subcollection: `posts/{postId}/comments`
Comments as subcollection (better organization, isolated queries).

```javascript
posts/{postId}/comments/{commentId}
{
  id: "auto-generated",
  postId: "parent-post-id",
  authorId: "user456",
  authorName: "Jane Smith",
  content: "Great post!",
  createdAt: Timestamp,
  likes: 0
}
```

## 🎯 Why This Structure?

### ✅ Subcollections for Comments
**Pros:**
- Isolated queries (load post without comments)
- Better performance (don't load 100+ comments when fetching posts)
- Clear hierarchy
- Automatic cleanup (delete post → delete all comments via batch)

**Cons:**
- Slightly more complex queries
- Need separate query to get comment count

### ❌ Top-level Comments Collection (Alternative)
```javascript
comments/{commentId}
{
  postId: "reference-to-post",
  // ... other fields
}
```
**Why NOT:**
- All comments in one collection (millions of docs)
- Harder to delete all comments for a post
- Messy architecture

### Search Strategy
**Client-side filtering** for now:
- Store lowercase versions of searchable fields
- Filter in React after fetching
- **Future:** Use Algolia or Elasticsearch for production search

**Why not Firestore queries for search?**
- Firestore doesn't support full-text search
- Limited to prefix matching only
- Better to start simple, scale later

## 📝 Index Requirements

Create these composite indexes in Firebase Console:

1. **Posts by date:**
   - Collection: `posts`
   - Fields: `createdAt` (Descending)

2. **Comments by post:**
   - Collection group: `comments`
   - Fields: `postId` (Ascending), `createdAt` (Descending)
