class Option extends HTMLElement {
  #root = this.attachShadow({ mode: 'open' });

  #disabled = this.hasAttribute('disabled');

  #selected = this.hasAttribute('selected');

  #value = this.getAttribute('value');

  #label = this.getAttribute('label') || this.textContent;

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    // console.log(name, oldValue, newValue);
    // if (name === "value" && oldValue && oldValue != newValue) {
    //   this.#value = newValue;
    // } else if (name === "selected" && oldValue && oldValue != newValue) {
    //   this.selected = newValue === "true" ? true : false;
    // } else if (name === "disabled" && oldValue && oldValue != newValue) {
    //   this.disabled = newValue === "true" ? true : false;
    // } else if (name === "label" && oldValue != newValue) {
    //   this.label = newValue;
    // }
  }

  focus() {
    this.#root.querySelector('button').focus();
  }

  #handleSelect = (hide = true) => {
    this.parentNode.select(this.#value);

    if (hide) {
      this.parentNode.hide();
    }
  };

  #render() {
    const button = document.createElement('button');

    button.textContent = this.#label;
    button.setAttribute('role', 'option');
    button.setAttribute('part', 'option');
    button.onmouseup = this.#handleSelect;

    if (this.#disabled) {
      button.setAttribute('disabled', true);
    }

    this.#root.append(button);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get #styles() {
    const sheet = new CSSStyleSheet();

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
      this.#root.querySelector('button').setAttribute('disabled', 'true');
    } else {
      this.#root.querySelector('button').removeAttribute('disabled');
    }

    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get label() {
    return this.#label;
  }

  set label(value) {
    this.#label = value;

    this.#root.querySelector('button').textContent = value;
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
  }

  static get observedAttributes() {
    return ['selected', 'value', 'label', 'disabled'];
  }
}

window.customElements.define('dice-option', Option);
