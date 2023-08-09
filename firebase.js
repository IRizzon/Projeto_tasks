//Firebase Config

const firebaseConfig = {
    apiKey: "AIzaSyC5bLS-CwubxiAjtNJyfMxJW8mh0NPljKU",
    authDomain: "banco-de-dados-task.firebaseapp.com",
    projectId: "banco-de-dados-task",
    storageBucket: "banco-de-dados-task.appspot.com",
    messagingSenderId: "375470175521",
    appId: "1:375470175521:web:246ac30b9e011656597a60",
    measurementId: "G-VLFR0NH5TM"
  };

  firebase.initializeApp(firebaseConfig);

  //----------------------------------\\

  const login = document.querySelector("#login")
  const email = document.querySelector("#email")
  const password = document.querySelector("#password")
  const formSubmit = document.querySelector("#submit")
  const onSubmit = document.querySelector("#button")

function onChangeEmail(){
  const email = email.value;
}

function onChangeLogin(){
  const login = login.value;
}

function onChangePassword(){
  const password = password.value;
}