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

//Login

function loginUser(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
  
        window.location.href = "../Home/index.html";
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Erro ao fazer login, usuário ou senha incorretos!");
      });
  }

window.onload = function() {
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const formSubmit = document.querySelector("#submit");

    formSubmit.addEventListener("click", (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    loginUser(email, password);
    });
};