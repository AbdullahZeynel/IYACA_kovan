// Upload Media Files to Firebase Storage
// Run this script once to upload all media files to Firebase Storage

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function uploadMediaFiles() {
  const mediaDir = './public/media';
  const files = readdirSync(mediaDir);

  console.log('🚀 Starting media upload to Firebase Storage...\n');

  for (const file of files) {
    try {
      const filePath = join(mediaDir, file);
      const fileBuffer = readFileSync(filePath);
      
      // Create a reference to the file location in Storage
      const storageRef = ref(storage, `media/${file}`);
      
      // Upload the file
      await uploadBytes(storageRef, fileBuffer);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log(`✅ Uploaded: ${file}`);
      console.log(`   URL: ${downloadURL}\n`);
    } catch (error) {
      console.error(`❌ Error uploading ${file}:`, error.message);
    }
  }

  console.log('✨ Upload complete!');
}

uploadMediaFiles().catch(console.error);
