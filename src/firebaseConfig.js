import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


let firebaseConfig = {
    apiKey: "AIzaSyAT9ywnspjDSSt4zghfHNnYuBrwmUjIV9o",
    authDomain: "listshare-a3375.firebaseapp.com",
    databaseURL: "https://listshare-a3375.firebaseio.com",
    projectId: "listshare-a3375",
    storageBucket: "listshare-a3375.appspot.com",
    messagingSenderId: "219850576286",
    appId: "1:219850576286:web:a9e981c34c23aa9b87c68f",
    measurementId: "G-7ZS1NYNTRL"
};

firebase.initializeApp(firebaseConfig);
export let db = firebase.firestore();
export let auth = firebase.auth();


if (location.hostname === 'localhost') {
    db.settings({
        host: 'localhost:8080',
        ssl: false
    })
}
