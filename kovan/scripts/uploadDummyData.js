// Script to upload dummy data to Firestore
// Run this once to populate your database with initial data

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read JSON files
const homeData = JSON.parse(readFileSync(join(__dirname, '../content/Home.json'), 'utf-8'));
const applicationsData = JSON.parse(readFileSync(join(__dirname, '../content/Applications.json'), 'utf-8'));
const meData = JSON.parse(readFileSync(join(__dirname, '../content/Me.json'), 'utf-8'));

// Firebase config from .env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadDummyData() {
  console.log('🚀 Starting dummy data upload...\n');

  try {
    // 1. Upload test user
    console.log('📝 Uploading test user...');
    const testUserId = 'test-user-001';
    await setDoc(doc(db, 'users', testUserId), {
      auth: {
        email: meData.defaultUserData.email || 'test@example.com',
        emailVerified: true,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      },
      profile: {
        name: meData.defaultUserData.name,
        headline: meData.defaultUserData.headline,
        bio: meData.defaultUserData.bio,
        location: meData.defaultUserData.location,
        phone: meData.defaultUserData.phone || '',
        website: meData.defaultUserData.website || '',
        avatarUrl: meData.defaultUserData.avatarUrl || '',
        bannerUrl: '',
        joinDate: meData.defaultUserData.joinDate
      },
      stats: meData.defaultUserData.stats,
      gamification: {
        level: meData.defaultUserData.level,
        xp: meData.defaultUserData.xp,
        badges: meData.defaultUserData.badges.map(b => `badge-${b.id}`),
        achievements: []
      },
      skills: meData.defaultUserData.skills,
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        language: 'tr'
      },
      isActive: true,
      isVerified: false
    });
    console.log('✅ Test user uploaded!\n');

    // 2. Upload posts
    console.log('📝 Uploading posts...');
    for (const post of homeData.mockPosts) {
      const postRef = await addDoc(collection(db, 'posts'), {
        authorId: post.author.userId,
        authorInfo: {
          name: post.author.name,
          title: post.author.title,
          avatarUrl: post.author.avatarUrl || '',
          isVerified: post.author.isVerified || false
        },
        content: post.content,
        media: [],
        hashtags: post.content.match(/#\w+/g) || [],
        engagement: {
          likes: post.likes,
          comments: post.comments,
          shares: post.shares,
          views: post.views || 0
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        isPinned: false
      });

      // Upload comments for each post
      if (post.commentList && post.commentList.length > 0) {
        for (const comment of post.commentList) {
          await addDoc(collection(db, 'posts', postRef.id, 'comments'), {
            authorId: `user-comment-${comment.id}`,
            authorInfo: {
              name: comment.author,
              avatarUrl: ''
            },
            text: comment.text,
            likes: 0,
            createdAt: serverTimestamp(),
            parentCommentId: null
          });
        }
      }

      console.log(`✅ Post "${post.author.name}" uploaded with comments!`);
    }
    console.log('✅ All posts uploaded!\n');

    // 3. Upload programs
    console.log('📝 Uploading volunteer programs...');
    for (const program of applicationsData.programs) {
      await addDoc(collection(db, 'programs'), {
        title: program.title,
        category: program.category,
        description: program.description,
        fullDescription: program.fullDescription,
        location: program.location,
        duration: program.duration,
        requirements: program.requirements,
        image: program.image,
        stats: {
          totalVolunteers: program.volunteers,
          activeVolunteers: Math.floor(program.volunteers * 0.7),
          completedVolunteers: Math.floor(program.volunteers * 0.3),
          applicants: Math.floor(program.volunteers * 1.3)
        },
        coordinator: {
          userId: testUserId,
          name: meData.defaultUserData.name,
          email: meData.defaultUserData.email || 'coordinator@example.com'
        },
        status: 'active',
        startDate: serverTimestamp(),
        endDate: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Program "${program.title}" uploaded!`);
    }
    console.log('✅ All programs uploaded!\n');

    // 4. Upload hashtags
    console.log('📝 Uploading trending hashtags...');
    for (const topic of homeData.trendingTopics) {
      await setDoc(doc(db, 'hashtags', topic.slug), {
        tag: topic.tag,
        postsCount: topic.posts,
        weeklyPosts: Math.floor(topic.posts * 0.3),
        monthlyPosts: topic.posts,
        lastUsed: serverTimestamp(),
        trending: topic.posts > 50,
        category: 'general'
      });
      console.log(`✅ Hashtag "${topic.tag}" uploaded!`);
    }
    console.log('✅ All hashtags uploaded!\n');

    // 5. Upload badges
    console.log('📝 Uploading badges...');
    const badges = [
      {
        id: 'badge-1',
        name: 'İlk Adım',
        description: 'Platformda ilk kez kayıt ol',
        imageUrl: '/images/badges/beginner.png',
        category: 'milestone',
        requirement: { type: 'signup', value: 1 },
        rarity: 'common',
        xpReward: 10
      },
      {
        id: 'badge-2',
        name: 'İlk Gönderi',
        description: 'İlk gönderini paylaş',
        imageUrl: '/images/badges/first-post.png',
        category: 'engagement',
        requirement: { type: 'posts_created', value: 1 },
        rarity: 'common',
        xpReward: 25
      },
      {
        id: 'badge-3',
        name: '10 Saat Gönüllü',
        description: '10 saat gönüllülük tamamla',
        imageUrl: '/images/badges/10-hours.png',
        category: 'hours',
        requirement: { type: 'hours_volunteered', value: 10 },
        rarity: 'common',
        xpReward: 50
      },
      {
        id: 'badge-4',
        name: 'İlk Proje',
        description: 'İlk gönüllü projesini tamamla',
        imageUrl: '/images/badges/first-project.png',
        category: 'projects',
        requirement: { type: 'projects_completed', value: 1 },
        rarity: 'rare',
        xpReward: 100
      }
    ];

    for (const badge of badges) {
      await setDoc(doc(db, 'badges', badge.id), badge);
      console.log(`✅ Badge "${badge.name}" uploaded!`);
    }
    console.log('✅ All badges uploaded!\n');

    console.log('🎉 ===== UPLOAD COMPLETE! =====');
    console.log('✅ Test user created');
    console.log(`✅ ${homeData.mockPosts.length} posts uploaded`);
    console.log(`✅ ${applicationsData.programs.length} programs uploaded`);
    console.log(`✅ ${homeData.trendingTopics.length} hashtags uploaded`);
    console.log(`✅ ${badges.length} badges uploaded`);
    console.log('\n🔥 Your Firestore database is ready!');
    
  } catch (error) {
    console.error('❌ Error uploading data:', error);
  }
}

// Run the upload
uploadDummyData();
