import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace this with your actual Firebase project config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyADgpNM_wm1vpk0x35SUreI-7hl1PUfvOc",
  authDomain: "webdevendt3.firebaseapp.com",
  projectId: "webdevendt3",
  storageBucket: "webdevendt3.firebasestorage.app",
  messagingSenderId: "593218077577",
  appId: "1:593218077577:web:81acdd3b9fe8275d1a9758",
  measurementId: "G-TZQSR3G2YS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
