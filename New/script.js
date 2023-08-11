//firebase Config

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
const firestore = firebase.firestore();

//Função adicionar Task

function saveFormData(userId, data) {
    const tasksRef = firestore.collection('users').doc(userId).collection('tasks');

    const newTaskRef = tasksRef.doc();
    const newTaskId = newTaskRef.id;
    const taskData = {
        id: newTaskId,
        ...data
    };
    newTaskRef.set(taskData)
        .then(() => {
            alert("Dados salvos com sucesso!");
        })
        .catch((error) => {
            alert("Erro ao salvar dados: " + error);
        });
}

window.onload = function() {
    const form = document.querySelector('#form')
    const date = document.querySelector('#date');
    const about = document.querySelector('#about');
    const description = document.querySelector('#description');
    const submitButton = document.querySelector('#submitBtn');

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();

        const user = firebase.auth().currentUser;
        if (user) {
            const userId = user.uid;
            const formData = {
                date: date.value,
                about: about.value,
                description: description.value,
                status: 'Em aberto'
            };

            saveFormData(userId, formData);
            form.reset();
        } else {
            alert('Usuário não autenticado. Faça login novamente para continuar.');
        }
    });
}

//Função Deslogar

function logoutUser() {
    firebase.auth().signOut().then(() => {
      window.location.href = "../Login/index.html";
    })
}


