import { useState, useEffect } from 'react';
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
import { db } from '../config/firebase';

/**
 * Hook to fetch all documents from a Firestore collection
 * @param {string} collectionName - Name of the Firestore collection
 * @param {object} options - Query options (where, orderBy, limit)
 * @returns {object} { data, loading, error }
 */
export const useCollection = (collectionName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query
        let q = collection(db, collectionName);
        
        // Apply filters if provided
        if (options.where) {
          const [field, operator, value] = options.where;
          q = query(q, where(field, operator, value));
        }
        
        if (options.orderBy) {
          const [field, direction = 'asc'] = Array.isArray(options.orderBy) 
            ? options.orderBy 
            : [options.orderBy];
          q = query(q, orderBy(field, direction));
        }
        
        if (options.limit) {
          q = query(q, limit(options.limit));
        }

        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setData(documents);
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, JSON.stringify(options)]);

  return { data, loading, error };
};

/**
 * Hook to fetch a single document by ID
 * @param {string} collectionName - Name of the Firestore collection
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

    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Document not found');
        }
      } catch (err) {
        console.error(`Error fetching document ${documentId}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [collectionName, documentId]);

  return { data, loading, error };
};

/**
 * Hook for real-time updates on a collection
 * @param {string} collectionName - Name of the Firestore collection
 * @param {object} options - Query options (where, orderBy, limit)
 * @returns {object} { data, loading, error }
 */
export const useCollectionRealtime = (collectionName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setError(null);

      // Build query
      let q = collection(db, collectionName);
      
      if (options.where) {
        const [field, operator, value] = options.where;
        q = query(q, where(field, operator, value));
      }
      
      if (options.orderBy) {
        const [field, direction = 'asc'] = Array.isArray(options.orderBy) 
          ? options.orderBy 
          : [options.orderBy];
        q = query(q, orderBy(field, direction));
      }
      
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const documents = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(documents);
          setLoading(false);
        },
        (err) => {
          console.error(`Error in realtime listener for ${collectionName}:`, err);
          setError(err.message);
          setLoading(false);
        }
      );

      // Cleanup listener on unmount
      return () => unsubscribe();
    } catch (err) {
      console.error(`Error setting up listener for ${collectionName}:`, err);
      setError(err.message);
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(options)]);

  return { data, loading, error };
};

/**
 * Hook for real-time updates on a single document
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} documentId - Document ID
 * @returns {object} { data, loading, error }
 */
export const useDocumentRealtime = (collectionName, documentId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const docRef = doc(db, collectionName, documentId);
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setData({ id: docSnap.id, ...docSnap.data() });
          } else {
            setError('Document not found');
          }
          setLoading(false);
        },
        (err) => {
          console.error(`Error in realtime listener for document ${documentId}:`, err);
          setError(err.message);
          setLoading(false);
        }
      );

      // Cleanup listener on unmount
      return () => unsubscribe();
    } catch (err) {
      console.error(`Error setting up listener for document ${documentId}:`, err);
      setError(err.message);
      setLoading(false);
    }
  }, [collectionName, documentId]);

  return { data, loading, error };
};
