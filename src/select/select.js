class Select extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });
  #internals = this.attachInternals();
  #value = "";
  #open = false;
  #focused = 0;

  connectedCallback() {
    this.#render();
    this.#internals.setFormValue(this.#value);
  }

  select(value) {
    this.#value = value;
    this.#internals.setFormValue(this.#value);

    this.#root.querySelector("input").value = this.#value;

    if (this.#open) {
      this.#handleClose();
    }
  }

  #handleOpen = () => {
    this.#root.querySelector("div").removeAttribute("hidden");
    this.#open = true;
    this.children[this.#focused].focus();

    document.addEventListener("keydown", this.#handleKeyDown);
  };

  #handleClose = () => {
    this.#root.querySelector("div").setAttribute("hidden", "true");
    this.#root.querySelector("input").focus();
    this.#open = false;

    document.removeEventListener("keydown", this.#handleKeyDown);
  };

  #handleInputKeyDown = (evt) => {
    if (evt.key == "Enter" && !this.#open) {
      this.#handleOpen();
    }

    if (evt.key == "ArrowDown") {
      if (this.#focused != this.children.length - 1) {
        this.select(this.children[++this.#focused].getAttribute("value"));
      }
    }

    if (evt.key == "ArrowUp") {
      if (this.#focused > 0) {
        this.select(this.children[--this.#focused].getAttribute("value"));
      }
    }
  };

  #handleKeyDown = (evt) => {
    if (evt.key == "Escape" && this.#open) {
      this.#handleClose();
    }

    if (evt.key == "ArrowDown") {
      if (this.#focused != this.children.length - 1) {
        this.children[++this.#focused].focus();
      }
    }

    if (evt.key == "ArrowUp") {
      if (this.#focused > 0) {
        this.children[--this.#focused].focus();
      }
    }
  };

  #render() {
    var input = document.createElement("input");
    var dropdown = document.createElement("div");
    var slot = document.createElement("slot");

    input.setAttribute("part", "input");
    input.setAttribute("readonly", "true");
    input.onclick = this.#handleOpen;
    input.onkeydown = this.#handleInputKeyDown;

    dropdown.setAttribute("part", "dropdown");
    dropdown.setAttribute("hidden", "true");
    dropdown.append(slot);

    this.#root.append(input, dropdown);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get #styles() {
    var sheet = new CSSStyleSheet();
    var input = this.#root.querySelector("input");

    sheet.insertRule(`
      :host {
        position: relative;
        display: inline-block;
      }
    `);
    sheet.insertRule(`
      div {
        position: absolute;
        background-color: white;
        min-width: ${input.offsetWidth}px;
        border: 1px solid;
        left: 0;
        top: ${input.offsetHeight}px;
      }
    `);

    return sheet;
  }

  get value() {
    return this.#value;
  }

  static formAssociated() {
    return true;
  }
}

class Option extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });

  connectedCallback() {
    this.#render();

    if (this.hasAttribute("selected")) {
      this.#handleSelect();
    }
  }

  focus() {
    this.#root.querySelector("button").focus();
  }

  #handleSelect = () => {
    this.parentNode.select(this.getAttribute("value"));
  };

  #render() {
    var button = document.createElement("button");

    button.innerHTML = this.innerHTML;
    button.setAttribute("part", "listitem");
    button.setAttribute("data-value", this.getAttribute("value"));
    button.onclick = this.#handleSelect;

    this.#root.append(button);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get #styles() {
    var sheet = new CSSStyleSheet();

    sheet.insertRule(`
      :host {
        display: block;
      }
    `);
    sheet.insertRule(`
      button {
        all: inherit;
        width: 100%;
      }
    `);
    sheet.insertRule(`
      button:hover,
      button:focus {
        background-color: #ddd;
      }
    `);

    return sheet;
  }
}

window.customElements.define("dice-select", Select);
window.customElements.define("dice-option", Option);
