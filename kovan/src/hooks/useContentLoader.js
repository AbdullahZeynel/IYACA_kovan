import { useState, useEffect } from 'react';

const useContentLoader = (filename) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/content/pages/${filename}`);
        if (!response.ok) throw new Error(`Failed to load ${filename}`);
        const data = await response.json();
        setContent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [filename]);

  return { content, loading, error };
};

export default useContentLoader;
