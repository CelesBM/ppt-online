import { ref, onValue } from "firebase/database";
import { rtdb } from "../server/rtdb";

const API_BASE_URL = "https://ppt-online-qs4b.onrender.com/";

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

  //Crear nuevo usuario
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
          if (!res.ok) {
            return res.json().then((data) => {
              throw new Error(data.message);
            });
          }
          return res.json();
        })
        .then((data) => {
          currentState.userId = data.id;
          currentState.messageError = "";
          this.setState(currentState);
          callback ? callback() : false;
        })
        .catch((err) => {
          currentState.messageError = err.message;
          this.setState(currentState);
          if (err.message === "El mail ya existe") {
            // Mostrar mensaje de usuario existente
            callback ? callback(err.message) : false;
          } else {
            callback ? callback(err.message) : false;
          }
        });
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
          if (!res.ok) {
            return res.json().then((data) => {
              throw new Error(data.message);
            });
          }
          return res.json();
        })
        .then((data) => {
          console.log("data:", data);
          currentState.userId = data.userId;
          currentState.messageError = "";
          this.setState(currentState);
          callback ? callback() : false;
        })
        .catch((err) => {
          currentState.messageError = err.message;
          this.setState(currentState);
          if (err.message === "User no existe") {
            // Mostrar mensaje de usuario no existente
            callback ? callback(err.message) : false;
          } else {
            callback ? callback(err.message) : false;
          }
        });
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

  //Leer rtdb
  listenRoom() {
    const currentState = this.getState();
    const roomRef = ref(rtdb, "/rooms/" + currentState.rtdbId);
    onValue(roomRef, (snapShot) => {
      const data = snapShot.val();
      currentState.rtdbData = data;
      console.log("State desde el listen room", currentState);
      state.setState(currentState);
    });
  },

  //VER SI LO NECESITO.
  /* joinRoom(roomId) {
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
  },*/

  //Acceder a una sala existente
  getRoom(callback?) {
    const currentState = this.getState();
    const room = currentState.roomId;
    fetch(API_BASE_URL + "/rooms/" + room + "?userId=" + currentState.userId, {
      method: "get",
      headers: { "content-type": "application/json" },
    })
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
            this.listenRoom();
          } else {
            currentState.messageError = data.message;
            console.log("Data error getRoom", data.message);
            this.setState(currentState);
          }
          callback();
        }
      });
  },

  //Player online y start, ver choice del jugador
  playerOnline() {
    const currentState = this.getState();
    currentState.online = true;
    currentState.start = true;
    currentState.choice = "";
    fetch(API_BASE_URL + "/game", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        online: currentState.online,
        start: currentState.start,
        choice: currentState.choice,
      }),
    }).then((res) => {
      return res.json();
    });
  },

  //Actualizo room con la partida jugada y los resultados
  updateRoom() {
    const currentState = this.getState();
    const roomId = currentState.roomId;

    fetch(
      API_BASE_URL +
        "/updateResults/" +
        roomId +
        "?userId=" +
        currentState.userId,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          results: {
            player1: currentState.player1,
            player2: currentState.player2,
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Resultados actualizados en el servidor:", data);
      })
      .catch((error) => {
        console.error("Error al actualizar resultados:", error);
      });
  },

  //Actualizo partida
  gamePush() {
    const currentState = this.getState();
    const currentName = currentState.name;
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
        rivalName: currentState.rivalName,
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
    console.log("Soy el setState:", this.data);
  },
};

export { state };
