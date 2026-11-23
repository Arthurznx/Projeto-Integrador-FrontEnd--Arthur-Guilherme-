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
        if (donoAlbum) donoAlbum.textContent = `👤 Naturalista: ${sessao.usuario.nome}`;

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
                btnToggleForm.textContent = '➕ Registrar Novo Encontro';
                resetarFormularioEncontro();
            } else {
                btnToggleForm.textContent = '✖ Fechar Formulário';
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
                    if (btnToggleForm) btnToggleForm.textContent = '➕ Registrar Novo Encontro';
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
            if (btnToggleForm) btnToggleForm.textContent = '➕ Registrar Novo Encontro';
        });
    }

    function resetarFormularioEncontro() {
        if (formEncontro) formEncontro.reset();
        inputIdEdicao.value = '';
        fotoBase64Atual = '';
        if (containerPreview) containerPreview.hidden = true;
        if (imgPreview) imgPreview.src = '';
        if (tituloFormEncontro) tituloFormEncontro.textContent = 'Registrar Encontro com a Fauna';
        if (btnSalvarEncontro) btnSalvarEncontro.textContent = '💾 Salvar Registro no Álbum';
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
                    <span class="badge-quantidade">👥 ${encontro.qntd_animal_observado} avistado(s)</span>
                    <span class="badge-data-encontro">📅 ${dataFormatada}</span>
                </div>
                <div class="card-encontro-conteudo">
                    <h3 class="card-encontro-titulo">${encontro.nome}</h3>
                    <p class="card-encontro-especie">${encontro.especie} (${encontro.tipo_animal})</p>
                    <span class="card-encontro-local">📍 ${encontro.habitat}</span>
                    <p class="card-encontro-relato">${encontro.relato}</p>
                    <div class="card-encontro-acoes">
                        <button type="button" class="btn-secundario btn-editar" data-id="${encontro.id_encontro}">
                            ✏️ Editar
                        </button>
                        <button type="button" class="btn-perigo btn-excluir" data-id="${encontro.id_encontro}">
                            🗑️ Excluir
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
        if (btnToggleForm) btnToggleForm.textContent = '✖ Fechar Formulário';

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
        if (btnSalvarEncontro) btnSalvarEncontro.textContent = '💾 Salvar Alterações';
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
