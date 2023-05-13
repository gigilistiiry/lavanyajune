import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

function StartFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyCalYbmu4E9JAtEEblrUVuHowQ_na2QBG4",
    authDomain: "operasi-2d00c.firebaseapp.com",
    projectId: "operasi-2d00c",
    storageBucket: "operasi-2d00c.appspot.com",
    messagingSenderId: "746590100080",
    appId: "1:746590100080:web:8e1a6ef1efd2bf54cd72b5"
  };

  const app = initializeApp(firebaseConfig);
  return getDatabase(app);
}

export default StartFirebase;
