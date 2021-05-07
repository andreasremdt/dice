class Select extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });
  #internals = this.attachInternals();
  #value = "";
  #open = false;
  #focused = 0;

  connectedCallback() {
    this.#render();
    this.#internals.setFormValue(this.#value);

    document.addEventListener("keyup", this.#handleKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener("keyup", this.#handleKeyDown);
  }

  attributeChangedCallack(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
  }

  select(value) {
    this.#value = value;
    this.#internals.setFormValue(this.#value);

    this.#root.querySelector("input").value = this.#value;
  }

  show = () => {
    this.#root.querySelector("div").removeAttribute("hidden");
    this.#open = true;

    this.children[this.#focused].focus();

    document.addEventListener("click", this.#handleOuterClick);
  };

  hide = () => {
    this.#root.querySelector("div").setAttribute("hidden", "true");
    this.#root.querySelector("input").focus();
    this.#open = false;

    document.removeEventListener("click", this.#handleOuterClick);
  };

  #handleOuterClick = ({ target }) => {
    if (!target.closest("dice-select")) {
      this.hide();
    }
  };

  #handleKeyDown = (evt) => {
    if (["Enter", "Escape", "Tab"].includes(evt.key)) {
      if (evt.key == "Escape" && this.#open) {
        this.hide();
      }

      if (evt.key == "Enter") {
        if (document.activeElement.isSameNode(this) && !this.#open) {
          this.show();
        } else if (this.#open) {
          this.hide();
        }
      }

      if (evt.key == "Tab" && this.#open) {
        this.hide();
      }
    }

    if (document.activeElement.isSameNode(this) || document.activeElement.parentElement.isSameNode(this)) {
      if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(evt.key)) {
        if (evt.key == "ArrowDown" && this.#focused != this.children.length - 1) {
          this.#focused++;
        } else if (evt.key == "ArrowUp" && this.#focused > 0) {
          this.#focused--;
        } else if (evt.key == "ArrowRight" && !this.#open && this.#focused != this.children.length - 1) {
          this.#focused++;
        } else if (evt.key == "ArrowLeft" && !this.#open && this.#focused > 0) {
          this.#focused--;
        } else if (evt.key == "End") {
          this.#focused = this.children.length - 1;
        } else if (evt.key == "Home") {
          this.#focused = 0;
        }

        this.children[this.#focused].focus();
        this.select(this.children[this.#focused].getAttribute("value"));
      }
    }
  };

  #handleClick = () => {
    if (this.#open) {
      this.hide();
    } else {
      this.show();
    }
  };

  #render() {
    var input = document.createElement("input");
    var dropdown = document.createElement("div");
    var slot = document.createElement("slot");

    input.setAttribute("part", "input");
    input.setAttribute("readonly", "true");
    input.onclick = this.#handleClick;

    dropdown.setAttribute("part", "dropdown");
    dropdown.setAttribute("hidden", "true");
    dropdown.append(slot);

    this.#root.append(input, dropdown);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get #styles() {
    var sheet = new CSSStyleSheet();

    sheet.insertRule(`
      :host {
        position: relative;
        display: inline-block;
      }
    `);
    sheet.insertRule(`
      :host::after {
        content: "▾";
        position: absolute;
        top: 0;
        right: 7px;
      }
    `);
    sheet.insertRule(`
      input {
        width: 100%;
        box-sizing: border-box;
      }
    `);
    sheet.insertRule(`
      div {
        position: absolute;
        background-color: white;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid;
        left: 0;
        top: 100%;
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
