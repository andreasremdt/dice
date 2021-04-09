class Tabs extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });

  connectedCallback() {
    this.#render();
    this.#prepare();

    this.addEventListener("click", this.#handleTabClick);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.#handleTabClick);
  }

  #handleTabClick = ({ target }) => {
    if (target.hasAttribute("data-for")) {
      this.#hideContent();

      target.removeAttribute("tabindex");
      this.querySelector("#" + target.dataset.for)?.removeAttribute("hidden");
    }
  };

  #prepare() {
    var selected = this.getAttribute("selected");

    for (let child of this.children) {
      let dataFor = child.getAttribute("data-for");
      let id = child.getAttribute("id");

      if (child.hasAttribute("slot")) {
        child.setAttribute("role", "tab");
        child.setAttribute("aria-selected", selected == dataFor);
        child.setAttribute("aria-controls", dataFor);
        child.setAttribute("id", `${dataFor}-tab`);

        if (selected != dataFor) {
          child.setAttribute("tabindex", "-1");
        }
      } else {
        child.setAttribute("tabindex", "0");
        child.setAttribute("role", "tabpanel");
        child.setAttribute("aria-labelledby", `${id}-tab`);

        if (selected != id) {
          child.setAttribute("hidden", "true");
        }
      }
    }
  }

  #hideContent() {
    for (let child of this.children) {
      if (!child.hasAttribute("slot")) {
        child.setAttribute("hidden", "true");
      } else {
        child.setAttribute("tabindex", "-1");
      }
    }
  }

  #render() {
    var tabs = document.createElement("div");
    var content = document.createElement("div");
    var tabsSlot = document.createElement("slot");
    var slot = document.createElement("slot");

    tabs.setAttribute("part", "tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", this.getAttribute("label") || "Tab navigation");

    content.setAttribute("part", "content");
    content.append(slot);

    tabsSlot.setAttribute("name", "tab");
    tabs.append(tabsSlot);

    this.#root.append(tabs, content);
  }

  static get observedAttributes() {
    return ["selected", "label"];
  }
}

window.customElements.define("dice-tabs", Tabs);
