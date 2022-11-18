import { createCalendar, getMonths } from './utils.js';

class DateTime extends HTMLElement {
  #root = this.attachShadow({ mode: 'open' });

  #open = false;

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open' && oldValue !== newValue) {
      if (newValue === 'true') {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  show = () => {
    if (!this.#open) {
      this.#root.querySelector('div').removeAttribute('hidden');
      this.#open = true;

      document.addEventListener('click', this.#handleOuterClick);
      document.addEventListener('keydown', this.#handleKeyDown);
    }
  };

  hide = () => {
    if (this.#open) {
      this.#root.querySelector('div').setAttribute('hidden', 'true');
      this.#open = false;

      document.removeEventListener('click', this.#handleOuterClick);
      document.removeEventListener('keydown', this.#handleKeyDown);
    }
  };

  #handleKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      this.hide();
    }
  };

  #handleClick = () => {
    if (this.#open) {
      this.hide();
    } else {
      this.show();
    }
  };

  #handleOuterClick = (evt) => {
    if (!evt.target.isSameNode(this)) {
      this.hide();
    }
  };

  #render() {
    const button = document.createElement('button');
    const calendar = document.createElement('div');
    const input = document.createElement('input');
    const next = document.createElement('button');
    const span = document.createElement('span');
    const previous = document.createElement('button');
    const caption = document.createElement('caption');
    let month = new Date().getMonth();
    const year = new Date().getFullYear();

    function update(newYear, newMonth) {
      calendar.innerHTML = '';

      const table = createCalendar(newYear, newMonth);

      table.append(caption);
      calendar.append(table);
    }

    caption.append(previous, span, input, next);

    previous.setAttribute('type', 'button');
    previous.textContent = '←';
    previous.onclick = () => {
      update(year, (month -= 1));
    };

    next.setAttribute('type', 'button');
    next.textContent = '→';
    next.onclick = () => {
      update(year, (month += 1));
    };

    input.setAttribute('type', 'number');
    input.value = String(year);
    input.onchange = (evt: Event) => {
      update(Number((<HTMLInputElement>evt.target).value), month);
    };

    span.textContent = getMonths()[month];

    update(year, month);

    button.textContent = 'o';
    button.onclick = this.#handleClick;

    this.#root.append(button, calendar);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get #styles() {
    const sheet = new CSSStyleSheet();

    sheet.insertRule(`:host {
      position: relative;
      display: inline-block;
      border: 1px solid;
      width: 250px;
      height: 21px;
    }`);

    sheet.insertRule(`div {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      border: 1px solid;
    }`);

    return sheet;
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

  static get formAssociated() {
    return true;
  }

  static get observedAttributes() {
    return ['open'];
  }
}

window.customElements.define('dice-datetime', DateTime);
