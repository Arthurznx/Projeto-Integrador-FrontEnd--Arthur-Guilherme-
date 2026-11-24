/**
 * Serviço de Integração com a API do iNaturalist
 * Documentação oficial: https://api.inaturalist.org/v1/
 *
 * Consulta observações com ocorrência comprovada na Paraíba (place_id=12593),
 * aplicando internacionalização (locale=pt-BR), seleção de fotografias em alta resolução,
 * atribuição autoral, validação taxonômica e desduplicação rigorosa.
 */

import { normalizarEntidadeFauna, formatarStatusConservacao, FAUNA_PARAIBA_PADRAO, DICIONARIO_TAXONOMICO_BR } from './fauna-service.js';

const INAT_API_BASE = 'https://api.inaturalist.org/v1';
const ID_LUGAR_PARAIBA = 12593; // Identificador oficial do Estado da Paraíba no iNaturalist

// Cache em memória para evitar requisições redundantes
const cacheRequisicoes = new Map();

/**
 * Normaliza string para comparação sem acento e em caixa baixa
 * @param {string} str
 * @returns {string}
 */
function normalizarTexto(str) {
    if (!str) return '';
    return str.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

/**
 * Gera chave canônica única para uma espécie considerando taxon_id e sinônimos
 * @param {Object} animal
 * @returns {string}
 */
function obterChaveCanonica(animal) {
    if (animal.taxon_id) {
        return `taxon-${animal.taxon_id}`;
    }
    const sp = (animal.especie || '').trim();
    if (sp && DICIONARIO_TAXONOMICO_BR[sp]) {
        return `taxon-${DICIONARIO_TAXONOMICO_BR[sp].taxon_id}`;
    }
    return `sp-${normalizarTexto(sp)}`;
}

/**
 * Consulta observações recentes e com fotos da fauna na Paraíba
 * @param {Object} opcoes - Parâmetros de filtro e paginação
 * @returns {Promise<Array>} Lista de espécies normalizadas (Entidade Fauna)
 */
export async function buscarEspeciesParaiba({ grupo = 'todos', termo = '', pagina = 1, limite = 24 } = {}) {
    const chaveCache = `inat-${grupo}-${termo}-${pagina}-${limite}`;

    if (cacheRequisicoes.has(chaveCache)) {
        return cacheRequisicoes.get(chaveCache);
    }

    // Mapeamento dos grupos para iconic_taxa do iNaturalist
    const mapaTaxons = {
        mamiferos: 'Mammalia',
        aves: 'Aves',
        repteis: 'Reptilia',
        anfibios: 'Amphibia',
        peixes: 'Actinopterygii,Chondrichthyes',
        invertebrados: 'Insecta,Mollusca,Arachnida,Crustacea',
        todos: 'Mammalia,Aves,Reptilia,Amphibia,Actinopterygii,Mollusca,Arachnida,Insecta'
    };

    const iconicTaxa = mapaTaxons[grupo] || mapaTaxons.todos;

    // Se estiver na página 1 e sem busca por termo, o catálogo base certificado é a fundação
    let catalogoBase = [...FAUNA_PARAIBA_PADRAO];

    if (grupo !== 'todos') {
        const grupoMapeado = {
            mamiferos: 'Mamífero',
            aves: 'Ave',
            repteis: 'Réptil',
            anfibios: 'Anfíbio',
            peixes: 'Peixe',
            invertebrados: 'Invertebrado'
        }[grupo];

        if (grupoMapeado) {
            catalogoBase = catalogoBase.filter(i => i.tipo_animal === grupoMapeado);
        }
    }

    // Se houver termo de busca, filtrar catálogo base antecipadamente
    if (termo && termo.trim() !== '') {
        const t = normalizarTexto(termo);
        catalogoBase = catalogoBase.filter(animal => {
            const n = normalizarTexto(animal.nome);
            const e = normalizarTexto(animal.especie);
            const tp = normalizarTexto(animal.tipo_animal);
            const h = normalizarTexto(animal.habitat);
            const b = normalizarTexto(animal.bioma);
            const loc = normalizarTexto(animal.local_observacao);
            return n.includes(t) || e.includes(t) || tp.includes(t) || h.includes(t) || b.includes(t) || loc.includes(t);
        });
    }

    // Mapa de espécies já presentes para impedir qualquer duplicidade
    const chavesRegistradas = new Set(catalogoBase.map(obterChaveCanonica));

    // Se página for 1 e já tivermos o catálogo base robusto, podemos consultar iNaturalist para complementar
    const url = new URL(`${INAT_API_BASE}/observations`);
    url.searchParams.set('place_id', String(ID_LUGAR_PARAIBA));
    url.searchParams.set('locale', 'pt-BR');
    url.searchParams.set('photos', 'true');
    url.searchParams.set('quality_grade', 'research'); // Apenas observações com grau de pesquisa comunitário
    url.searchParams.set('hrank', 'species');
    url.searchParams.set('lrank', 'subspecies');
    url.searchParams.set('order_by', 'votes');
    url.searchParams.set('order', 'desc');
    url.searchParams.set('page', String(pagina));
    url.searchParams.set('per_page', String(limite));
    url.searchParams.set('iconic_taxa', iconicTaxa);

    if (termo && termo.trim() !== '') {
        url.searchParams.set('q', termo.trim());
    }

    try {
        const controlador = new AbortController();
        const timeout = setTimeout(() => controlador.abort(), 6000);

        const resposta = await fetch(url.toString(), {
            signal: controlador.signal,
            headers: {
                'Accept': 'application/json'
            }
        });

        clearTimeout(timeout);

        if (!resposta.ok) {
            throw new Error(`Falha na resposta do iNaturalist: status HTTP ${resposta.status}`);
        }

        const dados = await resposta.json();
        const listaNovas = [];

        if (dados.results && Array.isArray(dados.results)) {
            for (const obs of dados.results) {
                if (!obs.taxon || !obs.taxon.name) continue;

                // Selecionar fotografia em alta resolução
                let foto = null;
                let credito = 'iNaturalist';

                if (obs.photos && obs.photos.length > 0) {
                    const fotoObj = obs.photos[0];
                    foto = fotoObj.url ? fotoObj.url.replace('/square.', '/large.').replace('/medium.', '/large.') : null;
                    credito = fotoObj.attribution || (obs.user ? `Observado por ${obs.user.name || obs.user.login}` : 'iNaturalist');
                } else if (obs.taxon.default_photo) {
                    foto = obs.taxon.default_photo.medium_url ? obs.taxon.default_photo.medium_url.replace('/square.', '/large.').replace('/medium.', '/large.') : null;
                    credito = obs.taxon.default_photo.attribution || 'iNaturalist';
                }

                // Status de conservação oficial
                let riscoBruto = 'Pouco preocupante';
                if (obs.taxon.conservation_status && obs.taxon.conservation_status.status_name) {
                    riscoBruto = obs.taxon.conservation_status.status_name;
                } else if (obs.taxon.threatened) {
                    riscoBruto = 'Vulnerável';
                }
                const statusFormatado = formatarStatusConservacao(riscoBruto);

                // Localização precisa e data
                let localFormatado = obs.place_guess || 'Paraíba, Brasil';
                let municipio = 'Paraíba';
                if (obs.place_guess) {
                    const partes = obs.place_guess.split(',');
                    municipio = partes[0].trim();
                }

                let dataObs = 'Registro verificado';
                if (obs.observed_on_details && obs.observed_on_details.date) {
                    dataObs = obs.observed_on_details.date;
                    localFormatado += ` • ${dataObs}`;
                } else if (obs.observed_on) {
                    dataObs = obs.observed_on;
                    localFormatado += ` • ${dataObs}`;
                }

                // Normalização com resolução de nomes populares e garantia de não duplicação
                const animalNormalizado = normalizarEntidadeFauna({
                    id_fauna: `inat-${obs.taxon.id}`,
                    taxon_id: obs.taxon.id,
                    nome: obs.taxon.preferred_common_name || obs.species_guess || '',
                    especie: obs.taxon.name,
                    tipo_animal: obs.taxon.iconic_taxon_name,
                    risco_preservacao: statusFormatado.nome,
                    codigo_status: statusFormatado.codigo,
                    foto_url: foto || 'assets/imagens/placeholder-animal.svg',
                    foto_credito: credito,
                    foto_atribuicao: credito,
                    municipio: municipio,
                    data_observacao: dataObs,
                    local_observacao: localFormatado,
                    fonte: 'iNaturalist API'
                });

                // Chave de desduplicação
                const chave = obterChaveCanonica(animalNormalizado);
                if (chavesRegistradas.has(chave)) {
                    continue; // Descarta repetições de espécies já presentes
                }
                chavesRegistradas.add(chave);

                // Se houver termo de busca, filtrar
                if (termo && termo.trim() !== '') {
                    const t = normalizarTexto(termo);
                    const n = normalizarTexto(animalNormalizado.nome);
                    const e = normalizarTexto(animalNormalizado.especie);
                    const tp = normalizarTexto(animalNormalizado.tipo_animal);
                    const h = normalizarTexto(animalNormalizado.habitat);
                    const b = normalizarTexto(animalNormalizado.bioma);
                    const loc = normalizarTexto(animalNormalizado.local_observacao);
                    if (!n.includes(t) && !e.includes(t) && !tp.includes(t) && !h.includes(t) && !b.includes(t) && !loc.includes(t)) {
                        continue;
                    }
                }

                listaNovas.push(animalNormalizado);
            }
        }

        // Se for página 1, combinar o catálogo base com as novas espécies únicas
        const resultadoFinal = pagina === 1 ? [...catalogoBase, ...listaNovas] : listaNovas;
        cacheRequisicoes.set(chaveCache, resultadoFinal);
        return resultadoFinal;

    } catch (erro) {
        console.warn('Aviso: Operando com o catálogo certificado da fauna paraibana (modo offline/resiliente):', erro.message);
        cacheRequisicoes.set(chaveCache, catalogoBase);
        return catalogoBase;
    }
}
