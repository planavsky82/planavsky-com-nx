"use strict";

// Create a class for the element
class CollectionComponent extends HTMLElement {
  static observedAttributes = ['display', 'template', "columns", "sectionHeader"];

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
    this._activeId = 0;

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

    this._div.addEventListener('scroll', () => {
      this.debounce(this.setActiveItemByScroll(), 100);
    });
  }

  connectedCallback() {
    //console.log('Custom element added to page.');
    //console.log(this.getAttribute('display'));
    //console.log('items', this.items);
    this._div.classList.add(this.getAttribute('display'));

    if (this.getAttribute('template')) {
      let template = document.getElementById(this.getAttribute('template'));
      if (template) {
        let templateContent = template.content;
        this._div.appendChild(templateContent.cloneNode(true));
      }
    }

    this.dataLoaded();
  }

  disconnectedCallback() {
    resizeObserver.disconnect();
    this._previousButton.removeEventListener('click');
    this._nextButton.removeEventListener('click');
    this._div.removeEventListener('scroll');
  }

  adoptedCallback() {
    //console.log('Custom element moved to new page.');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);

    if (name === 'columns') {
      this._flexBasis = this.returnFlexBasis();
      this._sheet.replaceSync(this.loadStyles());
    }

    if (this.getAttribute('display') === 'carousel' || this.getAttribute('display') === 'carousel-3d') {
      this.loadNavigation();
      this.displayNavigation(true, false);
    } else {
      if (this._previousButton) {
        this._shadow.removeChild(this._previousButton);
        this._shadow.removeChild(this._nextButton);
      }
    }
  }

  debounce(callback, delay) {
    let timeout = null;
    return (...args) => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  navigate(direction) {
    this._currentStep = this._activeId;
    if (direction === 'next') {
      this._currentStep++;
    }
    if (direction === 'previous') {
      this._currentStep--;
    }
    if (this._currentStep < 0) {
      this._currentStep = 0;
    }
    if (this._currentStep >= this._div.children.length) {
      this._currentStep = this._div.children.length - 1;
    }
    const first = this._currentStep === 0;
    const last = (this._currentStep + 1) === this._div.children.length;
    // TODO: clean, document, and test this logic
    if (this._currentStep >= 0 && (this._currentStep + 1) <= this._div.children.length && direction) {
      if (this.getAttribute('display') === 'carousel') {
        const middle = this._div.children[this._currentStep];
        middle.scrollIntoView(false);
      }
      if (this.getAttribute('display') === 'carousel-3d') {
        if (direction === 'next') {
          if (this._activeId < this._div.children.length - 1) {
            this._activeId++;
          }
        } else {
          if (this._activeId > 0) {
            this._activeId--;
          }
        }
        const items = this._div.getElementsByTagName('item');
        const arr = [].slice.call(items);
        arr.map(item => {
          return item.classList.remove('active');
        });
        items[this._activeId].classList.add('active');
        this._div.classList.remove('active-next');
        this._div.classList.remove('active-previous');
        if (direction === 'next') {
          this._div.classList.add('active-next');
        } else {
          this._div.classList.add('active-previous');
        }
        this.setSiblingClasses(this._activeId, items.length);
      }
      this.displayNavigation(first, last);
    }
    if (!direction) {
      this.displayNavigation(first, last);
    }
  }

  setSiblingClasses(activeId, max) {
    this._items.forEach((item, index) => {
      this._div.getElementsByTagName('item')[index].classList.remove('next-in-collection');
      this._div.getElementsByTagName('item')[index].classList.remove('previous-in-collection');
    });
    console.log(activeId);
    let forward = (activeId < (max - 3)) ? activeId + 3 : max;
    let backward = (activeId >= 3) ? activeId - 3 : 0;
    console.log('max', max);
    console.log('forward', forward);
    console.log('activeId', activeId);
    console.log('backward', backward);
    console.log('forward items:');
    // forward
    for (let i=activeId+1; i<forward+1; i++) {
      console.log(i);
      const items = this._div.getElementsByTagName('item')[i].classList.add('next-in-collection');
    }
    console.log('backward items:');
    // backward
    for (let i=activeId-1; i>=backward; i--) {
      console.log(i);
      const items = this._div.getElementsByTagName('item')[i].classList.add('previous-in-collection');
    }
  }

  setActiveItemByScroll() {
    if (this._div) {
      const items = this._div.getElementsByTagName('item');
      const arr = [].slice.call(items);
      arr.map(item => {
        return item.classList.remove('active');
      });
      const active = arr.reduce(
        (prev, current) => {
          return prev.getBoundingClientRect().x < current.getBoundingClientRect().x && prev.getBoundingClientRect().x >=0 ? prev : current
        }
      );
      active.classList.add('active');
      this._activeId = parseInt(active.id.split('_')[1]);
      // this.navigate(); removing - don't know why this was here
    }
  }

  loadNavigation() {
    this._previousButton = document.createElement('div');
    this._previousButton.className = 'previous-button fadeOut';
    this._previousButton.role = 'button';
    this._previousButton.tabIndex = '0';
    this._previousButton.innerHTML = '&#9664;';
    this._previousButton.addEventListener('click', () => {
      this.navigate('previous');
    });
    this._previousButton.addEventListener('keydown', () => {
      this.navigate('previous');
    });
    this._shadow.appendChild(this._previousButton);

    this._nextButton = document.createElement('div');
    this._nextButton.className = 'next-button fadeOut';
    this._nextButton.role = 'button';
    this._nextButton.tabIndex = '0';
    this._nextButton.innerHTML = '&#9664;';
    this._nextButton.addEventListener('click', () => {
      this.navigate('next');
    });
    this._nextButton.addEventListener('keydown', () => {
      this.navigate('next');
    });
    this._shadow.appendChild(this._nextButton);
  }

  displayNavigation(first, last) {
    this._previousButton.classList.remove('fadeOut');
    this._previousButton.classList.add('fadeIn');
    this._nextButton.classList.remove('fadeOut');
    this._nextButton.classList.add('fadeIn');
    this._previousButton.ariaHidden = 'false';
    this._nextButton.ariaHidden = 'false';
    if (first) {
      this._previousButton.classList.remove('fadeIn');
      this._previousButton.classList.add('fadeOut');
      this._previousButton.ariaHidden = 'true';
    }
    if (last) {
      this._nextButton.classList.remove('fadeIn');
      this._nextButton.classList.add('fadeOut');
      this._nextButton.ariaHidden = 'true';
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

  dataLoaded() {
    if (this._div.getElementsByTagName('item')[this._activeId]) {
      this._div.getElementsByTagName('item')[this._activeId].classList.add('active');
    }
  };

  set items(value) {
    this._items = value;
    //console.log('data', this._items);

    this._items.forEach((item, index) => {
      let itemElement = document.createElement('item');
      itemElement.id = 'item_' + index;
      itemElement.innerHTML = `<h${this.getAttribute('sectionHeader')}>${item.name}</h${this.getAttribute('sectionHeader')}>`;
      this._div.appendChild(itemElement);

      let indexElement = document.createElement('div');
      let summaryElement = document.createElement('div');
      let summaryData = document.createElement('ul');
      let picElement = document.createElement('img');
      let picElement2 = document.createElement('img');
      let descElement = document.createElement('div');
      let canvasElement = document.createElement('canvas');

      indexElement.classList.add('item-index');

      summaryElement.innerHTML = item.summary;

      if (item.summaryData) {
        item.summaryData.forEach((data) => {
          let summaryDataItem = document.createElement('li');
          let summaryDataItemLabel = document.createElement('span');
          let summaryDataItemValue = document.createElement('span');
          summaryDataItemLabel.innerHTML = data.label;
          summaryDataItem.appendChild(summaryDataItemLabel);
          summaryDataItemValue.innerHTML = data.value;
          summaryDataItem.appendChild(summaryDataItemValue);

          summaryData.appendChild(summaryDataItem);
        });
      }

      let alt = item.alt ? item.alt : item.name;
      picElement.src = item.pic;
      picElement.alt = 'Picture for ' + alt;

      let alt2 = item.alt2 ? item.alt2 : item.name;
      picElement2.src = item.pic2;
      picElement2.alt = 'Picture for ' + alt2;

      descElement.innerHTML = item.desc;

      canvasElement.width = '200';
      canvasElement.height = '100';
      canvasElement.ariaLabel = 'Additonal image for ' + item.name;
      canvasElement.role = 'img';

      let ctx = canvasElement.getContext('2d');
      ctx.moveTo(0, 0);
      ctx.lineTo(200, 100);
      ctx.stroke();

      itemElement.appendChild(indexElement);
      indexElement.appendChild(summaryElement);
      indexElement.appendChild(picElement);
      indexElement.appendChild(picElement2);
      if (item.canvas) {
        indexElement.appendChild(canvasElement);
      }
      indexElement.appendChild(summaryData);
      indexElement.appendChild(descElement);
    });

    this.dataLoaded();
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
      --darker: #333;
      --light: #ccc;
      --border: 1px solid var(--border-color);
      --button-border: 2px solid var(--black);
      --border-radius-base: 5px;
      --border-radius-small: 3px;
      --border-radius-large: 7px;
      --border-radius-xlarge: 9px;
      --border-radius-zoom: 30px;
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
      --button-size: 40px;

      position: relative;
    }

    .fadeIn {
      opacity: 100%;
      transition: opacity 1s;
    }

    .fadeOut {
      opacity: 0%;
      transition: opacity 1s;
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

    div.wrapper.carousel-3d {
      position: relative;
      min-height: 200px;
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

    div.wrapper.carousel-3d item {
      border: var(--border);
      border-radius: var(--border-radius-xlarge);
      min-height: 200px;
      position: absolute;
      width: 100%;
    }

    div.wrapper.carousel-3d.active-next item.active {
      animation: activate-next 1.5s ease-in;
    }

    div.wrapper.carousel-3d.active-previous item.active {
      animation: activate-previous 1.5s ease-in;
    }

    div.wrapper.carousel-3d :not(item.active) {
      opacity: 0;
    }

    div.wrapper.carousel item .item-index, div.wrapper.carousel-3d .item-index, div.wrapper.cards item .item-index {
      display: none;
      opacity: 0;
    }

    div.wrapper.carousel-3d item.previous-in-collection, div.wrapper.carousel-3d item.next-in-collection {
      margin-left: 3px;
      background: var(--black);
      color: var(--white);
      border-radius: var(--border-radius-zoom);
      z-index: 1;
    }

    div.wrapper.carousel-3d item.previous-in-collection .item-index, div.wrapper.carousel-3d item.next-in-collection .item-index {
      display: block;
      opacity: 1;
      font-size: 8rem;
    }

    div.wrapper.list item {
      padding: var(--space-md);

      :is(h1, h2, h3, h4, h5, h6) {
        margin: 0;
      }
    }

    div.wrapper.carousel-3d item.previous-in-collection {
      transition: opacity 1.5s;
      opacity: 1;
      transform: scale(0.1);
      border: 2px solid var(--white);
      position: absolute;
      transform-origin: top right;
      margin-top: -3px;
    }

    div.wrapper.carousel-3d item.next-in-collection {
      transition: opacity 1.5s;
      opacity: 1;
      transform: scale(0.1);
      border: 2px solid var(--white);
      transform-origin: bottom right;
      margin-top: 3px;
    }

    div.item-index {
      display: grid;
      grid-template-columns: auto auto auto;

      img:first-of-type {
        height: 100px;
      }

      img:nth-of-type(2) {
        height: 50px;
      }
    }

    @keyframes activate-next {
      0%   { transform: scale(.3); opacity: 0.5; border: 1px solid var(--darker); transform-origin: right bottom; }
      50%  { transform: scale(.5); opacity: 0.5; border: 1px solid var(--darker); transform-origin: center center; }
      100% { transform: scale(1); transform-origin: 0 0; opacity: 1; transform-origin: center center; }
    }

    @keyframes activate-previous {
      0%   { transform: scale(.3); opacity: 0.5; border: 1px solid var(--darker); transform-origin: right top; }
      50%  { transform: scale(.5); opacity: 0.5; border: 1px solid var(--darker); transform-origin: center center; }
      100% { transform: scale(1); transform-origin: 0 0; opacity: 1; transform-origin: center center; }
    }

    .previous-button, .next-button {
      border: var(--button-border);
      background: var(--dark);
      position: absolute;
      top: 40%;
      height: var(--button-size);
      width: var(--button-size);
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
      cursor: pointer;
    }

    .previous-button {
      left: 2px;
    }

    .next-button {
      right: -2px;
      transform: scale(-1, 1);
    }

    :host([display="carousel-3d"]) .previous-button, :host([display="carousel-3d"]) .next-button {
      top: 0%;
    }

    :host([display="carousel-3d"]) .previous-button {
      left: unset;
      right: calc(calc(var(--button-size) + var(--space-base) * 3) * -1);
      margin-top: calc(var(--button-size) + var(--space-base) * 2);
      transform: rotate(270deg);
    }

    :host([display="carousel-3d"]) .next-button {
      right: calc(calc(var(--button-size) + var(--space-base) * 3) * -1);
      transform: rotate(90deg);
    }
    `;
  }
}

customElements.define('collection-component', CollectionComponent);
