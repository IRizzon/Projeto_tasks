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
const firestore = firebase.firestore();

//Função para gerar Dashboard

function populateTable(tasks) {
    const tableBody = document.querySelector('#tbd');

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Data">${task.date}</td>
            <td data-label="Assunto">${task.about}</td>
            <td data-label="Status"><span 
            style="
            border-radius: 5px;
            padding: 3px;
            background-color: ${task.status === 'Finalizado' ? 'green' : '#999'};
            " id="status">${task.status}</span></td>
            <td data-label="#">
                <button id="check-button" class="material-symbols-outlined">event_available</button>
                <button id="edit-button" class="material-symbols-outlined">edit_calendar</button>
            </td>
        `;
        if (task.id) {
            row.setAttribute('data-task-id', task.id);
        }
        
        tableBody.appendChild(row);
    });

    const checkButtons = document.querySelectorAll('#check-button');
    const editButtons = document.querySelectorAll('#edit-button');

    //Botão Check

    checkButtons.forEach(button => {
        button.addEventListener('click', () => {
            checkTask(button);
        });
    });

    //Botão mostrar Descrição

    editButtons.forEach((button, index) => {
        button.addEventListener('mouseover', async () => {
            const taskId = button.parentNode.parentNode.getAttribute('data-task-id');
            const userId = firebase.auth().currentUser.uid;
    
            try {
                const taskSnapshot = await firestore.collection('users').doc(userId).collection('tasks').doc(taskId).get();
                const taskData = taskSnapshot.data();
    
                if (taskData) {
                    tooltip.textContent = taskData.description;
                    const rect = button.getBoundingClientRect();
                    tooltip.style.left = rect.left + 'px';
                    tooltip.style.top = rect.top - tooltip.offsetHeight + 'px';
                    tooltip.style.display = 'block';
                }
            } catch (error) {
                console.error("Erro ao obter descrição da atividade: ", error);
            }
        });
    
        button.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });
    });

}

//Função para botão check alterar status

function checkTask(button) {
    const row = button.parentNode.parentNode;
    const statusSpan = row.querySelector('#status');
    
    const userId = firebase.auth().currentUser.uid;
    const taskId = row.getAttribute('data-task-id');
    console.log('UserID:', userId);
    console.log('TaskID:', taskId);
    const taskData = {
        status: statusSpan.textContent === 'Em aberto' ? 'Finalizado' : 'Em aberto'
    };
    
    firestore.collection('users').doc(userId).collection('tasks').doc(taskId)
        .update(taskData)
        .then(() => {
            if (statusSpan.textContent === 'Em aberto') {
                statusSpan.style.backgroundColor = 'green';
            } else {
                statusSpan.style.backgroundColor = '#999';
            }
            statusSpan.textContent = taskData.status;
        })
        .catch(error => {
            console.error("Erro ao atualizar status: ", error);
        });
}

//Função de autenticação da Dashboard

function getTasks(userId) {
    firestore.collection('users').doc(userId).collection('tasks')
        .get()
        .then((querySnapshot) => {
            const tasks = [];
            querySnapshot.forEach((doc) => {
                tasks.push(doc.data());
            });
            populateTable(tasks);
        })
        .catch((error) => {
            console.error("Erro ao encontrar dados: ", error);
        });
}

//Autenticação de Usuário

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

      const userId = user.uid;
      getTasks(userId);

    } else {

      alert('Usuário não autenticado. Faça login para ver os dados.');
      window.location.href = '../Login/index.html';
    }
  });

  function logoutUser() {
    firebase.auth().signOut().then(() => {
      window.location.href = "../Login/index.html";
    })
}
