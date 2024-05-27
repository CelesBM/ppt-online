// VINCULANDO MI FIRESTORE DATABASE

import * as admin from "firebase-admin";
import * as path from "path"; //módulo path de Node.js para trabajar con rutas de archivos y directorios

//accedo a mi key:
const serviceAccount = require(path.resolve(
  __dirname,
  "serviceAccountKey.json"
));
// __dirname es la ruta del directorio actual, path.resolve() lo concatena con la key para formar la ruta absoluta al archivo serviceAccountKey.json = así me lee la key.

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// console.log(db); hasta acá sigue funcionando

const usersCollection = db.collection("users");

//obtener mis documentos de la collection users:

usersCollection
  .get()
  .then((snap) => {
    snap.forEach((doc) => {
      console.log(doc.id, ":", doc.data()); //esto devuelve: user (id columna 2) : {nombre: "prueba1", email: prueba1@gmail.com}
    });
  })
  .catch((error) => {
    console.log("Error:", error);
  });
