import { Router } from "@vaadin/router";
import { state } from "../../state";

class NewRoom extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const currentState = state.getState();
    this.shadow.innerHTML = `   
    <section>
        <h2>¡ Bienvenido/a, </br>${currentState.name} !</h2>
        <p>Se te ha asignado la sala XXXXXX </br> Comparte el código con tu contrincante </p>
        <div class="container-button">
            <button class="button">Ingresar a la sala</button>
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
    h2{
        font-family: "Luckiest Guy", cursive;
        font-style: normal;  
        font-size: 40px; 
        background-color: #fff;
        box-shadow: 0px 0px 30px 5px rgba(255, 117, 20, 0.7);
        width: 500px;
        border-radius: 4px;
        padding: 25px 50px;
        text-align: center;
    }
    p{
        font-family: "Poppins", sans-serif;
        font-style: normal;  
        font-size: 20px; 
        background-color: #fff;
        width: 500px;
        border-radius: 4px;
        padding: 25px 50px;
        text-align: center;
        line-height: 50px;
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

    const buttonEl = this.shadow.querySelector(".button") as HTMLButtonElement;

    buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
    });

    this.shadow.appendChild(style);
  }
}

customElements.define("new-room-comp", NewRoom);
