import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseMessaging = getMessaging(firebaseApp);

navigator.serviceWorker.getRegistrations().then((registrations) => {
  registrations.forEach((registration) => {
    // Send Firebase SDK config to the firebase service worker
    if (
      registration.active &&
      registration.active.scriptURL.includes("firebase-messaging-sw.js")
    ) {
      registration.active.postMessage({ firebaseConfig });
    }
  });
});
