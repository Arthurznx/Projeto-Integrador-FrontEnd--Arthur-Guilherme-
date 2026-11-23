/**
 * Serviço de Gerenciamento do Álbum Animal
 * Implementa as entidades do modelo ER:
 * - Entidade Usuário (id_usuario, nome, email, senha_hash)
 * - Entidade Álbum (id_album, id_usuario, nome, criado_em)
 * - Entidade Encontro (id_encontro, id_album, id_fauna, nome, foto_encontro, data_encontro, tipo_animal, habitat, especie, qntd_animal_observado, relato)
 *
 * Tratamento seguro de credenciais (SHA-256 via Web Crypto API) e arquitetura modular
 * preparada para posterior integração com backend/banco de dados real.
 */

const STORAGE_KEY_USUARIOS = 'animalia_usuarios_db';
const STORAGE_KEY_ALBUNS = 'animalia_albuns_db';
const STORAGE_KEY_ENCONTROS = 'animalia_encontros_db';
const STORAGE_KEY_SESSAO = 'animalia_sessao_ativa';

/**
 * Gera hash criptográfico SHA-256 para não armazenar senhas em texto puro
 */
export async function gerarHashSenha(senha) {
    if (!senha) return '';
    try {
        const codificador = new TextEncoder();
        const dados = codificador.encode(`animalia_salt_${senha}`);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dados);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
        // Fallback básico caso crypto.subtle não esteja disponível
        let hash = 0;
        for (let i = 0; i < senha.length; i++) {
            hash = (hash << 5) - hash + senha.charCodeAt(i);
            hash |= 0;
        }
        return `hash_${Math.abs(hash)}`;
    }
}

/**
 * Validação de formato de e-mail
 */
export function validarEmail(email) {
    if (!email) return false;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email.trim());
}

/**
 * Validação de força mínima da senha
 */
export function validarSenha(senha) {
    return typeof senha === 'string' && senha.trim().length >= 6;
}

// =============================================================================
// Gestão de Usuários e Autenticação
// =============================================================================

function carregarUsuarios() {
    try {
        const dados = localStorage.getItem(STORAGE_KEY_USUARIOS);
        return dados ? JSON.parse(dados) : [];
    } catch {
        return [];
    }
}

function salvarUsuarios(usuarios) {
    try {
        localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));
    } catch (e) {
        console.error('Falha ao persistir usuários:', e);
    }
}

function carregarAlbuns() {
    try {
        const dados = localStorage.getItem(STORAGE_KEY_ALBUNS);
        return dados ? JSON.parse(dados) : [];
    } catch {
        return [];
    }
}

function salvarAlbuns(albuns) {
    try {
        localStorage.setItem(STORAGE_KEY_ALBUNS, JSON.stringify(albuns));
    } catch (e) {
        console.error('Falha ao persistir álbuns:', e);
    }
}

function carregarEncontros() {
    try {
        const dados = localStorage.getItem(STORAGE_KEY_ENCONTROS);
        return dados ? JSON.parse(dados) : [];
    } catch {
        return [];
    }
}

function salvarEncontros(encontros) {
    try {
        localStorage.setItem(STORAGE_KEY_ENCONTROS, JSON.stringify(encontros));
    } catch (e) {
        console.error('Falha ao persistir encontros:', e);
    }
}

/**
 * Cadastra um novo Usuário e cria o Álbum correspondente (Relacionamento 1:1)
 */
export async function criarUsuarioEAlbum({ nomeUsuario, nomeAlbum, email, senha }) {
    if (!nomeUsuario || !nomeAlbum || !email || !senha) {
        throw new Error('Preencha todos os campos obrigatórios.');
    }

    if (!validarEmail(email)) {
        throw new Error('O formato do e-mail informado é inválido.');
    }

    if (!validarSenha(senha)) {
        throw new Error('A senha deve possuir no mínimo 6 caracteres.');
    }

    const usuarios = carregarUsuarios();
    const emailNormalizado = email.trim().toLowerCase();

    const usuarioExistente = usuarios.find((u) => u.email === emailNormalizado);
    if (usuarioExistente) {
        throw new Error('Já existe um álbum cadastrado com este endereço de e-mail. Utilize a aba "Acessar Álbum".');
    }

    const senhaHash = await gerarHashSenha(senha);
    const idUsuario = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const idAlbum = `alb_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const novoUsuario = {
        id_usuario: idUsuario,
        nome: nomeUsuario.trim(),
        email: emailNormalizado,
        senha_hash: senhaHash,
        criado_em: new Date().toISOString()
    };

    const novoAlbum = {
        id_album: idAlbum,
        id_usuario: idUsuario,
        nome: nomeAlbum.trim(),
        criado_em: new Date().toISOString()
    };

    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);

    const albuns = carregarAlbuns();
    albuns.push(novoAlbum);
    salvarAlbuns(albuns);

    // Inicializar com exemplo demonstrativo de encontro para ilustrar a experiência
    inicializarEncontrosDemonstracao(idAlbum);

    // Definir sessão ativa
    definirSessaoAtiva({ usuario: novoUsuario, album: novoAlbum });

    return { usuario: novoUsuario, album: novoAlbum };
}

/**
 * Realiza o acesso do usuário ao seu álbum
 */
export async function acessarAlbum({ email, senha }) {
    if (!email || !senha) {
        throw new Error('Informe o e-mail e a senha cadastrados.');
    }

    const emailNormalizado = email.trim().toLowerCase();
    const usuarios = carregarUsuarios();
    const usuario = usuarios.find((u) => u.email === emailNormalizado);

    if (!usuario) {
        throw new Error('E-mail não encontrado. Verifique as informações ou crie um novo álbum.');
    }

    const senhaHash = await gerarHashSenha(senha);
    if (usuario.senha_hash !== senhaHash) {
        throw new Error('Senha incorreta. Verifique os dados informados.');
    }

    const albuns = carregarAlbuns();
    let album = albuns.find((a) => a.id_usuario === usuario.id_usuario);

    if (!album) {
        // Criar álbum padrão caso não exista
        album = {
            id_album: `alb_${Date.now()}`,
            id_usuario: usuario.id_usuario,
            nome: `Álbum de ${usuario.nome}`,
            criado_em: new Date().toISOString()
        };
        albuns.push(album);
        salvarAlbuns(albuns);
    }

    definirSessaoAtiva({ usuario, album });
    return { usuario, album };
}

/**
 * Gestão de Sessão do Usuário
 */
export function obterSessaoAtiva() {
    try {
        const dados = sessionStorage.getItem(STORAGE_KEY_SESSAO) || localStorage.getItem(STORAGE_KEY_SESSAO);
        return dados ? JSON.parse(dados) : null;
    } catch {
        return null;
    }
}

export function definirSessaoAtiva(dadosSessao) {
    try {
        // Armazena na sessão atual do navegador
        sessionStorage.setItem(STORAGE_KEY_SESSAO, JSON.stringify(dadosSessao));
    } catch (e) {
        console.warn('Falha ao gravar sessão ativa:', e);
    }
}

export function encerrarSessao() {
    sessionStorage.removeItem(STORAGE_KEY_SESSAO);
    localStorage.removeItem(STORAGE_KEY_SESSAO);
}

// =============================================================================
// Gestão de Encontros (Entidade Álbum/Encontro)
// =============================================================================

/**
 * Adiciona um novo encontro ao Álbum
 */
export function adicionarEncontro({
    idAlbum,
    idFauna = null,
    nome,
    especie,
    tipoAnimal,
    habitat,
    dataEncontro,
    quantidade,
    fotoEncontro,
    relato
}) {
    if (!idAlbum) throw new Error('ID do álbum não informado.');
    if (!nome || !especie || !dataEncontro || !habitat) {
        throw new Error('Preencha os campos obrigatórios do encontro (Nome, Espécie, Data e Local/Habitat).');
    }

    const dataAtual = new Date().toISOString().split('T')[0];
    if (dataEncontro > dataAtual) {
        throw new Error('A data do encontro não pode ser uma data futura.');
    }

    const qtdNum = Number(quantidade);
    if (isNaN(qtdNum) || qtdNum < 1) {
        throw new Error('A quantidade de animais observados deve ser de no mínimo 1.');
    }

    const encontros = carregarEncontros();
    const novoEncontro = {
        id_encontro: `enc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        id_album: idAlbum,
        id_fauna: idFauna,
        nome: nome.trim(),
        especie: especie.trim(),
        tipo_animal: tipoAnimal || 'Mamífero',
        habitat: habitat.trim(),
        data_encontro: dataEncontro,
        qntd_animal_observado: qtdNum,
        foto_encontro: fotoEncontro || 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80',
        relato: relato ? relato.trim() : 'Encontro registrado no Álbum Animal.',
        criado_em: new Date().toISOString()
    };

    encontros.unshift(novoEncontro);
    salvarEncontros(encontros);
    return novoEncontro;
}

/**
 * Atualiza um encontro existente
 */
export function atualizarEncontro(idEncontro, dadosAtualizados) {
    const encontros = carregarEncontros();
    const indice = encontros.findIndex((e) => e.id_encontro === idEncontro);

    if (indice === -1) {
        throw new Error('Registro de encontro não encontrado.');
    }

    if (dadosAtualizados.data_encontro) {
        const dataAtual = new Date().toISOString().split('T')[0];
        if (dadosAtualizados.data_encontro > dataAtual) {
            throw new Error('A data do encontro não pode ser uma data futura.');
        }
    }

    if (dadosAtualizados.qntd_animal_observado) {
        const qtdNum = Number(dadosAtualizados.qntd_animal_observado);
        if (isNaN(qtdNum) || qtdNum < 1) {
            throw new Error('A quantidade observada deve ser de no mínimo 1.');
        }
    }

    encontros[indice] = {
        ...encontros[indice],
        ...dadosAtualizados,
        atualizado_em: new Date().toISOString()
    };

    salvarEncontros(encontros);
    return encontros[indice];
}

/**
 * Remove um encontro do Álbum
 */
export function excluirEncontro(idEncontro) {
    const encontros = carregarEncontros();
    const novosEncontros = encontros.filter((e) => e.id_encontro !== idEncontro);
    salvarEncontros(novosEncontros);
    return true;
}

/**
 * Obtém todos os encontros de um determinado álbum
 */
export function obterEncontrosPorAlbum(idAlbum) {
    if (!idAlbum) return [];
    const encontros = carregarEncontros();
    return encontros.filter((e) => e.id_album === idAlbum);
}

/**
 * Registros de demonstração para novos álbuns
 */
function inicializarEncontrosDemonstracao(idAlbum) {
    const encontros = carregarEncontros();
    const jaExistem = encontros.some((e) => e.id_album === idAlbum);
    if (jaExistem) return;

    const exemplos = [
        {
            id_encontro: `enc_demo_1_${Date.now()}`,
            id_album: idAlbum,
            id_fauna: 'pb-01',
            nome: 'Bando de Saguis na Trilha',
            especie: 'Callithrix jacchus',
            tipo_animal: 'Mamífero',
            habitat: 'Mata do Buraquinho, João Pessoa - PB',
            data_encontro: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
            qntd_animal_observado: 4,
            foto_encontro: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80',
            relato: 'Durante uma caminhada pela trilha ecológica pela manhã, avistamos uma família de saguis alimentando-se nos galhos mais baixos. Muito curiosos e ágeis.',
            criado_em: new Date().toISOString()
        },
        {
            id_encontro: `enc_demo_2_${Date.now()}`,
            id_album: idAlbum,
            id_fauna: 'pb-04',
            nome: 'Guarás ao Entardecer',
            especie: 'Eudocimus ruber',
            tipo_animal: 'Ave',
            habitat: 'Estuário do Rio Paraíba, Cabedelo - PB',
            data_encontro: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
            qntd_animal_observado: 8,
            foto_encontro: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
            relato: 'Bando sobrevoando o manguezal no pôr do sol. O contraste da plumagem avermelhada com o verde da vegetação do estuário foi inesquecível.',
            criado_em: new Date().toISOString()
        }
    ];

    encontros.push(...exemplos);
    salvarEncontros(encontros);
}
