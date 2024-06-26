import { Router } from "@vaadin/router";
import { state } from "../../state";

class Login extends HTMLElement {
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
            <button class="button">Iniciar sesión</button>
           <p class="err-user">Usuario no registrado</p>
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
        width: 50%;
        border-radius: 4px;
        padding: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        align-items: center;
        gap: 30px;
    }
    @media(min-width: 600px){
      form{
        width: 60%;
      }
    }
    @media(min-width: 1020px){
      form{
        gap: 50px;
      }
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
        font-size: 20px;
    }
    @media(min-width: 720px){
      label{
        font-size: 25px;
      }
    }
    input{
        width: 170px;
        height: 30px;
        padding: 0px 20px;
        border-radius: 4px;
        font-family: "Poppins", sans-serif;
        font-weight: 300;
        font-style: normal;
        font-size: 15px;
    }
    @media(min-width: 600px){
      input{
        width: 250px;
        height: 35px;
      }
    }
    @media(min-width: 1020px){
      input{
        width: 600px;
        height: 50px;
      }
    }
    .err{
        display: none;
        font-size: 14px;
        color: red;
        font-style: italic;
        margin: 5px 0px;
    }
    .err-user{
        display: none;
        font-size: 15px;
        color: red;
        margin: 5px 0px;
    }
    button{
        cursor: pointer;
        width: 180px;
        height: 40px;
        border-radius: 4px;
        border-color: #ff7514;
        font-family: "Poppins", sans-serif;
        font-weight: bold;
        font-style: normal;
        font-size: 17px;
        background-color: #ffbb8d;
    }
    @media(min-width: 600px){
      button{
        width: 250px;
        height: 45px;
      }
    }
    @media(min-width: 720px){
      button{
        width: 300px;
        height: 50px;       
        font-size: 20px;
      }
    }
    `;

    const formEl = this.shadow.querySelector(".form") as HTMLFormElement;
    const emailInput = formEl.querySelector("#email") as HTMLInputElement;
    const nameInput = formEl.querySelector("#name") as HTMLInputElement;
    const buttonEl = this.shadow.querySelector(".button") as HTMLButtonElement;
    const errorEl = this.shadow.querySelector(".err") as HTMLDivElement;
    const errorUserEl = this.shadow.querySelector(
      ".err-user"
    ) as HTMLDivElement;

    buttonEl.addEventListener("click", (e) => {
      e.preventDefault();

      //valores ingresados en los input:
      const email = emailInput.value;
      const name = nameInput.value;

      //verificar si los campos están vacíos:
      if (email.trim() === "" || name.trim() === "") {
        errorEl.style.display = "block";
        return;
      }

      //ocultar mensaje de error si estaba visible y lo arreglé:
      errorEl.style.display = "none";
      errorUserEl.style.display = "none";

      //guardo datos en state y base de datos:
      state.setEmailAndName(email, name);
      state.login((error) => {
        if (error) {
          if (error === "User no existe") {
            errorUserEl.style.display = "block";
          } else {
            alert("Error: " + error);
          }
        } else {
          Router.go("option-room");
        }
      });
    });
    this.shadow.appendChild(style);
  }
}

customElements.define("login-comp", Login);
