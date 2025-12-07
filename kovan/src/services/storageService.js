// Firestore Services - Storage Operations (Image/File Upload)
import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable,
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from '../config/firebase';

// Upload user profile image
export const uploadProfileImage = async (userId, file, onProgress) => {
  try {
    const storageRef = ref(storage, `users/${userId}/profile/${file.name}`);
    
    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } else {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// Upload user banner image
export const uploadBannerImage = async (userId, file, onProgress) => {
  try {
    const storageRef = ref(storage, `users/${userId}/uploads/banner_${Date.now()}.${file.name.split('.').pop()}`);
    
    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } else {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
  } catch (error) {
    console.error('Error uploading banner image:', error);
    throw error;
  }
};

// Upload post image
export const uploadPostImage = async (postId, file, onProgress) => {
  try {
    const timestamp = Date.now();
    const storageRef = ref(storage, `posts/${postId}/${timestamp}_${file.name}`);
    
    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } else {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
  } catch (error) {
    console.error('Error uploading post image:', error);
    throw error;
  }
};

// Upload program image
export const uploadProgramImage = async (programId, file, onProgress) => {
  try {
    const storageRef = ref(storage, `programs/${programId}/images/${file.name}`);
    
    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } else {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
  } catch (error) {
    console.error('Error uploading program image:', error);
    throw error;
  }
};

// Delete file from storage
export const deleteFile = async (fileUrl) => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Get all files in a directory
export const listFiles = async (path) => {
  try {
    const listRef = ref(storage, path);
    const res = await listAll(listRef);
    
    const urls = await Promise.all(
      res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          url: url,
          path: itemRef.fullPath
        };
      })
    );
    
    return urls;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

// Validate image file
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Geçersiz dosya tipi. Sadece JPEG, PNG, GIF ve WebP formatları kabul edilir.');
  }
  
  if (file.size > maxSize) {
    throw new Error('Dosya boyutu çok büyük. Maksimum 10MB yüklenebilir.');
  }
  
  return true;
};

export default {
  uploadProfileImage,
  uploadBannerImage,
  uploadPostImage,
  uploadProgramImage,
  deleteFile,
  listFiles,
  validateImageFile
};
