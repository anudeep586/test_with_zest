// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref}  from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWqzucPwNJmlAMmMCSbE5sNA49iNv4fjQ",
  authDomain: "simppwey.firebaseapp.com",
  projectId: "simppwey",
  storageBucket: "simppwey.appspot.com",
  messagingSenderId: "368177409712",
  appId: "1:368177409712:web:4112334c768b604b5ad575"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app)
