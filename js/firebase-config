/**
 * INFRA DEPOT - CLOUD CONNECT v1.0
 * Verified Web Configuration
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDi2TQAvaqnz0D3eK6KZLYYhxsHUBG10A8",
    authDomain: "infradepo.firebaseapp.com",
    projectId: "infradepo",
    storageBucket: "infradepo.firebasestorage.app",
    messagingSenderId: "733942710671",
    appId: "1:733942710671:web:1a2fdd540032ea73b2cbfa",
    measurementId: "G-FT60ZNKS6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Make DB globally available to Auth and Admin engines
window.db = db;

console.log("Firebase: Infrastructure Connected Successfully.");
