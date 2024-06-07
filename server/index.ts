import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import { firestore, rtdb } from "./db";
import { v4 as uuidv4 } from "uuid";

const PORT = 3002;
const app = express();
app.use(express.json());
app.use(cors());

const userCollection = firestore.collection("users");
const roomCollection = firestore.collection("rooms");

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
      if (!searchResponse.empty) {
        res.status(400).json({ message: "El mail ya existe" });
        return;
      }
    });

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

//Endpoint para generar una nueva sala.
app.post("/createRoom", (req, res) => {
  const userId = req.body.userId;
  const roomName = "currentGame";

  userCollection
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const longId = uuidv4();
        const roomRef = rtdb.ref("/rooms" + longId + "/" + roomName);
        roomRef.set({ owner: userId }).then(() => {
          const shortId = 1000 + Math.floor(Math.random() * 999);
          roomCollection
            .doc(shortId.toString())
            .set({
              rtdbId: longId,
              ownerName: userData.name,
              results: {
                player1: 0,
                player2: 0,
              },
            })
            .then(() => {
              res.json({
                roomId: shortId,
                ownerName: userData.name,
              });
            });
        });
      }
    });
});

//Endpoint para obtener sala por id.
app.get("/rooms/:roomId", (req, res) => {
  const userId = req.query.userId;
  const roomId = req.params.roomId;

  if (userId !== undefined) {
    userCollection
      .doc(userId.toString())
      .get()
      .then((doc) => {
        if (doc.exists) {
          roomCollection
            .doc(roomId)
            .get()
            .then((snap) => {
              if (snap.exists) {
                const roomData = snap.data();
                const userData = doc.data();
                roomData.name = userData.name;
                res.json(roomData);
              } else {
                res.status(401).json({
                  message: "No existe la sala",
                });
              }
            });
        } else {
          res.status(401).json({
            message: "No existe la data del user",
          });
        }
      });
  }
});

//Endpoint para pushear jugada.
/*app.post("/game", (req, res) => {
  const userId = req.body.userId;
  const realtimeId = req.body.realtimeId;
  const roomName = "currentGame";
  const roomRef = rtdb.ref("rooms/" + realtimeId + "/" + roomName);
  roomRef.once("value").then((snapshot) => {
    roomRef
      .child(userId)
      .transaction((data) => {
        if (snapshot.numChildren() >= 3) {
          return data ? { ...data, ...req.body } : data;
        } else {
          return data || req.body;
        }
      })
      .then(() => {
        res.json("ok");
      });
  });
});
*/

app.post("/game", (req, res) => {
  const userId = req.body.userId;
  const realtimeId = req.body.realtimeId;
  const roomName = "currentGame";
  const { online, start } = req.body;

  const roomRef = rtdb.ref("rooms/" + realtimeId + "/" + roomName);
  roomRef
    .update({ [userId + "/online"]: online, [userId + "/start"]: start }) // Actualiza el estado online para el usuario específico
    .then(() => {
      res.json("ok");
    })
    .catch((error) => {
      console.error("Error al actualizar estado online:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    });
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`);
});
