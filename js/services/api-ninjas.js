/**
 * Serviço de Integração com Animals API (API Ninjas)
 * Documentação oficial: https://api-ninjas.com/api/animals
 *
 * Atua como fonte complementar de dados biológicos descritivos (dieta, características, taxonomia).
 *
 * SEGURANÇA E ARMAZENAMENTO DE CHAVES (Item 9.1):
 * - Em aplicações exclusivamente frontend hospedadas no GitHub Pages, chaves privadas de API
 *   NÃO devem ser embutidas em código-fonte aberto ou comitadas no repositório.
 * - Este módulo oferece suporte à inserção de chave pelo usuário em tempo de execução
 *   (armazenamento opcional em sessionStorage/localStorage) e provê uma base biológica
 *   de fallback detalhada para as espécies da Paraíba, garantindo funcionamento pleno mesmo
 *   sem uma chave externa configurada.
 */

const API_NINJAS_URL = 'https://api.api-ninjas.com/v1/animals';
const CHAVE_STORAGE_KEY = 'animalia_ninjas_api_key';

// Base descritiva biológica complementar para espécies da fauna paraibana (Fallback seguro e enriquecido)
const BASE_BIOLOGICA_COMPLEMENTAR = {
    'Callithrix jacchus': {
        dieta: 'Onívoro (frutos, insetos, exsudatos/gomas de árvores, néctar e pequenos vertebrados).',
        habitat_biologico: 'Florestas tropicais, matas ciliares e caatinga arbórea.',
        expectativa_vida: '10 a 16 anos em ambiente natural.',
        caracteristicas_principais: 'Pelagem cinza-esbranquiçada com tufos brancos característicos ao redor das orelhas e cauda longa anilhada.',
        taxonomia: { reino: 'Animalia', filo: 'Chordata', classe: 'Mammalia', ordem: 'Primates', familia: 'Callitrichidae' }
    },
    'Tolypeutes tricinctus': {
        dieta: 'Insetívoro especializado (formigas, cupins e larvas de besouros).',
        habitat_biologico: 'Caatinga semiárida, vegetação arbustiva xerófila e solos arenosos.',
        expectativa_vida: '12 a 15 anos.',
        caracteristicas_principais: 'Carapaça rígida dividida em três cintas móveis que permite o fechamento hermético do corpo em esfera.',
        taxonomia: { reino: 'Animalia', filo: 'Chordata', classe: 'Mammalia', ordem: 'Cingulata', familia: 'Chlamyphoridae' }
    },
    'Bradypus torquatus': {
        dieta: 'Folívoro estrito (folhas jovens e brotos de árvores nativas selecionadas).',
        habitat_biologico: 'Dossel de florestas úmidas da Mata Atlântica.',
        expectativa_vida: '12 a 20 anos.',
        caracteristicas_principais: 'Pescoço revestido por longa pelagem negra em formato de crina, movimentos lentos e garras recurvadas.',
        taxonomia: { reino: 'Animalia', filo: 'Chordata', classe: 'Mammalia', ordem: 'Pilosa', familia: 'Bradypodidae' }
    },
    'Bradypus variegatus': {
        dieta: 'Herbívoro / Folívoro (folhas, ramos tenros e brotos).',
        habitat_biologico: 'Florestas tropicais e matas costeiras.',
        expectativa_vida: '20 a 30 anos.',
        caracteristicas_principais: 'Três dedos com garras fortes em cada pata, pelagem marrom-acinzentada com manchas faciais características.',
        taxonomia: { reino: 'Animalia', filo: 'Chordata', classe: 'Mammalia', ordem: 'Pilosa', familia: 'Bradypodidae' }
    },
    'Eudocimus ruber': {
        dieta: 'Carnívoro / Malacófago (caranguejos, camarões e pequenos moluscos de manguezal).',
        habitat_biologico: 'Manguezais, lamas estuarinas e lagoas costeiras.',
        expectativa_vida: '15 a 20 anos.',
        caracteristicas_principais: 'Coloração vermelha vibrante resultante dos pigmentos de carotenoides extraídos de caranguejos que compõem sua dieta.',
        taxonomia: { reino: 'Animalia', filo: 'Chordata', classe: 'Aves', ordem: 'Pelecaniformes', familia: 'Threskiornithidae' }
    },
    'Platalea ajaja': {
        dieta: 'Carnívoro aquático (pequenos peixes, anfíbios, camarões e insetos aquáticos).',
        habitat_biologico: 'Pântanos, manguezais e brejos com lâmina d’água rasa.',
        expectativa_vida: '10 a 15 anos.',
        caracteristicas_principais: 'Bico longo e achatado em forma de espátula com sensores táteis sensíveis a movimentos na água turva.',
        taxonomia: { reino: 'Animalia', filo: 'Chordata', classe: 'Aves', ordem: 'Pelecaniformes', familia: 'Threskiornithidae' }
    },
    'Eretmochelys imbricata': {
        dieta: 'Espongívoro (alimenta-se principalmente de esponjas marinhas tóxicas e anêmonas).',
        habitat_biologico: 'Recifes de corais rasos, costões rochosos e oceano aberto.',
        expectativa_vida: '30 a 50 anos ou mais.',
        caracteristicas_principais: 'Carapaça com escudos córneos imbricados (sobrepostos) e bico afilado adaptado para extrair esponjas de fendas nos recifes.',
        taxonomia: { reino: 'Animalia', filo: 'Chordata', classe: 'Reptilia', ordem: 'Testudines', familia: 'Cheloniidae' }
    },
    'Puma concolor': {
        dieta: 'Carnívoro estrito (veados, tatus, mocós, roedores e mamíferos de médio porte).',
        habitat_biologico: 'Matas secas de Caatinga, serras rochosas e florestas montanas.',
        expectativa_vida: '10 a 13 anos na natureza.',
        caracteristicas_principais: 'Grande felino solitário com pelagem uniforme castanho-avermelhada e excelente capacidade de salto e camuflagem.',
        taxonomia: { reino: 'Animalia', filo: 'Chordata', classe: 'Mammalia', ordem: 'Carnivora', familia: 'Felidae' }
    },
    'Caiman latirostris': {
        dieta: 'Carnívoro generalista (caramujos, caranguejos, peixes, aves e pequenos mamíferos).',
        habitat_biologico: 'Lagoas, rios de fluxo lento, brejos e estuários com vegetação densa.',
        expectativa_vida: '40 a 50 anos.',
        caracteristicas_principais: 'Focinho largo e robusto com coloração amarelada na região da garganta em animais adultos.',
        taxonomia: { reino: 'Animalia', filo: 'Chordata', classe: 'Reptilia', ordem: 'Crocodilia', familia: 'Alligatoridae' }
    },
    'Kerodon rupestris': {
        dieta: 'Herbívoro (folhas secas, cascas de árvores e frutos da Caatinga).',
        habitat_biologico: 'Lagedos e fendas de formações rochosas graníticas do semiárido.',
        expectativa_vida: '5 a 8 anos.',
        caracteristicas_principais: 'Roedor sem cauda visível, com unhas arredondadas semelhantes a pequenos cascos que conferem aderência nas pedras.',
        taxonomia: { reino: 'Animalia', filo: 'Chordata', classe: 'Mammalia', ordem: 'Rodentia', familia: 'Caviidae' }
    }
};

/**
 * Obtém a chave de API configurada no navegador (se existente)
 */
export function obterChaveNinjas() {
    try {
        return localStorage.getItem(CHAVE_STORAGE_KEY) || sessionStorage.getItem(CHAVE_STORAGE_KEY) || '';
    } catch {
        return '';
    }
}

/**
 * Salva uma chave fornecida pelo usuário no navegador
 */
export function salvarChaveNinjas(chave, persistente = true) {
    if (!chave) return;
    try {
        if (persistente) {
            localStorage.setItem(CHAVE_STORAGE_KEY, chave.trim());
        } else {
            sessionStorage.setItem(CHAVE_STORAGE_KEY, chave.trim());
        }
    } catch (e) {
        console.warn('Não foi possível persistir a chave no navegador:', e);
    }
}

/**
 * Remove a chave configurada
 */
export function removerChaveNinjas() {
    try {
        localStorage.removeItem(CHAVE_STORAGE_KEY);
        sessionStorage.removeItem(CHAVE_STORAGE_KEY);
    } catch {}
}

/**
 * Consulta informações complementares na Animals API Ninjas
 * com fallback inteligente para a base biológica local.
 *
 * @param {string} nomeCientifico - Nome científico da espécie
 * @param {string} nomePopular - Nome popular da espécie
 * @returns {Promise<Object>} Dados biológicos complementares
 */
export async function buscarDadosComplementares(nomeCientifico = '', nomePopular = '') {
    // 1. Verificar se existe na base biológica enriquecida local
    if (nomeCientifico && BASE_BIOLOGICA_COMPLEMENTAR[nomeCientifico]) {
        return {
            sucesso: true,
            origem: 'Base Biológica Paraibana (Curada)',
            dados: BASE_BIOLOGICA_COMPLEMENTAR[nomeCientifico]
        };
    }

    // 2. Se o usuário configurou uma chave da API Ninjas, tentar consulta externa
    const chave = obterChaveNinjas();

    if (chave) {
        try {
            const termoBusca = extrairTermoParaNinjas(nomeCientifico, nomePopular);
            const url = `${API_NINJAS_URL}?name=${encodeURIComponent(termoBusca)}`;

            const controlador = new AbortController();
            const timeout = setTimeout(() => controlador.abort(), 5000);

            const resposta = await fetch(url, {
                signal: controlador.signal,
                headers: {
                    'X-Api-Key': chave,
                    'Accept': 'application/json'
                }
            });

            clearTimeout(timeout);

            if (resposta.ok) {
                const resultados = await resposta.json();
                if (Array.isArray(resultados) && resultados.length > 0) {
                    const animal = resultados[0];
                    return {
                        sucesso: true,
                        origem: 'Animals API (API Ninjas)',
                        dados: {
                            dieta: animal.characteristics?.diet || 'Não informada na base da API.',
                            habitat_biologico: animal.characteristics?.habitat || animal.locations?.join(', ') || 'Não especificado.',
                            expectativa_vida: animal.characteristics?.lifespan || 'Não especificada.',
                            caracteristicas_principais: animal.characteristics?.distinctive_feature || animal.characteristics?.slogan || 'Informações biológicas obtidas via API Ninjas.',
                            taxonomia: animal.taxonomy || {}
                        }
                    };
                }
            }
        } catch (erro) {
            console.warn('Aviso: Falha ao consultar Animals API Ninjas:', erro.message);
        }
    }

    // 3. Fallback genérico quando não há chave configurada ou termo não encontrado
    return {
        sucesso: true,
        origem: 'Fauna Paraibana',
        dados: {
            dieta: 'Alimentação nativa adaptada aos ecossistemas paraibanos.',
            habitat_biologico: 'Ocorrência registrada no estado da Paraíba.',
            expectativa_vida: 'Variável de acordo com as condições do habitat natural.',
            caracteristicas_principais: 'Espécie silvestre de relevância para o equilíbrio ecológico e biodiversidade regional.',
            taxonomia: {}
        }
    };
}

/**
 * Auxiliar para converter termos comuns para busca na API Ninjas
 */
function extrairTermoParaNinjas(cientifico, popular) {
    if (cientifico) {
        const partes = cientifico.split(' ');
        if (partes.length > 0) return partes[0];
    }
    return popular || 'animal';
}
