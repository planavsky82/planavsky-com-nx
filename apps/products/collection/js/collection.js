// Create a class for the element
class CollectionComponent extends HTMLElement {
  static observedAttributes = ['display', 'template', "columns"];

  constructor() {
    // Always call super first in constructor
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    const cssVars = {
      breakpoints: {
        sm: '700',
        md: '900'
      }
    }
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
        border: 1px solid #ddd;
        border-radius: 5px;
        min-height: 100px;
        box-shadow: 5px 5px 5px #bbb;
        margin: 8px;
        flex: 1 0;
      }

      @media (max-width: ${cssVars.breakpoints.md}px) {
        div.wrapper.cards item {
          flex: 1 0 45%;
        }
      }

      @media (max-width: ${cssVars.breakpoints.sm}px) {
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
    window.addEventListener('resize', this.checkViewportState);

    if (this.getAttribute('template')) {
      let template = document.getElementById(this.getAttribute('template'));
      if (template) {
        let templateContent = template.content;
        this._div.appendChild(templateContent.cloneNode(true));
      }
    }
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.checkViewportState);
  }

  adoptedCallback() {
    console.log('Custom element moved to new page.');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);

    if (name === 'columns') {
      console.log('columns!!!!!!!!!!!');
    }
  }

  set items(value) {
    this._items = value;
    console.log('data', this._items);

    this._items.forEach((item) => {
      let itemElement = document.createElement('item');
      itemElement.style.flexBasis = '21%';
      itemElement.innerHTML = item.name;
      this._div.appendChild(itemElement);
    });
  }

  get items() {
    return this._items;
  }

  checkViewportState() {
    let browserInfo = {
      vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
    console.log(browserInfo);
  }
}

customElements.define('collection-component', CollectionComponent);
