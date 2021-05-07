class Dialog extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });
  #open = this.hasAttribute("open");
  #lastElementFocused = null;
  #focused = 0;

  connectedCallback() {
    this.#render();

    if (this.#open) {
      document.addEventListener("keydown", this.#handleKeyDown);
    }
  }

  attributeChangedCallback(name, _, newValue) {
    if (name == "open" && newValue) {
      if (newValue == "true") {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  show() {
    this.#root.querySelector("div").removeAttribute("hidden");
    this.#open = true;
    this.#lastElementFocused = document.activeElement;

    if (this.#focusable.length > 0) {
      this.#focusable[this.#focused].focus();
    }

    document.addEventListener("keydown", this.#handleKeyDown);
  }

  hide() {
    this.#root.querySelector("div").setAttribute("hidden", "true");
    this.#open = false;
    this.#lastElementFocused.focus?.();

    document.removeEventListener("keydown", this.#handleKeyDown);
  }

  #handleKeyDown = (evt) => {
    if (evt.key == "Escape" && this.#open) {
      this.hide();
    }

    if (evt.key == "Tab") {
      evt.preventDefault();

      if (evt.shiftKey) {
        if (this.#focused == 0) {
          this.#focused = this.#focusable.length - 1;
        } else {
          this.#focused--;
        }
      } else {
        if (this.#focused == this.#focusable.length - 1) {
          this.#focused = 0;
        } else {
          this.#focused++;
        }
      }

      this.#focusable[this.#focused].focus();
    }
  };

  #render() {
    var backdrop = document.createElement("div");
    var dialog = document.createElement("div");
    var slot = document.createElement("slot");

    if (!this.#open) {
      backdrop.setAttribute("hidden", true);
    }

    backdrop.setAttribute("part", "backdrop");
    backdrop.append(dialog);

    if (this.hasAttribute("aria-labelledby")) {
      dialog.setAttribute("aria-labelledby", this.getAttribute("aria-labelledby"));
    }

    dialog.setAttribute("part", "dialog");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.append(slot);

    this.#root.append(backdrop);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get #styles() {
    var sheet = new CSSStyleSheet();

    sheet.insertRule(`div[part="backdrop"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .1);
    }`);

    sheet.insertRule(`div[part="dialog"] {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      width: fit-content;
      height: fit-content;
      margin: auto;
      background-color: white;
      border: 3px solid;
      transform: translateY(-50%);
    }`);

    return sheet;
  }

  get #focusable() {
    return this.querySelectorAll(
      "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]"
    );
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

  static get observedAttributes() {
    return ["open"];
  }
}

window.customElements.define("dice-dialog", Dialog);
