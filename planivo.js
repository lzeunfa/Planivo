let areaAddTask = document.getElementById("areaAddTask");
areaAddTask.style.display = "none";


//função do botao de prosseguir da area login
function prosseguirLogin(){
    let nomeUser = document.getElementById('nomeUser').value;
    
    if(nomeUser == '' || nomeUser == ' '){
        alert('Preencha corretamente o campo nome para prosseguir!');
    }else{
        console.log(nomeUser);
        window.location.href = "../diashtml/segunda.html";
    }
}

//função para o btn que adiciona tarefa
function novaTarefa(){
    areaAddTask.style.display = "flex";

}

function fecharArea(){
    areaAddTask.style.display = "none";
}