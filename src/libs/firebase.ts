// firebaseConfig.ts
import { initializeApp, getApps } from '@react-native-firebase/app';
import { getFirestore } from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDvcROqjqQw-T0BjBuenLyGaERB0rxKRsg',
  authDomain: 'easy-85791.firebaseapp.com',
  projectId: 'easy-85791',
  storageBucket: 'easy-85791.appspot.com',
  messagingSenderId: '1072840275905',
  appId: '1:1072840275905:web:db0c0f9e38a501fb3be140',
  measurementId: 'G-NYJLWC4ZQE',
};

// Inicializa só se ainda não foi
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

export const database = getFirestore();
export const storage = getStorage();
