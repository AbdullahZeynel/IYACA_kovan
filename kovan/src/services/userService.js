// Firestore Services - User Operations
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Create new user
export const createUser = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      auth: {
        ...userData.auth,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      },
      isActive: true,
      isVerified: false
    });
    return { id: userId, ...userData };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      profile: profileData
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update user stats
export const updateUserStats = async (userId, stats) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      [`stats.${Object.keys(stats)[0]}`]: increment(Object.values(stats)[0])
    });
    return true;
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

// Add skill to user
export const addUserSkill = async (userId, skill) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const currentSkills = userDoc.data().skills || [];
      if (!currentSkills.includes(skill)) {
        await updateDoc(userRef, {
          skills: [...currentSkills, skill]
        });
      }
    }
    return true;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
};

// Add badge to user
export const addUserBadge = async (userId, badgeId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const currentBadges = userDoc.data().gamification?.badges || [];
      if (!currentBadges.includes(badgeId)) {
        await updateDoc(userRef, {
          'gamification.badges': [...currentBadges, badgeId]
        });
      }
    }
    return true;
  } catch (error) {
    console.error('Error adding badge:', error);
    throw error;
  }
};

// Get leaderboard (top volunteers by hours)
export const getLeaderboard = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('stats.hoursVolunteered', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

// Search users by name
export const searchUsers = async (searchTerm) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('profile.name', '>=', searchTerm),
      where('profile.name', '<=', searchTerm + '\uf8ff'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Listen to user changes (real-time)
export const listenToUser = (userId, callback) => {
  return onSnapshot(doc(db, 'users', userId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

export default {
  getUserById,
  createUser,
  updateUserProfile,
  updateUserStats,
  addUserSkill,
  addUserBadge,
  getLeaderboard,
  searchUsers,
  listenToUser
};
