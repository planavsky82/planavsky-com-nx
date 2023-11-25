import { Component, h, Listen } from '@stencil/core';
import { toastController } from '@ionic/core';

// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getMessaging, getToken } from "firebase/messaging";

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class AppRoot {

  @Listen("swUpdate", { target: 'window' })
  async onServiceWorkerUpdate() {
    const registration = await navigator.serviceWorker.getRegistration();

    if (!registration?.waiting) {
      // If there is no waiting registration, this is the first service
      // worker being installed.
      return;
    }

    const toast = await toastController.create({
      message: "New version available.",
      buttons: [{ text: 'Reload', role: 'reload' }],
      duration: 0
    });

    await toast.present();

    const { role } = await toast.onWillDismiss();

    if (role === 'reload') {
      registration.waiting.postMessage("skipWaiting");
    }
  }

  componentWillLoad() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistration()
        .then(registration => {
          if (registration?.active) {
            navigator.serviceWorker.addEventListener(
              'controllerchange',
              () => window.location.reload()
            );
          }
        })

      const requestNotificationPermission = async () => {
        const permission = await window.Notification.requestPermission();
        // value of permission can be 'granted', 'default', 'denied'
        // granted: user has accepted the request
        // default: user has dismissed the notification permission popup by clicking on x
        // denied: user has denied the request.
        if(permission !== 'granted'){
          throw new Error('Permission not granted for Notification');
        }
      }
      const main = async () => {
        await requestNotificationPermission();
      }
      main();
    }

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    /* const firebaseConfig = {
      apiKey: "AIzaSyBbDYeOyav0tjGR_4FuJusMq5rbpGSsp0A",
      authDomain: "planavsky-com.firebaseapp.com",
      databaseURL: "https://planavsky-com.firebaseio.com",
      projectId: "planavsky-com",
      storageBucket: "planavsky-com.appspot.com",
      messagingSenderId: "737615407449",
      appId: "1:737615407449:web:0ac1c4eac5271efd100448",
      measurementId: "G-G5L3YXSBB4"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    const messaging = getMessaging();
    // Add the public key generated from the console here.
    getToken(messaging, {vapidKey: "BBtCpWEmXjNkAMY1kXUiPlQn0Mal8lXr-Qhic8kgajNDscIK1t5NTq7XZe0zlZGJDJquw8l6vIfmpFz7YXrY2bQ"}); */

    /* function requestPermission() {
      console.log('Requesting permission...');
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    } */
  }

  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="app-home" />
          <ion-route url="/profile/:name" component="app-profile" />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
