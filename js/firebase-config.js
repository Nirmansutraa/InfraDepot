/**
 * NIRMANSUTRA | FIREBASE MASTER CONFIGURATION
 * Project: Infradepo
 * Fixed: Added getDocs for Smart ID Generation
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
    getStorage, 
    ref, 
    uploadString, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ✅ YOUR LIVE API DATA
const firebaseConfig = {
  apiKey: "AIzaSyDi2TQAvaqnz0D3eK6KZLYYhxsHUBG10A8",
  authDomain: "infradepo.firebaseapp.com",
  projectId: "infradepo",
  storageBucket: "infradepo.firebasestorage.app",
  messagingSenderId: "733942710671",
  appId: "1:733942710671:web:1a2fdd540032ea73b2cbfa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporting Engines
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Exporting Methods
export { 
    collection, 
    addDoc, 
    getDocs, // <--- Added this to fix the console error
    serverTimestamp,
    ref, 
    uploadString, 
    getDownloadURL, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
};
