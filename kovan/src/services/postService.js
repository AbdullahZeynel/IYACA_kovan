// Firestore Services - Post Operations
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  increment,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Create new post
export const createPost = async (postData) => {
  try {
    const postsRef = collection(db, 'posts');
    const newPost = {
      ...postData,
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      isPinned: false
    };
    const docRef = await addDoc(postsRef, newPost);
    return { id: docRef.id, ...newPost };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Get post by ID
export const getPostById = async (postId) => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', postId));
    if (postDoc.exists()) {
      return { id: postDoc.id, ...postDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
};

// Get all posts (feed)
export const getAllPosts = async (limitCount = 20) => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

// Get posts by user
export const getPostsByUser = async (userId, limitCount = 20) => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw error;
  }
};

// Get posts by hashtag
export const getPostsByHashtag = async (hashtag, limitCount = 20) => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('hashtags', 'array-contains', hashtag),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting hashtag posts:', error);
    throw error;
  }
};

// Update post
export const updatePost = async (postId, postData) => {
  try {
    await updateDoc(doc(db, 'posts', postId), {
      ...postData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete post
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Like/Unlike post
export const togglePostLike = async (postId, userId) => {
  try {
    const likeRef = doc(db, 'posts', postId, 'likes', userId);
    const likeDoc = await getDoc(likeRef);
    
    if (likeDoc.exists()) {
      // Unlike
      await deleteDoc(likeRef);
      await updateDoc(doc(db, 'posts', postId), {
        'engagement.likes': increment(-1)
      });
      return false;
    } else {
      // Like
      await setDoc(likeRef, {
        userId,
        likedAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'posts', postId), {
        'engagement.likes': increment(1)
      });
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Check if user liked post
export const hasUserLikedPost = async (postId, userId) => {
  try {
    const likeDoc = await getDoc(doc(db, 'posts', postId, 'likes', userId));
    return likeDoc.exists();
  } catch (error) {
    console.error('Error checking like:', error);
    return false;
  }
};

// Add comment to post
export const addComment = async (postId, commentData) => {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const newComment = {
      ...commentData,
      likes: 0,
      createdAt: serverTimestamp(),
      parentCommentId: null
    };
    const docRef = await addDoc(commentsRef, newComment);
    
    // Update post comment count
    await updateDoc(doc(db, 'posts', postId), {
      'engagement.comments': increment(1)
    });
    
    return { id: docRef.id, ...newComment };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get comments for post
export const getComments = async (postId) => {
  try {
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Delete comment
export const deleteComment = async (postId, commentId) => {
  try {
    await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
    await updateDoc(doc(db, 'posts', postId), {
      'engagement.comments': increment(-1)
    });
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Increment post views
export const incrementPostViews = async (postId) => {
  try {
    await updateDoc(doc(db, 'posts', postId), {
      'engagement.views': increment(1)
    });
    return true;
  } catch (error) {
    console.error('Error incrementing views:', error);
    throw error;
  }
};

// Listen to posts (real-time feed)
export const listenToPosts = (callback, limitCount = 20) => {
  const q = query(
    collection(db, 'posts'),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(posts);
  });
};

// Listen to post comments (real-time)
export const listenToComments = (postId, callback) => {
  const q = query(
    collection(db, 'posts', postId, 'comments'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(comments);
  });
};

export default {
  createPost,
  getPostById,
  getAllPosts,
  getPostsByUser,
  getPostsByHashtag,
  updatePost,
  deletePost,
  togglePostLike,
  hasUserLikedPost,
  addComment,
  getComments,
  deleteComment,
  incrementPostViews,
  listenToPosts,
  listenToComments
};
