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
    const userName = document.getElementById('userName');
    const avatar = document.getElementById('avatar');
    const avatarEdit = document.getElementById('avatarEdit');
    const profileForm = document.getElementById('profileForm');

    // Adiciona um ouvinte de alteração ao campo de arquivo
    fileInput.addEventListener('change', function(event) {
        console.log("Arquivo selecionado!");
        const user = firebase.auth().currentUser;
        
        if (user) {
            console.log("Usuário autenticado. UID: ", user.uid);
            const userId = user.uid;
            const storageRef = firebase.storage().ref(`avatars/${userId}`);
            
            // Obtém o arquivo selecionado
            const file = event.target.files[0];

            // Atualiza o avatar no Storage
            storageRef.put(file)
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(downloadURL => {
                    // Atualiza o avatar no Firestore
                    return firebase.firestore().collection('users').doc(userId).set({
                        avatar: downloadURL
                    }, { merge: true });
                })
                .then(() => {
                    // Atualiza o avatar na página
                    avatar.src = downloadURL;
                    avatarEdit.src = downloadURL;
                })
                .catch(error => {
                    console.error("Erro ao atualizar avatar: " + error);
                });
        } else {
            console.error("Usuário não autenticado.");
            // Aqui você pode adicionar uma lógica adicional ou exibir uma mensagem de erro ao usuário
        }
    });


    // Adiciona um ouvinte de envio ao formulário
    profileForm.addEventListener('submit', function(event) {
        console.log("Formulário enviado!"); 
        event.preventDefault();

        const user = firebase.auth().currentUser;
        if (user) {
            const userId = user.uid;
            const name = document.getElementById('iname').value || 'Usuário';
            const surname = document.getElementById('isname').value || '';
            const email = document.getElementById('iemail').value || '';
            const newEmail = document.getElementById('inewemail').value || '';

            // Verifica se um novo e-mail foi fornecido
            if (newEmail) {
                // Atualiza o e-mail de autenticação
                user.updateEmail(newEmail)
                    .then(() => {
                        // Atualiza o perfil no Firestore
                        return firebase.firestore().collection('users').doc(userId).set({
                            name: name,
                            surname: surname,
                            email: newEmail
                        }, { merge: true });
                    })
                    .then(() => {
                        // Atualiza o nome de usuário no cabeçalho
                        userName.textContent = name;
                        alert("E-mail atualizado com sucesso!");
                    })
                    .catch(error => {
                        console.error("Erro ao atualizar perfil: " + error);
                    });
            } else {
                // Se nenhum novo e-mail foi fornecido, apenas atualize outros detalhes do perfil
                firebase.firestore().collection('users').doc(userId).set({
                    name: name,
                    surname: surname,
                    email: email
                }, { merge: true })
                .then(() => {
                    // Atualiza o nome de usuário no cabeçalho
                    userName.textContent = name;
                    alert("Perfil atualizado com sucesso!");
                })
                .catch(error => {
                    console.error("Erro ao atualizar perfil: " + error);
                });
            }
        } else {
            alert('Usuário não autenticado. Faça login novamente para continuar.');
        }
    });
});