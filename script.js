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

//Registro

function storeUserData(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((register) => {
        const user = register.user;
        alert("E-mail " + user.email + " foi cadastrado com sucesso!");
        window.location.href = "/Home/index.html";
    })
    .catch((error) => {
        alert("Não foi possível efetuar o cadastro, por favor certifique-se de preencher os campos corretamente!");
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
    
    storeUserData(email, password);
    });
};

