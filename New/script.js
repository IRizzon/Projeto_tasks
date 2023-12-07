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

//carregando dados do Header
document.addEventListener('DOMContentLoaded', function() {
    const userName = document.getElementById('userName');
    const avatar = document.getElementById('avatar');

    firebase.auth().onAuthStateChanged(function (user){
        if(user){
            const userId = user.uid;
            
            firebase.firestore().collection('users').doc(userId).get()
                .then((doc) => {
                    userName.textContent = doc.data().name;
                    avatar.src = doc.data().avatar;
                })
                .catch((error) => {
                    console.error("Erro ao obter dados", error)
                });
        }
    });
});

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

//Função para obter os detalhes da tarefa
function getTaskDetails(userId, taskId) {
    const taskRef = firestore.collection('users').doc(userId).collection('tasks').doc(taskId);

    return taskRef.get()
        .then((doc) => {
            if (doc.exists) {
                return doc.data();
            } else {
                console.error("Documento não encontrado!");
                return null;
            }
        })
        .catch((error) => {
            console.error("Erro ao obter detalhes da tarefa: ", error);
            return null;
        });
}

//Função para salvar e atualizar tarefas
function updateTask(userId, taskId, data) {
    const taskRef = firestore.collection('users').doc(userId).collection('tasks').doc(taskId);

    return taskRef.update(data)
        .then(() => {
            alert("Dados atualizados com sucesso!");
        })
        .catch((error) => {
            alert("Erro ao atualizar dados: " + error);
        });
}

window.onload = function () {
    const form = document.querySelector('#form');
    const date = document.querySelector('#date');
    const about = document.querySelector('#about');
    const description = document.querySelector('#description');
    const submitButton = document.querySelector('#submitBtn');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const userId = user.uid;
            const urlParams = new URLSearchParams(window.location.search);
            const taskId = urlParams.get('taskId');

            if (taskId) {

                // Edição de Tarefa existente
                getTaskDetails(userId, taskId)
                    .then((taskData) => {
                        if (taskData) {

                            date.value = taskData.date;
                            about.value = taskData.about;
                            description.value = taskData.description;

                            submitButton.addEventListener('click', (e) => {
                                e.preventDefault();

                                const formData = {
                                    date: date.value,
                                    about: about.value,
                                    description: description.value
                                };

                                updateTask(userId, taskId, formData);
                            });
                        } else {
                            alert("Tarefa não encontrada!");
                        }
                    })
                    .catch((error) => {
                        console.error("Erro ao obter detalhes da tarefa: ", error);
                    });
            } else {

                // Adição de Nova Tarefa
                submitButton.addEventListener('click', (e) => {
                    e.preventDefault();

                    const formData = {
                        date: date.value,
                        about: about.value,
                        description: description.value,
                        status: 'Em aberto'
                    };

                    saveFormData(userId, formData);
                    form.reset();
                });
            }
        } else {
            alert('Usuário não autenticado. Faça login novamente para continuar.');
            window.location.href = "../Login/index.html";
        }
    });
}

// Função Deslogar
function logoutUser() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../Login/index.html";
    });
}