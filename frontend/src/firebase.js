// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'kellostore-9fef1.firebaseapp.com',
  projectId: 'kellostore-9fef1',
  storageBucket: 'kellostore-9fef1.appspot.com',
  messagingSenderId: '378710400031',
  appId: '1:378710400031:web:f3c01558f20bb613e4892a',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
