class Dropdown extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });
  #open = this.hasAttribute("open");
  #placement = this.getAttribute("placement") || "bottom";
  #align = this.getAttribute("align") || "left";
  #focused = 0;

  connectedCallback() {
    this.#render();

    if (this.#open) {
      this.show();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "open" && newValue) {
      if (newValue == "true") {
        this.show();
      } else {
        this.hide();
      }
    } else if (name == "placement" && oldValue && oldValue != newValue) {
      this.#placement = newValue;
      this.#root.adoptedStyleSheets = [this.#styles];
    } else if (name == "align" && oldValue && oldValue != newValue) {
      this.#align = newValue;
      this.#root.adoptedStyleSheets = [this.#styles];
    }
  }

  show() {
    document.addEventListener("keydown", this.#handleKeyDown);
    document.addEventListener("click", this.#handleOuterClick);

    this.#open = true;
    this.#focused = -1;
    this.#root.querySelector("div").removeAttribute("hidden");
    this.#root.querySelector("button").setAttribute("aria-expanded", "true");
  }

  hide(focus = true) {
    document.removeEventListener("keydown", this.#handleKeyDown);
    document.removeEventListener("click", this.#handleOuterClick);

    this.#open = false;
    this.#root.querySelector("div").setAttribute("hidden", "true");
    this.#root.querySelector("button").setAttribute("aria-expanded", "false");

    if (focus) {
      this.#root.querySelector("button").focus();
    }
  }

  #handleOuterClick = ({ target }) => {
    if (!target.closest("dice-dropdown")) {
      this.hide();
    }
  };

  #handleKeyDown = (evt) => {
    if (evt.key == "Escape") {
      this.hide();
    }

    if (["ArrowDown", "ArrowUp", "Tab", "Home", "End"].includes(evt.key)) {
      if (evt.key == "ArrowDown" || (evt.key == "Tab" && !evt.shiftKey)) {
        if (this.#focused < this.#focusable.length - 1) {
          evt.preventDefault();

          this.#focused++;
        } else if (evt.key == "Tab") {
          this.hide(false);
        }
      } else if (evt.key == "ArrowUp" || (evt.key == "Tab" && evt.shiftKey)) {
        if (this.#focused > 0) {
          evt.preventDefault();

          this.#focused--;
        } else if (evt.key == "Tab" && document.activeElement.isEqualNode(this)) {
          this.hide(false);
        }
      } else if (evt.key == "Home") {
        this.#focused = 0;
      } else if (evt.key == "End") {
        this.#focused = this.#focusable.length - 1;
      }

      this.#focusable[this.#focused].focus();
    }
  };

  #handleToggle = () => {
    if (this.#open) {
      this.hide();
    } else {
      this.show();
    }
  };

  #render() {
    this.#root.innerHTML = "";

    var button = document.createElement("button");
    var menu = document.createElement("div");
    var buttonSlot = document.createElement("slot");
    var menuSlot = document.createElement("slot");

    button.setAttribute("part", "button");
    button.setAttribute("id", this.#uid);
    button.setAttribute("aria-expanded", this.#open ? "true" : "false");
    button.onclick = this.#handleToggle;
    button.append(buttonSlot);

    menu.setAttribute("part", "menu");
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-labelledby", button.id);
    menu.setAttribute("hidden", "true");
    menu.append(menuSlot);

    menuSlot.setAttribute("name", "menu");

    this.#root.append(button, menu);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get open() {
    return this.#open;
  }

  set open(opened) {
    if (opened) {
      this.show();
    } else {
      this.hide();
    }
  }

  get placement() {
    return this.#placement;
  }

  set placement(value) {
    if (["top", "bottom", "right", "left"].includes(value)) {
      this.#placement = value;
      this.#root.adoptedStyleSheets = [this.#styles];
    }
  }

  get align() {
    return this.#align;
  }

  set align(value) {
    if (["top", "bottom", "right", "left"].includes(value)) {
      this.#align = value;
      this.#root.adoptedStyleSheets = [this.#styles];
    }
  }

  get #focusable() {
    return this.querySelectorAll(
      "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]"
    );
  }

  get #uid() {
    var first = Math.floor(Math.random() * 46656);
    var second = Math.floor(Math.random() * 46656);

    return first.toString(36) + second.toString(36);
  }

  get #styles() {
    var sheet = new CSSStyleSheet();
    var button = this.#root.querySelector("button");

    sheet.insertRule(`
      :host {
        position: relative;
        display: inline-block;
      }
    `);

    sheet.insertRule(`
      div {
        --spacing: 0px;
        position: absolute;
        background-color: white;
        width: max-content;
        border: 1px solid;
      }
    `);

    if (this.#placement == "bottom" || this.#placement == "top") {
      sheet.insertRule(`div {
        ${this.#placement == "bottom" ? "top" : "bottom"}: calc(${
        button.offsetHeight
      }px + var(--spacing));
        ${this.#align}: 0;
      }`);
    }

    if (this.#placement == "right" || this.#placement == "left") {
      sheet.insertRule(`div {
        ${this.#placement == "right" ? "left" : "right"}: calc(100% + var(--spacing));
        ${this.#align}: 0;
      }`);
    }

    return sheet;
  }

  static get observedAttributes() {
    return ["open", "align", "placement"];
  }
}

window.customElements.define("dice-dropdown", Dropdown);
