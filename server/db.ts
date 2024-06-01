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
  databaseURL: "https://ppt-online-4275c-default-rtdb.firebaseio.com", // URL base de datos rtdb
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
