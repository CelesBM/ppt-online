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
      font-size: 50px; 
      background-color: #fff;
      box-shadow: 0px 0px 30px 5px rgba(255, 117, 20, 0.7);
      width: 250px;
      border-radius: 4px;
      padding: 50px 20px;
  }
  @media(min-width:500px){
    h1{  
      font-size: 60px; 
      width: 300px;
      padding: 40px 35px;
    }
  }
  @media(min-width:720px){
    h1{        
      font-size: 80px; 
      width: 500px;
      padding: 25px 50px;
    }
  }
  @media(min-width:1020px){
    h1{        
      font-size: 90px; 
      width: 580px;
      padding: 25px 70px;
    }
  }
  .container-button{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    margin-top: 70px;
    gap: 20px;
}
@media(min-width:500px){
  .container-button{  
    margin-top: 50px;
  }
}
@media(min-width:720px){
  .container-button{  
    margin-top: 20px;
  }
}
@media(min-width:1020px){
  .container-button{  
    margin-top: -20px;
  }
}
button{
    cursor: pointer;
    width: 250px;
    height: 70px;
    border-radius: 4px;
    border-color: #ff7514;
    font-family: "Poppins", sans-serif;
    font-weight: bold;
    font-style: normal;
    font-size: 20px;
    background-color: #ffbb8d;
}
@media(min-width:500px){
  button{  
    width: 280px;
  }
}
@media(min-width:720px){
  button{  
    width: 300px;
  }
}
@media(min-width:720px){
  button{  
    font-size: 25px;
    width: 500px;
    height: 70px;
  }
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
      state.createNewRoom(() => {
        Router.go("/new-room");
      });
    });

    buttonOldEl.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/existing-room");
    });

    this.shadow.appendChild(style);
  }
}

customElements.define("rooms-comp", Rooms);
