import { Router } from "@vaadin/router";
import { state } from "../../state";
import map from "lodash/map";

class Game extends HTMLElement {
  counter = 10;
  ValueArrays: string[] = [];

  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const imgScissor = require("url:../../img/tijera.png");
    const imgStone = require("url:../../img/piedra.png");
    const imgPaper = require("url:../../img/papel.png");

    const currentState = state.getState();
    this.shadow.innerHTML = `   
    <section>
        <div class="container-hands-rival">
          <div class="container-hand-rival">
             <img class="img-stone-rival" src="https://imgur.com/WxZ1n4a.png" alt="stone-rival" valor="stone"/>
          </div>
          <div class="container-hand-rival">
            <img class="img-paper-rival" src="https://imgur.com/0KGjK2M.png" alt="paper-rival" valor="paper"/>
          </div>
          <div class="container-hand-rival">
             <img class="img-scissor-rival" src="https://imgur.com/Mc7opyX.png" alt="scissor-rival" valor="scissor" />
          </div>
        </div>

        <div class="counter">${this.counter} </div> 
        <div class="container-hands">
          <div class="container-hand">
             <img class="img-stone" src=${imgStone} alt="stone" valor="stone"/>
          </div>
          <div class="container-hand">
             <img class="img-paper" src=${imgPaper} alt="paper" valor="paper"/>
          </div>
          <div class="container-hand">
             <img class="img-scissor" src=${imgScissor} alt="scissor" valor="scissor"/>
          </div>
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

    .container-hands-rival{
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: flex-start;
      gap: 40px;
      position: absolute;
      top: 0;
    }
    @media(min-width:600px){
      .container-hands-rival{
        gap: 80px;
      }
    }
    @media(min-width:800px){
      .container-hands-rival{
        gap: 140px;
      }
    }
    @media(min-width:1250px){
      .container-hands-rival{
        gap: 280px;
      }
    }
    .img-scissor-rival, .img-stone-rival, .img-paper-rival{
      width: 70px;
      height: 150px;
    }
    @media(min-width:600px){
      .img-scissor-rival, .img-stone-rival, .img-paper-rival{
        width: 90px;
        height: 180px;
      }
    }
    .counter{
      margin-top: 300px;
      font-family: "Luckiest Guy", cursive;
      font-weight: 400;
      font-style: normal;  
      font-size: 50px; 
      background-color: #fff;
      box-shadow: 0px 0px 30px 5px rgba(255, 117, 20, 0.7);
      border-radius: 20px;
      padding: 20px;
    }
    @media(min-width:600px){
      .counter{
        font-size: 80px; 
      }
    }
    .container-hands{
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: flex-end;
      gap: 40px;
      position: absolute;
      bottom: 0;
    }
    @media(min-width:600px){
      .container-hands{
        gap: 80px;
      }
    }
    @media(min-width:800px){
      .container-hands{
        gap: 140px;
      }
    }
    @media(min-width:1250px){
      .container-hands{
        gap: 280px;
      }
    }
    .img-scissor, .img-stone, .img-paper{
      width: 70px;
      height: 150px;
    }
    @media(min-width:600px){
      .img-scissor, .img-stone, .img-paper{
        width: 90px;
        height: 180px;
      }
    }
    `;

    this.shadow.appendChild(style);
  }
}

customElements.define("game-comp", Game);
