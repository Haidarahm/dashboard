// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnBCBAIeayCh5HcF1-F4DWArNcwP8C13o",
  authDomain: "https://mediverse-1bc4d.firebaseapp.com",
  projectId: "mediverse-1bc4d",
  storageBucket: "Yhttps://mediverse-1bc4d.firebasestorage.app",
  messagingSenderId: "744697448294",
  appId: "1:744697448294:web:e9979d3d4cf7c07f656aa7",
  measurementId: "G-DPML2C04W",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
