/*
 * ============================================================
 * ANIMALIA - Mini-analisador de avistamentos da fauna paraibana
 * ============================================================
 * TEMA
 *   Registro de avistamentos de animais da fauna da Paraíba
 *   (projeto Animalia, Projeto Integrador Front-end).
 *
 * ENTRADA
 *   1) Um limite de avistamentos (número inteiro de 1 a 50) que define
 *      quando uma espécie é considerada "Frequente".
 *   2) Nomes de espécies digitados pela pessoa para somar +1 avistamento,
 *      repetindo até ela digitar "sair".
 *
 * PROCESSAMENTO
 *   - Valida o limite (Cancelar, vazio, texto e fora da faixa).
 *   - Classifica cada espécie em Frequente / Ocasional / Rara (if / else if / else).
 *   - Escolhe uma orientação de conservação conforme o ambiente (switch).
 *   - Resume o conjunto: total, média, quantidade de frequentes e a mais avistada.
 *
 * SAÍDA
 *   - Tabela no console (console.table), frases com template literal
 *     e o mesmo texto exibido na página (#saida-analise).
 *
 * TESTE DE MESA (limite = 10 e "sair" digitado de primeira, sem novos registros)
 *   Faixas: avistamentos >= 10 -> Frequente | >= 5 -> Ocasional | senão -> Rara
 *
 *   volta | i | espécie    | avist. | frequência | total | frequentes | mais avistada
 *   ------+---+------------+--------+------------+-------+------------+--------------
 *     1   | 0 | Preguiça   |   12   | Frequente  |  12   |     1      | Preguiça (12)
 *     2   | 1 | Tatu       |    7   | Ocasional  |  19   |     1      | Preguiça (12)
 *     3   | 2 | Colhereiro |    3   | Rara       |  22   |     1      | Preguiça (12)
 *
 *   Ao final das 6 voltas: total = 61, frequentes = 3, média = 10.2
 *   e a mais avistada é o Sagui (20). Esses valores devem aparecer no console.
 * ============================================================
 */

// ------------------------------------------------------------
// DADOS: 6 espécies com 4 propriedades cada.
// Os números de avistamentos são exemplos fictícios do projeto.
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// ENTRADA: lê o limite com prompt, converte com Number() e valida.
// Retorna o número válido ou null se a pessoa clicar em Cancelar.
// ------------------------------------------------------------
function lerLimite(minimo, maximo) {
    let limite = null;
    let valido = false;

    while (!valido) {
        const entrada = prompt(
            `Quantos avistamentos uma espécie precisa ter para ser "Frequente"?\n` +
            `Digite um número inteiro de ${minimo} a ${maximo}.`
        );

        if (entrada === null) {
            // Cancelar: sai da leitura sem valor
            return null;
        }

        const texto = entrada.trim().replace(",", ".");

        if (texto === "") {
            alert("O campo está vazio. Digite um número.");
        } else {
            const numero = Number(texto);

            if (Number.isNaN(numero)) {
                alert("Isso não é um número. Digite apenas dígitos, por exemplo: 10.");
            } else if (!Number.isInteger(numero) || numero < minimo || numero > maximo) {
                alert(`Valor fora da faixa. Digite um inteiro entre ${minimo} e ${maximo}.`);
            } else {
                limite = numero;
                valido = true; // atualiza a condição de saída do laço
            }
        }
    }

    return limite;
}

// ------------------------------------------------------------
// CLASSIFICAÇÃO: if / else if / else (3 faixas), da maior para a menor.
// ------------------------------------------------------------
function classificarFrequencia(avistamentos, limite) {
    let frequencia;

    if (avistamentos >= limite) {
        frequencia = "Frequente";
    } else if (avistamentos >= limite / 2) {
        frequencia = "Ocasional";
    } else {
        frequencia = "Rara";
    }

    return frequencia;
}

// ------------------------------------------------------------
// SWITCH: uma orientação para cada ambiente, com break e default.
// ------------------------------------------------------------
function orientacaoPorAmbiente(ambiente) {
    let orientacao;

    switch (ambiente) {
        case "floresta":
            orientacao = "Preservar a mata e evitar o desmatamento.";
            break;
        case "caatinga":
            orientacao = "Proteger a vegetação nativa e combater a caça.";
            break;
        case "manguezal":
            orientacao = "Evitar poluição e aterros nas áreas de mangue.";
            break;
        case "praia":
            orientacao = "Não deixar lixo e respeitar a área de desova.";
            break;
        default:
            orientacao = "Ambiente sem orientação cadastrada.";
            break;
    }

    return orientacao;
}

// Remove acentos e maiúsculas para comparar o que a pessoa digita
function normalizarTexto(texto) {
    return String(texto)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
}

// ------------------------------------------------------------
// WHILE: pede nomes de espécies até a pessoa digitar "sair".
// A condição é atualizada no fim de cada volta (sem continue).
// ------------------------------------------------------------
function lerComando() {
    const nomes = especies.map((e) => e.nome).join(", ");
    const resposta = prompt(
        `Registrar um novo avistamento (+1).\n` +
        `Espécies: ${nomes}\n` +
        `Digite o nome da espécie ou "sair" para continuar.`
    );

    // Cancelar (null) é tratado como "sair"
    return normalizarTexto(resposta ?? "sair");
}

function registrarAvistamentos() {
    let comando = lerComando();

    while (comando !== "sair") {
        const encontrada = especies.find((e) => normalizarTexto(e.nome) === comando);

        if (encontrada === undefined) {
            alert("Espécie não encontrada. Confira o nome ou digite \"sair\".");
        } else {
            encontrada.avistamentos += 1;
            alert(`${encontrada.nome}: agora são ${encontrada.avistamentos} avistamentos.`);
        }

        comando = lerComando(); // atualiza a condição de saída
    }
}

// ------------------------------------------------------------
// RESUMO: for com 4 padrões (contador, acumulador, máximo e média).
// ------------------------------------------------------------
function analisar(limite) {
    let total = 0;                 // acumulador
    let frequentes = 0;            // contador
    let maisAvistada = especies[0]; // máximo
    const relatorio = [];

    // i < length (e não <=) para não passar do último índice
    for (let i = 0; i < especies.length; i++) {
        const item = especies[i];
        const frequencia = classificarFrequencia(item.avistamentos, limite);
        const orientacao = orientacaoPorAmbiente(item.ambiente);

        total += item.avistamentos;

        if (frequencia === "Frequente") {
            frequentes++;
        }

        if (item.avistamentos > maisAvistada.avistamentos) {
            maisAvistada = item;
        }

        relatorio.push({
            nome: item.nome,
            especie: item.especie,
            ambiente: item.ambiente,
            avistamentos: item.avistamentos,
            frequencia: frequencia,
            orientacao: orientacao
        });
    }

    const media = total / especies.length; // média

    return { relatorio, total, frequentes, maisAvistada, media };
}

// ------------------------------------------------------------
// SAÍDA: console.table + frases com template literal.
// ------------------------------------------------------------
function exibirResultado(resultado, limite) {
    const { relatorio, total, frequentes, maisAvistada, media } = resultado;

    const palavraEspecie = frequentes === 1 ? "espécie" : "espécies";
    const situacao = frequentes > 0
        ? `${frequentes} ${palavraEspecie} com avistamentos frequentes`
        : "nenhuma espécie com avistamentos frequentes";

    const frases = [
        `Limite para "Frequente": ${limite} avistamentos.`,
        `Total de avistamentos: ${total}.`,
        `Média por espécie: ${media.toFixed(1)}.`,
        `Situação: ${situacao}.`,
        `Mais avistada: ${maisAvistada.nome} (${maisAvistada.especie}) com ${maisAvistada.avistamentos} avistamentos.`
    ];

    console.table(relatorio);
    frases.forEach((frase) => console.log(frase));

    // Mostra também na página, se a área de saída existir
    const saida = document.getElementById("saida-analise");
    if (saida !== null) {
        saida.textContent = frases.join("\n");
    }
}

// ------------------------------------------------------------
// FLUXO PRINCIPAL
// ------------------------------------------------------------
function iniciarAnalise() {
    // ?? usa o limite padrão quando a pessoa cancela (null)
    const limite = lerLimite(LIMITE_MINIMO, LIMITE_MAXIMO) ?? LIMITE_PADRAO;

    registrarAvistamentos();

    const resultado = analisar(limite);
    exibirResultado(resultado, limite);
}

// Liga o botão da página à análise (o script usa defer, então o DOM já existe)
const botaoAnalisar = document.getElementById("botao-analisar");
if (botaoAnalisar !== null) {
    botaoAnalisar.addEventListener("click", iniciarAnalise);
}