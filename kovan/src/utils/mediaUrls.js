// Firebase Storage Media Paths
// Use this to get media file URLs from Firebase Storage

export const MEDIA_BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/kovan-25458.appspot.com/o/media';

export const MEDIA_PATHS = {
  logo: {
    png: `${MEDIA_BASE_URL}%2Fkovan_logo.png?alt=media`,
    svg: `${MEDIA_BASE_URL}%2Fkovan_logo.svg?alt=media`,
  },
  icons: {
    home: `${MEDIA_BASE_URL}%2Fhome.svg?alt=media`,
    search: `${MEDIA_BASE_URL}%2Fsearch.svg?alt=media`,
    application: `${MEDIA_BASE_URL}%2Fapplication.svg?alt=media`,
    statistics: `${MEDIA_BASE_URL}%2Fstatistics.svg?alt=media`,
  },
  maps: {
    world: `${MEDIA_BASE_URL}%2Fworld.svg?alt=media`,
  },
  emoji: {
    home: `${MEDIA_BASE_URL}%2Fhome_emoji.png?alt=media`,
  }
};

// Helper function to get media URL
export const getMediaUrl = (path) => {
  return `${MEDIA_BASE_URL}%2F${path}?alt=media`;
};
