// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2KMrXyVWkMfh6_2h0RLWPWspdSPGeMSA",
  authDomain: "clavemaestra-e7821.firebaseapp.com",
  projectId: "clavemaestra-e7821",
  storageBucket: "clavemaestra-e7821.appspot.com",
  messagingSenderId: "56418650500",
  appId: "1:56418650500:web:29a4486a7fc247608035d1",
  measurementId: "G-9VJXJ74J8Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);