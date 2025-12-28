
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace with your Firebase project configuration
// You can find this in the Firebase Console: Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyD1ZNVIDK5-42_Ht5j795hEoLj0luHspZY",
  authDomain: "portfolio-builder-642dd.firebaseapp.com",
  databaseURL: "https://portfolio-builder-642dd-default-rtdb.firebaseio.com",
  projectId: "portfolio-builder-642dd",
  storageBucket: "portfolio-builder-642dd.firebasestorage.app",
  messagingSenderId: "282247883220",
  appId: "1:282247883220:web:787f2285768a31e10d4e41",
  measurementId: "G-GN83J4MQLR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
