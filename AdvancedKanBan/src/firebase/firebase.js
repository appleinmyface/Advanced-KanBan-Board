// Import the functions you need from the SDKs you're using
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHtH1hb5qfPVpFo3Tl-CNel7fS4k4J7U0",
  authDomain: "advancedkanban.firebaseapp.com",
  projectId: "advancedkanban",
  storageBucket: "advancedkanban.appspot.com",
  messagingSenderId: "664073497994",
  appId: "1:664073497994:web:e814c225e366a33a8aec73",
  measurementId: "G-HC1B9PD2CT" // optional, only needed for analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services that you need
export const auth = getAuth(app); // Firebase Authentication
export const db = getFirestore(app); // Firestore Database
