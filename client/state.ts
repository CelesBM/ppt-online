import { database } from "firebase-admin";

const API_BASE_URL = "http://localhost:3002";

const state = {
  data: {
    email: "",
    name: "",
    userId: "",
    messageError: "",
    roomId: "",
    ownerName: "",
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
