//area de adicionar task
const areaAddTask = document.getElementById("areaAddTask");
areaAddTask.style.display = "none";

//area para renomear
const areaRenomear = document.getElementById("areaRenomear");
areaRenomear.style.display = 'none';

//area para confirmar exclusão
const areaConfirmExclu = document.getElementById("areaConfirmExclu");
areaConfirmExclu.style.display = 'none';

//area para as settings
const areaSettings = document.getElementById('areaSettings');
areaSettings.style.display = 'none';

//definindo os containers de tarefas como variaveis
const contSemTask = document.getElementById("contSemTask");
const contComTask = document.getElementById("contComTask");
const btnAddTarefa = document.getElementById("contBtnNovaTarefa");

//escondi tudo inicialmente no css para eviter os flickers
//inicializando com estado oculto
contSemTask.style.display = 'none';
contComTask.style.display = 'none';
btnAddTarefa.style.display = 'none';

/*variavel externa para passar valores entre as funções
apagar tarefas e confirmar exclusao*/
let tarefaDiaSel = null;
let tarefaIndexSel = null;


//modelo das tarefas
class Tarefa{

    constructor(horarioI,nomeTarefa,descriTarefa,horarioF,diaSem){
        this.horarioI = horarioI;
        this.nomeTarefa = nomeTarefa;
        this.descriTarefa = descriTarefa;
        this.horarioF = horarioF;
        this.diaSem = diaSem;
    }

    //método para validação dos dados
    //verifica se os inputs obrigatorios estão preenchidos
    validarDados(){
        const camposObrigatorios = ['horarioI', 'nomeTarefa', 'horarioF', 'diaSem'];
        
        for(let campo of camposObrigatorios){
            if(this[campo] == undefined || this[campo] == '' || this[campo] == null){
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
        window.location.href = "./diashtml/segunda.html";
    }
}

/*funcao para verificacao de seguranca do acesso a 
pagina de login que so deve ser acessada caso o usuario nao tenha colocado o seu nome*/
function aoCarregarLogin(){
    let nome = localStorage.getItem('nomeUser');

    /*se no localStorage ja existir o nomeUser, ele nao deixa entrar na area de login*/
    if(nome){
        window.location.href = './diashtml/segunda.html';
    }
}

//funcao para verificacao de seguranca de acesso as paginas
function aoCarregarDias(numDiaSem){
    //recebe o nome definido pelo usuario que foi guardado no localStorage
    let nome = localStorage.getItem('nomeUser');

    //realizando a verificacao
    if(!nome){
        window.location.href = '../login.html'
        localStorage.clear();
        return;
    }
    
    //atualizando o nome no header
    let nomeHeader = document.getElementById('nomeUser');
    nomeHeader.innerText = nome;

    let tarefas = bd.getTarefas(numDiaSem);
    
    //verificando se existem tarefas para este dia
    if(tarefas.length === 0){
        //sem tarefas mostra o contSemTask
        contSemTask.style.display = 'flex';
        contComTask.style.display = 'none';
        btnAddTarefa.style.display = 'none';
        
        //força o navegador a aplicar as mudanças antes de adicionar animação
        contSemTask.offsetHeight; // forçando reflow
        
        contSemTask.classList.add('visible');
        contSemTask.classList.remove('invisible');
    } else {
        //com tarefas prepara e renderiza
        //primeiro renderiza o conteúdo enquanto ainda está oculto
        renderizarTarefas(numDiaSem, tarefas);
        
        //depois mostra tudo de uma vez
        contComTask.style.display = 'flex';
        btnAddTarefa.style.display = 'flex';
        contSemTask.style.display = 'none';
        
        //força reflow antes de adicionar animação
        contComTask.offsetHeight;
        
        contComTask.classList.add('visible');
        contComTask.classList.remove('invisible');
        btnAddTarefa.classList.add('visible');
        btnAddTarefa.classList.remove('invisible');
        contSemTask.classList.remove('visible');
        contSemTask.classList.add('invisible');
    }
}

//funcao de settings para poder sair ou renomear
function abrirSettings(){
    areaSettings.style.display = 'flex';
    overFlowHidden();
}

//funcao para deslogar
function reiniciar(){
    areaSettings.style.display = 'none';
    overFlowVisible();
    window.location.href = '../login.html'
    localStorage.clear();
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

    overFlowVisible();
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
    let descriTarefa = document.getElementById('descriTarefa');
    let horarioF = document.getElementById('hFim');
    let numDiaSem = numDia;

    //verificar se o value da descricao é undefined para receber string vazia
    console.log(descriTarefa);

    //criando nova tarefa
    let tarefa = new Tarefa(
        horarioI.value,nomeTarefa.value,descriTarefa.value,
        horarioF.value,numDiaSem
    );

    //caso o horario inicial seja maior que o horario final, mostra erro no cadastro da tarefa
    if(horarioI.value>horarioF.value){
        aviso('Horário de término deve ser no mesmo dia!','erro');
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
    descriTarefa.value = '';
    horarioF.value = '';
    numDiaSem.value = '';

    overFlowVisible();

    // Atualizar as tarefas sem flicker
    carregarTarefas(numDiaSem);
}

//função para renderizar tarefas
function renderizarTarefas(numDia, tarefas){
    //ordenando as tarefas por horario inicial
    tarefas.sort((a,b) => a.horarioI.localeCompare(b.horarioI));

    //cria todo o HTML de uma vez usando um fragmento
    const fragment = document.createDocumentFragment();

    //percorrendo cada elemento do objeto e criando seu html
    tarefas.forEach((tarefa,index) => {
        let divTask = document.createElement("div");
        divTask.className = 'cntTarefaAdicionada';

        //html das tarefas
        divTask.innerHTML = `
        <div class="infosTarefa">
            <p class="txtHorarios mb-1">${tarefa.horarioI} - ${tarefa.horarioF}</p>
            <p class="txtNomeTarefa">${tarefa.nomeTarefa}</p>
            <p class="txtDescriTarefa">${tarefa.descriTarefa}</p>
        </div>

        <img class="iconApagar align-self-center" src="../img/apagarIcon.png" alt="apagar-Icon" width="20px" height="20px" onclick="apagarTarefa(${numDia},${index})">
        `;

        fragment.appendChild(divTask);
    });

    //limpa e adiciona tudo de uma vez
    contComTask.innerHTML = '';
    contComTask.appendChild(fragment);
}

//funcao para carregar as tarefas e mostrar elas no respectivo dia
function carregarTarefas(numDia){
    let tarefas = bd.getTarefas(numDia);

    if(tarefas.length > 0){
        //renderiza as tarefas
        renderizarTarefas(numDia, tarefas);

        //atualiza a visibilidade dos containers
        contSemTask.style.display = 'none';
        contComTask.style.display = 'flex';
        btnAddTarefa.style.display = 'flex';
        
        contSemTask.classList.remove('visible');
        contSemTask.classList.add('invisible');
        contComTask.classList.remove('invisible');
        contComTask.classList.add('visible');
        btnAddTarefa.classList.remove('invisible');
        btnAddTarefa.classList.add('visible');
    }else{
        //atualiza a visibilidade para estado sem tarefas
        contComTask.style.display = 'none';
        btnAddTarefa.style.display = 'none';
        contSemTask.style.display = 'flex';
        
        contComTask.classList.remove('visible');
        contComTask.classList.add('invisible');
        btnAddTarefa.classList.remove('visible');
        btnAddTarefa.classList.add('invisible');
        contSemTask.classList.remove('invisible');
        contSemTask.classList.add('visible');
    }
}

//funcao para apagar tarefa clicando no icone de lixeira
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
    }else{
        //atualiza no localstorage
        bd.setTarefa(tarefaDiaSel,tarefas);
    }
    
    areaConfirmExclu.style.display = 'none';
    overFlowVisible();

    //mostra aviso de tarefa excluída com sucesso
    aviso('Tarefa excluída com sucesso!','sucesso');

    //atualiza a visualização
    carregarTarefas(tarefaDiaSel);
}

/*funcao que fecha cnts de interacao*/
function fecharArea(Area){
    if(Area == 0){
        areaRenomear.style.display = 'none';
    }else if(Area == 1){
        areaAddTask.style.display = "none";
    }else if (Area == 2){
        areaConfirmExclu.style.display = 'none';
    }else{
        areaSettings.style.display = 'none';
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
        imgAviso.src = '../img/check.png';
        textoAviso.innerText = texto;
        containerAviso.style.backgroundColor = '#10B981';
        containerAviso.style.display = 'flex';
    }else if(tipo == 'erro'){
        imgAviso.src = '../img/erro.png';
        textoAviso.innerText = texto;
        containerAviso.style.backgroundColor = '#EC2126';
        
        containerAviso.style.display = 'flex';
    }

    containerAviso.appendChild(imgAviso);
    containerAviso.appendChild(textoAviso);
    document.body.appendChild(containerAviso);

    //faz o aviso sumir apos 3 segundos
    setTimeout(() => {
        //adicioanndo classe fade out para animacao de saida
        containerAviso.classList.add('fade-out');

        //apos o tempo de animacao retira o elemento do dom
        setTimeout(() => {
            document.body.removeChild(containerAviso);
        }, 500);
    },2000);
}