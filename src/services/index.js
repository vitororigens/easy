import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC46rSoV690wdoLz43CWiKj7O585p7y8a0",
  authDomain: "easy-85791.firebaseapp.com",
  projectId: "easy-85791",
  storageBucket: "easy-85791.appspot.com",
  messagingSenderId: "1072840275905",
  appId: "1:1072840275905:web:db0c0f9e38a501fb3be140",
  measurementId: "G-NYJLWC4ZQE"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); 
}

export const authFirebase = firebase.auth();
export const database = firebase.firestore();
export const storage = firebase.storage();
