class Tooltip extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });
  #placement = this.getAttribute("placement") || "bottom";
  #open = this.hasAttribute("open");
  #template = this.getAttribute("template");
  #content = this.getAttribute("content");

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "open" && newValue) {
      if (newValue == "true") {
        this.show();
      } else {
        this.hide();
      }
    } else if (name == "placement" && oldValue && oldValue != newValue) {
      this.#placement = newValue;
      this.#root.adoptedStyleSheets = [this.#styles];
    } else if (name == "content" && newValue) {
      this.#content = newValue;
      this.#render();
    } else if (name == "template" && newValue) {
      this.#template = newValue;
      this.#render();
    }
  }

  show = () => {
    this.#open = true;
    this.#root.querySelector("span").classList.add("visible");

    document.addEventListener("keydown", this.#handleKeyDown);
  };

  hide = () => {
    this.#open = false;
    this.#root.querySelector("span").classList.remove("visible");

    document.removeEventListener("keydown", this.#handleKeyDown);
  };

  #handleKeyDown = (evt) => {
    if (evt.key == "Escape") {
      this.hide();
    }
  };

  #render() {
    var id = `tooltip-${this.#uid}`;
    var span = document.createElement("span");
    var slot = document.createElement("slot");

    if (!this.#content && this.#template) {
      span.append(document.getElementById(this.#template).content.cloneNode(true));
    } else if (this.#content) {
      span.innerHTML = this.#content;
    }

    span.setAttribute("part", "tooltip");
    span.setAttribute("id", id);
    span.setAttribute("role", "tooltip");

    if (this.#open) {
      span.classList.add("visible");
    }

    slot.onmouseover = this.show;
    slot.onmouseleave = this.hide;

    this.firstElementChild.onfocus = this.show;
    this.firstElementChild.onblur = this.hide;
    this.firstElementChild.setAttribute("aria-describedby", id);

    this.#root.innerHTML = "";
    this.#root.append(slot, span);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get open() {
    return this.#open;
  }

  set open(value) {
    if (value) {
      this.show();
    } else {
      this.hide();
    }
  }

  get placement() {
    return this.#open;
  }

  set placement(value) {
    this.#placement = value;
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get content() {
    return this.#content;
  }

  set content(value) {
    this.#content = value;
    this.#render();
  }

  get template() {
    return this.#template;
  }

  set template(value) {
    this.#template = value;
    this.#render();
  }

  get #uid() {
    var first = Math.floor(Math.random() * 46656);
    var second = Math.floor(Math.random() * 46656);

    return first.toString(36) + second.toString(36);
  }

  get #styles() {
    var sheet = new CSSStyleSheet();
    var tooltip = this.#root.querySelector("span");

    sheet.insertRule(`
      :host {
        display: inline-block;
        position: relative;
      }
    `);

    sheet.insertRule(`
      span {
        --spacing: 5px;
        --background-color: #333;
        --color: white;
        --transition-duration: 0.2s;
        --transition-animation: linear;
        position: absolute;
        width: max-content;
        background-color: var(--background-color);
        color: var(--color);
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s var(--transition-animation) var(--transition-duration), opacity var(--transition-duration);
      }
    `);

    sheet.insertRule(`
      span.visible {
        visibility: visible;
        opacity: 1;
        transition: visibility 0s var(--transition-animation) 0s, opacity var(--transition-duration);
      }
    `);

    if (this.#placement == "bottom" || this.#placement == "top") {
      sheet.insertRule(`span {
        ${this.#placement == "bottom" ? "top" : "bottom"}: calc(100% + var(--spacing));
        left: ${(this.offsetWidth - tooltip.offsetWidth) / 2}px;
      }`);
    }

    if (this.#placement == "left" || this.#placement == "right") {
      sheet.insertRule(`span {
        ${this.#placement == "right" ? "left" : "right"}: calc(100% + var(--spacing));
        top: -${(tooltip.offsetHeight - this.offsetHeight) / 2}px;
      }`);
    }

    return sheet;
  }

  static get observedAttributes() {
    return ["content", "placement", "open", "template"];
  }
}

window.customElements.define("dice-tooltip", Tooltip);
