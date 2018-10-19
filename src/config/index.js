const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTO_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};

let ROOT;

if (process.env.REACT_APP_NODE_ENV === 'development') {
  ROOT = 'https://api-dev.kizmo04.com';
} else if (process.env.NODE_ENV === 'production') {
  ROOT = 'https://api.kizmo04.com';
}

export const config = {
  JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
  firebaseConfig,
  ROOT
};
