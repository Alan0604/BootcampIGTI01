let tabUsuarios = null;
let tabEstatistica = null;
let numberFormat = null;
let resultPesquisa = null;
let sexoMasculino = null;
let quantMasculino = 0;
let sexoFeminino = null;
let quantFeminino = 0;
let somaIdade = 0;
let mediaIdade = 0;
let campoPesquisa = null;

let filtrarPessoas = [];
let countUsuario = [];

window.addEventListener("load", () => {
  campoPesquisa = document.querySelector("#campoPesquisa");
  botaoBusca = document.querySelector("#botaoBusca");
  tabEstatistica = document.querySelector("#tabEstatistica");
  tabUsuarios = document.querySelector("#tabUsuarios");
  countUsuario = document.querySelector("#countUsuario");
  resultPesquisa = document.querySelector("#resultPesquisa");

  campoPesquisa.addEventListener("keyup", pesquisarTexto);

  numberFormat = Intl.NumberFormat("pt-BR");
  fetchPesquisas();
});

async function fetchPesquisas() {
  const res = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );
  const json = await res.json();
  countUsuario = json.results.map((pesquisa) => {
    const { gender, picture, name, dob } = pesquisa;
    return {
      genero: gender,
      img: picture.medium,
      name: `${name.first} ${name.last}`,
      idade: dob.age,
    };
  });
}

function pesquisarTexto(event) {
  let nameResult = "";
  if (event.type === "keyup" || event.type === "click") {
    nameResult = campoPesquisa.value;
    if (nameResult.length >= 1) {
      botaoBusca.removeAttribute("disabled");      
      botaoBusca.addEventListener("click", pesquisarTexto);
      if (event.type === "click" || event.key === "Enter") {
        filtrarPessoa(nameResult);
      }
    } else {
      botaoBusca.setAttribute("disabled", "disabled");
    }
  }
}

function filtrarPessoa(nameResult) {
  let pessoaFiltro = countUsuario.filter((pesquisa) => {
    return pesquisa.name.toLowerCase().indexOf(nameResult.toLowerCase()) !== -1;
  });

  pessoaFiltro.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  buscarUsuarios(pessoaFiltro);
}

function buscarUsuarios(pessoaFiltro = []) {
  //retorno da pesquisa
  let contarTodasPessoas = pessoaFiltro.length;

  let usuariosHTML = "<div>";
  pessoaFiltro.forEach((pesquisa) => {
    const usuarioHTML = `
    <div class="pesquisa">
        <div>
            <img src="${pesquisa.img}">
            ${pesquisa.name}, ${pesquisa.idade} anos 
        </div>
    </div>
    `;
    usuariosHTML += usuarioHTML;
  });

  usuariosHTML += "</div>";
  tabUsuarios.innerHTML = usuariosHTML;

  totalPesquisado.innerHTML =
    "<i class='material-icons'>person</i> <b>" + contarTodasPessoas + "</b> Usuário(s) encontrado(s)";

  //estatística
  quantMasculino = pessoaFiltro.filter((pesquisa) => {
    return pesquisa.genero === "male";
  }).length;

  quantFeminino = pessoaFiltro.filter((pesquisa) => {
    return pesquisa.genero === "female";
  }).length;

  somaIdade = pessoaFiltro.reduce((acc, curr) => {
    return acc + curr.idade;
  }, 0);

  mediaIdade = somaIdade / contarTodasPessoas;

  if (somaIdade !== 0) {
    let estatisticasHTML = "<div>";
    const estatisticaHTML = `
    <div class="estatistica">
        <div>
        <i class='material-icons'>people</i> Sexo masculino:<b> ${quantMasculino}</b> </br>
            <i class='material-icons'>people</i> Sexo feminino:<b> ${quantFeminino}</b> </br>
            <i class='material-icons'>cake</i> Soma das idades:<b> ${somaIdade}</b> anos </br>
            <i class='material-icons'>show_chart</i> Média das Idades: <b>${formatarMedia(mediaIdade)}</b> anos
        </div>
    </div>
    `;
    estatisticasHTML += estatisticaHTML;
    estatisticasHTML += "</div>";
    tabEstatistica.innerHTML = estatisticasHTML;
    
    resultEstatistica.innerHTML = "<i class='material-icons'>poll</i> Estatística";
  }
}

function formatarMedia(numero) {
  return numberFormat.format(numero.toFixed(2));
}
