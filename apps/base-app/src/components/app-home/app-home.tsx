import { Component, h } from '@stencil/core';
import state from '../../global/store';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
})
export class AppHome {

  async componentWillLoad() {
    let response = await fetch('https://us-central1-planavsky-com.cloudfunctions.net/app/test');
    let json = await response.json();
    console.log(json);

    setInterval(() => state.seconds++, 1000);
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        <p>
          Welcome to the PWA Toolkit. You can use this starter to build entire
          apps with web components using Stencil and ionic/core! Check out the
          README for everything that comes in this starter out of the box and
          check out our docs on{' '}
          <a href="https://stenciljs.com">stenciljs.com</a> to get started.
        </p>

        <ion-button href="/profile/ionic" expand="block">
          Profile page
        </ion-button>

        <div class="bg-black p-6 rounded-md flex justify-center text-white">Hello, World!</div>
        <planit-button first="ABCD"></planit-button>

        <MyGlobalCounter />
        <p>
          Seconds: {state.seconds}
          <br />
          Squared Clicks: {state.squaredClicks}
        </p>
      </ion-content>,
    ];
  }
}

const MyGlobalCounter = () => {
  return (
    <button onClick={() => state.clicks++}>
      {state.clicks}
    </button>
  );
};
