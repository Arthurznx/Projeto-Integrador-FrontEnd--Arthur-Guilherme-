/**
 * Componente: Explorador da Fauna Paraibana
 * Gerencia a barra de pesquisa sem acentos, filtros por grupo taxonômico,
 * renderização de cards contendo exclusivamente as informações essenciais,
 * fotos em alta resolução autenticadas e modal de detalhes científicos.
 */

import { buscarEspeciesParaiba } from '../services/inaturalist.js';
import { validarEspecieCompleta, obterChaveCanonica } from '../services/fauna-service.js';

/**
 * Remove acentos e normaliza para busca insensível a acentuação e caixa
 * @param {string} texto
 * @returns {string}
 */
function normalizarTexto(texto) {
    if (!texto) return '';
    return texto
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

export function inicializarExploradorFauna() {
    const campoBusca = document.querySelector('#campo-busca-animais');
    const btnLimpar = document.querySelector('#btn-limpar-busca');
    const botoesFiltro = document.querySelectorAll('.btn-filtro');
    const containerCards = document.querySelector('#container-cards-fauna');
    const contadorResultados = document.querySelector('#contador-resultados');
    const btnCarregarMais = document.querySelector('#btn-carregar-mais');

    // Elementos do Modal de Detalhes Científicos
    const modal = document.querySelector('#modal-detalhes-animal');
    const modalBtnFechar = document.querySelector('#modal-btn-fechar');
    const modalTitulo = document.querySelector('#modal-titulo');
    const modalEspecie = document.querySelector('#modal-especie');
    const modalFoto = document.querySelector('#modal-foto');
    const modalFotoCredito = document.querySelector('#modal-foto-credito');
    const modalNomePopular = document.querySelector('#modal-nome-popular');
    const modalNomeCientifico = document.querySelector('#modal-nome-cientifico');
    const modalGrupo = document.querySelector('#modal-grupo');
    const modalBioma = document.querySelector('#modal-bioma');
    const modalHabitat = document.querySelector('#modal-habitat');
    const modalLocal = document.querySelector('#modal-local');
    const modalDataObservacao = document.querySelector('#modal-data-observacao');
    const modalConservacao = document.querySelector('#modal-conservacao');

    if (!containerCards) return;

    let grupoAtivo = 'todos';
    let termoAtual = '';
    let timeoutBusca = null;
    let listaEspeciesAtuais = [];
    let paginaAtual = 1;
    let carregandoMais = false;

    /**
     * Carrega e renderiza os dados da fauna (página 1 ou filtros novos)
     */
    async function carregarEspecies() {
        paginaAtual = 1;
        exibirCarregando();
        if (btnCarregarMais) {
            btnCarregarMais.hidden = true;
            btnCarregarMais.disabled = false;
        }

        try {
            const especies = await buscarEspeciesParaiba({
                grupo: grupoAtivo,
                termo: termoAtual,
                pagina: 1
            });

            listaEspeciesAtuais = especies.filter(validarEspecieCompleta);
            renderizarCards(listaEspeciesAtuais, false);
            atualizarContador(listaEspeciesAtuais.length);

            // Gerenciar visibilidade do botão de carregar mais
            if (btnCarregarMais) {
                btnCarregarMais.hidden = listaEspeciesAtuais.length < 8;
                btnCarregarMais.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icone-btn" aria-hidden="true">
                        <polyline points="7 13 12 18 17 13"></polyline>
                        <polyline points="7 6 12 11 17 6"></polyline>
                    </svg>
                    Carregar mais espécies da Paraíba
                `;
            }
        } catch (erro) {
            console.error('Erro ao carregar fauna:', erro);
            exibirErro();
        }
    }

    /**
     * Carrega mais espécies da próxima página mantendo a desduplicação
     */
    async function carregarMaisEspecies() {
        if (carregandoMais) return;
        carregandoMais = true;

        if (btnCarregarMais) {
            btnCarregarMais.disabled = true;
            btnCarregarMais.textContent = 'Carregando mais observações da Paraíba...';
        }

        try {
            paginaAtual += 1;
            const novasEspecies = await buscarEspeciesParaiba({
                grupo: grupoAtivo,
                termo: termoAtual,
                pagina: paginaAtual
            });

            if (novasEspecies && novasEspecies.length > 0) {
                // Desduplicação estrita por chave canônica e validação integral de completude
                const chavesExistentes = new Set(
                    listaEspeciesAtuais.map(obterChaveCanonica)
                );

                const especiesFiltradas = novasEspecies
                    .filter(validarEspecieCompleta)
                    .filter(item => {
                        const chave = obterChaveCanonica(item);
                        if (!chave || chavesExistentes.has(chave)) return false;
                        chavesExistentes.add(chave);
                        return true;
                    });

                if (especiesFiltradas.length > 0) {
                    listaEspeciesAtuais = [...listaEspeciesAtuais, ...especiesFiltradas];
                    renderizarCards(especiesFiltradas, true);
                    atualizarContador(listaEspeciesAtuais.length);
                } else {
                    finalizarPaginacao();
                }
            } else {
                finalizarPaginacao();
            }
        } catch (erro) {
            console.error('Erro ao carregar mais espécies:', erro);
            if (btnCarregarMais) {
                btnCarregarMais.disabled = false;
                btnCarregarMais.textContent = 'Tentar carregar mais novamente';
            }
        } finally {
            carregandoMais = false;
            if (btnCarregarMais && !btnCarregarMais.disabled) {
                btnCarregarMais.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icone-btn" aria-hidden="true">
                        <polyline points="7 13 12 18 17 13"></polyline>
                        <polyline points="7 6 12 11 17 6"></polyline>
                    </svg>
                    Carregar mais espécies da Paraíba
                `;
            }
        }
    }

    function finalizarPaginacao() {
        if (btnCarregarMais) {
            btnCarregarMais.disabled = true;
            btnCarregarMais.textContent = 'Todas as observações validadas foram exibidas';
        }
    }

    /**
     * Renderiza os cards das espécies contendo estritamente as informações essenciais
     * @param {Array} especies - Lista de espécies
     * @param {boolean} concatenar - Se verdadeiro, adiciona aos cards existentes
     */
    function renderizarCards(especies, concatenar = false) {
        if (!concatenar) {
            containerCards.innerHTML = '';
        }

        if (!especies || especies.length === 0) {
            if (!concatenar) exibirVazio();
            return;
        }

        especies.forEach((animal) => {
            const card = document.createElement('article');
            card.className = 'card-animal';
            card.dataset.id = animal.id_fauna;

            const fotoUrl = animal.foto_url || 'assets/imagens/placeholder-animal.svg';
            const statusClass = animal.codigo_status || 'lc';
            const dataObs = animal.data_observacao || 'Registro confirmado';
            const municipioObs = animal.municipio || 'Paraíba';
            const autorFoto = animal.foto_atribuicao ? animal.foto_atribuicao.split(',')[0] : 'Colaborador iNaturalist';

            card.innerHTML = `
                <div class="card-animal-foto-wrapper">
                    <img class="card-animal-foto" src="${fotoUrl}" alt="Fotografia de ${animal.nome}" loading="lazy" onerror="this.src='assets/imagens/placeholder-animal.svg'">
                    <span class="badge-taxonomia">${animal.tipo_animal}</span>
                    <span class="badge-conservacao ${statusClass}" title="Status de Conservação Oficial">${animal.risco_preservacao}</span>
                </div>
                <div class="card-animal-conteudo">
                    <h3 class="card-animal-nome">${animal.nome}</h3>
                    <p class="card-animal-especie">${animal.especie}</p>

                    <div class="card-animal-campo" title="Local e data da observação de campo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span>${municipioObs}, PB • ${dataObs}</span>
                    </div>

                    <div class="card-animal-metadados-ecologicos">
                        <span class="tag-bioma-card" title="Bioma oficial de ocorrência na Paraíba">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icone-ecologico" aria-hidden="true"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                            ${animal.bioma}
                        </span>
                        <span class="card-animal-habitat" title="Habitat ecológico característico">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icone-ecologico" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            ${animal.habitat}
                        </span>
                    </div>

                    <div class="card-animal-rodape">
                        <span class="card-animal-fonte" title="${animal.foto_atribuicao || animal.fonte}">${autorFoto}</span>
                        <button type="button" class="btn-detalhes-animal" data-id="${animal.id_fauna}">
                            Ver detalhes
                        </button>
                    </div>
                </div>
            `;

            containerCards.appendChild(card);
        });

        // Associar eventos nos botões "Ver detalhes"
        containerCards.querySelectorAll('.btn-detalhes-animal').forEach((btn) => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const animalSelecionado = listaEspeciesAtuais.find((item) => item.id_fauna === id);
                if (animalSelecionado) {
                    abrirModalDetalhes(animalSelecionado);
                }
            };
        });
    }

    /**
     * Exibe estado de carregamento com animação
     */
    function exibirCarregando() {
        containerCards.innerHTML = `
            <div class="estado-carregando" role="status">
                <div class="spinner" aria-hidden="true"></div>
                <p>Consultando dados científicos e fotográficos da fauna da Paraíba...</p>
            </div>
        `;
        if (contadorResultados) {
            contadorResultados.textContent = 'Buscando espécies comprovadas na Paraíba...';
        }
    }

    /**
     * Exibe estado vazio quando nenhuma espécie é encontrada
     */
    function exibirVazio() {
        containerCards.innerHTML = `
            <div class="estado-vazio">
                <h3>Nenhum animal encontrado</h3>
                <p>Não encontramos registros correspondentes à busca realizada.</p>
                <p>Dica: Pesquise sem preocupação com acentos ou maiúsculas (ex: "sagui", "jacare", "tartaruga", "sabia").</p>
                <button type="button" class="btn-tentar-novamente" id="btn-resetar-filtros">Limpar pesquisa e filtros</button>
            </div>
        `;

        const btnResetar = containerCards.querySelector('#btn-resetar-filtros');
        if (btnResetar) {
            btnResetar.addEventListener('click', () => {
                if (campoBusca) campoBusca.value = '';
                if (btnLimpar) btnLimpar.hidden = true;
                termoAtual = '';
                grupoAtivo = 'todos';
                botoesFiltro.forEach((btn) => {
                    btn.classList.toggle('ativo', btn.dataset.filtro === 'todos');
                });
                carregarEspecies();
            });
        }
    }

    /**
     * Exibe mensagem de erro e botão de tentar novamente
     */
    function exibirErro() {
        containerCards.innerHTML = `
            <div class="estado-erro" role="alert">
                <h3>Não foi possível carregar os animais</h3>
                <p>Houve uma instabilidade na consulta às bases científicas externas.</p>
                <button type="button" class="btn-tentar-novamente" id="btn-recarregar">Tentar novamente</button>
            </div>
        `;

        const btnRecarregar = containerCards.querySelector('#btn-recarregar');
        if (btnRecarregar) {
            btnRecarregar.addEventListener('click', carregarEspecies);
        }
    }

    /**
     * Atualiza o contador de resultados no topo
     */
    function atualizarContador(total) {
        if (!contadorResultados) return;
        if (total === 1) {
            contadorResultados.textContent = '1 espécie com ocorrência na Paraíba';
        } else {
            contadorResultados.textContent = `${total} espécies com ocorrência na Paraíba`;
        }
    }

    /**
     * Abre e preenche o modal de detalhes científicos essenciais
     */
    function abrirModalDetalhes(animal) {
        if (!modal) return;

        modalTitulo.textContent = animal.nome;
        modalEspecie.textContent = animal.especie;
        modalFoto.src = animal.foto_url || 'assets/imagens/placeholder-animal.svg';
        modalFoto.alt = `Fotografia em alta resolução de ${animal.nome}`;

        if (modalFotoCredito) {
            modalFotoCredito.textContent = animal.foto_atribuicao
                ? `Fotografia: ${animal.foto_atribuicao}`
                : 'Fotografia em processo de catalogação científica';
        }

        modalNomePopular.textContent = animal.nome;
        modalNomeCientifico.textContent = animal.especie;
        modalGrupo.textContent = animal.tipo_animal;

        if (modalBioma) {
            modalBioma.textContent = animal.bioma || 'Informação não disponível';
        }

        modalHabitat.textContent = animal.habitat || 'Informação não disponível';
        modalLocal.textContent = animal.municipio ? `${animal.municipio}, Paraíba, Brasil` : (animal.local_observacao || 'Paraíba, Brasil');

        if (modalDataObservacao) {
            modalDataObservacao.textContent = animal.data_observacao || 'Registro verificado';
        }

        modalConservacao.textContent = animal.risco_preservacao;

        modal.classList.add('aberto');
        modal.setAttribute('aria-hidden', 'false');
        if (modalBtnFechar) modalBtnFechar.focus();
    }

    /**
     * Fecha o modal de detalhes
     */
    function fecharModal() {
        if (!modal) return;
        modal.classList.remove('aberto');
        modal.setAttribute('aria-hidden', 'true');
    }

    if (modalBtnFechar) {
        modalBtnFechar.addEventListener('click', fecharModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) fecharModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('aberto')) {
                fecharModal();
            }
        });
    }

    // =========================================================================
    // Eventos da Barra de Pesquisa e Filtros
    // =========================================================================

    if (campoBusca) {
        campoBusca.addEventListener('input', (evento) => {
            const valor = evento.target.value;
            if (btnLimpar) {
                btnLimpar.hidden = valor.trim() === '';
            }

            clearTimeout(timeoutBusca);
            timeoutBusca = setTimeout(() => {
                termoAtual = valor.trim();
                carregarEspecies();
            }, 300);
        });
    }

    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            if (campoBusca) {
                campoBusca.value = '';
                campoBusca.focus();
            }
            btnLimpar.hidden = true;
            termoAtual = '';
            carregarEspecies();
        });
    }

    botoesFiltro.forEach((btn) => {
        btn.addEventListener('click', () => {
            botoesFiltro.forEach((b) => b.classList.remove('ativo'));
            btn.classList.add('ativo');

            grupoAtivo = btn.dataset.filtro;
            carregarEspecies();
        });
    });

    if (btnCarregarMais) {
        btnCarregarMais.addEventListener('click', carregarMaisEspecies);
    }

    // Carga inicial
    carregarEspecies();
}
