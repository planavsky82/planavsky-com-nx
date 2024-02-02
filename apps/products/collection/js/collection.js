// Create a class for the element
class CollectionComponent extends HTMLElement {
  static observedAttributes = ['display', 'template', "columns"];

  constructor() {
    // Always call super first in constructor
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    shadow.appendChild(style);

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      div.wrapper {
        height: auto;
      }

      item {
        display: block;
      }

      div.wrapper.cards {
        display: flex;
        flex-wrap: wrap;
      }

      div.wrapper.cards item {
        border: 1px solid #ccc;
        border-radius: 5px;
        min-height: 100px;
        box-shadow: 5px 5px 5px #bbb;
        margin: 8px;
        flex: 1 0 20%;
      }

      @media (max-width: 900px) {
        div.wrapper.cards item {
          flex: 1 0 45%;
        }
      }

      @media (max-width: 700px) {
        div.wrapper.cards item {
          flex: 1 0 90%;
        }
      }
      `
    );

    this._div = document.createElement('div');
    this._div.className = 'wrapper';
    shadow.appendChild(this._div);

    // Adopt the sheet into the shadow DOM
    shadow.adoptedStyleSheets = [sheet];

    this._items = [];
  }

  connectedCallback() {
    console.log('Custom element added to page.');
    console.log(this.getAttribute('display'));
    console.log('items', this.items);
    this._div.classList.add(this.getAttribute('display'));

    if (this.getAttribute('template')) {
      let template = document.getElementById(this.getAttribute('template'));
      if (template) {
        let templateContent = template.content;
        this._div.appendChild(templateContent.cloneNode(true));
      }
    }
  }

  disconnectedCallback() {
    console.log('Custom element removed from page.');
  }

  adoptedCallback() {
    console.log('Custom element moved to new page.');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);
  }

  set items(value) {
    this._items = value;
    console.log('data', this._items);

    this._items.forEach((item) => {
      let itemElement = document.createElement('item');
      itemElement.innerHTML = item.name;
      this._div.appendChild(itemElement);
    });
  }

  get items() {
    return this._items;
  }
}

customElements.define('collection-component', CollectionComponent);
