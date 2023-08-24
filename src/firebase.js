// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATX-n4JezwNMr6rUYjXcBDGtXsjTUxn4g",
  authDomain: "shoppy-project-9d39a.firebaseapp.com",
  projectId: "shoppy-project-9d39a",
  storageBucket: "shoppy-project-9d39a.appspot.com",
  messagingSenderId: "912560494934",
  appId: "1:912560494934:web:39c5ab5d5939ce645d1ef7",
  measurementId: "G-6Q2K1P17X9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// 우리는 firebase의 로직을 사용하지 않을 것이기 때문에 export해줘야함. 