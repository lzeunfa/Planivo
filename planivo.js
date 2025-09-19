let areaAddTask = document.getElementById("areaAddTask");
areaAddTask.style.display = "none";

let areaRenomear = document.getElementById("areaRenomear");
areaRenomear.style.display = 'none';


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

function renomear(){
    areaRenomear.style.display = 'flex';
}

//função para o btn que adiciona tarefa
function novaTarefa(){
    areaAddTask.style.display = "flex";
}

function fecharArea(Area){
    if(Area == 1){
    areaAddTask.style.display = "none";
    }else{
    areaRenomear.style.display = 'none';
    }
}