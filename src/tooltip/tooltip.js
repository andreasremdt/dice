class Tooltip extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });
  #placement = this.getAttribute("placement") || "bottom";

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue != newValue) {
      this.#render();
    }
  }

  #handleMouseOver = () => {
    this.#root.querySelector("span").classList.add("visible");
  };

  #handleMouseOut = () => {
    this.#root.querySelector("span").classList.remove("visible");
  };

  #render() {
    this.#root.innerHTML = "";

    var span = document.createElement("span");
    var slot = document.createElement("slot");

    span.textContent = this.getAttribute("content");
    span.setAttribute("part", "tooltip");

    slot.onmouseover = this.#handleMouseOver;
    slot.onmouseout = this.#handleMouseOut;

    this.#root.append(slot, span);
    this.#root.adoptedStyleSheets = [this.#styles];
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
    return ["content", "placement"];
  }
}

window.customElements.define("dice-tooltip", Tooltip);
