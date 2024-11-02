// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIaMzTLqbDHsZScxwN2c7cSIwkGjMMc-I",
  authDomain: "sc2006-1bf92.firebaseapp.com",
  projectId: "sc2006-1bf92",
  storageBucket: "sc2006-1bf92.firebasestorage.app",
  messagingSenderId: "9101975396",
  appId: "1:9101975396:web:d93252e1b38fdeef97e471",
  measurementId: "G-TJW0MQEZL7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };