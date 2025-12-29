import { initializeApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCeED98XGY7jY2toUo9NBR0X4q2rn1Kb5g",
    authDomain: "hamsync-7e6db.firebaseapp.com",
    projectId: "hamsync-7e6db",
    storageBucket: "hamsync-7e6db.firebasestorage.app",
    messagingSenderId: "929882137454",
    appId: "1:929882137454:web:4f0d524cd56d384ffb977f",
    measurementId: "G-T0DWN6ZC2E"
};

const app = initializeApp(firebaseConfig);

// Platform-aware persistence
const persistence = Platform.OS === 'web'
    ? browserLocalPersistence
    : getReactNativePersistence(ReactNativeAsyncStorage);

export const auth = initializeAuth(app, {
    persistence
});
export const db = getFirestore(app);
export const storage = getStorage(app);
