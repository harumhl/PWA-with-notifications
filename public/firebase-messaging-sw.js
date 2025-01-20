// https://firebase.google.com/docs/cloud-messaging/js/receive
// To use the modular SDK in a service worker, you must bundle your service worker file, since ES modules are relatively new and not widely supported.
// If you don't want to bundle your service worker file, you can use the namespaced API provided by the compat packages -> which is what I did below

console.log("Hello from firebase service worker");

self.addEventListener("message", (event) => {
  // Receiving Firebase SDK config from main app
  const firebaseConfig = event.data.firebaseConfig;
  firebaseReceibesMessageInBackground(firebaseConfig);
});

if ("function" === typeof importScripts) {
  // Importing Firebase SDK
  importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
  );
  importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
  );
}

const firebaseReceibesMessageInBackground = (firebaseConfig) => {
  if ("function" === typeof importScripts) {
    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload
      );

      const notificationTitle =
        payload.notification?.title ?? "Background Message Title";
      const notificationOptions = {
        body: payload.notification?.body ?? "Background Message body.",
      };

      // Service Worker sends a notification to the browser
      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    });
  }
};
