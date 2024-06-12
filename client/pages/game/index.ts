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
             <img class="img-rival" src="https://imgur.com/WxZ1n4a.png" alt="stone-rival" valor="stone"/>
          </div>
          <div class="container-hand-rival">
            <img class="img-rival" src="https://imgur.com/0KGjK2M.png" alt="paper-rival" valor="paper"/>
          </div>
          <div class="container-hand-rival">
             <img class="img-rival" src="https://imgur.com/Mc7opyX.png" alt="scissor-rival" valor="scissor" />
          </div>
        </div>

        <div class="counter">${this.counter} </div> 
        <div class="container-hands">
          <div class="container-hand">
             <img class="img-owner" src=${imgStone} alt="stone" value="stone"/>
          </div>
          <div class="container-hand">
             <img class="img-owner" src=${imgPaper} alt="paper" value="paper"/>
          </div>
          <div class="container-hand">
             <img class="img-owner" src=${imgScissor} alt="scissor" value="scissor"/>
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
    .img-rival{
      width: 70px;
      height: 150px;
    }
    @media(min-width:600px){
      .img-rival{
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
    img-owner{
      width: 70px;
      height: 150px;
    }
    @media(min-width:600px){
      img-owner{
        width: 90px;
        height: 180px;
      }
    }
    `;

    this.shadow.appendChild(style);

    const imgOwnerEl = this.shadow.querySelectorAll(".img-owner");
    const imgContainerEl = this.shadow.querySelector(".container-hands");
    let choice = false;

    //Elección de mano
    imgOwnerEl.forEach((handChosen) => {
      handChosen.addEventListener("click", () => {
        choice = true;
        const hand = handChosen.getAttribute("value");
        imgOwnerEl.forEach((img) => {
          if (img !== handChosen) {
            (img as HTMLImageElement).style.display = "none";
          }
        });
        console.log("Value:", hand);
        if (hand !== null) {
          currentState.choice = hand;
          state.setState(currentState);
          state.gamePush();
        }
      });
    });

    //Counter
    const counterEl = this.shadow.querySelector(".counter");
    const interval = setInterval(() => {
      if (counterEl) {
        counterEl.textContent = this.counter.toString();
        this.counter--;
        if (this.counter < 0) {
          clearInterval(interval);
          if (!choice) {
            console.log("No elegiste ninguna opción");
            const currentState = state.getState();
            currentState.online = false;
            currentState.start = false;
            state.setState(currentState);
            state.gamePush();
            Router.go("/instructions");
          }
          counterEl.remove();
          this.showRivalChoise();
          //  this.showPlayerWinner();
        }
      }
    }, 1000);
  }

  showRivalChoise() {
    const currentState = state.getState();
    //const hands = []; //tijera,piedra,papel
    const imgRivalEl = this.shadow.querySelectorAll(".img-rival");
    const data = currentState.rtdbData;
    const iteratedData = map(data);

    //nuevo
    const userIdComparation = currentState.userId;
    let rivalChoice = "";

    if (iteratedData[0].userId === userIdComparation) {
      rivalChoice = iteratedData[1].choice;
    } else {
      rivalChoice = iteratedData[0].choice;
    }

    imgRivalEl.forEach((img) => {
      const value = img.getAttribute("value");
      if (value === rivalChoice) {
        (img as HTMLImageElement).style.display = "block";
      } else {
        (img as HTMLImageElement).style.display = "none";
      }
    });
    //aca termina lo nuevo

    //viejo
    /*const userIdComparation = currentState.userId;
    if (userIdComparation === iteratedData[0].userId) {
      const hand = iteratedData[1].choice;

      console.log("Value:", hand);
      imgRivalEl.forEach((img) => {
        const value = img.getAttribute("value");
        if (value == hand) {
          console.log("Valor es:", value);
          console.log("Imagen es:", img);
          (img as HTMLImageElement).style.display = "block";
        }
      });
    } else {
      const hand = iteratedData[0].choice;
      imgRivalEl.forEach((imgItem) => {
        const value = imgItem.getAttribute("valor");
        if (value == hand) {
          console.log("Valor es:", value);
          console.log("Imagen es:", imgItem);
          (imgItem as HTMLImageElement).style.display = "block";
        }
      });
    }*/ // aca termina lo viejo
  }
}

customElements.define("game-comp", Game);
