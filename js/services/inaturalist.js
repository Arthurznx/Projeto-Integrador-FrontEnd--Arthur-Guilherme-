/**
 * Serviço de Integração com a API do iNaturalist
 * Documentação oficial: https://api.inaturalist.org/v1/
 *
 * Consulta observações com ocorrência comprovada na Paraíba (place_id=12593),
 * aplicando internacionalização (locale=pt-BR), seleção de fotografias em alta resolução,
 * atribuição autoral, paginação e suporte a múltiplos grupos taxonômicos.
 */

import { normalizarEntidadeFauna, formatarStatusConservacao, FAUNA_PARAIBA_PADRAO } from './fauna-service.js';

const INAT_API_BASE = 'https://api.inaturalist.org/v1';
const ID_LUGAR_PARAIBA = 12593; // Identificador oficial do Estado da Paraíba no iNaturalist

// Cache em memória para evitar requisições redundantes
const cacheRequisicoes = new Map();

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

    const url = new URL(`${INAT_API_BASE}/observations`);
    url.searchParams.set('place_id', String(ID_LUGAR_PARAIBA));
    url.searchParams.set('locale', 'pt-BR');
    url.searchParams.set('photos', 'true');
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
        const timeout = setTimeout(() => controlador.abort(), 7000);

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

        if (!dados.results || !Array.isArray(dados.results)) {
            throw new Error('Formato de resposta inesperado da API iNaturalist.');
        }

        // Normalizar e desduplicar espécies retornadas
        const especiesVistas = new Set();
        const listaNormalizada = [];

        for (const obs of dados.results) {
            if (!obs.taxon || !obs.taxon.name) continue;

            const nomeCientifico = obs.taxon.name;
            if (especiesVistas.has(nomeCientifico)) continue;
            especiesVistas.add(nomeCientifico);

            // Obter fotografia em melhor resolução disponível (large / medium em vez de square)
            let foto = null;
            let credito = 'iNaturalist';

            if (obs.photos && obs.photos.length > 0) {
                const fotoObj = obs.photos[0];
                foto = fotoObj.url ? fotoObj.url.replace('/square.', '/large.') : null;
                credito = fotoObj.attribution || (obs.user ? `Observado por ${obs.user.name || obs.user.login}` : 'iNaturalist');
            } else if (obs.taxon.default_photo) {
                foto = obs.taxon.default_photo.medium_url ? obs.taxon.default_photo.medium_url.replace('/square.', '/large.') : null;
                credito = obs.taxon.default_photo.attribution || 'iNaturalist';
            }

            // Normalização do status de conservação (sem siglas)
            let riscoBruto = 'Pouco preocupante';
            if (obs.taxon.conservation_status && obs.taxon.conservation_status.status_name) {
                riscoBruto = obs.taxon.conservation_status.status_name;
            } else if (obs.taxon.threatened) {
                riscoBruto = 'Vulnerável';
            }
            const statusFormatado = formatarStatusConservacao(riscoBruto);

            // Localização precisa e data da observação de campo na Paraíba
            let localFormatado = obs.place_guess || 'Paraíba, Brasil';
            let municipio = 'Paraíba';
            if (obs.place_guess) {
                const partes = obs.place_guess.split(',');
                municipio = partes[0].trim();
            }

            let dataObs = 'Registro verificado';
            if (obs.observed_on_details && obs.observed_on_details.date) {
                dataObs = obs.observed_on_details.date;
                localFormatado += ` (${dataObs})`;
            } else if (obs.observed_on) {
                dataObs = obs.observed_on;
                localFormatado += ` (${dataObs})`;
            }

            const animalNormalizado = normalizarEntidadeFauna({
                id_fauna: `inat-${obs.taxon.id}`,
                nome: obs.taxon.preferred_common_name || obs.species_guess || obs.taxon.name,
                especie: obs.taxon.name,
                tipo_animal: obs.taxon.iconic_taxon_name,
                habitat: obs.place_guess ? `Ocorrência observada em ${obs.place_guess}` : 'Habitat nativo paraibano',
                descricao: `Espécie com registro verificado no estado da Paraíba. Catalogada com ${obs.identifications_count || 1} identificação(ões) na plataforma científica iNaturalist.`,
                risco_preservacao: statusFormatado.nome,
                codigo_status: statusFormatado.codigo,
                foto_url: foto,
                foto_credito: credito,
                foto_atribuicao: credito,
                municipio: municipio,
                data_observacao: dataObs,
                local_observacao: localFormatado,
                fonte: 'iNaturalist API'
            });

            listaNormalizada.push(animalNormalizado);
        }

        // Se estiver na primeira página e o resultado for curto, mesclar com a base paraibana curada
        if (pagina === 1 && (!termo || termo.trim() === '')) {
            const combinados = [...listaNormalizada];
            let baseFiltrada = [...FAUNA_PARAIBA_PADRAO];

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
                    baseFiltrada = baseFiltrada.filter((i) => i.tipo_animal === grupoMapeado);
                }
            }

            for (const padrao of baseFiltrada) {
                if (!combinados.some((item) => item.especie.toLowerCase() === padrao.especie.toLowerCase())) {
                    combinados.push(padrao);
                }
            }
            cacheRequisicoes.set(chaveCache, combinados);
            return combinados;
        }

        // Se a busca por termo não retornar itens do iNaturalist, filtrar base local
        if (listaNormalizada.length === 0 && termo) {
            const t = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const filtradosBase = FAUNA_PARAIBA_PADRAO.filter((animal) => {
                const n = (animal.nome || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const e = (animal.especie || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const tp = (animal.tipo_animal || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const h = (animal.habitat || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const b = (animal.bioma || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const loc = (animal.local_observacao || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return n.includes(t) || e.includes(t) || tp.includes(t) || h.includes(t) || b.includes(t) || loc.includes(t);
            });
            cacheRequisicoes.set(chaveCache, filtradosBase);
            return filtradosBase;
        }

        cacheRequisicoes.set(chaveCache, listaNormalizada);
        return listaNormalizada;

    } catch (erro) {
        console.warn('Aviso: Utilizando base catalogada da fauna paraibana devido a limite ou rede:', erro.message);

        // Fallback robusto a partir do catálogo catalogado da Paraíba
        let fallback = [...FAUNA_PARAIBA_PADRAO];

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
                fallback = fallback.filter((item) => item.tipo_animal === grupoMapeado);
            }
        }

        if (termo && termo.trim() !== '') {
            const t = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            fallback = fallback.filter((animal) => {
                const n = (animal.nome || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const e = (animal.especie || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const tp = (animal.tipo_animal || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const h = (animal.habitat || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const b = (animal.bioma || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return n.includes(t) || e.includes(t) || tp.includes(t) || h.includes(t) || b.includes(t);
            });
        }

        return fallback;
    }
}
