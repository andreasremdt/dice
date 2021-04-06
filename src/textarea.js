class Textarea extends HTMLElement {
  #internals = this.attachInternals();
  #root = this.attachShadow({ mode: "open" });
  #value = this.getAttribute("value");

  connectedCallback() {
    this.#render();
    this.#handleValidation();
    this.#internals.setFormValue(this.#value);
  }

  #handleInput = ({ target }) => {
    target.parentNode.dataset.value = target.value;

    this.#value = target.value;
    this.#internals.setFormValue(this.#value);
    this.#handleValidation();
  };

  #handleValidation() {
    if (this.value == "" && this.required) {
      this.#internals.setValidity(
        {
          valueMissing: true,
        },
        "Please fill out this field.",
        this.#root.querySelector("textarea")
      );
    } else {
      this.#internals.setValidity({});
    }
  }

  #render() {
    var textarea = document.createElement("textarea");
    var div = document.createElement("div");
    var label = document.createElement("label");
    var slot = document.createElement("slot");

    if (this.textContent) {
      label.setAttribute("part", "label");
      label.setAttribute("for", this.getAttribute("id") || `textarea-${this.#uid}`);
      label.append(slot);
      this.#root.append(label);
    }

    div.append(textarea);

    for (let attribute of this.attributes) {
      textarea.setAttributeNode(attribute.cloneNode());
    }

    textarea.setAttribute("part", "textarea");
    textarea.value = this.#value;
    textarea.oninput = this.#handleInput;

    if (this.textContent) {
      textarea.setAttribute("id", label.getAttribute("for"));
    }

    this.#root.append(div);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get value() {
    return this.#value;
  }

  get required() {
    return typeof this.getAttribute("required") == "string";
  }

  get #uid() {
    var first = Math.floor(Math.random() * 46656);
    var second = Math.floor(Math.random() * 46656);

    return first.toString(36) + second.toString(36);
  }

  get #styles() {
    var sheet = new CSSStyleSheet();

    sheet.insertRule(":host { display: inline-block; }");
    sheet.insertRule("div { display: grid; }");
    sheet.insertRule(`
      div::after, textarea {
        grid-area: 1 / 1 / 2 / 2;
        font: unset;
        padding: unset;
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
    return ["value", "name", "id", "placeholder", "required"];
  }
}

window.customElements.define("dice-textarea", Textarea);
