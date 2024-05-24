import { Router } from "@vaadin/router";

class Signin extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
    <section>
        <h1>Piedra, papel o tijera</h1>
    </section>
    `;

    const style = document.createElement("style");
    style.innerHTML = `

    `;
    this.shadow.appendChild(style);
  }
}

customElements.define("signin-comp", Signin);
