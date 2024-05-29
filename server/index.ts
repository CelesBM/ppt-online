import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import { firestore } from "./db";
import { messaging } from "firebase-admin";

const PORT = 3002;
const app = express();
app.use(express.json());
app.use(cors());

const userCollection = firestore.collection("users");

//Endpoint para registrar nuevos usuarios. Devuelve el id del nuevo user.

app.post("/signin", (req, res) => {
  const email = req.body.email;
  const name = req.body.name;

  if (!name) {
    res.status(400).json({ message: "El nombre es obligatorio" });
    return;
  }

  userCollection
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        userCollection
          .add({ email, name })
          .then((data) => {
            res.json({ id: data.id });
          })
          .catch((error) => {
            console.error("Error al agregar usuario:", error);
            res.status(500).json({ message: "Error interno del servidor" });
          });
      } else {
        res.status(200).json({ id: searchResponse.docs[0].id });
      }
    })
    .catch((error) => {
      console.error("Error al buscar usuario:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    });
});

//Endpoint para iniciar sesión con usuario ya creado.
app.post("/login", (req, res) => {
  const email = req.body.email;
  userCollection
    .where("email", "==", email)
    .get()
    .then((response) => {
      if (response.empty) {
        res.status(404).json({
          message: "User no existe",
        });
      } else {
        res.json({ userId: response.docs[0].id });
      }
    });
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`);
});
