import { Component, h, Element } from '@stencil/core';

// https://stenciljs.com/docs/stencil-store
import state from '../../global/store';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss'
})
export class AppHome {

  @Element() element;

  private list: CollectionComponent;

  async componentWillLoad() {
    const response = await fetch('https://us-central1-planavsky-com.cloudfunctions.net/app/test');
    const json = await response.json();
    console.log(json);

    setInterval(() => state.seconds++, 1000);
  }

  componentDidLoad() {
    this.list = this.element.querySelector('collection-component');
    this.list.setAttribute('sectionHeader', '3');
    this.list.items = [
      {
        "id": 1,
        "name": "New York City",
        "pic": "/demo-images/city.jpeg",
        "summary": "This is summary text.",
        "summaryData": [
          {
            "label": "A",
            "value": "B"
          },
          {
            "label": "A",
            "value": "B"
          },
          {
            "label": "A",
            "value": "B"
          }
        ],
        "desc": "Description",
        "colors": [ "#32a852", "#a83238", "#a83238" ]
      },
      {
        "id": 2,
        "name": "Pittsburgh",
        "pic": "/demo-images/city.jpeg",
        "summary": "This is summary text.",
        "summaryData": [
          {
            "label": "A",
            "value": "B"
          },
          {
            "label": "A",
            "value": "B"
          },
          {
            "label": "A",
            "value": "B"
          }
        ],
        "desc": "Description",
        "colors": [ "#32a852", "#a83238", "#a83238" ]
      }
    ];
  }

  showPrintView = () => {
    this.list.togglePrintView();
    if (this.list.getPrintView()) {
      document.getElementById('print-button').textContent = 'Normal View';
    } else {
      document.getElementById('print-button').textContent = 'Print View';
    }
  };

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

        <collection-component display="list" sectionHeader="2"></collection-component>

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

/* <section class="list">
  <select id="position" onChange={(event) => loadPlayers(event.target)} aria-label="Select Position">
    <option value="QB">Quarterback</option>
    <option value="RB">Running Back</option>
    <option value="WR">Wide Reciever</option>
    <option value="TE">Tight End</option>
    <option value="FLEX">Flex</option>
    <option value="K">Kicker</option>
    <option value="DST">Defense/Special Teams</option>
  </select>
  <button onClick={() => this.showPrintView()} id="print-button">Print View</button>
  <collection-component display="list" sectionHeader="2"></collection-component>
</section> */
