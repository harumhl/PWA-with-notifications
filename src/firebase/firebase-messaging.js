import { useEffect, useState } from "react";
import { firebaseMessaging } from "./firebase-initialization";
import { getToken, onMessage } from "firebase/messaging";

export const FirebaseMessaging = () => {
  const [fcmRegistrationToken, setFcmRegistrationToken] = useState("");

  const sendMessage = (title = "Title", body = "Body") => {
    fetch(
      "https://fcm.googleapis.com/v1/projects/pwa-with-notifications/messages:send",
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_FIREBASE_CLOUD_MESSAGING_API_AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: {
            webpush: {
              notification: {
                title,
                body,
              },
            },
            token: fcmRegistrationToken,
          },
        }),
      }
    );
  };

  onMessage(firebaseMessaging, (payload) => {
    // Displaying the notification on foreground
    alert(payload.notification?.body);
  });

  useEffect(() => {
    getToken(firebaseMessaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_WEB_PUSH_CERT_VAPID_KEY,
    }).then((token) => {
      setFcmRegistrationToken(token);
    });
  }, []);

  return <button onClick={() => sendMessage()}>Send Message</button>;
};
