import firebase from 'firebase';  
  

// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDPP_RbbmSXBJZsD-3fxGsjmEAn6PmSrIs",
    authDomain: "inventory-b0db7.firebaseapp.com",
    databaseURL: "https://inventory-b0db7.firebaseio.com",
    projectId: "inventory-b0db7",
    storageBucket: "inventory-b0db7.appspot.com",
    messagingSenderId: "431885282403",
    appId: "1:431885282403:web:31006ccc734fe83ae15c56"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var storage = firebase.storage();

export default firebase;


