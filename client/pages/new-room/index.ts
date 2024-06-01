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
        <p>Se te ha asignado la sala ${currentState.roomId} </br> Comparte el código con tu contrincante </p>
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
        gap: 40px;
    }
    @media(min-width:1020px){
      section{
        gap: 10px;
      }
    }
    h2{
        font-family: "Luckiest Guy", cursive;
        font-style: normal;  
        font-size: 25px; 
        background-color: #fff;
        box-shadow: 0px 0px 30px 5px rgba(255, 117, 20, 0.7);
        width: 200px;
        border-radius: 4px;
        padding: 25px 50px;
        text-align: center;
    }
    @media(min-width:500px){
      h2{
        font-size: 30px; 
        width: 250px;
      }
    }
    @media(min-width:700px){
      h2{
        font-size: 40px; 
        width: 400px;
      }
    }
    @media(min-width:1020px){
      h2{
        font-size: 55px; 
        width: 600px;
      }
    }
    p{
        font-family: "Poppins", sans-serif;
        font-style: normal;  
        font-size: 18px; 
        background-color: #fff;
        width: 200px;
        border-radius: 4px;
        padding: 25px 50px;
        text-align: center;
        line-height: 30px;
    }
    @media(min-width:500px){
      p{
        font-size: 20px; 
        width: 250px;
      }
    }
    @media(min-width:700px){
      p{
        font-size: 25px; 
        width: 350px;
        line-height: 40px;
      }
    }
    @media(min-width:1020px){
      p{
        width: 500px;
        line-height: 50px;
      }
    }
    button{
        cursor: pointer;
        width: 250px;
        height: 50px;
        border-radius: 4px;
        border-color: #ff7514;
        font-family: "Poppins", sans-serif;
        font-weight: bold;
        font-style: normal;
        font-size: 18px;
        background-color: #ffbb8d;
    }
    @media(min-width:700px){
      button{
        width: 300px;
        height: 60px;
        font-size: 20px;
      }
    }
    @media(min-width:1020px){
      button{
        width: 400px;
        height: 70px;
        font-size: 22px;
      }
    }
    `;

    const buttonEl = this.shadow.querySelector(".button") as HTMLButtonElement;

    buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      //getroom y pushjugada
    });

    this.shadow.appendChild(style);
  }
}

customElements.define("new-room-comp", NewRoom);
