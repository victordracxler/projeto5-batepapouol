let userName = "";
let promptNome = "";
let timerOnline = "";
let timerListaUsers = "";
let destinatario = "";

function perguntarNome(input) {
  promptNome = input;

  //promptNome = prompt("Escolha um nome de usuário");
  let objNome = {
    name: promptNome,
  };

  const requisicaoNome = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    objNome
  );

  requisicaoNome.then(nomeOK);
  requisicaoNome.catch(nomeInvalido);
}

//perguntarNome();

function nomeInvalido(resposta) {
  console.log(resposta);

  document.querySelector(".login").style.display = "flex";
  alert("Nome inválido ou já utilizado!");

  //perguntarNome();
}

function nomeOK(resposta) {
  userName = promptNome;
  document.querySelector(".login").style.display = "none";
  puxarMensagens();
  setInterval(puxarMensagens, 3000);
  timerOnline = setInterval(manterNaSala, 5000);
  puxarUsuarios();
  timerListaUsers = setInterval(puxarUsuarios, 10000);
}

function puxarMensagens() {
  const promessa = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );

  promessa.then(mensagensOK);
  promessa.catch(mensagensErro);
}

function manterNaSala() {
  let objNome = {
    name: userName,
  };
  const requisicaoOnline = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    objNome
  );

  requisicaoOnline.catch(erroOnline);
  requisicaoOnline.then(OKOnline);
}

function OKOnline(resposta) {
  console.log("Usuário ainda online");
}
function erroOnline(resposta) {
  console.log("erro ao manter online");
  console.log(resposta.response.status);
  clearInterval(timerOnline);
  clearInterval(timerListaUsers);
}

let dados = [];

function mensagensOK(resposta) {
  dados = resposta.data;
  arrayDeMensagens = [];
  dados.forEach(fazerLi);

  renderizarMensagens(arrayDeMensagens);
  document.querySelector("ul").lastChild.scrollIntoView();
}

function mensagensErro(resposta) {
  console.log("erro ao carregar mensagens");
  console.log(resposta.response.status);
}

let arrayDeMensagens = [];

function fazerLi(dado) {
  let li = "";
  if (dado.type === "message") {
    li = `<li class="mensagem">
                <p class="text">
                <span class="time">(${dado.time})</span>
                <span class="from">${dado.from}</span> para <span class="to">${dado.to}</span>: ${dado.text}</p>
            </li>`;
  } else if (dado.type === "status") {
    li = ` <li class="mensagem status">
                <p class="text">                    
                <span class="time">(${dado.time})</span>
                <span class="from">${dado.from}</span> ${dado.text}</p>
            </li>`;
  } else if (dado.type === "private_message" && dado.to === userName) {
    li = ` <li class="mensagem privada">
                <p class="text">                    
                <span class="time">(${dado.time})</span>
                <span class="from">${dado.from}</span> reservadamente para <span class="to">${dado.to}</span>: ${dado.text}</p>
            </li>`;
  }

  arrayDeMensagens.push(li);
}

function renderizarMensagens(listaDeLi) {
  const elementoUl = document.querySelector("ul");
  elementoUl.innerHTML = "";

  for (let i = 0; i < listaDeLi.length; i++) {
    elementoUl.innerHTML += listaDeLi[i];
  }
}

function enviarMensagem() {
  const campoDeMensagem = document.querySelector(".input-message");
  const objMensagem = {
    from: userName,
    to: "Todos",
    text: campoDeMensagem.value,
    type: "message",
  };

  const requisicaoMensagem = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    objMensagem
  );

  requisicaoMensagem.catch(envioErro);
  requisicaoMensagem.then(envioOk);

  campoDeMensagem.value = "";
}

function envioOk(resposta) {
  puxarMensagens();
}

function envioErro(resposta) {
  window.location.reload();
}

// Bônus

function botaoMenu() {
  const elementoMenu = document.querySelector(".sidemenu");
  elementoMenu.classList.toggle("escondido");
}

function puxarUsuarios() {
  const promessaUsers = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/participants"
  );

  promessaUsers.catch((resposta) =>
    console.log(`Erro ${resposta.response.status} ao carregar usuários!!`)
  );
  promessaUsers.then(renderizarUsuarios);
}

function renderizarUsuarios(resposta) {
  const listaUsuarios = resposta.data;

  const elementoLista = document.querySelector(".contacts");
  elementoLista.innerHTML = `<li data-identifier="participant">
                              <ion-icon name="people"></ion-icon>
                              <p>Todos</p>
                            </li>`;

  for (let i = 0; i < listaUsuarios.length; i++) {
    const liUsuario = `<li data-identifier="participant">
                        <ion-icon name="person-circle"></ion-icon>
                        <p>${listaUsuarios[i].name}</p>
                      </li>`;

    elementoLista.innerHTML += liUsuario;
  }
}

function entrada() {
  const input = document.querySelector(".inputUsername").value;

  document.querySelector(".entrada").style.display = "none";
  document.querySelector(".loading").style.display = "flex";
  perguntarNome(input);
}
