// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCGcBtpaHUsfK4N9tVeTYJRy9YnCQATYfY',
  authDomain: 'matbookworkflow.firebaseapp.com',
  projectId: 'matbookworkflow',
  storageBucket: 'matbookworkflow.firebasestorage.app',
  messagingSenderId:'314246119953',
  appId: '1:314246119953:web:0ecccaa022e5fd799c67b0',
  measurementId: 'G-3P42HTBFPK ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db }; 