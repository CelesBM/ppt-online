import { Router } from "@vaadin/router";
import { state } from "../../state";

class ExistingRoom extends HTMLElement {
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
        <p>Ingrese el código de sala</p>
        <input type="text" id="roomId" name="roomId">
        <div class="container-err">
            <h5 class="err">* Esta sala no existe.</h5>
        </div>
        <button class="button">Ingresar a la sala</button>
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
    input{
        width: 170px;
        height: 30px;
        padding: 0px 20px;
        border-radius: 4px;
        font-family: "Poppins", sans-serif;
        font-weight: 300;
        font-style: normal;
        font-size: 15px;
        text-align: center;
    }
    @media(min-width: 600px){
      input{
        width: 250px;
        height: 35px;
      }
    }
    @media(min-width: 1020px){
      input{
        width: 600px;
        height: 50px;
        margin-bottom: 50px;
      }
    }
    .err{
        display: none;
        font-size: 14px;
        color: red;
        font-style: italic;
        margin: 5px 0px;
        background-color: #fff;
        padding: 5px;
        border-radius: 4px;
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
    const codeInput = this.shadow.querySelector("#roomId") as HTMLInputElement;
    const errorEl = this.querySelector(".container-err") as HTMLDivElement;

    buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      const inputValue = codeInput.value;
      const currentState = state.getState();
      currentState.roomId = inputValue;
      state.setState(currentState);
      state.getRoom(() => {
        const currenState = state.getState();
        if (currenState.messageError === "" || undefined) {
          state.gamePush();
          Router.go("/instructions");
        } else {
          errorEl.style.display = "block";
        }
      });
    });

    this.shadow.appendChild(style);
  }
}

customElements.define("existing-room-comp", ExistingRoom);
