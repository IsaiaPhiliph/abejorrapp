import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPtCa5yp-w9hzX54lwhwOSyn9bYDBzBKY",
  authDomain: "abejorrapp.firebaseapp.com",
  projectId: "abejorrapp",
  storageBucket: "abejorrapp.appspot.com",
  messagingSenderId: "694121435653",
  appId: "1:694121435653:web:000ec8a07c22b48b74026c",
  measurementId: "G-DS2P87GX2D",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };
export default firebaseApp;
