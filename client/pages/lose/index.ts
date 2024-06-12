import { Router } from "@vaadin/router";

class Lose extends HTMLElement {
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
        <h2>Perdiste &#x1F62D;</h2>
        <div class="container-score">
            <h5>Nombre 1: 0</h5>
            <h5>Nombre 2: 0</h5>
        </div>
        <button class="button">Volver a jugar</button>
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
        gap: 30px;
    }
    @media(min-width:1020px){
      section{
        gap: 10px;
      }
    }
    h2{
        font-family: "Luckiest Guy", cursive;
        font-style: normal;  
        font-size: 40px; 
        background-color: #fff;
        box-shadow: 0px 0px 30px 5px rgba(255, 117, 20, 0.7);
        width: 200px;
        border-radius: 4px;
        padding: 25px 50px;
        text-align: center;
    }
    @media(min-width:500px){
      h2{
        font-size: 50px; 
        width: 250px;
      }
    }
    @media(min-width:700px){
      h2{
        font-size: 60px; 
        width: 400px;
      }
    }
    @media(min-width:1020px){
      h2{
        font-size: 70px; 
        width: 600px;
      }
    }
    .container-score{
        family: "Poppins", sans-serif;
        background-color: #fff;
        width: 200px;
        border-radius: 4px;
        padding: 25px 50px;
        text-align: center;
        line-height: 30px;
        font-size: 25px; 
    }
    @media(min-width:500px){
      .container-score{
        font-size: 35px; 
        width: 250px;
      }
    }
    @media(min-width:700px){
      .container-score{
        font-size: 45px; 
        width: 350px;
      }
    }
    @media(min-width:1020px){
      .container-score{
        width: 500px;
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
        margin-top: 30px;
      }
    }
    `;

    this.shadow.appendChild(style);
  }
}

customElements.define("lose-comp", Lose);
