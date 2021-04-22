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
        position: absolute;
        width: max-content;
        background-color: #333;
        color: #fff;
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s linear 0.1s, opacity 0.1s;
      }
    `);

    sheet.insertRule(`
      span.visible {
        visibility: visible;
        opacity: 1;
        transition: visibility 0s linear 0s, opacity 0.1s;
      }
    `);

    if (this.#placement == "bottom") {
      sheet.insertRule(`span {
        top: 100%;
        left: -${(tooltip.offsetWidth - this.offsetWidth) / 2}px;
      }`);
    }

    if (this.#placement == "top") {
      sheet.insertRule(`span {
        bottom: 100%;
        left: -${(tooltip.offsetWidth - this.offsetWidth) / 2}px;
      }`);
    }

    if (this.#placement == "right") {
      sheet.insertRule(`span {
        left: 100%;
        top: -${(tooltip.offsetHeight - this.offsetHeight) / 2}px;
      }`);
    }

    if (this.#placement == "left") {
      sheet.insertRule(`span {
        right: 100%;
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
