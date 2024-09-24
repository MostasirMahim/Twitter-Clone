// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5PB74-IRJ1yjVlFewAdIcy3QIgb7oWRE",
  authDomain: "mclone-4daee.firebaseapp.com",
  projectId: "mclone-4daee",
  storageBucket: "mclone-4daee.appspot.com",
  messagingSenderId: "999071284088",
  appId: "1:999071284088:web:52f1e3b67db963599c268d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
