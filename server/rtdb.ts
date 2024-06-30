import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import * as dotenv from "dotenv";

dotenv.config();
//console.log("DATABASE_URL from dotenv:", process.env.DATABASE_URL);
//console.log("APIKEY from dotenv:", process.env.APIKEY);
//console.log(process.env.SERVICEACCOUNT_KEY);
//console.log(JSON.parse(process.env.SERVICEACCOUNT_KEY));

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  databaseURL: process.env.DATABASE_URL,
  authDomain: "ppt-online.firebaseapp.com",
  projectId: "ppt-online-4275c",
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
export { rtdb };
