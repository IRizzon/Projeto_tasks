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

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const avatarEdit = document.getElementById('avatarEdit');
    const saveButton = document.getElementById('saveButton');
    const avatar = document.getElementById('avatar');
    const userName = document.getElementById('userName');
    const name = document.getElementById('iname')

    firebase.auth().onAuthStateChanged(function (user){
        if(user){
            const userId = user.uid;
            
            firebase.firestore().collection('users').doc(userId).get()
                .then((doc) => {
                    avatarEdit.src = doc.data().avatar;
                    avatar.src = doc.data().avatar;
                    userName.textContent = doc.data().name;
                    name.value = doc.data().name;
                })
                .catch((error) => {
                    console.error("Erro ao obter dados", error)
                });
        }
    });

    //Selecionando foto
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader();

            reader.onload = function(e) {
                avatarEdit.src = e.target.result;
                avatarEdit.classList.add('avatar2');
            };

            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecione uma imagem PNG ou JPG.');
            
        }
    });

    //console.log('Usuário atual:', firebase.auth().currentUser);

    //Alterar Dados
    saveButton.addEventListener('click', function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                const userId = user.uid;
                const name = document.getElementById('iname').value;
                const newEmail = document.getElementById('inewemail').value;
                const email = document.getElementById('iemail').value;
                
                console.log('Usuário atual:', user);
                if (name || avatarEdit.src || newEmail || email) {
                    const dataToSave = {};
    
                    if (name) {
                        dataToSave.name = name;
                    }
    
                    if (avatarEdit.src) {
                        dataToSave.avatar = avatarEdit.src;
                    }
                    if (newEmail) {
                        dataToSave.newEmail = newEmail;
                    }
    
                    firebase.firestore().collection('users').doc(userId).set(dataToSave, { merge: true })
                        .then(() => {
                            if (newEmail) {
                                return user.updateEmail(newEmail);
                            } else {
                                return Promise.resolve();
                            }
                        })
                        .then(() => {
                            alert('Dados salvos com sucesso!');
                        })
                        .catch(error => {
                            console.error("Erro ao salvar dados: " + error);
                        });
                } else {
                    alert('Nenhuma informação para salvar. Por favor, forneça um nome e/ou uma foto.');
                }
            } else {
                alert('Por favor, faça login e forneça um nome antes de salvar.');
                console.log('Usuário atual: null');
            }
        });
    });
});

function logoutUser() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../Login/index.html";
    });
}