// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1m5L0_H11SFliWeAtB_4pjBLNhZNJEFM",
  authDomain: "todolist-96d13.firebaseapp.com",
  databaseURL: "https://todolist-96d13-default-rtdb.firebaseio.com",
  projectId: "todolist-96d13",
  storageBucket: "todolist-96d13.appspot.com",
  messagingSenderId: "813988576438",
  appId: "1:813988576438:web:14d25da2e9c602a265ba17",
  measurementId: "G-EG01GLLDK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth()
const analytics = getAnalytics(app);