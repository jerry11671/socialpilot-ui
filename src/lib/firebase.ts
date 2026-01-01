import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPAhEbum9qht2kmFFrxMvgePVhm-c2AoQ",
  authDomain: "ufitrunam-61b22.firebaseapp.com",
  projectId: "ufitrunam-61b22",
  storageBucket: "ufitrunam-61b22.firebasestorage.app",
  messagingSenderId: "836074481060",
  appId: "1:836074481060:web:e884fdfa0a9a2f06894d31",
  measurementId: "G-RQNMNEXDMR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.addScope('email');
microsoftProvider.addScope('profile');

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithMicrosoft = () => signInWithPopup(auth, microsoftProvider);
export const logout = () => signOut(auth);