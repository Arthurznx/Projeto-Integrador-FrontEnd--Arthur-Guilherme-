/**
 * Componente: Explorador da Fauna Paraibana
 * Gerencia a barra de pesquisa dinâmica, filtros por categoria,
 * renderização de cards e o modal de detalhes científicos.
 */

import { buscarEspeciesParaiba } from '../services/inaturalist.js';
import { buscarDadosComplementares } from '../services/api-ninjas.js';

export function inicializarExploradorFauna() {
    const campoBusca = document.querySelector('#campo-busca-animais');
    const btnLimpar = document.querySelector('#btn-limpar-busca');
    const botoesFiltro = document.querySelectorAll('.btn-filtro');
    const containerCards = document.querySelector('#container-cards-fauna');
    const contadorResultados = document.querySelector('#contador-resultados');

    // Elementos do Modal de Detalhes
    const modal = document.querySelector('#modal-detalhes-animal');
    const modalBtnFechar = document.querySelector('#modal-btn-fechar');
    const modalTitulo = document.querySelector('#modal-titulo');
    const modalEspecie = document.querySelector('#modal-especie');
    const modalFoto = document.querySelector('#modal-foto');
    const modalNomePopular = document.querySelector('#modal-nome-popular');
    const modalNomeCientifico = document.querySelector('#modal-nome-cientifico');
    const modalGrupo = document.querySelector('#modal-grupo');
    const modalHabitat = document.querySelector('#modal-habitat');
    const modalConservacao = document.querySelector('#modal-conservacao');
    const modalLocal = document.querySelector('#modal-local');
    const modalDescricaoComplementar = document.querySelector('#modal-descricao-complementar');
    const modalDieta = document.querySelector('#modal-dieta');

    if (!containerCards) return;

    let grupoAtivo = 'todos';
    let termoAtual = '';
    let timeoutBusca = null;
    let listaEspeciesAtuais = [];

    /**
     * Carrega e renderiza os dados da fauna
     */
    async function carregarEspecies() {
        exibirCarregando();

        try {
            const especies = await buscarEspeciesParaiba({
                grupo: grupoAtivo,
                termo: termoAtual
            });

            listaEspeciesAtuais = especies;
            renderizarCards(especies);
            atualizarContador(especies.length);
        } catch (erro) {
            console.error('Erro ao carregar fauna:', erro);
            exibirErro();
        }
    }

    /**
     * Renderiza os cards das espécies
     */
    function renderizarCards(especies) {
        if (!especies || especies.length === 0) {
            exibirVazio();
            return;
        }

        containerCards.innerHTML = '';

        especies.forEach((animal) => {
            const card = document.createElement('article');
            card.className = 'card-animal';
            card.dataset.id = animal.id_fauna;

            const fotoUrl = animal.foto_url || 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=800&q=80';
            const statusClass = animal.codigo_status || 'lc';

            card.innerHTML = `
                <div class="card-animal-foto-wrapper">
                    <img class="card-animal-foto" src="${fotoUrl}" alt="Fotografia de ${animal.nome}" loading="lazy">
                    <span class="badge-taxonomia">${animal.tipo_animal}</span>
                    <span class="badge-conservacao ${statusClass}" title="Status de Conservação">${animal.risco_preservacao}</span>
                </div>
                <div class="card-animal-conteudo">
                    <h3 class="card-animal-nome">${animal.nome}</h3>
                    <p class="card-animal-especie">${animal.especie}</p>
                    <span class="card-animal-habitat">📍 ${animal.habitat}</span>
                    <p class="card-animal-descricao">${animal.descricao}</p>
                    <div class="card-animal-rodape">
                        <span class="card-animal-fonte">${animal.fonte}</span>
                        <button type="button" class="btn-detalhes-animal" data-id="${animal.id_fauna}">
                            Ver detalhes
                        </button>
                    </div>
                </div>
            `;

            containerCards.appendChild(card);
        });

        // Eventos nos botões "Ver detalhes"
        containerCards.querySelectorAll('.btn-detalhes-animal').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const animalSelecionado = listaEspeciesAtuais.find((item) => item.id_fauna === id);
                if (animalSelecionado) {
                    abrirModalDetalhes(animalSelecionado);
                }
            });
        });
    }

    /**
     * Exibe estado de carregamento com animação
     */
    function exibirCarregando() {
        containerCards.innerHTML = `
            <div class="estado-carregando" role="status">
                <div class="spinner" aria-hidden="true"></div>
                <p>Consultando dados científicos da fauna da Paraíba...</p>
            </div>
        `;
        if (contadorResultados) {
            contadorResultados.textContent = 'Buscando espécies...';
        }
    }

    /**
     * Exibe estado vazio quando nenhuma espécie é encontrada
     */
    function exibirVazio() {
        containerCards.innerHTML = `
            <div class="estado-vazio">
                <h3>Nenhum animal encontrado</h3>
                <p>Não encontramos registros correspondentes ao termo "${termoAtual}".</p>
                <p>Dica: Tente pesquisar por outros nomes como "Sagui", "Tatu", "Guará", "Tartaruga" ou limpe a busca.</p>
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
                <p>Houve uma instabilidade na consulta às bases externas.</p>
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
            contadorResultados.textContent = '1 espécie encontrada na Paraíba';
        } else {
            contadorResultados.textContent = `${total} espécies encontradas na Paraíba`;
        }
    }

    /**
     * Abre e preenche o modal de detalhes científicos e biológicos
     */
    async function abrirModalDetalhes(animal) {
        if (!modal) return;

        modalTitulo.textContent = animal.nome;
        modalEspecie.textContent = animal.especie;
        modalFoto.src = animal.foto_url;
        modalFoto.alt = `Fotografia em alta resolução de ${animal.nome}`;

        modalNomePopular.textContent = animal.nome;
        modalNomeCientifico.textContent = animal.especie;
        modalGrupo.textContent = animal.tipo_animal;
        modalHabitat.textContent = animal.habitat;
        modalConservacao.textContent = animal.risco_preservacao;
        modalLocal.textContent = animal.local_observacao || 'Paraíba, Brasil';

        modalDescricaoComplementar.textContent = 'Consultando informações biológicas complementares...';
        modalDieta.textContent = '';

        modal.classList.add('aberto');
        modal.setAttribute('aria-hidden', 'false');
        modalBtnFechar.focus();

        // Buscar complementos da Animals API Ninjas / Base biológica curada
        try {
            const complemento = await buscarDadosComplementares(animal.especie, animal.nome);
            if (complemento && complemento.dados) {
                modalDescricaoComplementar.textContent = complemento.dados.caracteristicas_principais || animal.descricao;
                modalDieta.textContent = `🥗 Dieta: ${complemento.dados.dieta || 'Alimentação nativa de ecossistemas da Paraíba.'}`;
            } else {
                modalDescricaoComplementar.textContent = animal.descricao;
                modalDieta.textContent = '';
            }
        } catch {
            modalDescricaoComplementar.textContent = animal.descricao;
            modalDieta.textContent = '';
        }
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
            const valor = evento.target.value.trim();
            if (btnLimpar) {
                btnLimpar.hidden = valor === '';
            }

            clearTimeout(timeoutBusca);
            timeoutBusca = setTimeout(() => {
                termoAtual = valor;
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

    // Carga inicial
    carregarEspecies();
}
