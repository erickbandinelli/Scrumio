import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SUA_AUTH_DOMAIN",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SUA_PROJECT_ID",
  storageBucket: "SUA_BUCKET",
  messagingSenderId: "SENDER_ID",
  appId: "SUA_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
