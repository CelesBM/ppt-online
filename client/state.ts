import { database } from "firebase-admin";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../server/rtdb";

const API_BASE_URL = "http://localhost:3002";

const state = {
  data: {
    rtdbData: {},
    email: "",
    name: "",
    userId: "",
    messageError: "",
    roomId: "",
    ownerName: "",
    rivalName: "",
    rtdbId: "",
    player1: 0,
    player2: 0,
    result: "",
    choice: "",
    online: "",
    start: "",
  },

  listeners: [], //array de funciones

  getState() {
    return this.data;
    //última version del estado
  },

  //Guardar el nombre y mail
  setEmailAndName(email: string, name: string) {
    const currentState = this.getState();
    currentState.email = email;
    currentState.name = name;
    this.setState(currentState);
  },

  //Crear un usuario nuevo
  createNewUser(callback) {
    const currentState = this.getState();
    if (currentState.email) {
      fetch(API_BASE_URL + "/signin", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: currentState.email,
          name: currentState.name,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("data:", data), (currentState.userId = data.id);
          this.setState(currentState);
          callback ? callback() : false;
        })
        .catch((err) => console.log(err));
    }
  },

  //Validar usuario existente
  login(callback) {
    const currentState = this.getState();
    if (currentState.email) {
      fetch(API_BASE_URL + "/login", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: currentState.email,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("data:", data);
          currentState.userId = data.userId;
          this.setState(currentState);
          callback ? callback() : false;
        })
        .catch((err) => console.log(err));
    }
  },

  //Crear una nueva sala
  createNewRoom(callback?) {
    const currentState = this.getState();
    if (currentState.userId) {
      fetch(API_BASE_URL + "/createRoom", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId: currentState.userId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (callback) {
            currentState.roomId = data.roomId;
            currentState.ownerName = data.ownerName;
            this.setState(currentState);
            callback();
          }
        });
    } else {
      console.log("UserId no existe");
    }
  },

  //Acceder a una sala existente
  getRoom(callback?) {
    const currenState = this.getState();
    const room = currenState.roomId;
    fetch(API_BASE_URL + "/rooms/" + room + "?userId=" + currenState.userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (callback) {
          if (data.message === undefined || "") {
            currenState.rtdbId = data.rtdbId;
            currenState.ownerName = data.ownerName;
            currenState.rivalName = data.rivalName;
            currenState.player1 = data.results.player1;
            currenState.player2 = data.results.player2;
            console.log("Data sala getRoom:", data);
            this.setState(currenState);
          } else {
            currenState.messageError = data.message;
            console.log("Data error getRoom", data.message);
            this.setState(currenState);
          }
          callback();
        }
      });
  },

  //Enviar juego
  gamePush() {
    const currentState = this.getState();
    const currentName = this.data.name;
    fetch(API_BASE_URL + "/game", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: currentState.userId,
        realtimeId: currentState.rtdbId,
        result: currentState.result,
        choice: currentState.choice,
        name: currentName,
        online: currentState.online,
        start: currentState.start,
      }),
    });
  },

  dataRolPlayers(callback) {
    const currenState = this.getState();
    const roomRef = ref(rtdb, "rooms/" + currenState.rtdbId + "currentGame");
    onValue(roomRef, (snapshot) => {
      if (callback) {
        const value = snapshot.val();
        currenState.rtdbData = value;
        this.setState(currenState);
        callback();
      }
    });
  },

  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
    //cuando algún componente cambia el estado
  },

  setState(newState) {
    this.data = newState;
    for (const callback of this.listeners) {
      callback();
    }
    console.log("Soy el state y he cambiado:", this.data);
  },
};

export { state };
