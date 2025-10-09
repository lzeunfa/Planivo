//area de adicionar task
const areaAddTask = document.getElementById("areaAddTask");
areaAddTask.style.display = "none";

//area para renomear
const areaRenomear = document.getElementById("areaRenomear");
areaRenomear.style.display = 'none';

//area para confirmar exclusão
const areaConfirmExclu = document.getElementById("areaConfirmExclu");
areaConfirmExclu.style.display = 'none';

//definindo os containers de tarefas como variaveis
const contSemTask = document.getElementById("contSemTask");
contSemTask.style.display = 'none';

const contComTask = document.getElementById("contComTask");
contComTask.style.display = 'none';

/*variavel externa para passar valores entre as funções
apagar tarefas e confirmar exclusao*/
let tarefaDiaSel = null;
let tarefaIndexSel = null;


//modelo das tarefas
class Tarefa{

    constructor(horarioI,nomeTarefa,horarioF,diaSem){
        this.horarioI = horarioI;
        this.nomeTarefa = nomeTarefa;
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

//modelo bd como se fosse um banco de dados
class Bd{

    //metodo para gravar tarefa
    gravar(t,d){
        //variavel que recupera as tarefas do dia
        let tarefas = JSON.parse(localStorage.getItem(d)) || [];

        //adiciona a nova tarefa grava no array da tarefa do dia
        tarefas.push(t);

        //salva o array de tarefas alterado no localStorage
        localStorage.setItem(d, JSON.stringify(tarefas));
    }

    //metodo para buscar tarefa
    getTarefas(dia){
        return JSON.parse(localStorage.getItem(dia)) || [];
    }

    //metodo para salvar tarefa
    setTarefa(dia,tarefas){
        localStorage.setItem(dia,JSON.stringify(tarefas));
    }

    //metodo para remover tarefa
    remover(d){
        localStorage.removeItem(d);
    }
}
let bd = new Bd();


//função do botao de prosseguir da area login
function prosseguirLogin(){
    //variavel que recebera o nome informado pelo usuario
    let nomeUser = document.getElementById('nomeUser').value.trim();
    
    //verifica se o input do campo nome nao esta vazio
    if(nomeUser.trim() == ''){
        aviso('Preencha o campo nome para prosseguir!','erro');
    }else{//recebe no localstorage o nome informado no input
        localStorage.setItem('nomeUser', nomeUser);
        window.location.href = "/diashtml/segunda.html";
    }
}

/*funcao para verificacao de seguranca do acesso a 
pagina de login que so deve ser acessada caso o usuario nao tenha colocado o seu nome*/
function aoCarregarLogin(){
    let nome = localStorage.getItem('nomeUser');

    /*se no localStorage ja existir o nomeUser, ele nao deixa entrar na area de login*/
    if(nome){
        window.location.href = '/diashtml/segunda.html';
    }
}

//funcao para verificacao de seguranca de acesso as paginas
function aoCarregarDias(numDiaSem){
    //recebe o nome definido pelo usuario que foi guardado no localStorage
    let nome = localStorage.getItem('nomeUser');

    //realizando a verificacao
    if(!nome){//se nome for string vazia ou algo do tipo retorna false mas com negacao torna true e executa o bloco de codigo
        window.location.href = '/../index.html'
        localStorage.clear();
    }else{//recebe o nome do localstorage e passa para o span no header da pagina html
        let nomeHeader = document.getElementById('nomeUser');
        nomeHeader.innerHTML = nome;
    }

    //verifica se no localstorage existe um item com o numero do dia da pagina
    if(!localStorage.getItem(numDiaSem)){
        /*adiciona o conteiner com conteudo sem task
        caso nao exista tarefas no dia*/
        contSemTask.style.display = "flex";
    }else{
        //retira o conteiner com conteudo sem task
        contSemTask.style.display = "none";

        //faz aparecer o container com conteudo com task
        contComTask.style.display = "flex";

        let btnAddTarefa = document.getElementById("contBtnNovaTarefa");
        btnAddTarefa.style.display = 'flex';

        //chamando a função para criação do html das tarefas
        carregarTarefas(numDiaSem);
    }
}

//funcao onclick no simbolo de renomear para abrir tela de renomeacao
function renomear(){
    areaRenomear.style.display = 'flex';
    overFlowHidden();
}

//funcao onclick para confirmacao de novo nome
function confirmRename(){
    //recebe o novo nome definido pelo usuario no input
    let newName = document.getElementById("nomeAtt").value;

    //verificacao se é um valor válido
    if(newName.trim() == ''){
        aviso('Erro, informe um valor válido!','erro');
    }else{
        localStorage.setItem('nomeUser', newName);

        areaRenomear.style.display = 'none';

        //mostra aviso de nome alterado com sucesso
        aviso('Nome alterado com sucesso!','sucesso');

        //pega o nome no localstorage e atualiza o header
        let nome = localStorage.getItem('nomeUser');
        let nomeHeader = document.getElementById('nomeUser');
        nomeHeader.innerText = nome;
            
    }
}

//função para o btn que adiciona tarefa
function novaTarefa(){
    areaAddTask.style.display = "flex";

    //sobe a pagina
    window.scrollTo(0,0);
    overFlowHidden();
}

//parametro numDia dias da semana de 1-7, comecando na segunda
function adicionarTarefa(numDia){
    //recebendo os inputs da area de novatarefa
    let horarioI = document.getElementById('hInicio');
    let nomeTarefa = document.getElementById('nomeTarefa');
    let horarioF = document.getElementById('hFim');
    let numDiaSem = numDia;

    //criando nova tarefa
    let tarefa = new Tarefa(
        horarioI.value,nomeTarefa.value,
        horarioF.value,numDiaSem
    );

    //caso o horario inicial seja maior que o horario final, mostra erro no cadastro da tarefa
    if(horarioI.value>horarioF.value){
        aviso('Erro, informe um valor válido!','erro');
        return;
    }
    
    //mostra erro no cadastro de tarefas caso algum input não tenha sido preenchido
    if(!tarefa.validarDados()){
        aviso('Erro no cadastro, confira os campos!','erro');
        return;
    }

    //realiza a gravacao da tarefa no local storage
    bd.gravar(tarefa,numDia);

    //faz fechar a area de adicionar tarefa
    areaAddTask.style.display = 'none';

    //mostra aviso de tarefa cadastrada com sucesso
    aviso('Tarefa cadastrada!','sucesso');

    //esvazia os valores dos inputs
    horarioI.value = '';
    nomeTarefa.value = '';
    horarioF.value = '';
    numDiaSem.value = '';

    overFlowVisible();

    carregarTarefas(numDia);
}

//funcao para carregar as tarefas e mostrar elas no respectivo dia
function carregarTarefas(numDia){

    /*recebe o objeto com a determinada chave e se nao existir recebe um array*/
    let tarefas = bd.getTarefas(numDia);

    //recebe o container que recebera as tarefas
    let containerTasks = document.getElementById("contComTask");
    //limpa o container antes de renderizar
    containerTasks.innerHTML = '';
    containerTasks.className = 'flex-column';

    //ordenando as tarefas por horario inicial
    tarefas.sort((a,b) => a.horarioI.localeCompare(b.horarioI));

    //percorrendo cada elemento do objeto e criando seu html
    tarefas.forEach((tarefa,index) => {
        let divTask = document.createElement("div");
        divTask.className = 'cntTarefaAdicionada';

        //html das tarefas
        divTask.innerHTML = `
        <div class="infosTarefa">
            <p class="txtHorarios mb-1">${tarefa.horarioI} - ${tarefa.horarioF}</p>
            <p class="txtNomeTarefa">${tarefa.nomeTarefa}</p>
        </div>

        <img class="iconApagar align-self-center" src="/img/apagarIcon.png" alt="apagar-Icon" width="20px" height="20px" onclick="apagarTarefa(${numDia},${index})">
        `;

        containerTasks.appendChild(divTask);
    });

    //retira o conteiner com conteudo sem task
    contSemTask.style.display = "none";

    //faz aparecer o container com conteudo com task
    contComTask.style.display = "flex";

    //faz aparecer o btn de adicionar tarefa redondo
    let btnAddTarefa = document.getElementById("contBtnNovaTarefa");
    btnAddTarefa.style.display = 'flex';
    
}

//funcao para apagar tarefa clicando no incoe de lixeira
function apagarTarefa(diaSem,index){
    areaConfirmExclu.style.display = 'flex';

    /*atualiza o valor dentro da variaveel pra passar pra funcao
    de confirmacao de exclusao caso confirme*/
    tarefaDiaSel = diaSem;
    tarefaIndexSel = index;

    window.scrollTo(0,0);

    overFlowHidden();
}


//confirmacao de exclusao de tarefa
function confirmExclu(){
    //recebe o objeto com a determinada chave e se nao existir recebe um array
    let tarefas = bd.getTarefas(tarefaDiaSel);

    /*ordenando as tarefas por horario inicial para evitar prolema no splice e apagar a tarefa errada*/
    tarefas.sort((a,b) => a.horarioI.localeCompare(b.horarioI));

    //removendo a tarefa pelo seu indice
    tarefas.splice(tarefaIndexSel,1);    

    //verifica se o array ainda tem tarefas
    if(tarefas.length === 0){
        bd.remover(tarefaDiaSel);
        let btnAddTarefa = document.getElementById("contBtnNovaTarefa");
        btnAddTarefa.style.display = 'none';
        window.location.reload();
    }else{
        //atualiza no localstorage
        bd.setTarefa(tarefaDiaSel,tarefas);
    }
    areaConfirmExclu.style.display = 'none';

    overFlowVisible();
    /*atualiza a pagina e consequentemente puxa a funcao de carregar tarefa novamente*/
    aviso('Tarefa excluída com sucesso!','sucesso');
    
    carregarTarefas(tarefaDiaSel);
}

/*funcao que fecha cnts de interacao*/
function fecharArea(Area){
    if(Area == 1){
        areaAddTask.style.display = "none";
    }else if(Area == 0){
        areaRenomear.style.display = 'none';
    }else{
        areaConfirmExclu.style.display = 'none';
    }
    overFlowVisible();
}

//funcao para esconder overflow evitando rolagem vertical
function overFlowHidden(){
    document.body.style.overflow = 'hidden';
}

//funcao para voltar a aparecer overflow
function overFlowVisible(){
    document.body.style.overflow = 'visible';
}

//function para a criação de avisos estilizados
function aviso(texto,tipo){
    //criando o container do aviso
    const containerAviso = document.createElement('div');
    containerAviso.className = 'avisoTopo align-items-center justify-content-center';

    //criando o img e o p do aviso
    const imgAviso = document.createElement('img');
    imgAviso.className = 'iconAviso';
    const textoAviso = document.createElement('p');
    textoAviso.className = 'textoAviso pt-3 text-center';

    //verifica o tipo de aviso e altera o conteudo e estilo
    if(tipo == 'sucesso'){
        imgAviso.src = '/img/check.png';
        textoAviso.innerText = texto;
        containerAviso.style.backgroundColor = '#10B981';
        containerAviso.style.display = 'flex';
    }else if(tipo == 'erro'){
        imgAviso.src = '/img/erro.png';
        textoAviso.innerText = texto;
        containerAviso.style.backgroundColor = '#EC2126';
        
        containerAviso.style.display = 'flex';
    }

    containerAviso.appendChild(imgAviso);
    containerAviso.appendChild(textoAviso);
    document.body.appendChild(containerAviso);

    setTimeout(() => {
        //adicioanndo classe fade out para animacao de saida
        containerAviso.classList.add('fade-out');

        //apos o tempo de animacao retira o elemento do dom
        setTimeout(() => {
            document.body.removeChild(containerAviso);
        }, 500);
    },3000);
}