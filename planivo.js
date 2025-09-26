let areaAddTask = document.getElementById("areaAddTask");
areaAddTask.style.display = "none";

let areaRenomear = document.getElementById("areaRenomear");
areaRenomear.style.display = 'none';

//classe das tarefas
class Tarefa{

    constructor(horarioI,horarioF,diaSem){
        this.horarioI = horarioI;
        this.horarioF = horarioF;
        this.diaSem = diaSem;
    }

    //método para validação dos dados
    //verifica se os inputs obrigatorios estão preenchidos
    validarDados(){

        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false;
            }
        }
        return true;
    }
}


//função do botao de prosseguir da area login
function prosseguirLogin(){
    //variavel que recebera o nome informado pelo usuario
    let nomeUser = document.getElementById('nomeUser').value.trim();
    
    //verifica se o input do campo nome nao esta vazio
    if(nomeUser == '' || nomeUser == ' '){
        alert('Preencha o campo nome para prosseguir!');
    }else{//recebe no localstorage o nome informado no input
        localStorage.setItem('nomeUser', nomeUser);
        window.location.href = "../diashtml/segunda.html";
    }
}

//funcao para verificacao de seguranca de acesso as paginas
function aoCarregar(){
    //recebe o nome definido pelo usuario que foi guardado no localStorage
    let nome = localStorage.getItem('nomeUser');
    console.log(nome);

    //realizando a verificacao
    if(!nome){//se nome for string vazia ou algo do tipo retorna false mas com negacao torna true e executa o bloco de codigo
        window.location.href = '../../index.html'
    }else{//recebe o nome do localstorage e passa para o span no header da pagina html
        let nomeHeader = document.getElementById('nomeUser');
        nomeHeader.innerHTML = nome;
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