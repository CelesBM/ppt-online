import { ref, onValue } from "firebase/database";
import { rtdb } from "../server/rtdb";
//import { Router } from "@vaadin/router";

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
    playersReady: 0,
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
            this.listenRoom();
            callback();
          }
        });
    } else {
      console.log("UserId no existe");
    }
  },

  listenRoom() {
    const currentState = this.getState();
    const roomRef = ref(rtdb, "/rooms/" + currentState.rtdbId);
    onValue(roomRef, (snapShot) => {
      const data = snapShot.val();
      currentState.rtdbData = data[currentState.rtdbId];
      console.log("State desde el listen room", currentState);
      state.setState(currentState);
    });
  },

  //Asociar rival
  joinRoom(roomId) {
    const currentState = this.getState();
    const userId = currentState.userId;

    if (!userId) {
      console.log("User ID no existe");
      return;
    }

    fetch(API_BASE_URL + "/joinRoom", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        roomId: roomId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("Data de joinRoom:", data);
        if (data.message === "Rival asociado correctamente") {
          // Actualizar el estado con el nombre del rival
          currentState.rivalName = currentState.name;
          this.setState(currentState);
        }
      })
      .catch((error) => {
        console.error("Error al unirse como rival:", error);
      });
  },

  //Acceder a una sala existente
  getRoom(callback?) {
    const currentState = this.getState();
    const room = currentState.roomId;
    fetch(API_BASE_URL + "/rooms/" + room + "?userId=" + currentState.userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (callback) {
          if (data.message === undefined || "") {
            currentState.rtdbId = data.rtdbId;
            currentState.ownerName = data.ownerName;
            currentState.player1 = data.results.player1;
            currentState.player2 = data.results.player2;
            if (
              data.rivalName === "" &&
              currentState.name !== currentState.ownerName
            ) {
              currentState.rivalName = currentState.name;
            } else if (data.rivalName !== "") {
              currentState.rivalName = data.rivalName;
            }
            console.log("Data sala getRoom:", data);
            this.setState(currentState);
          } else {
            currentState.messageError = data.message;
            console.log("Data error getRoom", data.message);
            this.setState(currentState);
          }
          callback();
        }
      });
  },

  playerOnline() {
    const currentState = this.getState();
    currentState.online = true;
    currentState.start = true;
    fetch(API_BASE_URL + "/game", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        online: currentState.online,
        start: currentState.start,
      }),
    });
  },

  gamePush() {
    const currentState = this.getState();
    const currentName = currentState.name;
    //currentState.online = true;
    //currentState.start = true;
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
        rivalName: currentState.rivalName, // Enviar el nombre del rival al servidor
        online: currentState.online,
        start: currentState.start,
      }),
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
