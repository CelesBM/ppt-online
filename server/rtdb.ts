import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import * as dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: "5pFzdfw1vrIgj8mR8Ywh8XdGF2OQUVFofOFWQFb7",
  databaseURL: "https://ppt-online-4275c-default-rtdb.firebaseio.com",
  authDomain: "ppt-online.firebaseapp.com",
  projectId: "ppt-online-4275c",
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);

export { rtdb };
