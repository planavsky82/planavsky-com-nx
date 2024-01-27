// Create a class for the element
class CollectionComponent extends HTMLElement {
  static observedAttributes = ["color", "size", "display"];

  constructor() {
    // Always call super first in constructor
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    shadow.appendChild(style);

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      div {
        border: 1px solid red;
        height: 400px;
      }`
    );

    const div = document.createElement("div");
    shadow.appendChild(div);

    // Adopt the sheet into the shadow DOM
    shadow.adoptedStyleSheets = [sheet];

    this._items = [];

    let template = document.getElementById("collection-component-items");
    console.log(template);
    let templateContent = template.content;
    div.appendChild(templateContent.cloneNode(true));
  }

  connectedCallback() {
    console.log("Custom element added to page.");
    console.log(this.getAttribute("display"));
    console.log(this.items);
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);
  }

  set items(value) {
    this._items = value;
    console.log('data', this._items);
  }

  get items() {
    return this._items;
  }
}

customElements.define("collection-component", CollectionComponent);
