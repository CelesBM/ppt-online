import { Router } from "@vaadin/router";
import { state } from "../../state";

class Signin extends HTMLElement {
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
    <form class="form">
        <div class="container-name">
            <label for="name">Nombre:</label>
            <input type="name" id="name" name="name">
        </div>
        <div class="container-email">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email">
        </div>
        <p class="err">* Debe completar ambos campos para continuar</p>
        <button class="button">Registrarse</button>
    </form>
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
        margin-top: 100px;
    }
    form{
        background-color: #fff;
        box-shadow: 0px 0px 30px 5px rgba(255, 117, 20, 0.7);
        width: 40%;
        border-radius: 4px;
        padding: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        align-items: center;
        gap: 30px;
    }
    div{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        align-items: center;
    }
    label{
        font-family: "Poppins", sans-serif;
        font-weight: bold;
        font-style: normal;
        font-size: 25px;
    }
    input{
        width: 500px;
        height: 50px;
        padding: 0px 20px;
        border-radius: 4px;
        font-family: "Poppins", sans-serif;
        font-weight: 300;
        font-style: normal;
        font-size: 20px;
    }
    .err{
        display: none;
        font-size: 14px;
        color: red;
        font-style: italic;
        margin: 5px 0px;
    }
    button{
        cursor: pointer;
        width: 300px;
        height: 50px;
        border-radius: 4px;
        border-color: #ff7514;
        font-family: "Poppins", sans-serif;
        font-weight: bold;
        font-style: normal;
        font-size: 20px;
        background-color: #ffbb8d;
    }
    `;

    const formEl = this.shadow.querySelector(".form") as HTMLFormElement;
    const emailInput = formEl.querySelector("#email") as HTMLInputElement;
    const nameInput = formEl.querySelector("#name") as HTMLInputElement;
    const buttonEl = this.shadow.querySelector(".button") as HTMLButtonElement;
    const errorEl = this.shadow.querySelector(".err") as HTMLDivElement;

    buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      const email = emailInput.value;
      const name = nameInput.value;
      // Verificar si los campos están vacíos
      if (email.trim() === "" || name.trim() === "") {
        errorEl.style.display = "block";
        return;
      }
      errorEl.style.display = "none"; //en caso que al principio no lo completé, si luego lo completo no sigue apareciendo el .err
      console.log("Nombre:", name, "&&", "Email:", email);
      state.setEmailAndName(email, name);
      state.createNewUser(() => {
        Router.go("option-room");
      });
    });

    this.shadow.appendChild(style);
  }
}

customElements.define("signin-comp", Signin);
