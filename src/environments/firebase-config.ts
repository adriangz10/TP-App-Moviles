import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyDIVuFFfcPjPfyk8WVzDK3mpN7cBzI1S9k",
  authDomain: "envios-expres.firebaseapp.com",
  // databaseURL:"https://firestore.googleapis.com/v1/projects/paqueteria-express-c6480/databases/(default)/documents/",
  projectId: "envios-expres",
  storageBucket: "envios-expres.appspot.com",
  messagingSenderId: "376126228693",
  appId: "1:376126228693:android:14027b6ae9166079317a5c"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);