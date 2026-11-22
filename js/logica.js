
/*
 * ANIMALIA - Mini-analisador de avistamentos
 * Análise da fauna paraibana.
 */

// DADOS: seis espécies com quatro propriedades.
const especies = [
    { nome: "Preguiça", especie: "Bradypus variegatus", ambiente: "floresta", avistamentos: 12 },
    { nome: "Tatu", especie: "Tolypeutes tricinctus", ambiente: "caatinga", avistamentos: 7 },
    { nome: "Colhereiro", especie: "Platalea ajaja", ambiente: "manguezal", avistamentos: 3 },
    { nome: "Guará", especie: "Eudocimus ruber", ambiente: "manguezal", avistamentos: 15 },
    { nome: "Tartaruga", especie: "Eretmochelys imbricata", ambiente: "praia", avistamentos: 4 },
    { nome: "Sagui", especie: "Callithrix jacchus", ambiente: "floresta", avistamentos: 20 }
];

const LIMITE_MINIMO = 1;
const LIMITE_MAXIMO = 50;
const LIMITE_PADRAO = 10;

// Lê e valida o limite.
// Os parâmetros possuem valores padrão.
function lerLimite(minimo = LIMITE_MINIMO, maximo = LIMITE_MAXIMO) {
    let limite = null;
    let valido = false;

    while (!valido) {
        const entrada = prompt(
            `Quantos avistamentos tornam uma espécie "Frequente"?\n` +
            `Digite um número inteiro de ${minimo} a ${maximo}.`
        );

        if (entrada === null) {
            return null;
        }

        const texto = entrada.trim().replace(",", ".");

        if (texto === "") {
            alert("O campo está vazio. Digite um número.");
        } else {
            const numero = Number(texto);

            if (Number.isNaN(numero)) {
                alert("Digite um número válido.");
            } else if (!Number.isInteger(numero) || numero < minimo || numero > maximo) {
                alert(`Digite um número inteiro entre ${minimo} e ${maximo}.`);
            } else {
                limite = numero;
                valido = true;
            }
        }
    }

    return limite;
}

// Classifica a frequência dos avistamentos.
function classificarFrequencia(avistamentos, limite = LIMITE_PADRAO) {
    if (avistamentos >= limite) {
        return "Frequente";
    } else if (avistamentos >= limite / 2) {
        return "Ocasional";
    } else {
        return "Rara";
    }
}

// Retorna uma orientação de conservação conforme o ambiente.
function orientacaoPorAmbiente(ambiente) {
    switch (ambiente) {
        case "floresta":
            return "Preservar a mata e evitar o desmatamento.";
        case "caatinga":
            return "Proteger a vegetação nativa e combater a caça.";
        case "manguezal":
            return "Evitar poluição e aterros nas áreas de mangue.";
        case "praia":
            return "Não deixar lixo e respeitar a área de desova.";
        default:
            return "Ambiente sem orientação cadastrada.";
    }
}

// Normaliza o texto para facilitar a comparação dos nomes.
function normalizarTexto(texto) {
    return String(texto)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Solicita o nome de uma espécie.
function lerComando() {
    const nomes = especies.map((animal) => animal.nome).join(", ");

    const resposta = prompt(
        `Registrar um novo avistamento (+1).\n` +
        `Espécies: ${nomes}\n` +
        `Digite o nome da espécie ou "sair".`
    );

    return normalizarTexto(resposta ?? "sair");
}

// Registra novos avistamentos.
function registrarAvistamentos() {
    let comando = lerComando();

    while (comando !== "sair") {
        const encontrada = especies.find(
            (animal) => normalizarTexto(animal.nome) === comando
        );

        if (encontrada === undefined) {
            alert('Espécie não encontrada. Digite um nome válido ou "sair".');
        } else {
            encontrada.avistamentos++;
            alert(`${encontrada.nome}: agora são ${encontrada.avistamentos} avistamentos.`);
        }

        comando = lerComando();
    }
}

// ANALISAR: utiliza map, filter e reduce sem alterar o array original.
function analisar(limite = LIMITE_PADRAO) {

    // MAP: cria uma nova lista com os dados classificados.
    const relatorio = especies.map((animal) => ({
        nome: animal.nome,
        especie: animal.especie,
        ambiente: animal.ambiente,
        avistamentos: animal.avistamentos,
        frequencia: classificarFrequencia(animal.avistamentos, limite),
        orientacao: orientacaoPorAmbiente(animal.ambiente)
    }));

    // FILTER: seleciona somente as espécies frequentes.
    const frequentes = relatorio.filter(
        (animal) => animal.frequencia === "Frequente"
    );

    // REDUCE: soma todos os avistamentos.
    const total = relatorio.reduce(
        (soma, animal) => soma + animal.avistamentos,
        0
    );

    // REDUCE: encontra a espécie com mais avistamentos.
    const maisAvistada = relatorio.reduce((maior, animal) => {
        return animal.avistamentos > maior.avistamentos ? animal : maior;
    }, relatorio[0]);

    // Calcula a média.
    const media = total / relatorio.length;

    return {
        relatorio,
        total,
        frequentes,
        maisAvistada,
        media
    };
}

// EXIBIÇÃO: apresenta os resultados na página.
function exibirResultado(resultado, limite) {

    // Seleciona a área de resultado e verifica se ela existe.
    const saida = document.querySelector("#saida-analise");

    if (saida === null) {
        console.error("Área de resultado não encontrada.");
        return;
    }

    // Limpa os resultados anteriores.
    saida.textContent = "";

    const titulo = document.createElement("h3");
    titulo.textContent = "Resultado da análise";
    saida.appendChild(titulo);

    // Cria um elemento para cada animal.
    resultado.relatorio.forEach((animal) => {
        const card = document.createElement("article");
        card.classList.add("card-avistamento");

        const nome = document.createElement("h4");
        nome.textContent = animal.nome;

        const dados = document.createElement("p");
        dados.textContent =
            `Espécie: ${animal.especie} | ` +
            `Ambiente: ${animal.ambiente} | ` +
            `Avistamentos: ${animal.avistamentos}`;

        const frequencia = document.createElement("p");
        frequencia.textContent = `Classificação: ${animal.frequencia}`;
        frequencia.classList.add(
            animal.frequencia.toLowerCase()
        );

        const orientacao = document.createElement("p");
        orientacao.textContent = `Conservação: ${animal.orientacao}`;

        card.appendChild(nome);
        card.appendChild(dados);
        card.appendChild(frequencia);
        card.appendChild(orientacao);

        saida.appendChild(card);
    });

    // REDUCE: gera o resumo geral dos avistamentos.
    const resumo = resultado.relatorio.reduce((texto, animal) => {
        return texto +
            `${animal.nome}: ${animal.avistamentos} avistamentos. `;
    }, "");

    const resumoElemento = document.createElement("p");
    resumoElemento.classList.add("resumo-avistamentos");
    resumoElemento.textContent = resumo;

    saida.appendChild(resumoElemento);

    // Apresenta os dados no Console.
    console.table(resultado.relatorio);

    console.log(`Limite para Frequente: ${limite}`);
    console.log(`Total de avistamentos: ${resultado.total}`);
    console.log(`Média por espécie: ${resultado.media.toFixed(1)}`);
    console.log(`Espécies frequentes: ${resultado.frequentes.length}`);
    console.log(
        `Mais avistada: ${resultado.maisAvistada.nome} ` +
        `(${resultado.maisAvistada.avistamentos} avistamentos)`
    );
}

// FLUXO PRINCIPAL.
function iniciarAnalise() {
    const limiteInformado = lerLimite();

    const limite = limiteInformado ?? LIMITE_PADRAO;

    registrarAvistamentos();

    const resultado = analisar(limite);

    exibirResultado(resultado, limite);
}

// Seleciona o botão e verifica se ele existe.
const botaoAnalisar = document.querySelector("#botao-analisar");

if (botaoAnalisar !== null) {
    botaoAnalisar.addEventListener("click", iniciarAnalise);
}

// TESTES: funções disponíveis no Console.
console.log("Teste de classificação:");
console.log(classificarFrequencia(12, 10));
console.log(classificarFrequencia(7, 10));
console.log(classificarFrequencia(3, 10));

console.log("Teste de análise:");
console.log(analisar(10));
