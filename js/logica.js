
// Dados iniciais das espécies
const especies = [
    {
        id: 1,
        nome: "Preguiça",
        especie: "Bradypus variegatus",
        ambiente: "floresta",
        avistamentos: 12,
        marcado: false
    },
    {
        id: 2,
        nome: "Tatu",
        especie: "Tolypeutes tricinctus",
        ambiente: "caatinga",
        avistamentos: 7,
        marcado: false
    },
    {
        id: 3,
        nome: "Colhereiro",
        especie: "Platalea ajaja",
        ambiente: "manguezal",
        avistamentos: 3,
        marcado: false
    },
    {
        id: 4,
        nome: "Guará",
        especie: "Eudocimus ruber",
        ambiente: "manguezal",
        avistamentos: 15,
        marcado: false
    },
    {
        id: 5,
        nome: "Tartaruga",
        especie: "Eretmochelys imbricata",
        ambiente: "praia",
        avistamentos: 4,
        marcado: false
    },
    {
        id: 6,
        nome: "Sagui",
        especie: "Callithrix jacchus",
        ambiente: "floresta",
        avistamentos: 20,
        marcado: false
    }
];

// Elementos da interface
const lista = document.querySelector("#lista-especies");
const resumo = document.querySelector("#resumo-lista");
const busca = document.querySelector("#busca-especies");
const filtro = document.querySelector("#filtro-especies");
const botaoEstado = document.querySelector("#botao-estado");
const controles = document.querySelector("#controles-especies");
const formulario = document.querySelector("#form-adicionar-especie");

// Orientação de conservação
function orientacaoPorAmbiente(ambiente) {
    switch (ambiente) {
        case "floresta":
            return "Preservar a vegetação e evitar o desmatamento.";

        case "caatinga":
            return "Combater a caça ilegal e preservar a vegetação nativa.";

        case "manguezal":
            return "Evitar a poluição e proteger o ecossistema.";

        case "praia":
            return "Manter as praias limpas e proteger os ninhos.";

        default:
            return "Preservar o ambiente natural da espécie.";
    }
}

// Classificação dos avistamentos
function classificarFrequencia(avistamentos, limite = 10) {
    if (avistamentos >= limite) {
        return "Frequente";
    } else if (avistamentos >= limite / 2) {
        return "Ocasional";
    }

    return "Rara";
}

// Cria um item da lista
function criarItem(animal) {
    const item = document.createElement("li");
    item.classList.add("card-avistamento");
    item.dataset.id = animal.id;

    const nome = document.createElement("h3");
    nome.textContent = animal.nome;

    const dados = document.createElement("p");
    dados.textContent =
        `Espécie: ${animal.especie} | ` +
        `Ambiente: ${animal.ambiente} | ` +
        `Avistamentos: ${animal.avistamentos}`;

    const frequencia = document.createElement("p");
    frequencia.textContent =
        `Classificação: ${classificarFrequencia(animal.avistamentos)}`;

    frequencia.classList.add(
        classificarFrequencia(animal.avistamentos).toLowerCase()
    );

    const orientacao = document.createElement("p");
    orientacao.textContent =
        `Conservação: ${orientacaoPorAmbiente(animal.ambiente)}`;

    const botaoMarcar = document.createElement("button");
    botaoMarcar.type = "button";
    botaoMarcar.dataset.acao = "marcar";
    botaoMarcar.textContent = animal.marcado
        ? "Desmarcar"
        : "Marcar";

    botaoMarcar.setAttribute(
        "aria-pressed",
        String(animal.marcado)
    );

    const botaoRemover = document.createElement("button");
    botaoRemover.type = "button";
    botaoRemover.dataset.acao = "remover";
    botaoRemover.textContent = "Remover";

    item.classList.toggle("marcado", animal.marcado);

    item.append(
        nome,
        dados,
        frequencia,
        orientacao,
        botaoMarcar,
        botaoRemover
    );

    return item;
}

// Desenha e atualiza a lista
function desenhar() {
    if (!lista || !resumo) {
        return;
    }

    const termo = busca.value.trim().toLowerCase();
    const tipoFiltro = filtro.value;

    const filtradas = especies.filter((animal) => {
        const correspondeNome = animal.nome
            .toLowerCase()
            .includes(termo);

        const correspondeFiltro =
            tipoFiltro === "todos" ||
            (tipoFiltro === "marcados" && animal.marcado) ||
            (tipoFiltro === "nao-marcados" && !animal.marcado);

        return correspondeNome && correspondeFiltro;
    });

    const elementos = filtradas.map(criarItem);

    lista.replaceChildren(...elementos);

    const marcados = especies.filter(
        (animal) => animal.marcado
    ).length;

    resumo.textContent =
        `Total: ${especies.length} espécies | ` +
        `Marcadas: ${marcados} | ` +
        `Não marcadas: ${especies.length - marcados}`;

    if (botaoEstado && controles) {
        const aberto = !controles.hidden;

        botaoEstado.setAttribute(
            "aria-expanded",
            String(aberto)
        );
    }
}

// Delegação de eventos
function tratarEventoLista(evento) {
    const botao = evento.target.closest("button[data-acao]");

    if (!botao || !lista.contains(botao)) {
        return;
    }

    const item = botao.closest("li[data-id]");

    if (!item) {
        return;
    }

    const id = Number(item.dataset.id);

    const animal = especies.find(
        (registro) => registro.id === id
    );

    if (!animal) {
        return;
    }

    if (botao.dataset.acao === "marcar") {
        animal.marcado = !animal.marcado;
    }

    if (botao.dataset.acao === "remover") {
        const indice = especies.findIndex(
            (registro) => registro.id === id
        );

        if (indice !== -1) {
            especies.splice(indice, 1);
        }
    }

    desenhar();
}

// Alterna a exibição dos controles
function alternarEstado() {
    if (!botaoEstado || !controles) {
        return;
    }

    controles.hidden = !controles.hidden;

    botaoEstado.setAttribute(
        "aria-expanded",
        String(!controles.hidden)
    );

    botaoEstado.textContent = controles.hidden
        ? "Mostrar controles"
        : "Ocultar controles";
}

// Adiciona uma nova espécie
function adicionarEspecie(evento) {
    evento.preventDefault();

    const campoNome = formulario.querySelector("#novo-nome");
    const campoEspecie = formulario.querySelector("#novo-especie");
    const campoAmbiente = formulario.querySelector("#novo-ambiente");
    const campoAvistamentos = formulario.querySelector("#novo-avistamentos");

    const nome = campoNome.value.trim();
    const especie = campoEspecie.value.trim();
    const ambiente = campoAmbiente.value;
    const avistamentos = Number(campoAvistamentos.value);

    if (
        nome === "" ||
        especie === "" ||
        ambiente === "" ||
        !Number.isInteger(avistamentos) ||
        avistamentos < 0 ||
        avistamentos > 50
    ) {
        alert("Preencha corretamente todos os campos.");
        return;
    }

    const novoAnimal = {
        id: Date.now(),
        nome,
        especie,
        ambiente,
        avistamentos,
        marcado: false
    };

    especies.push(novoAnimal);

    formulario.reset();

    desenhar();
}

// Inicialização
function iniciar() {
    if (lista) {
        lista.addEventListener("click", tratarEventoLista);
    }

    if (botaoEstado) {
        botaoEstado.addEventListener("click", alternarEstado);
    }

    if (busca) {
        busca.addEventListener("input", desenhar);
    }

    if (filtro) {
        filtro.addEventListener("change", desenhar);
    }

    if (formulario) {
        formulario.addEventListener("submit", adicionarEspecie);
    }

    desenhar();
}

iniciar();
