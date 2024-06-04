import { Router } from "@vaadin/router";
import { state } from "../../state";
import map from "lodash/map";

class Instructions extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.playerRol();
  }

  playerRol() {
    state.dataRolPlayers(() => {
      const currentState = state.getState();
      const data = currentState.rtdbData;

      // Verificar si hay datos antes de intentar acceder a ellos
      if (data && Object.keys(data).length > 0) {
        const iteratedData = map(data);
        console.log("iteratedData es:", iteratedData[0]);

        if (currentState.ownerName !== iteratedData[1].name) {
          currentState.rivalName = iteratedData[1].name;
          currentState.rivalName =
            currentState.rivalName !== undefined ? currentState.rivalName : "";
        } else {
          currentState.rivalName = iteratedData[0].name;
        }
      } else {
        console.log("No hay datos disponibles aún.");
      }
      this.render();
    });
  }

  render() {
    const currentState = state.getState();
    this.shadow.innerHTML = `   
    <section>
        <div class="info-room-container">
            <div class="players-container">
                <p class="player1-name">Jugador 1: ${currentState.ownerName}</p>
                <p class="player2-name">Jugador 2: ${
                  currentState.rivalName !== currentState.ownerName
                    ? currentState.rivalName
                    : ""
                }</p>
            </div>
            <div class="roomId-container">
                <p class="roomId-code">Sala: ${currentState.roomId}</p>
            </div>
        </div>
        <div class="instructions-container">
            <p class="instructions">Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 5 segundos.</p>
        </div>
        <div class="button-container">
            <button class="button">Jugar</button>
        </div>
        <div class="wait-online">Esperando que el rival presione "Jugar"</div>
    </section>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
    section{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        gap: 40px;
    }
    @media(min-width:1020px){
        section{
          gap: 10px;
        }
      }
    .info-room-container{
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-content: center;
        align-items: flex-start;    
    }
    .instructions-container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        align-items: center; 
    }
    p{
        font-family: "Poppins", sans-serif;
        font-style: normal;  
        font-size: 14px; 
        background-color: #ffbb8d;   
        text-align: center;    
        padding: 5px 10px;
    }
    @media(min-width:500px){
      p{
        font-size: 16px; 
      }
    }
    @media(min-width:700px){
      p{
        font-size: 18px; 
      }
    }
    @media(min-width:1020px){
        p{
          font-size: 20px; 
        }
      }
    .instructions{
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
        .instructions{
          font-size: 22px; 
          width: 250px;
          padding: 30px 70px;
        }
      }
      @media(min-width:700px){
        .instructions{
          font-size: 26px; 
          width: 350px;
          padding: 50px 90px;
        }
      }
      @media(min-width:1020px){
        .instructions{
            font-size: 32px; 
            line-height: 40px;
            width: 500px;
            padding: 50px 90px;
          }
      }
    .button-container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        align-items: center; 
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
    .wait-online{
      display: none;
      color: red;
      font-size: 12px;
      text-align: center;
    }
    `;

    const buttonEl = this.shadow.querySelector(".button") as HTMLButtonElement;
    const onlineEl = this.querySelector(".wait-online") as HTMLDivElement;

    buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      onlineEl.style.display = "block";
      const currenState = state.getState();
      currenState.online = true;
      currenState.start = true;
      state.setState(currenState);
      state.gamePush();
      state.dataRolPlayers(() => {
        const currentState = state.getState();
        const data = currentState.rtdbData;
        const iteratedData = map(data);
        if (iteratedData[0].start === true && iteratedData[1].start === true) {
          console.log("FUNCIONA EL ONLINE Y START");
          //onlineEl.remove();
          //Router.go("/game");
        } else {
          console.log("NO FUNCIONA EL ONLINE Y START");
        }
      });
    });

    this.shadow.appendChild(style);
  }
}

customElements.define("instructions-comp", Instructions);
