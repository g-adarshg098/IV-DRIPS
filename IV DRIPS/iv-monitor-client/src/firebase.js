import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAi5_2n5LEB-9UroqDJlePsiAZc3HS4DUE",
    authDomain: "ivdrips-a309d.firebaseapp.com",
    projectId: "ivdrips-a309d",
    storageBucket: "ivdrips-a309d.firebasestorage.app",
    messagingSenderId: "159172899073",
    appId: "1:159172899073:web:4690ab3332fdddf774ab00",
    measurementId: "G-WWYYM4NMNH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { app, analytics };