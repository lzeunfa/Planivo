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
            if(this[i] == undefined || this[i].trim() == '' || this[i] == null){
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
    if(nomeUser.trim() == ''){
        alert('Preencha o campo nome para prosseguir!');
    }else{//recebe no localstorage o nome informado no input
        localStorage.setItem('nomeUser', nomeUser);
        window.location.href = "../diashtml/segunda.html";
    }
}

/*funcao para verificacao de seguranca do acesso a 
pagina de login que so deve ser acessada caso o usuario nao tenha colocado o seu nome*/
function aoCarregarLogin(){
    let nome = localStorage.getItem('nomeUser');

    /*se no localStorage ja existir o nomeUser, ele nao deixa entrar na area de login*/
    if(nome){
        window.location.href = 'diashtml/segunda.html';
    }
}

//funcao para verificacao de seguranca de acesso as paginas
function aoCarregarDias(){
    //recebe o nome definido pelo usuario que foi guardado no localStorage
    let nome = localStorage.getItem('nomeUser');

    //realizando a verificacao
    if(!nome){//se nome for string vazia ou algo do tipo retorna false mas com negacao torna true e executa o bloco de codigo
        window.location.href = '../../index.html'
    }else{//recebe o nome do localstorage e passa para o span no header da pagina html
        let nomeHeader = document.getElementById('nomeUser');
        nomeHeader.innerHTML = nome;
    }
}

//funcao onclick no simbolo de renomear para abrir tela de renomeacao
function renomear(){
    areaRenomear.style.display = 'flex';
}

//funcao onclick para confirmacao de novo nome
function confirmRename(){
    //recebe o novo nome definido pelo usuario no input
    let newName = document.getElementById("nomeAtt").value;

    //verificacao se é um valor válido
    if(newName.trim() == ''){
        alert('Preencha o campo novo nome com texto válido!');
    }else{
        localStorage.setItem('nomeUser', newName);

        areaRenomear.style.display = 'none';
        aoCarregarDias();
    }
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