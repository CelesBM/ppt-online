import { Router } from "@vaadin/router";
import { state } from "../../state";

class Game extends HTMLElement {
  counter = 10;
  //ValueArrays: string[] = [];

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
             <img class="img-rival" src="https://imgur.com/WxZ1n4a.png" alt="stone-rival" value="stone"/>
          </div>
          <div class="container-hand-rival">
            <img class="img-rival" src="https://imgur.com/0KGjK2M.png" alt="paper-rival" value="paper"/>
          </div>
          <div class="container-hand-rival">
             <img class="img-rival" src="https://imgur.com/Mc7opyX.png" alt="scissor-rival" value="scissor" />
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
    .img-owner{
      width: 70px;
      height: 150px;
    }
    @media(min-width:600px){
      .img-owner{
        width: 90px;
        height: 180px;
      }
    }
    `;

    this.shadow.appendChild(style);

    const imgOwnerEl = this.shadow.querySelectorAll(".img-owner");
    const imgContainerEl = this.shadow.querySelector(".container-hands");
    let choice = false;

    //Elección de mano y ocultar las no elegidas:
    imgOwnerEl.forEach((handChosen) => {
      handChosen.addEventListener("click", () => {
        choice = true;
        const hand = handChosen.getAttribute("value");
        imgOwnerEl.forEach((img) => {
          if (img !== handChosen) {
            (img as HTMLImageElement).style.display = "none";
            (imgContainerEl as HTMLElement).style.gap = "0px";
          }
        });
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
          this.showRivalChoice();
        }
      }
    }, 1000);
  }

  showRivalChoice() {
    const currentState = state.getState();
    const imgRivalEl = this.shadow.querySelectorAll(".img-rival");
    const imgRivalContainerEl = this.shadow.querySelector(
      ".container-hands-rival"
    );

    const currentGame = currentState.rtdbData.currentGame;
    const myName = currentState.name;
    let rivalChoice = ""; // Variable para almacenar la elección del rival

    for (const playerName in currentGame) {
      if (Object.hasOwnProperty.call(currentGame, playerName)) {
        const playerData = currentGame[playerName]; //jugador actual y rival
        const playerChoice = playerData.choice; //mi eleccion y la del rival

        //en caso de que el nombre del player no sea el mío:
        if (playerName !== myName) {
          rivalChoice = playerChoice; // Almacena la elección del rival
          console.log("Rival:", playerName, "Elección:", rivalChoice);
        }
      }
    }

    //Visibiliza solo la mano elegida por el rival:
    imgRivalEl.forEach((img) => {
      const hand = img.getAttribute("value");
      if (hand !== rivalChoice) {
        (img as HTMLImageElement).style.display = "none";
        (imgRivalContainerEl as HTMLElement).style.gap = "0px";
      }
    });

    setTimeout(() => {
      this.showPlayerWinner(currentState.choice, rivalChoice);
    }, 2000);
  }

  //Conocer quién ganó la partida:
  showPlayerWinner(playerChoice, rivalChoice) {
    const currentState = state.getState();
    const myName = currentState.name;
    let winner = "";

    //determinar en qué casos gana y pierde y sumar puntos en player1 y player2:
    if (playerChoice === rivalChoice) {
      winner = "tie";
    } else if (
      (playerChoice === "stone" && rivalChoice === "scissor") ||
      (playerChoice === "scissor" && rivalChoice === "paper") ||
      (playerChoice === "paper" && rivalChoice === "stone")
    ) {
      winner = currentState.ownerName;
      if (myName === currentState.ownerName) {
        currentState.player1 += 1;
      } else {
        currentState.player2 += 1;
      }
    } else {
      winner = currentState.rivalName;
      if (myName === currentState.ownerName) {
        currentState.player2 += 1;
      } else {
        currentState.player1 += 1;
      }
    }

    //actualizar el resultado en el currentState:
    currentState.result =
      winner === myName ? "win" : winner === "tie" ? "tie" : "lose";
    state.setState(currentState);

    //enviar resultados al server:
    state.updateRoom();

    //redirigir según resultado de partida:
    setTimeout(() => {
      if (winner === currentState.ownerName) {
        Router.go("/win");
      } else if (winner === currentState.rivalName) {
        Router.go("/lose");
      } else {
        Router.go("/tie");
      }
    }, 2000);
  }
}

customElements.define("game-comp", Game);
