// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAzf5F7rXBFs76z2lAv65hmR3A_bKkiYdM',
  authDomain: 'algomentor-8bb86.firebaseapp.com',
  projectId: 'algomentor-8bb86',
  storageBucket: 'algomentor-8bb86.firebasestorage.app',
  messagingSenderId: '753994054679',
  appId: '1:753994054679:web:74025b7b890d083164b052',
  measurementId: 'G-LVLF0J8LYP'
};


export const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
