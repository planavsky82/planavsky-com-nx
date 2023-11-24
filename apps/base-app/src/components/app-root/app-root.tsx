import { Component, h, Listen } from '@stencil/core';
import { toastController } from '@ionic/core';

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
