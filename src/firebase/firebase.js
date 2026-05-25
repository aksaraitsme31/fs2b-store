import { initializeApp } from "firebase/app";

import {
  getFirestore
} from "firebase/firestore";

import {
  getAuth
} from "firebase/auth";

import {
  getStorage
} from "firebase/storage";

import {
  getDatabase
} from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyFsErAp9zfIy_MJOxkTFS16GXrSWVv6E",
  authDomain: "fs2b-store.firebaseapp.com",
  projectId: "fs2b-store",
  storageBucket: "fs2b-store.firebasestorage.app",
  messagingSenderId: "557403238530",
  appId: "1:557403238530:web:4f5512394c056c8972049b",

  databaseURL:
    "https://fs2b-store-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app =
  initializeApp(firebaseConfig);

export const db =
  getFirestore(app);

export const auth =
  getAuth(app);

export const storage =
  getStorage(app);

export const realtimeDb =
  getDatabase(app);