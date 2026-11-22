
// Dados iniciais das espécies da fauna
const especies = [
    {
        nome: "Preguiça",
        especie: "Bradypus variegatus",
        ambiente: "floresta",
        avistamentos: 12
    },
    {
        nome: "Tatu",
        especie: "Tolypeutes tricinctus",
        ambiente: "caatinga",
        avistamentos: 7
    },
    {
        nome: "Colhereiro",
        especie: "Platalea ajaja",
        ambiente: "manguezal",
        avistamentos: 3
    },
    {
        nome: "Guará",
        especie: "Eudocimus ruber",
        ambiente: "manguezal",
        avistamentos: 15
    },
    {
        nome: "Tartaruga",
        especie: "Eretmochelys imbricata",
        ambiente: "praia",
        avistamentos: 4
    },
    {
        nome: "Sagui",
        especie: "Callithrix jacchus",
        ambiente: "floresta",
        avistamentos: 20
    }
];

// Limites utilizados na análise
const LIMITE_MINIMO = 1;
const LIMITE_MAXIMO = 50;
const LIMITE_PADRAO = 10;


// Solicita e valida o limite de avistamentos
function lerLimite(minimo = LIMITE_MINIMO, maximo = LIMITE_MAXIMO) {
    let limite;

    while (true) {
        const resposta = prompt(
            `Digite o limite de avistamentos (${minimo} a ${maximo}):`
        );

        if (resposta === null) {
            return null;
        }

        limite = Number(resposta);

        if (
            resposta.trim() !== "" &&
            Number.isInteger(limite) &&
            limite >= minimo &&
            limite <= maximo
        ) {
            return limite;
        }

        alert(`Digite um número inteiro entre ${minimo} e ${maximo}.`);
    }
}


// Classifica a frequência de avistamentos
function classificarFrequencia(avistamentos, limite = LIMITE_PADRAO) {
    if (avistamentos >= limite) {
        return "Frequente";
    } else if (avistamentos >= limite / 2) {
        return "Ocasional";
    } else {
        return "Rara";
    }
}


// Retorna uma orientação de conservação conforme o ambiente
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


// Padroniza textos para facilitar a comparação
function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}


// Solicita uma espécie para consultar
function lerComando() {
    const nomes = especies.map((animal) => animal.nome).join(", ");

    const resposta = prompt(
        `Digite o nome de uma espécie para registrar um avistamento.\n\nEspécies: ${nomes}\n\nDigite "sair" para finalizar.`
    );

    return normalizarTexto(resposta ?? "sair");
}


// Registra novos avistamentos
function registrarAvistamentos() {
    while (true) {
        const comando = lerComando();

        if (comando === "sair") {
            break;
        }

        const animalEncontrado = especies.find(
            (animal) => normalizarTexto(animal.nome) === comando
        );

        if (animalEncontrado) {
            animalEncontrado.avistamentos++;

            alert(
                `Avistamento registrado para ${animalEncontrado.nome}!`
            );
        } else {
            alert("Espécie não encontrada. Tente novamente.");
        }
    }
}


// Realiza os cálculos da análise
function analisar(limite = LIMITE_PADRAO) {

    // Cria uma nova lista com os dados analisados
    const relatorio = especies.map((animal) => ({
        nome: animal.nome,
        especie: animal.especie,
        ambiente: animal.ambiente,
        avistamentos: animal.avistamentos,
        frequencia: classificarFrequencia(
            animal.avistamentos,
            limite
        ),
        orientacao: orientacaoPorAmbiente(animal.ambiente)
    }));

    // Filtra as espécies com frequência alta
    const frequentes = relatorio.filter(
        (animal) => animal.frequencia === "Frequente"
    );

    // Calcula o total de avistamentos
    const total = relatorio.reduce(
        (soma, animal) => soma + animal.avistamentos,
        0
    );

    // Identifica a espécie mais avistada
    const maisAvistada = relatorio.reduce(
        (maior, animal) =>
            animal.avistamentos > maior.avistamentos ? animal : maior,
        relatorio[0]
    );

    // Calcula a média de avistamentos
    const media = total / relatorio.length;

    return {
        relatorio,
        total,
        frequentes,
        maisAvistada,
        media
    };
}


// Exibe os resultados na página
function exibirResultado(resultado, limite) {
    const saida = document.querySelector("#saida-analise");

    // Verifica se a área de resultados existe
    if (saida === null) {
        console.error("Área de resultados não encontrada.");
        return;
    }

    // Limpa os resultados anteriores
    saida.textContent = "";

    const titulo = document.createElement("h3");
    titulo.textContent = "Resultado da análise";
    saida.appendChild(titulo);

    // Cria um card para cada espécie
    resultado.relatorio.forEach((animal) => {
        const card = document.createElement("article");
        card.classList.add("card-avistamento");

        const nome = document.createElement("h4");
        nome.textContent = animal.nome;

        const dados = document.createElement("p");
        dados.textContent =
            `Espécie: ${animal.especie} | Ambiente: ${animal.ambiente} | Avistamentos: ${animal.avistamentos}`;

        const frequencia = document.createElement("p");
        frequencia.textContent = `Classificação: ${animal.frequencia}`;
        frequencia.classList.add(animal.frequencia.toLowerCase());

        const orientacao = document.createElement("p");
        orientacao.textContent = `Conservação: ${animal.orientacao}`;

        card.appendChild(nome);
        card.appendChild(dados);
        card.appendChild(frequencia);
        card.appendChild(orientacao);

        saida.appendChild(card);
    });

    // Gera um resumo utilizando reduce
    const resumo = resultado.relatorio.reduce(
        (texto, animal) =>
            texto + `${animal.nome}: ${animal.avistamentos} avistamentos. `,
        ""
    );

    const resumoElemento = document.createElement("p");
    resumoElemento.classList.add("resumo-avistamentos");
    resumoElemento.textContent = resumo;

    saida.appendChild(resumoElemento);

    // Exibe os indicadores gerais
    const indicadores = document.createElement("p");
    indicadores.classList.add("resumo-avistamentos");

    indicadores.textContent =
        `Total: ${resultado.total} | ` +
        `Média: ${resultado.media.toFixed(1)} | ` +
        `Espécies frequentes: ${resultado.frequentes.length} | ` +
        `Mais avistada: ${resultado.maisAvistada.nome}`;

    saida.appendChild(indicadores);

    // Exibe os resultados no Console
    console.table(resultado.relatorio);

    console.log(`Limite utilizado: ${limite}`);
    console.log(`Total de avistamentos: ${resultado.total}`);
    console.log(`Média de avistamentos: ${resultado.media.toFixed(1)}`);
    console.log(`Espécies frequentes: ${resultado.frequentes.length}`);
    console.log(`Espécie mais avistada: ${resultado.maisAvistada.nome}`);
}


// Controla o início da análise
function iniciarAnalise() {
    const limiteInformado = lerLimite();
    const limite = limiteInformado ?? LIMITE_PADRAO;

    registrarAvistamentos();

    const resultado = analisar(limite);

    exibirResultado(resultado, limite);
}


// Seleciona o botão e verifica sua existência
const botaoAnalisar = document.querySelector("#botao-analisar");

if (botaoAnalisar !== null) {
    botaoAnalisar.addEventListener("click", iniciarAnalise);
}


// Testes das funções no Console
console.log("Teste de classificação:");

console.log(classificarFrequencia(12, 10));
console.log(classificarFrequencia(7, 10));
console.log(classificarFrequencia(3, 10));

console.log("Teste de análise:");

console.log(analisar(10));
