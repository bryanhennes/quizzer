import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import {getDatabase} from "firebase/database";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC3fyo0T3MIHWL_zeNS6OKx_Tton1vi4jY",
    authDomain: "quizzer-389c0.firebaseapp.com",
    projectId: "quizzer-389c0",
    storageBucket: "quizzer-389c0.appspot.com",
    messagingSenderId: "825155381138",
    appId: "1:825155381138:web:22b1fc2e2dd53305b1034b",
    measurementId: "G-PESGY29SQH"
  };

  const app = initializeApp(firebaseConfig);
  export const realDb = getDatabase(app);
  export const db = getFirestore(app);
  export const auth = getAuth(app);
  export const storage = getStorage(app);