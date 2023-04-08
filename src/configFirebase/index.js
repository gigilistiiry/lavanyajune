import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

function StartFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyBoyIAjbShKisCtBxzqgyGEg-HZWf0xs1s",
    authDomain: "operasi-7f49a.firebaseapp.com",
    databaseURL: "https://operasi-7f49a-default-rtdb.firebaseio.com",
    projectId: "operasi-7f49a",
    storageBucket: "operasi-7f49a.appspot.com",
    messagingSenderId: "373800333492",
    appId: "1:373800333492:web:2b741f78d6e8e1ab38a7e1"
  };

  const app = initializeApp(firebaseConfig);
  return getDatabase(app);
}

export default StartFirebase;
