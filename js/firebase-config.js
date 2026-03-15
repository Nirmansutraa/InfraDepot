/**
 * INFRA DEPOT - MASTER FIREBASE CONNECTION
 *
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDi2TQAvaqnz0D3eK6KZLYYhxsHUBG10A8",
  authDomain: "infradepo.firebaseapp.com", // Updated to infradepo
  projectId: "infradepo",                   // Updated to infradepo
  storageBucket: "infradepo.firebasestorage.app",
  messagingSenderId: "733942710671",
  appId: "1:733942710671:web:1a2fdd540032ea73b2cbfa",
  measurementId: "G-FT60ZNKS6P"
};

const app = initializeApp(firebaseConfig);

// EXPORT these so Admin and Capture pages can "talk" to the cloud
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

console.log("CORE SYSTEM: Connected to 'infradepo' Intelligence Cloud.");
