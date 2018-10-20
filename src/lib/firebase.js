import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTO_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};

firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GithubAuthProvider();
provider.addScope('user');

export const signIn = () => firebase.auth().signInWithPopup(provider);

export const signOut = () => firebase.auth().signOut();
