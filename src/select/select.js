import './option.js';

class Select extends HTMLElement {
  #root = this.attachShadow({ mode: 'open' });

  #internals = this.attachInternals();

  #value = '';

  #open = false;

  #focused = 0;

  #autofocus = this.hasAttribute('autofocus');

  #searchable = this.hasAttribute('searchable');

  #disabled = this.hasAttribute('disabled');

  #required = this.hasAttribute('required');

  #searching = false;

  connectedCallback() {
    this.#render();
    this.#internals.setFormValue(this.#value);

    document.addEventListener('keyup', this.#handleKeyDown);

    const selected = this.#focusable.findIndex((child) => child.hasAttribute('selected'));

    this.#focused = selected === -1 ? 0 : selected;
    this.select(this.#focusable[this.#focused].getAttribute('value'));
  }

  disconnectedCallback() {
    document.removeEventListener('keyup', this.#handleKeyDown);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value' && oldValue !== newValue) {
      this.#value = newValue;
    } else if (name === 'required' && oldValue !== newValue) {
      this.required = newValue === 'true';
    } else if (name === 'disabled' && oldValue !== newValue) {
      this.disabled = newValue === 'true';
    } else if (name === 'searchable' && oldValue !== newValue) {
      this.searchable = newValue === 'true';
    }
  }

  select(value) {
    this.#value = value;
    this.#internals.setFormValue(this.#value);

    this.#root.querySelector('input').value = this.#value;
    this.#handleValidation();
  }

  show = () => {
    this.#root.querySelector('div').removeAttribute('hidden');
    this.#open = true;

    this.#focusable[this.#focused].focus();

    document.addEventListener('click', this.#handleOuterClick);
  };

  hide = () => {
    this.#root.querySelector('div').setAttribute('hidden', 'true');
    this.#root.querySelector('input').focus();
    this.#open = false;

    if (this.#searchable) {
      this.#root.querySelector('input[type="search"]').value = '';

      for (const child of this.#children) {
        child.removeAttribute('hidden');
      }
    }

    document.removeEventListener('click', this.#handleOuterClick);
  };

  #handleValidation() {
    if (this.#value === '' && this.#required) {
      this.#internals.setValidity(
        {
          valueMissing: true,
        },
        'Please select an item in the list',
        this.#root.querySelector('input'),
      );
    } else {
      this.#internals.setValidity({});
    }
  }

  #handleOuterClick = ({ target }) => {
    if (!target.closest('dice-select')) {
      this.hide();
    }
  };

  #handleKeyDown = (evt) => {
    if (['Enter', 'Escape', 'Tab'].includes(evt.key)) {
      if (evt.key === 'Escape' && this.#open && !this.#searching) {
        this.hide();
      }

      if (evt.key === 'Enter') {
        if (document.activeElement.isSameNode(this) && !this.#open) {
          this.show();
        } else if (this.#open) {
          this.hide();
        }
      }

      if (evt.key === 'Tab' && this.#open) {
        this.hide();
      }
    }

    if (document.activeElement.isSameNode(this) || document.activeElement.parentElement.isSameNode(this)) {
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evt.key)) {
        this.#searching = false;

        if (evt.key === 'ArrowDown' && this.#focused !== this.#focusable.length - 1) {
          this.#focused += 1;
        } else if (evt.key === 'ArrowUp' && this.#focused > 0) {
          this.#focused -= 1;
        } else if (evt.key === 'ArrowRight' && !this.#open && this.#focused !== this.#focusable.length - 1) {
          this.#focused += 1;
        } else if (evt.key === 'ArrowLeft' && !this.#open && this.#focused > 0) {
          this.#focused -= 1;
        } else if (evt.key === 'End') {
          this.#focused = this.#focusable.length - 1;
        } else if (evt.key === 'Home') {
          this.#focused = 0;
        }

        this.#focusable[this.#focused].focus();
        this.select(this.#focusable[this.#focused].getAttribute('value'));
      }
    }

    if (evt.altKey && evt.key === 's') {
      this.#searching = true;
      this.#root.querySelector('input[type="search"]').focus();
    }
  };

  #handleSearch = (evt) => {
    const search = evt.target.value.toLowerCase().trim();

    for (const child of this.#children) {
      if (
        child.getAttribute('label')?.toLowerCase().includes(search) ||
        child.textContent.toLowerCase().includes(search)
      ) {
        child.removeAttribute('hidden');
      } else {
        child.setAttribute('hidden', 'true');
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
    const input = document.createElement('input');
    const dropdown = document.createElement('div');
    const search = document.createElement('input');
    const slot = document.createElement('slot');

    search.setAttribute('type', 'search');
    search.setAttribute('aria-label', 'Filter this selection');
    search.setAttribute('placeholder', 'Filter this selection');
    search.oninput = this.#handleSearch;

    if (!this.#searchable) {
      search.setAttribute('hidden', 'true');
    }

    input.setAttribute('part', 'input');
    input.setAttribute('readonly', 'true');
    input.onclick = this.#handleClick;

    if (this.#disabled) {
      input.setAttribute('disabled', 'true');
    }

    if (this.#autofocus) {
      input.setAttribute('autofocus', 'true');
    }

    dropdown.setAttribute('part', 'dropdown');
    dropdown.setAttribute('hidden', 'true');
    dropdown.append(search, slot);

    this.#root.append(input, dropdown);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get #styles() {
    const sheet = new CSSStyleSheet();

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

  get #children() {
    return Array.from(this.children);
  }

  get #focusable() {
    return this.#children.filter((child) => !child.hasAttribute('disabled'));
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
      this.#root.querySelector('input').focus();
    }
  }

  get disabled() {
    return this.#disabled;
  }

  set disabled(value) {
    this.#disabled = value;

    if (value) {
      this.#root.querySelector('input').setAttribute('disabled', 'true');
    } else {
      this.#root.querySelector('input').removeAttribute('disabled');
    }
  }

  get required() {
    return this.#required;
  }

  set required(value) {
    this.#required = value;

    this.#handleValidation();
  }

  get searchable() {
    return this.#searchable;
  }

  set searchable(value) {
    this.#searchable = value;

    if (value) {
      this.#root.querySelector('input[type="search"]').removeAttribute('hidden');
    } else {
      this.#root.querySelector('input[type="search"]')?.setAttribute('hidden', 'true');
    }
  }

  static formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return ['disabled', 'required', 'searchable', 'value'];
  }
}

window.customElements.define('dice-select', Select);
