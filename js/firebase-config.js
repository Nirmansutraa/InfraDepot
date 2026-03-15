import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "nirmansutraa.firebaseapp.com",
  projectId: "nirmansutraa",
  storageBucket: "nirmansutraa.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// EXPORT these so other files can see them [cite: 191-192]
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

console.log("Firebase: Infrastructure Connected Successfully.");
