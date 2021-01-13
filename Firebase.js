import firebase from "firebase";import firestore from 'firebase/firestore'

const settings = {};

const config = {
  apiKey: "AIzaSyAmIQdENE8ufB2Ai89jEQ1Fc5zZ-rIXO2c",
  authDomain: "meditationapp-840c3.firebaseapp.com",
  databaseURL: "https://meditationapp-840c3.firebaseio.com",
  projectId: "meditationapp-840c3",
  storageBucket: "meditationapp-840c3.appspot.com",
  messagingSenderId: "1006085563410",
};

firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;


