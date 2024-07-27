// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAKRq8dGR5K0fC339xcUWFrk_9KmqED8YQ",
  authDomain: "meshables-8dfc2.firebaseapp.com",
  projectId: "meshables-8dfc2",
  storageBucket: "meshables-8dfc2.appspot.com",
  messagingSenderId: "527308042901",
  appId: "1:527308042901:web:3de52a4d84fb921969e19c",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };

const auth = getAuth();
export { auth };

const storage = getStorage(app);
export { storage };
