import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// These values are placeholders. 
// You can find your real config in the Firebase Console:
// Project Settings > General > Your Apps > Web App
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "arias-project-hub.firebaseapp.com",
  projectId: "arias-project-hub",
  storageBucket: "arias-project-hub.firebasestorage.app",
  messagingSenderId: "REPLACE_WITH_YOUR_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
