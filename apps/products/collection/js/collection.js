// Create a class for the element
class CollectionComponent extends HTMLElement {
  static observedAttributes = ['display', 'template', "columns"];

  constructor() {
    // Always call super first in constructor
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
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
    shadow.appendChild(style);

    this._div = document.createElement('div');
    this._div.className = 'wrapper';
    shadow.appendChild(this._div);

    this._items = [];

    // call flexBasis function
    this._flexBasis = '21%';

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(this.loadStyles());

    // Adopt the sheet into the shadow DOM
    shadow.adoptedStyleSheets = [sheet];

    const resizeObserver = new ResizeObserver((entries) => {
      const wrapper = entries[0].contentRect;
      if (wrapper.width <= this._cssVars.breakpoints.sm) {
        this._flexBasis = this._cssVars.flexBasis.sm;
      } else if (wrapper.width <= this._cssVars.breakpoints.md && wrapper.width > this._cssVars.breakpoints.sm) {
        this._flexBasis = this._cssVars.flexBasis.md;
      } else {
        // call flexBasis function
        this._flexBasis = '21%';
      }
      sheet.replaceSync(this.loadStyles());
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
    //resizeObserver.disconnect();
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
      itemElement.innerHTML = item.name;
      this._div.appendChild(itemElement);
    });
  }

  get items() {
    return this._items;
  }

  loadStyles() {
    return `
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
      flex: 1 0 ${this._flexBasis};
    }
    `;
  }
}

customElements.define('collection-component', CollectionComponent);
