class Tabs extends HTMLElement {
  #root = this.attachShadow({ mode: 'open' });

  #active = this.getAttribute('active');

  connectedCallback() {
    this.#render();

    if (this.#active) {
      this.show(this.#active);
    }

    document.addEventListener('keydown', this.#handleKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.#handleKeyDown);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'active' && oldValue && oldValue !== newValue) {
      this.#active = newValue;
      this.show(newValue);
    } else if (name === 'label' && oldValue && oldValue !== newValue) {
      this.#root.querySelector('div[role="tablist"]').setAttribute('aria-label', newValue);
    }
  }

  show(id) {
    for (const child of this.children) {
      if (child.hasAttribute('slot') && child.hasAttribute('data-for')) {
        if (child.getAttribute('data-for') === id) {
          child.setAttribute('aria-selected', 'true');
          child.removeAttribute('tabindex');
        } else {
          child.setAttribute('aria-selected', 'false');
          child.setAttribute('tabindex', '-1');
        }
      } else if (child.getAttribute('id') === id) {
        child.removeAttribute('hidden');
      } else {
        child.setAttribute('hidden', 'true');
      }
    }

    this.#active = id;
  }

  #handleTabClick = (evt) => {
    evt.preventDefault();

    this.show(evt.target.getAttribute('data-for'));
  };

  #handleKeyDown = (evt) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evt.key)) {
      if (this.contains(document.activeElement) && document.activeElement.hasAttribute('data-for')) {
        let index = this.#tabButtons.findIndex((tabButton) => tabButton.getAttribute('data-for') === this.#active);

        if (evt.key === 'ArrowRight') {
          if (index < this.#tabButtons.length - 1) {
            index += 1;
          } else if (index === this.#tabButtons.length - 1) {
            index = 0;
          }
        } else if (evt.key === 'ArrowLeft') {
          if (index > 0) {
            index -= 1;
          } else if (index === 0) {
            index = this.#tabButtons.length - 1;
          }
        } else if (evt.key === 'Home') {
          index = 0;
        } else if (evt.key === 'End') {
          index = this.#tabButtons.length - 1;
        }

        this.#tabButtons[index].focus();
        this.show(this.#tabButtons[index].getAttribute('data-for'));
      }
    }
  };

  #render() {
    const tabs = document.createElement('div');
    const content = document.createElement('div');
    const tabsSlot = document.createElement('slot');
    const slot = document.createElement('slot');

    for (const child of this.children) {
      const dataFor = child.getAttribute('data-for');
      const id = child.getAttribute('id');

      if (child.hasAttribute('slot') && child.hasAttribute('data-for')) {
        child.setAttribute('role', 'tab');
        child.setAttribute('aria-controls', dataFor);
        child.setAttribute('id', `${dataFor}-tab`);
        child.onclick = this.#handleTabClick;
      } else {
        child.setAttribute('tabindex', '0');
        child.setAttribute('role', 'tabpanel');
        child.setAttribute('aria-labelledby', `${id}-tab`);
      }
    }

    tabs.setAttribute('part', 'tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', this.getAttribute('label') || 'Tab navigation');

    content.setAttribute('part', 'content');
    content.append(slot);

    tabsSlot.setAttribute('name', 'tab');
    tabs.append(tabsSlot);

    this.#root.append(tabs, content);
  }

  get active() {
    return this.#active;
  }

  set active(value) {
    this.#active = value;

    this.show(value);
  }

  get label() {
    return this.getAttribute('label');
  }

  set label(value) {
    this.#root.querySelector('div[role="tablist"]').setAttribute('aria-label', value);
  }

  get #tabButtons() {
    return Array.from(this.children).filter((child) => child.hasAttribute('slot') && child.hasAttribute('data-for'));
  }

  static get observedAttributes() {
    return ['active', 'label'];
  }
}

window.customElements.define('dice-tabs', Tabs);
