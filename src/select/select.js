class Select extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });
  #internals = this.attachInternals();
  #value = "";
  #open = false;
  #focused = 0;
  #autofocus = this.hasAttribute("autofocus");

  connectedCallback() {
    this.#render();
    this.#internals.setFormValue(this.#value);

    document.addEventListener("keyup", this.#handleKeyDown);

    var selected = this.#focusable.findIndex((child) => child.hasAttribute("selected"));

    this.#focused = selected == -1 ? 0 : selected;
    this.select(this.#focusable[this.#focused].getAttribute("value"));
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

    this.#focusable[this.#focused].focus();

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
        if (evt.key == "ArrowDown" && this.#focused != this.#focusable.length - 1) {
          this.#focused++;
        } else if (evt.key == "ArrowUp" && this.#focused > 0) {
          this.#focused--;
        } else if (evt.key == "ArrowRight" && !this.#open && this.#focused != this.#focusable.length - 1) {
          this.#focused++;
        } else if (evt.key == "ArrowLeft" && !this.#open && this.#focused > 0) {
          this.#focused--;
        } else if (evt.key == "End") {
          this.#focused = this.#focusable.length - 1;
        } else if (evt.key == "Home") {
          this.#focused = 0;
        }

        this.#focusable[this.#focused].focus();
        this.select(this.#focusable[this.#focused].getAttribute("value"));
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

    if (this.#autofocus) {
      input.setAttribute("autofocus", "true");
    }

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
        cursor: default;
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

  get #focusable() {
    return Array.from(this.children).filter((child) => !child.hasAttribute("disabled"));
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.select(value);
  }

  get autofocus() {
    return this.#autofocus;
  }

  set autofocus(value) {
    this.#autofocus = value;

    if (value) {
      this.#root.querySelector("input").focus();
    }
  }

  static formAssociated() {
    return true;
  }
}

class Option extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });
  #disabled = this.hasAttribute("disabled");
  #selected = this.hasAttribute("selected");
  #value = this.getAttribute("value");
  #label = this.getAttribute("label") || this.textContent;

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log(name, oldValue, newValue);
    // if (name == "value" && oldValue && oldValue != newValue) {
    //   this.#value = newValue;
    // } else if (name == "selected" && oldValue && oldValue != newValue) {
    //   this.selected = newValue == "true" ? true : false;
    // } else if (name == "disabled" && oldValue && oldValue != newValue) {
    //   this.disabled = newValue == "true" ? true : false;
    // } else if (name == "label" && oldValue != newValue) {
    //   this.label = newValue;
    // }
  }

  focus() {
    this.#root.querySelector("button").focus();
  }

  #handleSelect = (hide = true) => {
    this.parentNode.select(this.#value);

    if (hide) {
      this.parentNode.hide();
    }
  };

  #render() {
    var button = document.createElement("button");

    button.textContent = this.#label;
    button.setAttribute("role", "option");
    button.setAttribute("part", "option");
    button.onmouseup = this.#handleSelect;

    if (this.#disabled) {
      button.setAttribute("disabled", true);
    }

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
      button:disabled {
        color: rgba(0, 0, 0, .6);
      }
    `);
    sheet.insertRule(`
      button:not([disabled]):hover,
      button:not([disabled]):focus {
        background-color: #ddd;
      }
    `);

    return sheet;
  }

  get selected() {
    return this.#selected;
  }

  set selected(value) {
    this.#selected = value;

    this.#handleSelect(false);
  }

  get disabled() {
    return this.#disabled;
  }

  set disabled(value) {
    this.#disabled = value;

    if (value) {
      this.#root.querySelector("button").setAttribute("disabled", "true");
    } else {
      this.#root.querySelector("button").removeAttribute("disabled");
    }

    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get label() {
    return this.#label;
  }

  set label(value) {
    this.#label = value;

    this.#root.querySelector("button").textContent = value;
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
  }

  static get observedAttributes() {
    return ["selected", "value", "label", "disabled"];
  }
}

window.customElements.define("dice-select", Select);
window.customElements.define("dice-option", Option);
