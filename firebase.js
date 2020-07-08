import firebase from 'firebase';  
  

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCbYaElkN8cy5-0gAmxFRgt7fQ5lwXSdlc",
  authDomain: "mystock-davelop.firebaseapp.com",
  databaseURL: "https://mystock-davelop.firebaseio.com",
  projectId: "mystock-davelop",
  storageBucket: "mystock-davelop.appspot.com",
  messagingSenderId: "191945947985",
  appId: "1:191945947985:web:543d07b1ade374f9eef170",
  measurementId: "G-G1TEW8V30W"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();


//var storage = firebase.storage();

export default firebase;


