/**
 * VANILLA JAVASCRIPT FIRESTORE EXAMPLES
 * No React or other frameworks required
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';
import { db } from './config/firebase';

// ============================================
// EXAMPLE 1: Fetch All Documents from Collection
// ============================================
async function fetchAllPosts() {
  try {
    console.log('Fetching all posts...');
    
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('Posts fetched:', posts);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

// Usage:
// fetchAllPosts().then(posts => {
//   posts.forEach(post => {
//     console.log(`${post.authorInfo.name}: ${post.content}`);
//   });
// });


// ============================================
// EXAMPLE 2: Fetch Single Document by ID
// ============================================
async function fetchPostById(postId) {
  try {
    console.log(`Fetching post ${postId}...`);
    
    const docRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const post = { id: docSnap.id, ...docSnap.data() };
      console.log('Post found:', post);
      return post;
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

// Usage:
// fetchPostById('post-123').then(post => {
//   if (post) {
//     console.log(post.content);
//   }
// });


// ============================================
// EXAMPLE 3: Fetch with WHERE Filter
// ============================================
async function fetchPostsByUser(userId) {
  try {
    console.log(`Fetching posts by user ${userId}...`);
    
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef, 
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${posts.length} posts by user`);
    return posts;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
}

// Usage:
// fetchPostsByUser('user-001').then(posts => {
//   console.log(`User has ${posts.length} posts`);
// });


// ============================================
// EXAMPLE 4: Fetch Active Programs
// ============================================
async function fetchActivePrograms() {
  try {
    console.log('Fetching active volunteer programs...');
    
    const programsRef = collection(db, 'programs');
    const q = query(
      programsRef,
      where('isActive', '==', true),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const programs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${programs.length} active programs`);
    return programs;
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
}


// ============================================
// EXAMPLE 5: Real-time Listener - Collection
// ============================================
function listenToNotifications(userId, callback) {
  console.log(`Setting up real-time listener for user ${userId} notifications...`);
  
  const notificationsRef = collection(db, 'notifications');
  const q = query(
    notificationsRef,
    where('userId', '==', userId),
    where('isRead', '==', false),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  
  // Set up the listener
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Received ${notifications.length} unread notifications`);
      callback(notifications);
    },
    (error) => {
      console.error('Error in notifications listener:', error);
    }
  );
  
  // Return unsubscribe function to stop listening
  return unsubscribe;
}

// Usage:
// const unsubscribe = listenToNotifications('user-001', (notifications) => {
//   console.log('New notifications:', notifications);
//   // Update UI here
//   notifications.forEach(notif => {
//     console.log(`- ${notif.title}: ${notif.message}`);
//   });
// });
//
// // Stop listening when done
// unsubscribe();


// ============================================
// EXAMPLE 6: Real-time Listener - Single Document
// ============================================
function listenToUserProfile(userId, callback) {
  console.log(`Setting up real-time listener for user ${userId} profile...`);
  
  const userRef = doc(db, 'users', userId);
  
  // Set up the listener
  const unsubscribe = onSnapshot(
    userRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const user = { id: docSnap.id, ...docSnap.data() };
        console.log('User profile updated:', user);
        callback(user);
      } else {
        console.log('User not found');
        callback(null);
      }
    },
    (error) => {
      console.error('Error in user profile listener:', error);
    }
  );
  
  return unsubscribe;
}

// Usage:
// const unsubscribe = listenToUserProfile('user-001', (user) => {
//   if (user) {
//     console.log(`${user.profile.name} - Level ${user.gamification.level}`);
//     console.log(`Followers: ${user.stats.followers}`);
//     // Update UI here
//   }
// });
//
// // Stop listening when done
// unsubscribe();


// ============================================
// EXAMPLE 7: Fetch Comments (Subcollection)
// ============================================
async function fetchPostComments(postId) {
  try {
    console.log(`Fetching comments for post ${postId}...`);
    
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const comments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${comments.length} comments`);
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}


// ============================================
// EXAMPLE 8: Display Data in HTML (Vanilla JS)
// ============================================
async function displayPostsInHTML() {
  try {
    const posts = await fetchAllPosts();
    const container = document.getElementById('posts-container');
    
    if (!container) {
      console.error('Container element not found');
      return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create HTML for each post
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post-card';
      postElement.innerHTML = `
        <div class="post-header">
          <img src="${post.authorInfo.avatarUrl || '/default-avatar.png'}" alt="${post.authorInfo.name}">
          <div>
            <h4>${post.authorInfo.name}</h4>
            <p>${post.authorInfo.title}</p>
          </div>
        </div>
        <div class="post-content">
          <p>${post.content}</p>
        </div>
        <div class="post-engagement">
          <span>👍 ${post.engagement.likes}</span>
          <span>💬 ${post.engagement.comments}</span>
          <span>🔗 ${post.engagement.shares}</span>
          <span>👁️ ${post.engagement.views}</span>
        </div>
      `;
      
      container.appendChild(postElement);
    });
    
    console.log('Posts displayed in HTML');
  } catch (error) {
    console.error('Error displaying posts:', error);
  }
}


// ============================================
// EXAMPLE 9: Real-time Feed Updates
// ============================================
function setupLiveFeed(containerId) {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error('Container element not found');
    return;
  }
  
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(20));
  
  // Real-time listener
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    container.innerHTML = ''; // Clear container
    
    querySnapshot.forEach((doc) => {
      const post = { id: doc.id, ...doc.data() };
      
      const postElement = document.createElement('article');
      postElement.className = 'feed-post';
      postElement.innerHTML = `
        <h3>${post.authorInfo.name}</h3>
        <p>${post.content}</p>
        <small>${new Date(post.createdAt).toLocaleString('tr-TR')}</small>
      `;
      
      container.appendChild(postElement);
    });
    
    console.log(`Feed updated with ${querySnapshot.size} posts`);
  });
  
  return unsubscribe;
}

// Usage in HTML:
// <div id="live-feed"></div>
// <script>
//   const unsubscribe = setupLiveFeed('live-feed');
// </script>


// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
export {
  fetchAllPosts,
  fetchPostById,
  fetchPostsByUser,
  fetchActivePrograms,
  listenToNotifications,
  listenToUserProfile,
  fetchPostComments,
  displayPostsInHTML,
  setupLiveFeed
};
