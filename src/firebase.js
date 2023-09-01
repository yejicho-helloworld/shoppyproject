// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUJiaLn2LXXGSLLTSgdSAfdjj5LJCaTmQ",
  authDomain: "shoppy-c5ef7.firebaseapp.com",
  projectId: "shoppy-c5ef7",
  storageBucket: "shoppy-c5ef7.appspot.com",
  messagingSenderId: "948767016386",
  appId: "1:948767016386:web:af3e3a56ca6b246fbac25b",
  measurementId: "G-L1HY1H9RWL",
  databaseURL:
    "https://shoppy-c5ef7-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// 우리는 firebase의 로직을 사용하지 않을 것이기 때문에 export해줘야함.
export const database = getDatabase(app); // 추가
const productsRef = ref(database, "products"); // "products" 경로의 참조를 가져옵니다.
const snapshot = await get(productsRef); // 데이터를 가져옵니다.
