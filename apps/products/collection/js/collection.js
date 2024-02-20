"use strict";

// Create a class for the element
class CollectionComponent extends HTMLElement {
  static observedAttributes = ['display', 'template', "columns"];

  constructor() {
    // Always call super first in constructor
    super();

    const style = document.createElement('style');
    this._shadow = this.attachShadow({ mode: 'open' });
    this._cssVars = {
      breakpoints: {
        sm: '700',
        md: '900'
      },
      flexBasis: {
        sm: '90%',
        md: '45%'
      }
    }
    this._shadow.appendChild(style);

    this._div = document.createElement('div');
    this._div.className = 'wrapper';
    this._shadow.appendChild(this._div);

    this._items = [];

    this._flexBasis = this.returnFlexBasis();

    this._sheet = new CSSStyleSheet();
    this._sheet.replaceSync(this.loadStyles());

    // Adopt the sheet into the shadow DOM
    this._shadow.adoptedStyleSheets = [this._sheet];

    const resizeObserver = new ResizeObserver((entries) => {
      const wrapper = entries[0].contentRect;
      if (wrapper.width <= this._cssVars.breakpoints.sm) {
        this._flexBasis = this._cssVars.flexBasis.sm;
      } else if (wrapper.width <= this._cssVars.breakpoints.md && wrapper.width > this._cssVars.breakpoints.sm) {
        this._flexBasis = this._cssVars.flexBasis.md;
      } else {
        this._flexBasis = this.returnFlexBasis();
      }
      this._sheet.replaceSync(this.loadStyles());
    });
    resizeObserver.observe(this._div);
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
    resizeObserver.disconnect();
  }

  adoptedCallback() {
    console.log('Custom element moved to new page.');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);

    if (name === 'columns') {
      this._flexBasis = this.returnFlexBasis();
      this._sheet.replaceSync(this.loadStyles());
    }

    if (this.getAttribute('display') === 'carousel') {
      this._previousButton = document.createElement('a');
      this._previousButton.className = 'previous-button';
      this._previousButton.innerHTML = '&#9664;';
      this._previousButton.href = '#';
      this._shadow.appendChild(this._previousButton);
      this._nextButton = document.createElement('a');
      this._nextButton.className = 'next-button';
      this._nextButton.innerHTML = '&#9664;';
      this._nextButton.href = '#';
      this._shadow.appendChild(this._nextButton);
    } else {
      if (this._previousButton) {
        this._shadow.removeChild(this._previousButton);
        this._shadow.removeChild(this._nextButton);
      }
    }
  }

  returnFlexBasis() {
    const cols = parseInt(this.getAttribute('columns'));
    let gap = 0;
    switch(cols) {
      case 2:
        gap = 0.5;
        break;
      case 6:
        gap = 3;
        break;
      case 7:
        gap = 5;
        break;
      case 8:
        gap = 6;
        break;
      case 9:
        gap = 7;
        break;
      case 10:
        gap = 8.5;
        break;
      default:
        gap = 1;
    }

    const width = 100/this.getAttribute('columns') - (this.getAttribute('columns') - gap);
    return width + '%';
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

  loadStyles() {
    return `
    :host {
      --border-color: #ddd;
      --shadow-color: #bbb;
      --black: #000;
      --white: #fff;
      --dark: #555;
      --light: #ccc;
      --border: 1px solid var(--border-color);
      --button-border: 2px solid var(--black);
      --border-radius-base: 5px;
      --border-radius-small: 3px;
      --border-radius-large: 7px;
      --border-radius-xlarge: 9px;
      --shadow-base: 5px 5px 5px var(--shadow-color);
      --shadow-sm: 2px 2px 2px var(--shadow-color);
      --space-base: 4px;
      --space-small: 2px;
      --space-md: calc(var(--space-base) * 2);
      --font-size-base: 14px;
      --font-size-large: 18px;
      --font-size-xlarge: 22px;
      --font-size-xxlarge: 26px;
      --font-weight-bold: bold;

      position: relative;
    }

    div.wrapper {
      height: auto;
    }

    item {
      display: block;
    }

    div.wrapper.cards, div.wrapper.carousel {
      display: flex;
    }

    div.wrapper.cards {
      flex-wrap: wrap;
    }

    div.wrapper.carousel {
      flex-direction: row;
      overflow-x: auto;
      padding-bottom: var(--space-base);
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      margin: 0 var(--space-base);
    }

    div.wrapper.cards item {
      border: var(--border);
      border-radius: var(--border-radius-base);
      min-height: 100px;
      box-shadow: var(--shadow-base);
      margin: var(--space-md);
      flex: 1 0 ${this._flexBasis};
    }

    div.wrapper.list item {
      border: var(--border);
      margin-bottom: var(--space-base);
      box-shadow: var(--shadow-sm);
      border-radius: var(--border-radius-base);
    }

    div.wrapper.carousel item {
      border: var(--border);
      border-radius: var(--border-radius-xlarge);
      min-height: 200px;
      margin-right: var(--space-base);
      flex: 1 0 99.5%;
      scroll-snap-align: start;
    }

    .previous-button, .next-button {
      border: var(--button-border);
      background: var(--dark);
      position: absolute;
      top: 40%;
      height: 40px;
      width: 40px;
      border-radius: 40px;
      line-height: 40px;
      text-align: center;
      font-size: var(--font-size-xlarge);
      color: var(--white);
      -webkit-text-stroke: 2px var(--black);
      text-stroke: 2px var(--black);
      font-weight: var(--font-weight-bold);
      text-decoration: none;
      display: block;
      padding-right: var(--space-small);
    }

    .previous-button {
      left: 2px;
    }

    .next-button {
      right: -2px;
      transform: scale(-1, 1);
    }
    `;
  }
}

customElements.define('collection-component', CollectionComponent);
