import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import { firestore, rtdb } from "./db";
import { v4 as uuidv4 } from "uuid";

const PORT = 3005;
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
              rivalName: "", // Inicialmente no hay rival
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

//Endpoint para unirse a una sala existente.
app.post("/joinRoom", (req, res) => {
  const userId = req.body.userId;
  const roomId = req.body.roomId;
  const roomName = "currentGame";

  userCollection
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data(); //Aca tengo los datos del usuario
        const userDataName = userData.name; //nombre del user

        roomCollection
          .doc(roomId)
          .get()
          .then((roomSnap) => {
            if (roomSnap.exists) {
              const roomData = roomSnap.data();
              if (
                roomData.rival === "" &&
                roomData.ownerName !== userDataName
              ) {
                roomCollection
                  .doc(roomId)
                  .update({
                    rival: userId,
                    rivalName: userData.name,
                  })
                  .then(() => {
                    res.json({ message: "Rival asociado correctamente" });
                  })
                  .catch((error) => {
                    console.error("Error al unirse como rival:", error);
                    res
                      .status(500)
                      .json({ message: "Error interno del servidor" });
                  });
              } else {
                res.status(400).json({ message: "La sala ya está llena" });
              }
            } else {
              res.status(401).json({
                message: "No existe la sala",
              });
            }
          });
      } else {
        res.status(401).json({
          message: "No existe la data del usuario",
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
                //roomData.name = userData.name; //ver lo saque recien
                roomData.player1 = userData.name;
                roomData.player2 = roomData.rivalName;
                // Verificar si el usuario es el propietario de la sala
                if (userData.name !== roomData.ownerName) {
                  roomData.rivalName = userData.name;
                  roomCollection
                    .doc(roomId)
                    .update({ rivalName: userData.name });
                }
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

app.post("/game", (req, res) => {
  const userId = req.body.userId;
  const realtimeId = req.body.realtimeId;
  const name = req.body.name;
  const roomName = "currentGame";
  const { online, start, choice } = req.body;

  const roomRef = rtdb.ref("rooms/" + realtimeId + "/" + roomName);
  roomRef
    .update({
      [name + "/online"]: online,
      [name + "/start"]: start,
      [name + "/choice"]: choice,
    }) // Actualiza el estado online para el usuario específico
    .then(() => {
      res.json("ok");
    })
    .catch((error) => {
      console.error("Error al actualizar estado online:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    });
});

// En este endpoint vamos a actualizar la data de firestore con la data que le pasamos por el front,
// para ir pusheando los resultados, ejemplo:{player1: 0+1, player2:0}
// Endpoint para actualizar los resultados de la sala
app.post("/updateResults/:roomId", (req, res) => {
  const userId = req.query.userId;
  const roomId = req.params.roomId;
  const results = req.body.results;

  if (userId && roomId && results) {
    userCollection
      .doc(userId.toString())
      .get()
      .then((doc) => {
        if (doc.exists) {
          roomCollection
            .doc(roomId.toString())
            .update({
              results: results,
            })
            .then(() => {
              res.json("Resultados actualizados correctamente");
            })
            .catch((error) => {
              console.error("Error al actualizar resultados:", error);
              res.status(500).json({ message: "Error interno del servidor" });
            });
        } else {
          res.status(401).json({ message: "Usuario no encontrado" });
        }
      })
      .catch((error) => {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
      });
  } else {
    res.status(400).json({ message: "Parámetros incompletos" });
  }
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`);
});
