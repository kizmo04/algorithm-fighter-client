import firebase from 'firebase';
import { firebaseConfig } from '../config/firebase';

firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GithubAuthProvider();
provider.addScope('user');

export const signIn = () => firebase.auth().signInWithPopup(provider);

export const signOut = () => firebase.auth().signOut();
