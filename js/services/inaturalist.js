/**
 * Serviço de Integração com a API do iNaturalist
 * Documentação oficial: https://api.inaturalist.org/v1/
 *
 * Consulta observações e táxons com foco exclusivo na fauna do estado da Paraíba (place_id=12593),
 * aplicando internacionalização (locale=pt-BR) e tratamento de erros com fallback.
 */

import { normalizarEntidadeFauna, FAUNA_PARAIBA_PADRAO } from './fauna-service.js';

const INAT_API_BASE = 'https://api.inaturalist.org/v1';
const ID_LUGAR_PARAIBA = 12593; // Identificador oficial do Estado da Paraíba no iNaturalist

// Cache em memória para evitar requisições redundantes
const cacheRequisicoes = new Map();

/**
 * Consulta observações recentes e com fotos da fauna na Paraíba
 * @param {Object} opcoes - Parâmetros de filtro
 * @returns {Promise<Array>} Lista de espécies normalizadas (Entidade Fauna)
 */
export async function buscarEspeciesParaiba({ grupo = 'todos', termo = '', limite = 24 } = {}) {
    const chaveCache = `inat-${grupo}-${termo}-${limite}`;

    if (cacheRequisicoes.has(chaveCache)) {
        return cacheRequisicoes.get(chaveCache);
    }

    // Mapeamento dos grupos para iconic_taxa do iNaturalist
    const mapaTaxons = {
        mamiferos: 'Mammalia',
        aves: 'Aves',
        repteis: 'Reptilia',
        anfibios: 'Amphibia',
        todos: 'Mammalia,Aves,Reptilia,Amphibia'
    };

    const iconicTaxa = mapaTaxons[grupo] || mapaTaxons.todos;

    const url = new URL(`${INAT_API_BASE}/observations`);
    url.searchParams.set('place_id', String(ID_LUGAR_PARAIBA));
    url.searchParams.set('locale', 'pt-BR');
    url.searchParams.set('photos', 'true');
    url.searchParams.set('popular', 'true');
    url.searchParams.set('order_by', 'votes');
    url.searchParams.set('order', 'desc');
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

            // Obter melhor fotografia disponível
            let foto = null;
            if (obs.photos && obs.photos.length > 0) {
                foto = obs.photos[0].url.replace('square', 'medium');
            } else if (obs.taxon.default_photo) {
                foto = obs.taxon.default_photo.medium_url;
            }

            // Status de conservação
            let riscoPreservacao = 'Pouco Preocupante (LC)';
            if (obs.taxon.conservation_status && obs.taxon.conservation_status.status_name) {
                riscoPreservacao = obs.taxon.conservation_status.status_name;
            } else if (obs.taxon.threatened) {
                riscoPreservacao = 'Ameaçada de Extinção';
            }

            const animalNormalizado = normalizarEntidadeFauna({
                id_fauna: `inat-${obs.taxon.id}`,
                nome: obs.taxon.preferred_common_name || obs.species_guess || obs.taxon.name,
                especie: obs.taxon.name,
                tipo_animal: obs.taxon.iconic_taxon_name,
                habitat: obs.place_guess ? `Paraíba (${obs.place_guess})` : 'Paraíba, Brasil',
                descricao: `Espécie observada em ambiente natural na Paraíba. Registrada com ${obs.identifications_count || 1} identificação(ões) na plataforma científica iNaturalist.`,
                risco_preservacao: riscoPreservacao,
                foto_url: foto,
                local_observacao: obs.place_guess || 'Paraíba, BR',
                fonte: 'iNaturalist API'
            });

            listaNormalizada.push(animalNormalizado);
        }

        // Se a busca pelo termo não retornar nada do iNaturalist, filtrar a base padrão
        if (listaNormalizada.length === 0 && termo) {
            const t = termo.toLowerCase();
            const filtradosBase = FAUNA_PARAIBA_PADRAO.filter((animal) =>
                animal.nome.toLowerCase().includes(t) ||
                animal.especie.toLowerCase().includes(t) ||
                animal.tipo_animal.toLowerCase().includes(t) ||
                animal.habitat.toLowerCase().includes(t)
            );
            cacheRequisicoes.set(chaveCache, filtradosBase);
            return filtradosBase;
        }

        // Se a API retornar menos de 4 itens, complementar com a base padrão para garantir riqueza visual
        if (listaNormalizada.length < 4 && (!termo || termo.trim() === '')) {
            const combinados = [...listaNormalizada];
            for (const padrao of FAUNA_PARAIBA_PADRAO) {
                if (!combinados.some((item) => item.especie === padrao.especie)) {
                    combinados.push(padrao);
                }
            }
            cacheRequisicoes.set(chaveCache, combinados);
            return combinados;
        }

        cacheRequisicoes.set(chaveCache, listaNormalizada);
        return listaNormalizada;

    } catch (erro) {
        console.warn('Aviso: Não foi possível obter dados ao vivo da API iNaturalist. Utilizando base catalogada da fauna paraibana.', erro.message);

        // Fallback seguro: filtrar base local paraibana
        let fallback = [...FAUNA_PARAIBA_PADRAO];

        if (grupo !== 'todos') {
            const grupoMapeado = {
                mamiferos: 'Mamífero',
                aves: 'Ave',
                repteis: 'Réptil',
                anfibios: 'Anfíbio'
            }[grupo];

            if (grupoMapeado) {
                fallback = fallback.filter((item) => item.tipo_animal === grupoMapeado);
            }
        }

        if (termo && termo.trim() !== '') {
            const t = termo.toLowerCase();
            fallback = fallback.filter((animal) =>
                animal.nome.toLowerCase().includes(t) ||
                animal.especie.toLowerCase().includes(t) ||
                animal.tipo_animal.toLowerCase().includes(t) ||
                animal.habitat.toLowerCase().includes(t)
            );
        }

        return fallback;
    }
}
