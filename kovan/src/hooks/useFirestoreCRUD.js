/**
 * Custom Hook: useFirestoreCRUD
 * 
 * A comprehensive Firestore hook for Create, Read, Update, Delete, and Search operations.
 * Designed for posts and comments with real-time updates.
 * 
 * Features:
 * - Real-time listeners
 * - Optimistic updates
 * - Error handling
 * - Loading states
 * - Search functionality
 */

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Hook to fetch a collection with real-time updates
 * @param {string} collectionName - Name of the Firestore collection
 * @param {object} options - Query options
 * @returns {object} { data, loading, error, refresh }
 */
export const useCollection = (collectionName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    orderByField = 'createdAt',
    orderDirection = 'desc',
    limitCount = null,
    whereConditions = null,
    realtime = true
  } = options;

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Build query
      let q = collection(db, collectionName);
      const queryConstraints = [];

      // Add where conditions
      if (whereConditions) {
        whereConditions.forEach(([field, operator, value]) => {
          queryConstraints.push(where(field, operator, value));
        });
      }

      // Add ordering
      if (orderByField) {
        queryConstraints.push(orderBy(orderByField, orderDirection));
      }

      // Add limit
      if (limitCount) {
        queryConstraints.push(limit(limitCount));
      }

      q = query(q, ...queryConstraints);

      // Real-time listener
      if (realtime) {
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const documents = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              // Convert Firestore Timestamps to JS Dates
              createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
              updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
            }));
            setData(documents);
            setLoading(false);
          },
          (err) => {
            console.error(`Error listening to ${collectionName}:`, err);
            setError(err.message);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } else {
        // One-time fetch
        getDocs(q).then((snapshot) => {
          const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
            updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
          }));
          setData(documents);
          setLoading(false);
        }).catch((err) => {
          console.error(`Error fetching ${collectionName}:`, err);
          setError(err.message);
          setLoading(false);
        });
      }
    } catch (err) {
      console.error(`Error setting up query:`, err);
      setError(err.message);
      setLoading(false);
    }
  }, [collectionName, orderByField, orderDirection, limitCount, JSON.stringify(whereConditions), realtime]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      let q = collection(db, collectionName);
      const queryConstraints = [];

      if (whereConditions) {
        whereConditions.forEach(([field, operator, value]) => {
          queryConstraints.push(where(field, operator, value));
        });
      }

      if (orderByField) {
        queryConstraints.push(orderBy(orderByField, orderDirection));
      }

      if (limitCount) {
        queryConstraints.push(limit(limitCount));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      }));
      setData(documents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [collectionName, orderByField, orderDirection, limitCount, whereConditions]);

  return { data, loading, error, refresh };
};

/**
 * Hook to fetch a single document
 * @param {string} collectionName - Collection name
 * @param {string} documentId - Document ID
 * @returns {object} { data, loading, error }
 */
export const useDocument = (collectionName, documentId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, collectionName, documentId);
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setData({
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate?.() || docSnap.data().createdAt,
            updatedAt: docSnap.data().updatedAt?.toDate?.() || docSnap.data().updatedAt
          });
        } else {
          setData(null);
          setError('Document not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching document:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, documentId]);

  return { data, loading, error };
};

/**
 * Hook for CRUD operations
 * @param {string} collectionName - Collection name
 * @returns {object} CRUD functions
 */
export const useFirestoreCRUD = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new document
   */
  const create = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, collectionName), docData);
      setLoading(false);
      return { id: docRef.id, ...docData };
    } catch (err) {
      console.error(`Error creating document:`, err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [collectionName]);

  /**
   * Update an existing document
   */
  const update = useCallback(async (documentId, data) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      setLoading(false);
      return true;
    } catch (err) {
      console.error(`Error updating document:`, err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [collectionName]);

  /**
   * Delete a document
   */
  const remove = useCallback(async (documentId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, collectionName, documentId));
      setLoading(false);
      return true;
    } catch (err) {
      console.error(`Error deleting document:`, err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [collectionName]);

  /**
   * Increment a numeric field
   */
  const incrementField = useCallback(async (documentId, field, value = 1) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, {
        [field]: increment(value)
      });
      setLoading(false);
      return true;
    } catch (err) {
      console.error(`Error incrementing field:`, err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [collectionName]);

  return { create, update, remove, incrementField, loading, error };
};

/**
 * Search hook with client-side filtering
 * @param {Array} data - Array of documents to search
 * @param {string} searchTerm - Search query
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered results
 */
export const useSearch = (data, searchTerm, searchFields = ['title', 'content']) => {
  const [results, setResults] = useState(data);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      setResults(data);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = data.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        if (Array.isArray(value)) {
          return value.some(v => String(v).toLowerCase().includes(term));
        }
        return false;
      });
    });

    setResults(filtered);
  }, [data, searchTerm, JSON.stringify(searchFields)]);

  return results;
};
