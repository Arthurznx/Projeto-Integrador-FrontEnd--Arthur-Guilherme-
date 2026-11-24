/**
 * Componente de Interface do Usuário - Álbum Animal
 * Controla os fluxos de acesso, cadastro, formulário de registros e cards de encontros.
 */

import {
    criarUsuarioEAlbum,
    acessarAlbum,
    obterSessaoAtiva,
    encerrarSessao,
    adicionarEncontro,
    atualizarEncontro,
    excluirEncontro,
    obterEncontrosPorAlbum,
    validarEmail,
    validarSenha
} from '../services/album-service.js';

// Ícones SVG para interface limpa sem emojis
const ICONE_EDITAR = `<svg class="icone-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
const ICONE_EXCLUIR = `<svg class="icone-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
const ICONE_LOCAL = `<svg class="icone-metadado" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
const ICONE_CALENDARIO = `<svg class="icone-metadado" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
const ICONE_QUANTIDADE = `<svg class="icone-metadado" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
const ICONE_MAIS = `<svg class="icone-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const ICONE_FECHAR = `<svg class="icone-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
const ICONE_SALVAR = `<svg class="icone-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`;
const ICONE_USUARIO = `<svg class="icone-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

export function inicializarAlbumUI() {
    // Seções principais
    const secaoAuth = document.querySelector('#secao-autenticacao');
    const secaoPainel = document.querySelector('#secao-painel-album');

    // Abas de Autenticação
    const tabCriar = document.querySelector('#tab-criar');
    const tabAcessar = document.querySelector('#tab-acessar');
    const formCriar = document.querySelector('#form-criar-album');
    const formAcessar = document.querySelector('#form-acessar-album');
    const feedbackAuth = document.querySelector('#feedback-auth');

    // Elementos do Painel do Álbum
    const tituloAlbum = document.querySelector('#titulo-album-exibicao');
    const donoAlbum = document.querySelector('#dono-album-exibicao');
    const btnSair = document.querySelector('#btn-sair-album');
    const btnToggleForm = document.querySelector('#btn-toggle-formulario');
    const containerFormEncontro = document.querySelector('#container-formulario-encontro');
    const containerEncontros = document.querySelector('#container-encontros-album');

    // Estatísticas
    const statTotalEncontros = document.querySelector('#stat-total-encontros');
    const statTotalAnimais = document.querySelector('#stat-total-animais');
    const statEspeciesDistintas = document.querySelector('#stat-especies-distintas');

    // Formulário de Registro de Encontro
    const formEncontro = document.querySelector('#form-registro-encontro');
    const tituloFormEncontro = document.querySelector('#titulo-form-encontro');
    const feedbackFormEncontro = document.querySelector('#feedback-form-encontro');
    const inputIdEdicao = document.querySelector('#encontro-id-edicao');
    const inputNome = document.querySelector('#encontro-nome');
    const inputEspecie = document.querySelector('#encontro-especie');
    const selectTipo = document.querySelector('#encontro-tipo');
    const inputHabitat = document.querySelector('#encontro-habitat');
    const inputData = document.querySelector('#encontro-data');
    const inputQuantidade = document.querySelector('#encontro-quantidade');
    const inputArquivoFoto = document.querySelector('#encontro-arquivo-foto');
    const textareaRelato = document.querySelector('#encontro-relato');
    const btnSalvarEncontro = document.querySelector('#btn-salvar-encontro');
    const btnCancelarEdicao = document.querySelector('#btn-cancelar-edicao');

    // Pré-visualização de Imagem
    const containerPreview = document.querySelector('#container-preview');
    const imgPreview = document.querySelector('#img-preview');
    const btnRemoverFoto = document.querySelector('#btn-remover-foto');

    let fotoBase64Atual = '';
    let sessaoAtual = obterSessaoAtiva();

    // Configurar data máxima do campo de data como hoje
    if (inputData) {
        inputData.max = new Date().toISOString().split('T')[0];
    }

    // =========================================================================
    // Fluxo de Inicialização de Sessão
    // =========================================================================

    if (sessaoAtual && sessaoAtual.usuario && sessaoAtual.album) {
        exibirPainelAlbum(sessaoAtual);
    } else {
        exibirInterfaceAuth();
    }

    function exibirInterfaceAuth() {
        if (secaoAuth) secaoAuth.hidden = false;
        if (secaoPainel) secaoPainel.hidden = true;
    }

    function exibirPainelAlbum(sessao) {
        sessaoAtual = sessao;
        if (secaoAuth) secaoAuth.hidden = true;
        if (secaoPainel) secaoPainel.hidden = false;

        if (tituloAlbum) tituloAlbum.textContent = sessao.album.nome;
        if (donoAlbum) donoAlbum.innerHTML = `${ICONE_USUARIO} Naturalista: ${sessao.usuario.nome}`;

        carregarListaEncontros();
    }

    // =========================================================================
    // Alternância de Abas (Criar / Acessar)
    // =========================================================================

    if (tabCriar && tabAcessar) {
        tabCriar.addEventListener('click', () => {
            tabCriar.classList.add('ativa');
            tabCriar.setAttribute('aria-selected', 'true');
            tabAcessar.classList.remove('ativa');
            tabAcessar.setAttribute('aria-selected', 'false');

            formCriar.hidden = false;
            formAcessar.hidden = true;
            limparFeedback(feedbackAuth);
        });

        tabAcessar.addEventListener('click', () => {
            tabAcessar.classList.add('ativa');
            tabAcessar.setAttribute('aria-selected', 'true');
            tabCriar.classList.remove('ativa');
            tabCriar.setAttribute('aria-selected', 'false');

            formAcessar.hidden = false;
            formCriar.hidden = true;
            limparFeedback(feedbackAuth);
        });
    }

    // =========================================================================
    // Criação de Novo Álbum
    // =========================================================================

    if (formCriar) {
        formCriar.addEventListener('submit', async (evento) => {
            evento.preventDefault();
            limparFeedback(feedbackAuth);

            const nomeUsuario = document.querySelector('#campo-nome-usuario').value.trim();
            const nomeAlbum = document.querySelector('#campo-nome-album').value.trim();
            const email = document.querySelector('#campo-email-cadastro').value.trim();
            const senha = document.querySelector('#campo-senha-cadastro').value;

            if (!nomeUsuario || !nomeAlbum || !email || !senha) {
                exibirFeedback(feedbackAuth, 'Preencha todos os campos obrigatórios (*).', 'erro');
                return;
            }

            if (!validarEmail(email)) {
                exibirFeedback(feedbackAuth, 'Informe um endereço de e-mail válido.', 'erro');
                return;
            }

            if (!validarSenha(senha)) {
                exibirFeedback(feedbackAuth, 'A senha deve conter no mínimo 6 caracteres.', 'erro');
                return;
            }

            try {
                const resultado = await criarUsuarioEAlbum({
                    nomeUsuario,
                    nomeAlbum,
                    email,
                    senha
                });

                exibirFeedback(feedbackAuth, 'Álbum criado com sucesso! Abrindo seu espaço...', 'sucesso');
                formCriar.reset();

                setTimeout(() => {
                    exibirPainelAlbum(resultado);
                }, 600);

            } catch (erro) {
                exibirFeedback(feedbackAuth, erro.message, 'erro');
            }
        });
    }

    // =========================================================================
    // Acesso ao Álbum Existente
    // =========================================================================

    if (formAcessar) {
        formAcessar.addEventListener('submit', async (evento) => {
            evento.preventDefault();
            limparFeedback(feedbackAuth);

            const email = document.querySelector('#campo-email-login').value.trim();
            const senha = document.querySelector('#campo-senha-login').value;

            if (!email || !senha) {
                exibirFeedback(feedbackAuth, 'Preencha seu e-mail e sua senha.', 'erro');
                return;
            }

            try {
                const resultado = await acessarAlbum({ email, senha });
                exibirFeedback(feedbackAuth, 'Acesso realizado com sucesso! Entrando...', 'sucesso');
                formAcessar.reset();

                setTimeout(() => {
                    exibirPainelAlbum(resultado);
                }, 500);

            } catch (erro) {
                exibirFeedback(feedbackAuth, erro.message, 'erro');
            }
        });
    }

    // =========================================================================
    // Encerramento de Sessão (Logout)
    // =========================================================================

    if (btnSair) {
        btnSair.addEventListener('click', () => {
            if (confirm('Deseja realmente sair do seu álbum?')) {
                encerrarSessao();
                sessaoAtual = null;
                exibirInterfaceAuth();
            }
        });
    }

    // =========================================================================
    // Alternância do Formulário de Registro
    // =========================================================================

    if (btnToggleForm) {
        btnToggleForm.addEventListener('click', () => {
            const estaOculto = containerFormEncontro.hidden;
            containerFormEncontro.hidden = !estaOculto;

            if (!estaOculto) {
                btnToggleForm.innerHTML = `${ICONE_MAIS} Registrar Novo Encontro`;
                resetarFormularioEncontro();
            } else {
                btnToggleForm.innerHTML = `${ICONE_FECHAR} Fechar Formulário`;
                inputNome.focus();
            }
        });
    }

    // =========================================================================
    // Upload e Pré-visualização de Fotografia
    // =========================================================================

    if (inputArquivoFoto) {
        inputArquivoFoto.addEventListener('change', (evento) => {
            const arquivo = evento.target.files[0];
            if (!arquivo) return;

            if (!arquivo.type.startsWith('image/')) {
                alert('Por favor, selecione um arquivo de imagem válido.');
                inputArquivoFoto.value = '';
                return;
            }

            // Limite de 5MB para manipulação local via DataURL
            if (arquivo.size > 5 * 1024 * 1024) {
                alert('A imagem selecionada é muito grande. Escolha uma foto de até 5MB.');
                inputArquivoFoto.value = '';
                return;
            }

            const leitor = new FileReader();
            leitor.onload = (e) => {
                fotoBase64Atual = e.target.result;
                if (imgPreview && containerPreview) {
                    imgPreview.src = fotoBase64Atual;
                    containerPreview.hidden = false;
                }
            };
            leitor.readAsDataURL(arquivo);
        });
    }

    if (btnRemoverFoto) {
        btnRemoverFoto.addEventListener('click', () => {
            fotoBase64Atual = '';
            if (inputArquivoFoto) inputArquivoFoto.value = '';
            if (containerPreview) containerPreview.hidden = true;
            if (imgPreview) imgPreview.src = '';
        });
    }

    // =========================================================================
    // Envio do Formulário de Registro / Edição
    // =========================================================================

    if (formEncontro) {
        formEncontro.addEventListener('submit', (evento) => {
            evento.preventDefault();
            limparFeedback(feedbackFormEncontro);

            if (!sessaoAtual || !sessaoAtual.album) {
                exibirFeedback(feedbackFormEncontro, 'Sessão expirada. Por favor, acesse novamente.', 'erro');
                return;
            }

            const idEdicao = inputIdEdicao.value;
            const nome = inputNome.value.trim();
            const especie = inputEspecie.value.trim();
            const tipoAnimal = selectTipo.value;
            const habitat = inputHabitat.value.trim();
            const dataEncontro = inputData.value;
            const quantidade = inputQuantidade.value;
            const relato = textareaRelato.value.trim();

            if (!nome || !especie || !habitat || !dataEncontro) {
                exibirFeedback(feedbackFormEncontro, 'Preencha todos os campos obrigatórios (*).', 'erro');
                return;
            }

            const dataHoje = new Date().toISOString().split('T')[0];
            if (dataEncontro > dataHoje) {
                exibirFeedback(feedbackFormEncontro, 'A data do encontro não pode estar no futuro.', 'erro');
                return;
            }

            try {
                if (idEdicao) {
                    // Modo Edição
                    atualizarEncontro(idEdicao, {
                        nome,
                        especie,
                        tipo_animal: tipoAnimal,
                        habitat,
                        data_encontro: dataEncontro,
                        qntd_animal_observado: quantidade,
                        foto_encontro: fotoBase64Atual || undefined,
                        relato
                    });
                    exibirFeedback(feedbackFormEncontro, 'Registro atualizado com sucesso!', 'sucesso');
                } else {
                    // Modo Criação
                    adicionarEncontro({
                        idAlbum: sessaoAtual.album.id_album,
                        nome,
                        especie,
                        tipoAnimal,
                        habitat,
                        dataEncontro,
                        quantidade,
                        fotoEncontro: fotoBase64Atual,
                        relato
                    });
                    exibirFeedback(feedbackFormEncontro, 'Encontro adicionado ao seu Álbum!', 'sucesso');
                }

                carregarListaEncontros();

                setTimeout(() => {
                    resetarFormularioEncontro();
                    if (containerFormEncontro) containerFormEncontro.hidden = true;
                    if (btnToggleForm) btnToggleForm.innerHTML = `${ICONE_MAIS} Registrar Novo Encontro`;
                }, 800);

            } catch (erro) {
                exibirFeedback(feedbackFormEncontro, erro.message, 'erro');
            }
        });
    }

    if (btnCancelarEdicao) {
        btnCancelarEdicao.addEventListener('click', () => {
            resetarFormularioEncontro();
            if (containerFormEncontro) containerFormEncontro.hidden = true;
            if (btnToggleForm) btnToggleForm.innerHTML = `${ICONE_MAIS} Registrar Novo Encontro`;
        });
    }

    function resetarFormularioEncontro() {
        if (formEncontro) formEncontro.reset();
        inputIdEdicao.value = '';
        fotoBase64Atual = '';
        if (containerPreview) containerPreview.hidden = true;
        if (imgPreview) imgPreview.src = '';
        if (tituloFormEncontro) tituloFormEncontro.textContent = 'Registrar Encontro com a Fauna';
        if (btnSalvarEncontro) btnSalvarEncontro.innerHTML = `${ICONE_SALVAR} Salvar Registro no Álbum`;
        if (btnCancelarEdicao) btnCancelarEdicao.hidden = true;
        limparFeedback(feedbackFormEncontro);
    }

    // =========================================================================
    // Listagem e Renderização dos Encontros
    // =========================================================================

    function carregarListaEncontros() {
        if (!sessaoAtual || !sessaoAtual.album || !containerEncontros) return;

        const encontros = obterEncontrosPorAlbum(sessaoAtual.album.id_album);
        atualizarEstatisticas(encontros);

        if (encontros.length === 0) {
            containerEncontros.innerHTML = `
                <div class="estado-vazio" style="grid-column: 1 / -1;">
                    <h3>Seu álbum ainda não tem encontros registrados</h3>
                    <p>Clique no botão "Registrar Novo Encontro" acima para adicionar sua primeira observação da fauna paraibana.</p>
                </div>
            `;
            return;
        }

        containerEncontros.innerHTML = '';

        encontros.forEach((encontro) => {
            const card = document.createElement('article');
            card.className = 'card-encontro';
            card.dataset.id = encontro.id_encontro;

            // Formatação amigável da data
            const partesData = encontro.data_encontro.split('-');
            const dataFormatada = partesData.length === 3 ? `${partesData[2]}/${partesData[1]}/${partesData[0]}` : encontro.data_encontro;

            card.innerHTML = `
                <div class="card-encontro-foto-wrapper">
                    <img class="card-encontro-foto" src="${encontro.foto_encontro}" alt="Foto de ${encontro.nome}" loading="lazy">
                    <span class="badge-quantidade">${ICONE_QUANTIDADE} ${encontro.qntd_animal_observado} avistado(s)</span>
                    <span class="badge-data-encontro">${ICONE_CALENDARIO} ${dataFormatada}</span>
                </div>
                <div class="card-encontro-conteudo">
                    <h3 class="card-encontro-titulo">${encontro.nome}</h3>
                    <p class="card-encontro-especie">${encontro.especie} (${encontro.tipo_animal})</p>
                    <span class="card-encontro-local">${ICONE_LOCAL} ${encontro.habitat}</span>
                    <p class="card-encontro-relato">${encontro.relato}</p>
                    <div class="card-encontro-acoes">
                        <button type="button" class="btn-secundario btn-editar" data-id="${encontro.id_encontro}">
                            ${ICONE_EDITAR} Editar
                        </button>
                        <button type="button" class="btn-perigo btn-excluir" data-id="${encontro.id_encontro}">
                            ${ICONE_EXCLUIR} Excluir
                        </button>
                    </div>
                </div>
            `;

            containerEncontros.appendChild(card);
        });

        // Eventos de Edição
        containerEncontros.querySelectorAll('.btn-editar').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                prepararEdicaoEncontro(id);
            });
        });

        // Eventos de Exclusão
        containerEncontros.querySelectorAll('.btn-excluir').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (confirm('Tem certeza de que deseja remover este registro do seu álbum?')) {
                    excluirEncontro(id);
                    carregarListaEncontros();
                }
            });
        });
    }

    function prepararEdicaoEncontro(idEncontro) {
        const encontros = obterEncontrosPorAlbum(sessaoAtual.album.id_album);
        const encontro = encontros.find((e) => e.id_encontro === idEncontro);
        if (!encontro) return;

        // Abrir formulário
        if (containerFormEncontro) containerFormEncontro.hidden = false;
        if (btnToggleForm) btnToggleForm.innerHTML = `${ICONE_FECHAR} Fechar Formulário`;

        // Preencher dados
        inputIdEdicao.value = encontro.id_encontro;
        inputNome.value = encontro.nome;
        inputEspecie.value = encontro.especie;
        selectTipo.value = encontro.tipo_animal || 'Mamífero';
        inputHabitat.value = encontro.habitat;
        inputData.value = encontro.data_encontro;
        inputQuantidade.value = encontro.qntd_animal_observado;
        textareaRelato.value = encontro.relato || '';

        // Foto existente
        fotoBase64Atual = encontro.foto_encontro;
        if (imgPreview && containerPreview && fotoBase64Atual) {
            imgPreview.src = fotoBase64Atual;
            containerPreview.hidden = false;
        }

        // Alterar títulos
        if (tituloFormEncontro) tituloFormEncontro.textContent = 'Editar Registro de Encontro';
        if (btnSalvarEncontro) btnSalvarEncontro.innerHTML = `${ICONE_SALVAR} Salvar Alterações`;
        if (btnCancelarEdicao) btnCancelarEdicao.hidden = false;

        containerFormEncontro.scrollIntoView({ behavior: 'smooth' });
    }

    function atualizarEstatisticas(encontros) {
        if (!statTotalEncontros || !statTotalAnimais || !statEspeciesDistintas) return;

        const totalEncontros = encontros.length;
        const totalAnimais = encontros.reduce((acc, cur) => acc + (Number(cur.qntd_animal_observado) || 1), 0);
        const especiesUnicas = new Set(encontros.map((e) => e.especie.toLowerCase().trim())).size;

        statTotalEncontros.textContent = String(totalEncontros);
        statTotalAnimais.textContent = String(totalAnimais);
        statEspeciesDistintas.textContent = String(especiesUnicas);
    }

    // =========================================================================
    // Funções Auxiliares de Feedback
    // =========================================================================

    function exibirFeedback(elemento, mensagem, tipo) {
        if (!elemento) return;
        elemento.textContent = mensagem;
        elemento.className = `mensagem-feedback ${tipo}`;
        elemento.hidden = false;
    }

    function limparFeedback(elemento) {
        if (!elemento) return;
        elemento.textContent = '';
        elemento.className = 'mensagem-feedback';
        elemento.hidden = true;
    }
}
