import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDUg9XxXzMSENSDjk_F7GeIEReMfZSiSA0",
  authDomain: "pf4lagerra-project.firebaseapp.com",
  projectId: "pf4lagerra-project",
  storageBucket: "pf4lagerra-project.appspot.com",
  messagingSenderId: "515355383753",
  appId: "1:515355383753:web:47cd3a63ad03b82166fa18",
  measurementId: "G-3T1LMB7KN3",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const fs = getFirestore(app);
const storage = getStorage();
export { auth, storage, fs };
export default app;
