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