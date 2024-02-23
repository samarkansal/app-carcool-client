import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzWkOUjOT1JSEaE2PnB44WGtTVI9AhDVE",
  authDomain: "carcool-6643d.firebaseapp.com",
  projectId: "carcool-6643d",
  storageBucket: "carcool-6643d.appspot.com",
  messagingSenderId: "408947238864",
  appId: "1:408947238864:web:0ac80491f765809a0abbd5",
  measurementId: "G-8WRJHHDWED",
};
const app = firebase.initializeApp(firebaseConfig);

// const app = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// })

export const auth = app.auth();
export default app;
