import { database } from "firebase-admin";

const API_BASE_URL = "http://localhost:3002";

const state = {
  data: {
    email: "",
    name: "",
    userId: "",
    messageError: "",
  },

  listeners: [], //array de funciones

  getState() {
    return this.data;
    //última version del estado
  },

  setEmailAndName(email: string, name: string) {
    const currentState = this.getState();
    currentState.email = email;
    currentState.name = name;
    this.setState(currentState);
  },

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
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (callback) {
            if (data.message === undefined || "") {
              currentState.userId = data.id;
              console.log("Login:", data);
              this.setState(currentState);
            } else {
              console.log("Error:", data.message);
              currentState.messageError = data.message;
              this.setState(currentState);
            }
            callback();
          }
        });
    } else {
      console.log("Este usuario no existe en la base de datos");
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
