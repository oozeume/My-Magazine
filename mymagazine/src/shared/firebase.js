import firebase from "firebase/app";
import "firebase/auth"; // 여기에 유저 정보 담았고
import "firebase/firestore"; // 여기에 포스트를 담았고
import "firebase/storage"; // 여기에 이미지를 담았어

const firebaseConfig = {
    apiKey: "AIzaSyCWnIsDVRaGG321Sl58MbohQ1ERO0s9TN4",
    authDomain: "my-magazine-4af16.firebaseapp.com",
    projectId: "my-magazine-4af16",
    storageBucket: "my-magazine-4af16.appspot.com",
    messagingSenderId: "397235895049",
    appId: "1:397235895049:web:747fd37944502b8eb3f1d8",
    measurementId: "G-LGX56YE38R"
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, apiKey, firestore, storage };