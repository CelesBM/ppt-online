import { Router } from "@vaadin/router";
import { state } from "../../state";

class Rooms extends HTMLElement {
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
        <div class="container-button">
            <button class="new-room">Crear nueva sala</button>
            <button class="old-room">Ingresar a sala existente</button>
        </div>
    </section>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
    section{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        align-items: center;
    }
    h1{
        font-family: "Luckiest Guy", cursive;
        font-weight: 400;
        font-style: normal;  
        font-size: 80px; 
        background-color: #fff;
        box-shadow: 0px 0px 30px 5px rgba(255, 117, 20, 0.7);
        width: 500px;
        border-radius: 4px;
        padding: 25px 50px;
    }
    .container-button{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        align-items: center;
        gap: 20px;
    }
    button{
        cursor: pointer;
        width: 300px;
        height: 50px;
        border-radius: 4px;
        border-color: #ff7514;
        font-family: "Poppins", sans-serif;
        font-weight: bold;
        font-style: normal;
        font-size: 20px;
        background-color: #ffbb8d;
    }
    `;

    const buttonNewEl = this.shadow.querySelector(
      ".new-room"
    ) as HTMLButtonElement;
    const buttonOldEl = this.shadow.querySelector(
      ".old-room"
    ) as HTMLButtonElement;

    buttonNewEl.addEventListener("click", (e) => {
      e.preventDefault();
      //state.generateNewRoom(() => {Router.go("/compartir"); });
      Router.go("new-room");
    });

    buttonOldEl.addEventListener("click", (e) => {
      e.preventDefault();
    });

    this.shadow.appendChild(style);
  }
}

customElements.define("rooms-comp", Rooms);
