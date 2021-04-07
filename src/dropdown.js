class Dropdown extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });
  #open = typeof this.getAttribute("open") == "string";
  #align = this.getAttribute("align") || "left";
  #justify = this.getAttribute("justify") || "bottom";
  #spacing = Number(this.getAttribute("spacing")) || 0;

  connectedCallback() {
    this.#render();

    document.addEventListener("keydown", this.#handleKeyDown);
    document.addEventListener("click", this.#handleOuterClick);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.#handleKeyDown);
    document.removeEventListener("click", this.#handleOuterClick);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue != newValue) {
      this.#render();
    }
  }

  #handleKeyDown = (evt) => {
    if (evt.key == "Escape" && this.open) {
      this.#open = false;
      this.#root.querySelector("details").open = false;
    }
  };

  #handleOuterClick = ({ target }) => {
    if (this.open && !target.closest("dice-dropdown")) {
      this.#open = false;
      this.#root.querySelector("details").open = false;
    }
  };

  #handleClick = (evt) => {
    evt.preventDefault();

    this.#open = !this.#open;
    this.#root.querySelector("details").open = this.#open;
  };

  #handleToggle = () => {
    this.#open = this.#root.querySelector("details").open;
  };

  #render() {
    var details = document.createElement("details");
    var summary = document.createElement("summary");
    var summarySlot = document.createElement("slot");
    var defaultSlot = document.createElement("slot");
    var div = document.createElement("div");

    summarySlot.setAttribute("name", "trigger");
    summarySlot.onclick = this.#handleClick;

    div.setAttribute("part", "menu");
    div.setAttribute("role", "menu");
    div.append(defaultSlot);

    summary.setAttribute("part", "summary");
    summary.setAttribute("aria-haspopup", "menu");
    summary.setAttribute("role", "button");
    summary.append(summarySlot);

    details.setAttribute("part", "details");
    details.open = this.open;
    details.ontoggle = this.#handleToggle;
    details.append(summary, div);

    this.#root.append(details);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get open() {
    return this.#open;
  }

  get #styles() {
    var sheet = new CSSStyleSheet();
    var summary = this.#root.querySelector("summary");

    sheet.insertRule(`
      :host {
        position: relative;
        display: inline-block;
      }
    `);
    sheet.insertRule("summary { list-style-type: none }");
    sheet.insertRule(`
      div {
        position: absolute;
        background-color: white;
        width: max-content;
        border: 1px solid;
      }
    `);

    if (this.#align == "left") {
      sheet.insertRule("div { left: 0; }");
    }

    if (this.#align == "right") {
      sheet.insertRule("div { right: 0; }");
    }

    if (this.#align == "center") {
      sheet.insertRule(
        `div { left: -${(summary.nextElementSibling.offsetWidth - summary.offsetWidth) / 2}px; }`
      );
    }

    if (this.#justify == "bottom") {
      sheet.insertRule(`div { top: ${summary.offsetHeight + this.#spacing}px; }`);
    }

    if (this.#justify == "top") {
      sheet.insertRule(`div { bottom: ${summary.offsetHeight + this.#spacing}px; }`);
    }

    return sheet;
  }

  static get observedAttributes() {
    return ["open", "align", "justify", "spacing"];
  }
}

window.customElements.define("dice-dropdown", Dropdown);
