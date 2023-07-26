import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "my-chat-app-80fc9.firebaseapp.com",
    projectId: "my-chat-app-80fc9",
    storageBucket: "my-chat-app-80fc9.appspot.com",
    messagingSenderId: "892258788231",
    appId: "1:892258788231:web:2c32c84f713dbb5511a922"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)