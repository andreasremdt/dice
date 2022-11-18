const VALIDATION_MESSAGES = {
  valueMissing: () => 'Please fill out this field.',
  tooShort: (requiredLength, actualLength) =>
    `Please lengthen this text to ${requiredLength} characters or more (you are currently using ${actualLength} character${
      actualLength !== 1 ? 's' : ''
    }).`,
  tooLong: (requiredLength, actualLength) =>
    `Please shorten this text to ${requiredLength} characters or less (you are currently using ${actualLength} character${
      actualLength !== 1 ? 's' : ''
    }).`,
  patternMismatch: () => 'Please match the requested format.',
};

class Textarea extends HTMLElement {
  #internals = this.attachInternals();

  #root = this.attachShadow({ mode: 'open' });

  #value = this.textContent || this.getAttribute('value') || '';

  #required = this.hasAttribute('required');

  #minLength = this.getAttribute('minlength');

  #maxLength = this.getAttribute('maxlength');

  #pattern = this.hasAttribute('pattern') && new RegExp(this.getAttribute('pattern'));

  connectedCallback() {
    this.#render();
    this.#handleValidation();
    this.#internals.setFormValue(this.#value);
  }

  focus() {
    this.#root.querySelector('textarea').focus();
  }

  blur() {
    this.#root.querySelector('textarea').blur();
  }

  select() {
    this.#root.querySelector('textarea').select();
  }

  setRangeText(...args) {
    this.#root.querySelector('textarea').setRangeText.apply(null, ...args);
  }

  setSelectionRange(...args) {
    this.#root.querySelector('textarea').setSelectionRange.apply(null, ...args);
  }

  #handleInput = (evt) => {
    const { dataset } = evt.target.parentNode;

    dataset.value = evt.target.value;
    this.#value = evt.target.value;
    this.#internals.setFormValue(this.#value);
    this.#handleValidation();
  };

  #handleChange = (evt) => {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: evt.target.value,
        },
      }),
    );
  };

  #handleValidation() {
    if (this.#value === '' && this.#required) {
      this.#internals.setValidity(
        {
          valueMissing: true,
        },
        VALIDATION_MESSAGES.valueMissing(),
        this.#root.querySelector('textarea'),
      );
    } else if (this.#minLength && this.#value.length < Number(this.#minLength)) {
      this.#internals.setValidity(
        {
          tooShort: true,
        },
        VALIDATION_MESSAGES.tooShort(this.#minLength, this.value.length),
        this.#root.querySelector('textarea'),
      );
    } else if (this.#maxLength && this.#value.length > Number(this.#maxLength)) {
      this.#internals.setValidity(
        {
          tooLong: true,
        },
        VALIDATION_MESSAGES.tooShort(this.#maxLength, this.value.length),
        this.#root.querySelector('textarea'),
      );
    } else if (this.#pattern && !this.#pattern.test(this.#value)) {
      this.#internals.setValidity(
        {
          patternMismatch: true,
        },
        VALIDATION_MESSAGES.patternMismatch(),
        this.#root.querySelector('textarea'),
      );
    } else {
      this.#internals.setValidity({});
    }
  }

  #render() {
    const textarea = document.createElement('textarea');
    const div = document.createElement('div');

    div.setAttribute('part', 'wrapper');
    div.append(textarea);

    for (const attribute of this.attributes) {
      // @ts-ignore
      textarea.setAttributeNode(attribute.cloneNode());
    }

    textarea.setAttribute('part', 'textarea');
    textarea.value = this.#value;
    textarea.oninput = this.#handleInput;
    textarea.onchange = this.#handleChange;

    if (textarea.hasAttribute('id')) {
      const label = document.querySelector(`label[for="${textarea.getAttribute('id')}"]`) as HTMLLabelElement;

      if (label) label.onclick = () => textarea.focus();
    }

    this.#root.append(div);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get value() {
    return this.#value;
  }

  set value(newValue) {
    this.#value = newValue;
    this.#internals.setFormValue(newValue);
    this.#root.querySelector('textarea').value = newValue;
    this.#handleValidation();
  }

  get required() {
    return this.#required;
  }

  set required(value) {
    this.#required = value;
  }

  get minlength() {
    return this.#minLength;
  }

  set minlength(value) {
    this.#minLength = value;
  }

  get maxlength() {
    return this.#maxLength;
  }

  set maxlength(value) {
    this.#maxLength = value;
  }

  get pattern() {
    return this.#pattern;
  }

  set pattern(value) {
    this.#pattern = new RegExp(value);
  }

  get #styles() {
    const sheet = new CSSStyleSheet();

    sheet.insertRule(':host { display: inline-block; }');
    sheet.insertRule('div { display: grid; --padding: 0; }');
    sheet.insertRule(`
      div::after, textarea {
        grid-area: 1 / 1 / 2 / 2;
        font: unset;
        padding: var(--padding);
      }
    `);
    sheet.insertRule(`
      div::after {
        content: attr(data-value) " ";
        white-space: pre-wrap;
        visibility: hidden;
      }
    `);
    sheet.insertRule(`
      textarea {
        resize: none;
        overflow: hidden;
      }
    `);

    return sheet;
  }

  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return ['value', 'name', 'id', 'placeholder', 'required'];
  }
}

window.customElements.define('dice-textarea', Textarea);
