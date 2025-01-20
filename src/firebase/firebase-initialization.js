import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { useEffect, useState } from "react";

export const useFirebaseInit = () => {
  // Basic Firebase Setup
  const [firebaseConfig] = useState({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  });
  const [firebaseApp] = useState(initializeApp(firebaseConfig));
  const [firebaseMessaging] = useState(getMessaging(firebaseApp));

  const [fcmRegistrationToken, setFcmRegistrationToken] = useState("");

  const [isNotificationPermissionGranted, setIsNotificationPermissionGranted] =
    useState(false);
  const [
    isFirebaseConfigSentToServiceWorker,
    setIsFirebaseConfigSentToServiceWorker,
  ] = useState(false);

  useEffect(() => {
    // Checking for notification permission
    if (!isNotificationPermissionGranted) {
      Notification.requestPermission().then(() => {
        setIsNotificationPermissionGranted(true);
      });
    }
  }, [isNotificationPermissionGranted]);

  useEffect(() => {
    // Sending Firebase config to Service worker
    if (!isFirebaseConfigSentToServiceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          // Send Firebase SDK config to the firebase service worker
          if (
            registration.active &&
            registration.active.scriptURL.includes("firebase-messaging-sw.js")
          ) {
            registration.active.postMessage({
              firebaseConfig,
            });
            setIsFirebaseConfigSentToServiceWorker(true);
          }
        });
      });
    }
  }, [firebaseConfig, isFirebaseConfigSentToServiceWorker]);

  useEffect(() => {
    getToken(firebaseMessaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_WEB_PUSH_CERT_VAPID_KEY,
    }).then((token) => {
      console.log(token);
      setFcmRegistrationToken(token);
    });
  }, [firebaseMessaging]);

  return {
    firebaseApp,
    firebaseMessaging,
    fcmRegistrationToken,
  };
};
