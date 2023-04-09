// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { useEffect, useState } from "react";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3mY1m2lwZv7bL9QRlarEHE0wMP8h0jKo",
  authDomain: "spdacoba.firebaseapp.com",
  databaseURL: "https://spdacoba-default-rtdb.firebaseio.com",
  projectId: "spdacoba",
  storageBucket: "spdacoba.appspot.com",
  messagingSenderId: "347301128595",
  appId: "1:347301128595:web:702690a63bae917d1e2066",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebase;

// export const getData = async () => {
//   const dataRef = firebase.database().ref("Daftar");
//   const snapshot = await dataRef.on("value");
//   const data = snapshot.val();
//   console.log(data, "data fb geData");
//   return data;
// };

export const getData = () => {
  return new Promise((resolve, reject) => {
    const dataRef = firebase.database().ref("Daftar");
    dataRef.on(
      "value",
      (snapshot) => {
        const data = snapshot.val();
        console.log(data, "data from firebase in function geData");
        resolve(data);
      },
      (error) => {
        console.log(error);
        reject(error);
      }
    );
  });
};
