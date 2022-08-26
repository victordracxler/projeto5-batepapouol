let userName = "";

function perguntarNome() {
  userName = prompt("Escolha um nome de usuário");
  const objNome = {
    name: userName,
  };

  const requisicaoNome = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    objNome
  );

  requisicaoNome.then();
  requisicaoNome.catch(nomeInvalido);
}

function nomeInvalido(resposta) {
  alert("Nome inválido ou já utilizado!");
  perguntarNome();
}

function puxarMensagens() {
  const promessa = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );

  promessa.then(respostaChegou);
  promessa.catch(deuErro);
}
puxarMensagens();
//setInterval(puxarMensagens, 3000);

let dados = [];

function respostaChegou(resposta) {
  dados = resposta.data;
  dados.forEach(fazerLi);

  renderizarMensagens(arrayDeMensagens);
  document.querySelector("ul").lastChild.scrollIntoView();
}

function deuErro(resposta) {
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
  } else if (dado.type === "private_message") {
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
