const REACT_APP_DEV_ROOT='http://localhost:5000';
const REACT_APP_FIREBASE_API_KEY='AIzaSyA8tjWN6Il51ou3WdpR_zXkzWvM5E0YxJQ';
const REACT_APP_FIREBASE_AUTO_DOMAIN='codebattle-7fb78.firebaseapp.com';
const REACT_APP_FIREBASE_DATABASE_URL='https://codebattle-7fb78.firebaseio.com';
const REACT_APP_FIREBASE_PROJECT_ID='codebattle-7fb78';
const REACT_APP_FIREBASE_STORAGE_BUCKET='codebattle-7fb78.appspot.com';
const REACT_APP_FIREBASE_MESSAGING_SENDER_ID=43363239969;
const REACT_APP_JWT_SECRET ='dragon';

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTO_DOMAIN,
  databaseURL: REACT_APP_FIREBASE_DATABASE_URL,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};

export const config = {
  JWT_SECRET: REACT_APP_JWT_SECRET,
  firebaseConfig,
  ROOT: process.env.NODE_ENV !== 'production' ? REACT_APP_DEV_ROOT : '',
};