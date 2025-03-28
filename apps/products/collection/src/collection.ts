"use strict";

interface CollectionItem {
  breakpoints: { sm: string; md: string; };
  flexBasis: { sm: string; md: string; };
}

interface Action {
  label: string;
  shortLabel: string;
  event: any;
  modal?: { type: string; size: string; data: any; };
}

interface Item {
  id: number;
  name: string;
  summary: string;
  desc: string;
  pic: string;
  pic2?: string;
  canvas?: boolean;
  alt?: string;
  alt2?: string;
  colors: string[];
  actions?: Action[];
}

// Create a class for the element
class CollectionComponent extends HTMLElement {
  static observedAttributes = ['display', 'template', 'columns', 'sectionHeader'];

  private _shadow: ShadowRoot;
  private _cssVars: CollectionItem;
  private _div: HTMLDivElement;
  private _items: Item[];
  private _activeId: number;
  private _triggerElement: HTMLElement | undefined;
  private _printView: boolean;
  private _flexBasis: string;
  private _sheet: CSSStyleSheet;
  private _previousButton: HTMLDivElement | null = null;
  private _nextButton: HTMLDivElement | null = null;
  private _currentStep: number = 0;

  public resizeObserver: ResizeObserver;

  //events
  // 1) order-adjusted - returns updated list of items

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
    this._triggerElement = undefined;
    this._printView = false;

    this._flexBasis = this.returnFlexBasis();

    this._sheet = new CSSStyleSheet();
    this._sheet.replaceSync(this.loadStyles());

    // Adopt the sheet into the shadow DOM
    this._shadow.adoptedStyleSheets = [this._sheet];

    this.resizeObserver = new ResizeObserver((entries) => {
      const wrapper = entries[0].contentRect;
      if (wrapper.width <= parseInt(this._cssVars.breakpoints.sm)) {
        this._flexBasis = this._cssVars.flexBasis.sm;
      } else if (wrapper.width <= parseInt(this._cssVars.breakpoints.md) && wrapper.width > parseInt(this._cssVars.breakpoints.sm)) {
        this._flexBasis = this._cssVars.flexBasis.md;
      } else {
        this._flexBasis = this.returnFlexBasis();
      }
      this._sheet.replaceSync(this.loadStyles());
    });
    this.resizeObserver.observe(this._div);

    this._div.addEventListener('scroll', () => {
      this.debounce(this.setActiveItemByScroll(), 100);
    });
  }

  connectedCallback() {
    //console.log('Custom element added to page.');
    //console.log(this.getAttribute('display'));
    //console.log('items', this.items);
    this._div.classList.add(this.getAttribute('display') || 'list');

    this.loadModal();

    if (this.getAttribute('template')) {
      let template = document.getElementById(this.getAttribute('template') || '') as HTMLTemplateElement;
      if (template) {
        let templateContent = template.content;
        this._div.appendChild(templateContent.cloneNode(true));
      }
    }

    this.dataLoaded();
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
    if (this._previousButton) {
      this._previousButton.removeEventListener('click', () => {});
    }
    if (this._nextButton) {
      this._nextButton.removeEventListener('click', () => {});
    }
    this._div.removeEventListener('scroll', () => {});
  }

  adoptedCallback() {
    //console.log('Custom element moved to new page.');
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    //console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);

    if (name === 'columns') {
      this._flexBasis = this.returnFlexBasis();
      this._sheet.replaceSync(this.loadStyles());
    }

    if (this.getAttribute('display') === 'carousel' || this.getAttribute('display') === 'carousel-3d') {
      this.loadNavigation();
      this.displayNavigation(true, false);
    } else {
      if (this._previousButton && this._nextButton) {
        this._shadow.removeChild(this._previousButton);
        this._shadow.removeChild(this._nextButton);
      }
    }
  }

  isDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  debounce(callback: any, delay: number) {
    let timeout: any = null;
    return (...args: any[]) => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  togglePrintView() {
    this._printView = !this._printView;
    if (this._printView) {
      this._div.classList.add('print');
    } else {
      this._div.classList.remove('print');
    }
  }

  getPrintView() {
    return (this._printView);
  }

  navigate(direction: 'next' | 'previous') {
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
        arr.map((item: any) => {
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

  loadModal() {
    // detailModal for the collection
    let detailModal = document.createElement('dialog');
    let detailModalBg = document.createElement('div');
    let detailModalHeader = document.createElement('div');
    let detailModalTitle = document.createElement(`h${Number(this.getAttribute('sectionHeader')) + 1}`);
    let detailModalClose = document.createElement('button');
    let detailModalContent = document.createElement('div');
    detailModal.classList.add('detail-modal');
    detailModal.open = false;
    detailModalHeader.classList.add('detail-modal-header');
    detailModalBg.classList.add('detail-modal-bg');
    detailModalClose.classList.add('close');
    detailModalTitle.innerHTML = 'Breece Hall';
    detailModalClose.innerHTML = '&#x2715;';
    detailModalClose.addEventListener('click', () => {
      this.toggleModal(false);
    });
    detailModalContent.classList.add('detail-modal-content');
    this._shadow.appendChild(detailModalBg);
    this._shadow.appendChild(detailModal);
    detailModal.appendChild(detailModalHeader);
    detailModal.appendChild(detailModalContent);
    detailModalHeader.appendChild(detailModalTitle);
    detailModalHeader.appendChild(detailModalClose);
    detailModalBg.style.display = 'none';
  }

  toggleModal(open: boolean, callback?: any, size?: string, index?: number, triggerElement?: HTMLElement) {
    const dialog = this._shadow.querySelector('dialog');
    const dialogBg = this._shadow.querySelector('.detail-modal-bg') as HTMLElement;
    if (dialog) {
      dialog.classList.remove('small');
      if (size) {
        dialog.classList.add(size);
      }
      dialog.open = open;
    }
    if (open === false) {
      if (this._triggerElement) {
        this._triggerElement.focus();
      }
      if (dialogBg) {
        dialogBg.style.display = 'none';
      }
    } else {
      if (dialogBg) {
        dialogBg.style.display = '';
        this._triggerElement = triggerElement;
        dialogBg.focus();
      }
    }
    if (callback && index) {
      let data = callback();
      this.loadModalContent(data, index);
    }
  }

  loadModalContent(data: any, index: number) {
    let content = this._shadow.querySelector('dialog > div.detail-modal-content');
    if (!content) {
      return;
    }
    console.log(data);
    content.innerHTML = '';
    switch(data.modal.type) {
      case 'tables':
        let title = document.createElement(`h${Number(this.getAttribute('sectionHeader')) + 2}`);
        let table = document.createElement('table');
        title.innerHTML = data.modal.data[0].title;
        content.appendChild(title);
        content.appendChild(table);
        break;
      case 'ranking':
        let form = document.createElement('form');
        let label = document.createElement('label');
        let input = document.createElement('input');
        let button = document.createElement('button');
        form.addEventListener('submit', (formEvent) => {
          formEvent.preventDefault();
        });
        input.id = 'ranking';
        input.value = (index + 1).toString();
        label.innerHTML = 'Current Ranking';
        label.htmlFor = 'ranking';
        button.classList.add('standard-button');
        button.textContent = 'Submit New Ranking';
        button.type = 'button';
        button.onclick = () => {
          // determine if new ranking is 'up' or 'down'
          let currentValue = data.modal.data.ranking;
          let newValue = input.value;
          let direction = undefined;
          if (newValue > currentValue) {
            this.move('down', parseInt(input.value) - 2, data.modal.data.id);
          } else if (newValue < currentValue) {
            direction = 'up';
            this.move('up', parseInt(input.value), data.modal.data.id);
          }
          this.toggleModal(false);
        };
        content.appendChild(form);
        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(button);
        break;
      default:
        // code block
    }
  }

  setSiblingClasses(activeId: number, max: number) {
    this._items.forEach((item, index) => {
      this._div.getElementsByTagName('item')[index].classList.remove('next-in-collection');
      this._div.getElementsByTagName('item')[index].classList.remove('previous-in-collection');
    });
    //console.log(activeId);
    let forward = (activeId < (max - 3)) ? activeId + 3 : max;
    let backward = (activeId >= 3) ? activeId - 3 : 0;
    //console.log('max', max);
    //console.log('forward', forward);
    //console.log('activeId', activeId);
    //console.log('backward', backward);
    //console.log('forward items:');
    // forward
    for (let i=activeId+1; i<forward+1; i++) {
      //console.log(i);
      const items = this._div.getElementsByTagName('item')[i].classList.add('next-in-collection');
    }
    //console.log('backward items:');
    // backward
    for (let i=activeId-1; i>=backward; i--) {
      //console.log(i);
      const items = this._div.getElementsByTagName('item')[i].classList.add('previous-in-collection');
    }
  }

  setActiveItemByScroll() {
    if (this._div) {
      const items = this._div.getElementsByTagName('item');
      const arr = [].slice.call(items);
      arr.map((item: HTMLElement) => {
        return item.classList.remove('active');
      });
      const active = arr.reduce(
        (prev, current) => {
          return (prev as HTMLElement).getBoundingClientRect().x < (current as HTMLElement).getBoundingClientRect().x && (prev as HTMLElement).getBoundingClientRect().x >= 0 ? prev : current
        }
      );
      (active as HTMLElement).classList.add('active');
      this._activeId = parseInt((active as HTMLElement).id.split('_')[1]);
      // this.navigate(); removing - don't know why this was here
    }
  }

  loadNavigation() {
    this._previousButton = document.createElement('div');
    this._previousButton.className = 'previous-button fadeOut';
    this._previousButton.role = 'button';
    this._previousButton.tabIndex = 0;
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
    this._nextButton.tabIndex = 0;
    this._nextButton.innerHTML = '&#9664;';
    this._nextButton.addEventListener('click', () => {
      this.navigate('next');
    });
    this._nextButton.addEventListener('keydown', () => {
      this.navigate('next');
    });
    this._shadow.appendChild(this._nextButton);
  }

  displayNavigation(first: boolean, last: boolean) {
    if (!this._previousButton || !this._nextButton) {
      return;
    }
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
    const cols = parseInt(this.getAttribute('columns') || '1');
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

    const columns = parseInt(this.getAttribute('columns') || '1', 10);
    const width = 100 / columns - (columns - gap);
    return width + '%';
  }

  dataLoaded() {
    if (this._div.getElementsByTagName('item')[this._activeId]) {
      this._div.getElementsByTagName('item')[this._activeId].classList.add('active');
    }
  };

  set items(value) {
    // clear
    this._items.forEach((item: Item, index: number) => {
      this._div.removeChild(this._div.querySelector('#item_' + index) as HTMLElement);
    });

    this._items = value;
    //console.log('data', this._items);

    this._items.forEach((item: Item, index: number) => {
      let itemElement = document.createElement('item');

      // style
      itemElement.style.backgroundColor = item.colors[0];
      itemElement.style.color = item.colors[1];

      itemElement.id = 'item_' + index;
      itemElement.innerHTML = `<div class="header-section" style="border-bottom: 6px solid #${item.colors[2]}">
        <h${this.getAttribute('sectionHeader')}>
        <span class="ranking-header">${index + 1}</span>
        ${item.name}</h${this.getAttribute('sectionHeader')}>
        <div class="header-actions"></div></div>`;
      this._div.appendChild(itemElement);

      // item
      let indexElement = document.createElement('div');
      indexElement.classList.add('item-index');
      indexElement.style.borderTop = '2px solid #' + item.colors[3];

      // ranking number area
      let rankingElement = document.createElement('div');
      rankingElement.innerHTML = (index + 1).toString();
      rankingElement.classList.add('ranking');

      // print name section
      let printNameWrapper = document.createElement('div');
      printNameWrapper.classList.add('print-name');
      printNameWrapper.innerHTML = item.name;

      // summary detail section
      let summaryWrapper = document.createElement('div');
      let summaryElement = document.createElement('div');
      summaryElement.innerHTML = item.summary;

      // imagery area
      let picWrapper = document.createElement('div');
      let picElement = document.createElement('img');
      let picElement2 = document.createElement('img');

      picWrapper.classList.add('pic-wrapper');
      summaryWrapper.classList.add('summary-wrapper');

      let alt = item.alt ? item.alt : item.name;
      picElement.src = item.pic;
      picElement.alt = 'Picture for ' + alt;

      if (item.pic2) {
        let alt2 = item.alt2 ? item.alt2 : item.name;
        picElement2.src = item.pic2;
        picElement2.alt = 'Picture for ' + alt2;
      }

      // description / additional detail area
      let descElement = document.createElement('div');
      descElement.classList.add('ranking-number');
      descElement.innerHTML = item.desc;

      // actions area
      let actions = document.createElement('ul');
      if (item.actions) {
        item.actions.forEach((action: Action, actionIndex: number) => {
          let actionItem = document.createElement('li');
          let actionItemAnchor = document.createElement('a');
          actionItemAnchor.innerHTML = action.label + ' >>';
          actionItemAnchor.href = 'javascript:';
          if (action.modal) {
            actionItemAnchor.addEventListener('click', (clickEvent) => {
              this.toggleModal(true, action.event, action.modal?.size, index, clickEvent.currentTarget as HTMLElement);
            });
          } else {
            actionItemAnchor.onclick = action.event;
          }
          actionItem.appendChild(actionItemAnchor);

          actions.appendChild(actionItem);

          let topAction = document.createElement('a');
          itemElement.querySelector('.header-section .header-actions')?.appendChild(topAction);
          topAction.href = 'javascript:';
          if (action.modal) {
            topAction.addEventListener('click', () => {
              this.toggleModal(true, action.event, action.modal?.size, index);
            });
          } else {
            topAction.onclick = action.event;
          }
          topAction.innerHTML = action.shortLabel;
          if (item.actions && (item.actions.length - 1) !== actionIndex) {
            let separator = document.createElement('span');
            separator.innerHTML = ' | ';
            separator.classList.add('separator');
            const headerActions = itemElement.querySelector('.header-section .header-actions');
            if (headerActions) {
              headerActions.appendChild(separator);
            }
          }
        });
      }

      // canvas area
      let canvasElement = document.createElement('canvas');
      canvasElement.width = 200;
      canvasElement.height = 100;
      canvasElement.ariaLabel = 'Additonal image for ' + item.name;
      canvasElement.role = 'img';

      let ctx = canvasElement.getContext('2d');
      ctx?.moveTo(0, 0);
      ctx?.lineTo(200, 100);
      ctx?.stroke();

      // control area
      let controlElement = document.createElement('div');
      let rankUpElement = document.createElement('button');
      let rankDownElement = document.createElement('button');
      let upArrow = document.createElement('div');
      let downArrow = document.createElement('div');
      upArrow.classList.add('arrow');
      downArrow.classList.add('arrow');
      controlElement.classList.add('control-area');
      rankUpElement.ariaLabel = 'Move Up';
      rankDownElement.ariaLabel = 'Move Down';
      rankUpElement.addEventListener('click', () => {
        this.move('up', index, item.id);
      });
      rankDownElement.addEventListener('click', () => {
        this.move('down', index, item.id);
      });
      if (index === 0) {
        rankUpElement.style.visibility = 'hidden';
      }
      if (index === (this._items.length - 1)) {
        rankDownElement.style.visibility = 'hidden';
      }

      // attach elements
      itemElement.appendChild(indexElement);
      indexElement.appendChild(rankingElement);
      indexElement.appendChild(printNameWrapper);
      indexElement.appendChild(picWrapper);
      indexElement.appendChild(summaryWrapper);
      summaryWrapper.appendChild(summaryElement);
      summaryWrapper.appendChild(descElement);
      picWrapper.appendChild(picElement);
      if (item.pic2) {
        picWrapper.appendChild(picElement2);
      }
      if (item.canvas) {
        picWrapper.appendChild(canvasElement);
      }
      indexElement.appendChild(actions);
      indexElement.appendChild(controlElement);
      controlElement.appendChild(rankUpElement);
      controlElement.appendChild(rankDownElement);
      rankUpElement.appendChild(upArrow);
      rankDownElement.appendChild(downArrow);
    });

    this.dataLoaded();
  }

  get items() {
    return this._items;
  }

  move(direction: 'up' | 'down', activeIndex: number, activeId: number) {
    let order = this._items.filter((item) => {
      return item.id !== activeId;
    });
    let newIndex = activeIndex;
    let activeObj = this._items.find((item) => {
      return item.id === activeId;
    });
    if (direction === 'down') {
      newIndex++;
    } else {
      newIndex--;
    }

    if (newIndex < 0) {
      newIndex = 0;
    }
    if (newIndex > this._items.length - 1) {
      newIndex = this._items.length - 1;
    }

    if (!activeObj) {
      return;
    }
    order.splice(newIndex, 0, activeObj);
    this.items = order;
    let eventOrderAdjusted = new CustomEvent('order-adjusted', {
      detail: {
        message: 'Order has been adjusted.',
        order: order,
        itemIds: order.map((item) => {
          return item.id;
        }),
        direction
      }
    });
    this.dispatchEvent(eventOrderAdjusted);

    let buttonPosition = direction === 'up' ? 1 : 2;
    if (newIndex === 0) {
      buttonPosition = 2;
    }
    if (newIndex === this._items.length - 1) {
      buttonPosition = 1;
    }
    const button = this._shadow.querySelector('#item_' + newIndex + ' .control-area button:nth-of-type(' + buttonPosition + ')') as HTMLElement;
    if (button) {
      button.focus();
    }
    const newItem = this._shadow.querySelector('#item_' + newIndex);
    if (newItem) {
      newItem.classList.add('item-moved');
    }
  }

  loadStyles() {
    return `
    :host {
      --border-color: #ddd;
      --border-moved-color: #39ff14;
      --shadow-color: #bbb;
      --black: #000;
      --white: #fff;
      --grey: #bbb;
      --light-grey: #ddd;
      --dark: #555;
      --darker: #333;
      --light: #ccc;
      --highlight: #1434a4;
      --link-hover: #4169e1;
      --link: #7DF9FF;
      --border: 1px solid var(--border-color);
      --border-moved: 5px solid var(--border-moved-color);
      --button-border: 2px solid var(--black);
      --border-radius-base: 5px;
      --border-radius-small: 3px;
      --border-radius-large: 7px;
      --border-radius-xlarge: 9px;
      --border-radius-zoom: 30px;
      --shadow-base: 5px 5px 5px var(--shadow-color);
      --shadow-sm: 2px 2px 2px var(--shadow-color);
      --space-base: 4px;
      --space-sm: 2px;
      --space-md: calc(var(--space-base) * 2);
      --space-lg: calc(var(--space-base) * 4);
      --space-xl: calc(var(--space-base) * 6);
      --font-size-base: 14px;
      --font-size-large: 18px;
      --font-size-xlarge: 22px;
      --font-size-xxlarge: 26px;
      --font-size-3xlarge: 30px;
      --font-size-4xlarge: 34px;
      --font-size-5xlarge: 38px;
      --font-size-6xlarge: 42px;
      --font-size-super: 64px;
      --font-weight-bold: bold;
      --button-size: 40px;
      --opacity-less: 0.75;
      --opacity-base: 0.5;

      position: relative;
    }

    a {
      color: var(--link);
      line-height: 24px;

      &:hover {
        color: var(--link-hover);
      }
    }

    ul {
      list-style-type: square;
      padding-left: var(--space-xl);
    }

    .standard-button {
      margin-top: var(--space-md);
      padding: var(--space-md);
      font-size: var(--font-size-lg);
      background: var(--black);
      color: var(--white);
      border-radius: var(--border-radius-base);
      cursor: pointer;
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

    @keyframes activate-moved {
      0%   { border: 1px solid var(--border-moved-color); }
      50%  { border: 4px solid var(--border-moved-color); }
      100% { border: 1px solid var(--border-moved-color); }
    }

    div.wrapper.list item {
      border: var(--border);
      margin-bottom: var(--space-base);
      // box-shadow: var(--shadow-sm);
      border-radius: var(--border-radius-base);

      &.item-moved {
        animation: activate-moved 1.5s 5;
      }
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
      padding-bottom: 0;

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

    span.ranking-header {
      display: none;
    }

    .header-section {
      display: flex;
      justify-content: space-between;

      a, span.separator {
        display: none;
      }
    }

    div.item-index {
      display: flex;

      > div, ul {
        flex-grow: 1;
      }

      div.ranking {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: var(--space-md);
        font-size: var(--font-size-super);
        font-weight: var(--font-weight-bold);
        width: 3rem;
      }

      div.print-name {
        display: none;
      }

      div.pic-wrapper {
        img:first-of-type {
          height: 80px;
          margin-top: var(--space-sm);
        }

        img:nth-of-type(2) {
          height: 40px;
          position: relative;
          bottom: -10px;
          left: -40px;
        }
      }

      ul {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      div.summary-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;
        padding-left: var(--space-lg);
        width: 180px;

        div:first-of-type {
          font-style: italic;
        }

        div:nth-of-type(2) {
          div:first-of-type {
            font-style: normal;
            font-weight: var(--font-weight-bold);
          }

          div:nth-of-type(2) {
            background: var(--highlight);
            width: 40px;
            text-align: center;
            border-radius: var(--border-radius-base);
            margin-top: var(--space-sm);
            padding: var(--space-sm);
          }
        }
      }

      div.control-area {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        .arrow {
          border: solid var(--black);
          border-width: 0 3px 3px 0;
          display: inline-block;
          padding: 3px;
        }

        button {
          border-radius: var(--border-radius-xlarge);
          height: 40px;
          width: 40px;
          cursor: pointer;
          border: 2px solid var(--dark);
          background: var(--white);
        }

        button:nth-of-type(1) {
          margin-bottom: var(--space-sm);

          .arrow {
            transform: rotate(-135deg);
            -webkit-transform: rotate(-135deg);
          }
        }

        button:nth-of-type(2) {
          .arrow {
            transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
          }
        }
      }
    }

    .detail-modal {
      top: 0;
      left: 0;
      position: fixed;
      width: 90%;
      max-width: 900px;
      height: 97vh;
      margin: 1vh auto 1vh;
      padding: 0;
      background: var(--light-grey);

      &.small {
        width: 450px;
      }

      .detail-modal-header {
        border-bottom: 3px solid var(--dark);
        background: var(--black);
        display: flex;
        justify-content: space-between;
        color: var(--white);
        font-size: var(--font-size-large);
        padding: 0 var(--space-lg);
        height: 3rem;
        line-height: 3rem;

        h1, h2, h3, h4, h5, h6 {
          margin: 0;
        }

        button.close {
          font-size: var(--font-size-xxlarge);
          cursor: pointer;
          background: none;
          border: 0;
          color: var(--white);
        }
      }

      .detail-modal-content {
        padding: var(--space-md);

        h1, h2, h3, h4, h5, h6 {
          margin: var(--space-md) 0 0;
        }

        form {
          padding: calc(var(--space-xl) * 2) var(--space-xl) 0;
          display: flex;
          flex-direction: column;

          label {
            margin-bottom: var(--space-base);
            font-size: var(--font-size-xlarge);
          }

          input {
            font-size: var(--font-size-6xlarge);
            padding: var(--space-md);
          }
        }
      }
    }

    .detail-modal-bg {
      top: 0;
      left: 0;
      position: fixed;
      width: 100vw;
      height: 100vh;
      background-color: var(--black);
      opacity: var(--opacity-less);
    }

    div.wrapper.list.print item {
      background-color: var(--white) !important;
      color: var(--black) !important;
      padding-top: 0;

      .header-section {
        display: none;
      }

      .item-index {
        border-top: 0 !important;
        display: flex;
        flex: 0 1 150px;
        padding: var(--space-base) 0;
      }

      .ranking {
        font-size: var(--font-size-xlarge) !important;
        flex-grow: 0;
      }

      .pic-wrapper, .control-area, ul {
        display: none;
      }

      .summary-wrapper {
        text-align: right;
        padding-right: var(--space-xl);
      }

      .ranking-number {
        div:nth-of-type(2) {
          display: none;
        }
      }

      .print-name {
        display: flex;
        align-items: center;
        flex-grow: 0;
      }
    }

    @media screen and (max-width: 800px) {
      span.ranking-header {
        display: inline-block;
      }

      .header-section {
        font-size: var(--font-size-base);

        h* {
          font-size: 5px;
        }

        a {
          display: inline-block;
        }

        span.separator {
          display: inline;
        }
      }

      div.item-index {
        padding-bottom: var(--space-base);

        div.ranking {
          display: none;
        }

        div.pic-wrapper {
          flex-grow: 0;
        }

        > ul {
          display: none;
        }

        div.control-area {
          margin-top: var(--space-base);
        }
      }

      .detail-modal {
        width: 100%;
        max-width: 100%;
    }

    @media screen and (max-width: 400px) {
      div.item-index {
        div.pic-wrapper {
          img:nth-of-type(2) {
            margin-right: -35px;
          }
        }

        div.summary-wrapper {
          font-size: var(--font-size-base);
          padding-left: 0;
        }
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
      padding-right: var(--space-sm);
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
