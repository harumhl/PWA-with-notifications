import { useCallback } from "react";
import { useFirebaseInit } from "./firebase-initialization";
import { onMessage } from "firebase/messaging";

export const FirebaseMessaging = () => {
  const { firebaseMessaging, fcmRegistrationToken } = useFirebaseInit();

  const sendMessage = useCallback(
    (title = "Title", body = "Body") => {
      // Sending message to Firebase Cloud Messaging API, which my service worker is subscribing to
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
              token: fcmRegistrationToken, // Instead of topic, a token can be specified as a destination
            },
          }),
        }
      )
        .then((e) => {
          if (e.ok) {
            console.log("Message sent");
          } else {
            e.json().then((b) => {
              console.warn("Message failed to sent", e);
            });
          }
        })
        .catch((e) => {
          console.warn("Message failed to sent", e);
          console.warn(
            "Try re-generating REACT_APP_FIREBASE_CLOUD_MESSAGING_API_AUTH_TOKEN env var"
          );
        });
    },
    [fcmRegistrationToken]
  );

  onMessage(firebaseMessaging, (payload) => {
    console.log("Message received on foreground", payload);
    alert(payload.notification?.body);
  });

  return <button onClick={() => sendMessage()}>Send Message</button>;
};
