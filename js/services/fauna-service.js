/**
 * Serviço de Dados da Fauna Paraibana
 * Implementa a Entidade Fauna (id_fauna, nome, tipo_animal, habitat, espécie, descrição, risco_preservação)
 * e atua como camada de normalização e acesso aos dados da biodiversidade da Paraíba.
 */

// Base de dados de referência com espécies emblemáticas da fauna paraibana
export const FAUNA_PARAIBA_PADRAO = [
    {
        id_fauna: 'pb-01',
        nome: 'Sagui-de-tufos-brancos',
        especie: 'Callithrix jacchus',
        tipo_animal: 'Mamífero',
        habitat: 'Mata Atlântica e Caatinga',
        bioma: 'mata-atlantica',
        descricao: 'Pequeno primata nativo do Nordeste brasileiro, muito comum em áreas de mata e parques urbanos na Paraíba (como a Mata do Buraquinho em João Pessoa). Alimenta-se de frutos, insetos e exsudatos de árvores.',
        risco_preservacao: 'Pouco Preocupante (LC)',
        codigo_status: 'lc',
        foto_url: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80',
        local_observacao: 'João Pessoa, PB',
        fonte: 'Fauna Paraibana / iNaturalist'
    },
    {
        id_fauna: 'pb-02',
        nome: 'Tatu-bola-do-nordeste',
        especie: 'Tolypeutes tricinctus',
        tipo_animal: 'Mamífero',
        habitat: 'Caatinga',
        bioma: 'caatinga',
        descricao: 'Espécie endêmica do Brasil com ocorrência típica na Caatinga paraibana. Possui a habilidade única de se enrolar completamente em formato de bola para se proteger de predadores.',
        risco_preservacao: 'Vulnerável (VU)',
        codigo_status: 'vu',
        foto_url: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80',
        local_observacao: 'Cariri Paraibano, PB',
        fonte: 'Fauna Paraibana / ICMBio'
    },
    {
        id_fauna: 'pb-03',
        nome: 'Preguiça-de-coleira',
        especie: 'Bradypus torquatus',
        tipo_animal: 'Mamífero',
        habitat: 'Mata Atlântica',
        bioma: 'mata-atlantica',
        descricao: 'Mamífero arborícola endêmico da Mata Atlântica costeira brasileira. Passa a maior parte da vida no dossel das árvores alimentando-se exclusivamente de folhas. Ameaçada pela fragmentação florestal.',
        risco_preservacao: 'Vulnerável (VU)',
        codigo_status: 'vu',
        foto_url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
        local_observacao: 'Litoral Sul, PB',
        fonte: 'Fauna Paraibana'
    },
    {
        id_fauna: 'pb-04',
        nome: 'Guará',
        especie: 'Eudocimus ruber',
        tipo_animal: 'Ave',
        habitat: 'Manguezal e Estuários',
        bioma: 'manguezal',
        descricao: 'Ave aquática espetacular por sua plumagem vermelha escarlate intensa, originada da alimentação rica em carotenos de pequenos caranguejos nos manguezais dos estuários paraibanos.',
        risco_preservacao: 'Pouco Preocupante (LC)',
        codigo_status: 'lc',
        foto_url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
        local_observacao: 'Estuário do Rio Paraíba, PB',
        fonte: 'Fauna Paraibana / iNaturalist'
    },
    {
        id_fauna: 'pb-05',
        nome: 'Colhereiro',
        especie: 'Platalea ajaja',
        tipo_animal: 'Ave',
        habitat: 'Manguezais e Zonas Úmidas',
        bioma: 'manguezal',
        descricao: 'Grande ave limícola com bico característico em forma de colher, utilizado para tatear águas rasas em busca de pequenos peixes, crustáceos e insetos aquáticos.',
        risco_preservacao: 'Pouco Preocupante (LC)',
        codigo_status: 'lc',
        foto_url: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=800&q=80',
        local_observacao: 'Cabedelo, PB',
        fonte: 'Fauna Paraibana'
    },
    {
        id_fauna: 'pb-06',
        nome: 'Tartaruga-de-pente',
        especie: 'Eretmochelys imbricata',
        tipo_animal: 'Réptil',
        habitat: 'Litoral, Recifes e Praias',
        bioma: 'litoral',
        descricao: 'Tartaruga marinha que utiliza os recifes de corais e costões rochosos da costa da Paraíba para alimentação, desovando em praias protegidas durante os meses de verão.',
        risco_preservacao: 'Criticamente em Perigo (CR)',
        codigo_status: 'cr',
        foto_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        local_observacao: 'Costa Paraibana (Cabedelo / Baía da Traição), PB',
        fonte: 'Projeto Tartarugas / iNaturalist'
    },
    {
        id_fauna: 'pb-07',
        nome: 'Suçuarana (Onça-parda)',
        especie: 'Puma concolor',
        tipo_animal: 'Mamífero',
        habitat: 'Caatinga e Matas Serranas',
        bioma: 'caatinga',
        descricao: 'O segundo maior felino das Américas, com registros confirmados em unidades de conservação e áreas preservadas da Caatinga e serras do interior da Paraíba.',
        risco_preservacao: 'Vulnerável (VU)',
        codigo_status: 'vu',
        foto_url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
        local_observacao: 'Pico do Jabre / Curimataú, PB',
        fonte: 'Fauna Paraibana / iNaturalist'
    },
    {
        id_fauna: 'pb-08',
        nome: 'Cobra-verde-da-caatinga',
        especie: 'Erythrolamprus viridis',
        tipo_animal: 'Réptil',
        habitat: 'Caatinga',
        bioma: 'caatinga',
        descricao: 'Serpente diurna não peçonhenta, endêmica do semiárido brasileiro com belíssima coloração verde brilhante. Alimenta-se principalmente de pequenos anfíbios e lagartos.',
        risco_preservacao: 'Pouco Preocupante (LC)',
        codigo_status: 'lc',
        foto_url: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=800&q=80',
        local_observacao: 'Cabaceiras, PB',
        fonte: 'iNaturalist (Observações PB)'
    },
    {
        id_fauna: 'pb-09',
        nome: 'Jacaré-de-papo-amarelo',
        especie: 'Caiman latirostris',
        tipo_animal: 'Réptil',
        habitat: 'Rios, Brejos e Manguezais',
        bioma: 'mata-atlantica',
        descricao: 'Réptil semiaquático presente em bacias hidrográficas da Paraíba, lagoas e brejos. Desempenha papel ecológico vital controlando populações de peixes e pragas aquáticas.',
        risco_preservacao: 'Pouco Preocupante (LC)',
        codigo_status: 'lc',
        foto_url: 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=800&q=80',
        local_observacao: 'Bacia do Rio Mamanguape, PB',
        fonte: 'Fauna Paraibana'
    },
    {
        id_fauna: 'pb-10',
        nome: 'Sapo-cururu-do-nordeste',
        especie: 'Rhinella jimi',
        tipo_animal: 'Anfíbio',
        habitat: 'Caatinga e Zonas Antrópicas',
        bioma: 'caatinga',
        descricao: 'Grande anfíbio anuro adaptado às condições do semiárido nordestino. Possui papel ecológico crucial no controle biológico de insetos agrícolas e vetores de doenças.',
        risco_preservacao: 'Pouco Preocupante (LC)',
        codigo_status: 'lc',
        foto_url: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=800&q=80',
        local_observacao: 'Campina Grande / Agreste, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-11',
        nome: 'Mocó',
        especie: 'Kerodon rupestris',
        tipo_animal: 'Mamífero',
        habitat: 'Lagedos e Afloramentos Rochosos',
        bioma: 'caatinga',
        descricao: 'Roedor endêmico da Caatinga adaptado a viver nas fendas e lagedos de pedra típicos do interior paraibano. Ágil saltador entre as rochas e herbívoro estrito.',
        risco_preservacao: 'Pouco Preocupante (LC)',
        codigo_status: 'lc',
        foto_url: 'https://images.unsplash.com/photo-1505672678857-85937424641e?auto=format&fit=crop&w=800&q=80',
        local_observacao: 'Lagedo de Pai Mateus, Cabaceiras, PB',
        fonte: 'Fauna Paraibana'
    },
    {
        id_fauna: 'pb-12',
        nome: 'Gavião-de-asa-larga',
        especie: 'Buteo platypterus',
        tipo_animal: 'Ave',
        habitat: 'Mata Atlântica e Brejos de Altitude',
        bioma: 'mata-atlantica',
        descricao: 'Ave de rapina com visão aguçada, observada em florestas e áreas serranas da Paraíba. Importante predador de topo no controle de pequenos roedores e répteis.',
        risco_preservacao: 'Pouco Preocupante (LC)',
        codigo_status: 'lc',
        foto_url: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=800&q=80',
        local_observacao: 'Areia / Brejo Paraibano, PB',
        fonte: 'iNaturalist'
    }
];

/**
 * Normaliza um objeto de espécie para a estrutura oficial da Entidade Fauna
 */
export function normalizarEntidadeFauna(dados) {
    return {
        id_fauna: dados.id_fauna || `fauna-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        nome: dados.nome || 'Espécie não identificada',
        especie: dados.especie || 'Nome científico desconhecido',
        tipo_animal: dados.tipo_animal || classificarTipoAnimal(dados.iconic_taxon_name || dados.classe),
        habitat: dados.habitat || inferirHabitat(dados),
        descricao: dados.descricao || 'Espécie catalogada com registros de ocorrência no território paraibano.',
        risco_preservacao: dados.risco_preservacao || 'Não avaliado',
        codigo_status: extrairCodigoStatus(dados.risco_preservacao || dados.codigo_status),
        foto_url: dados.foto_url || 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=800&q=80',
        local_observacao: dados.local_observacao || 'Paraíba, Brasil',
        fonte: dados.fonte || 'iNaturalist'
    };
}

/**
 * Mapeia classes taxonômicas para tipos amigáveis em português
 */
export function classificarTipoAnimal(taxon) {
    if (!taxon) return 'Outro';
    const t = String(taxon).toLowerCase();
    if (t.includes('mammalia') || t.includes('mamifero')) return 'Mamífero';
    if (t.includes('aves') || t.includes('ave') || t.includes('pássaro')) return 'Ave';
    if (t.includes('reptilia') || t.includes('réptil') || t.includes('reptil')) return 'Réptil';
    if (t.includes('amphibia') || t.includes('anfíbio') || t.includes('anfibio')) return 'Anfíbio';
    if (t.includes('actinopterygii') || t.includes('peixe')) return 'Peixe';
    if (t.includes('insecta') || t.includes('inseto') || t.includes('arachnida')) return 'Invertebrado';
    return 'Fauna Silvestre';
}

/**
 * Extrai o código da categoria de ameaça da IUCN
 */
function extrairCodigoStatus(status) {
    if (!status) return 'lc';
    const s = String(status).toLowerCase();
    if (s.includes('cr') || s.includes('criticamente')) return 'cr';
    if (s.includes('en') || s.includes('perigo')) return 'en';
    if (s.includes('vu') || s.includes('vulner')) return 'vu';
    if (s.includes('nt') || s.includes('quase')) return 'nt';
    return 'lc';
}

/**
 * Infere o habitat com base na localização ou nome do animal
 */
function inferirHabitat(dados) {
    const texto = `${dados.nome || ''} ${dados.place_guess || ''} ${dados.habitat || ''}`.toLowerCase();
    if (texto.includes('caatinga') || texto.includes('cabaceiras') || texto.includes('patos') || texto.includes('sousa')) {
        return 'Caatinga';
    }
    if (texto.includes('mangue') || texto.includes('cabedelo') || texto.includes('estuário')) {
        return 'Manguezal';
    }
    if (texto.includes('praia') || texto.includes('marinho') || texto.includes('costa') || texto.includes('recife')) {
        return 'Litoral e Recifes';
    }
    return 'Mata Atlântica e Florestas';
}
