/**
 * Serviço de Dados da Fauna Paraibana
 *
 * Implementa a Entidade Fauna rigorosamente conforme o modelo ER:
 * - id_fauna
 * - nome (nome popular em português)
 * - tipo_animal (grupo taxonômico)
 * - bioma (Caatinga ou Mata Atlântica)
 * - habitat (ambiente ecológico específico)
 * - espécie (nome científico válido)
 * - descrição (aspectos biológicos e comportamentais)
 * - risco_preservação (nomenclatura oficial em português sem siglas)
 * - local_observação (município ou localidade geográfica do registro na Paraíba)
 */

export const MAPA_CONSERVACAO_PT = {
    lc: 'Pouco preocupante',
    nt: 'Quase ameaçada',
    vu: 'Vulnerável',
    en: 'Em perigo',
    cr: 'Criticamente em perigo',
    ew: 'Extinta na natureza',
    ex: 'Extinta',
    dd: 'Dados insuficientes',
    ne: 'Não avaliada'
};

/**
 * Normaliza qualquer código ou descrição de conservação para a apresentação oficial em português
 * SEM SIGLAS na interface (Item 5).
 */
export function formatarStatusConservacao(statusBruto) {
    if (!statusBruto) return { nome: 'Não avaliada', codigo: 'ne' };
    const s = String(statusBruto).toLowerCase().trim();

    if (s.includes('criticamente') || s === 'cr') return { nome: 'Criticamente em perigo', codigo: 'cr' };
    if (s.includes('em perigo') || s === 'en' || s.includes('endangered')) return { nome: 'Em perigo', codigo: 'en' };
    if (s.includes('vulner') || s === 'vu') return { nome: 'Vulnerável', codigo: 'vu' };
    if (s.includes('quase') || s === 'nt' || s.includes('near threatened')) return { nome: 'Quase ameaçada', codigo: 'nt' };
    if (s.includes('natureza') || s === 'ew') return { nome: 'Extinta na natureza', codigo: 'ew' };
    if (s.includes('extinta') || s === 'ex' || s.includes('extinct')) return { nome: 'Extinta', codigo: 'ex' };
    if (s.includes('insuficiente') || s === 'dd') return { nome: 'Dados insuficientes', codigo: 'dd' };
    if (s.includes('pouco') || s.includes('preocupante') || s === 'lc' || s.includes('least concern')) {
        return { nome: 'Pouco preocupante', codigo: 'lc' };
    }
    if (s.includes('amea') || s.includes('threatened')) return { nome: 'Vulnerável', codigo: 'vu' };

    return { nome: 'Não avaliada', codigo: 'ne' };
}

/**
 * Catálogo Abrangente de Espécies da Fauna com Ocorrência Comprovada na Paraíba
 * Cobre todos os 6 grupos taxonômicos (Mamíferos, Aves, Répteis, Anfíbios, Peixes, Invertebrados)
 * e os diferentes biomas e habitats do estado.
 */
export const FAUNA_PARAIBA_PADRAO = [
    // ==========================================
    // MAMÍFEROS (Mammalia)
    // ==========================================
    {
        id_fauna: 'pb-mam-01',
        nome: 'Sagui-de-tufos-brancos',
        especie: 'Callithrix jacchus',
        tipo_animal: 'Mamífero',
        bioma: 'Mata Atlântica e Caatinga',
        habitat: 'Florestas úmidas, matas ciliares e enclaves arbóreos da Caatinga',
        descricao: 'Primata de pequeno porte endêmico do Nordeste brasileiro. Muito ágil, vive em grupos familiares de 3 a 15 indivíduos e possui incisivos adaptados para perfurar troncos de árvores e extrair exsudatos e gomas nutritivas.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/17876038/large.jpg',
        foto_credito: '(c) Rum Bucolic Ape, some rights reserved (CC BY-ND)',
        local_observacao: 'Mata do Buraquinho, João Pessoa, PB',
        fonte: 'iNaturalist / Base Fauna PB'
    },
    {
        id_fauna: 'pb-mam-02',
        nome: 'Tatu-bola-do-nordeste',
        especie: 'Tolypeutes tricinctus',
        tipo_animal: 'Mamífero',
        bioma: 'Caatinga',
        habitat: 'Caatinga arbustiva, solos arenosos e matas secas',
        descricao: 'Espécie endêmica do semiárido brasileiro com ocorrência histórica e registros protegidos no interior paraibano. Possui a notável capacidade de dobrar a carapaça e se fechar hermeticamente em forma de bola como defesa contra predadores.',
        risco_preservacao: 'Vulnerável',
        codigo_status: 'vu',
        foto_url: 'https://static.inaturalist.org/photos/683160535/large.jpg',
        foto_credito: '(c) William Lewis, all rights reserved, uploaded by William Lewis',
        local_observacao: 'Cariri Ocidental, Monteiro, PB',
        fonte: 'ICMBio / Livro Vermelho da Fauna'
    },
    {
        id_fauna: 'pb-mam-03',
        nome: 'Preguiça-de-coleira',
        especie: 'Bradypus torquatus',
        tipo_animal: 'Mamífero',
        bioma: 'Mata Atlântica',
        habitat: 'Dossel de florestas úmidas de encosta e tabuleiro',
        descricao: 'Mamífero arborícola exclusivo dos remanescentes da Mata Atlântica do leste brasileiro. Caracteriza-se por uma longa juba de pelos negros na nuca e ombros. Alimenta-se seletivamente de folhas de árvores maduras.',
        risco_preservacao: 'Vulnerável',
        codigo_status: 'vu',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/707560611/large.jpg',
        foto_credito: '(c) Conrado Pável de Oliveira, some rights reserved (CC BY), uploaded by Conrado Pável de Oliveira',
        local_observacao: 'Reserva Ecológica Mata do Amém, Cabedelo, PB',
        fonte: 'Fauna Paraibana / ICMBio'
    },
    {
        id_fauna: 'pb-mam-04',
        nome: 'Preguiça-comum',
        especie: 'Bradypus variegatus',
        tipo_animal: 'Mamífero',
        bioma: 'Mata Atlântica',
        habitat: 'Copas de árvores em matas estacionais e brejos',
        descricao: 'Preguiça de três dedos com máscara facial escura e hábitos diurnos e crepusculares. Apresenta pelagem espessa que abriga microalgas simbióticas, conferindo camuflagem esverdeada em meio à folhagem.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://static.inaturalist.org/photos/73892662/large.jpg',
        foto_credito: '(c) Siegfried Baesler, all rights reserved, uploaded by Siegfried Baesler',
        local_observacao: 'Parque Estadual Dois Irmãos / Litoral Sul, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-mam-05',
        nome: 'Suçuarana (Onça-parda)',
        especie: 'Puma concolor',
        tipo_animal: 'Mamífero',
        bioma: 'Caatinga e Mata Atlântica',
        habitat: 'Serras rochosas, caatinga arbórea e vales florestados',
        descricao: 'Segundo maior felino neotropical. Possui grande plasticidade ecológica e ocorre em áreas protegidas serranas do interior paraibano. Predador de topo essencial no controle de populações de mamíferos herbívoros.',
        risco_preservacao: 'Vulnerável',
        codigo_status: 'vu',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/9834553/large.jpg',
        foto_credito: '(c) pfaucher, some rights reserved (CC BY-NC), uploaded by pfaucher',
        local_observacao: 'Parque Estadual do Pico do Jabre, Maturéia, PB',
        fonte: 'iNaturalist / ICMBio'
    },
    {
        id_fauna: 'pb-mam-06',
        nome: 'Mocó',
        especie: 'Kerodon rupestris',
        tipo_animal: 'Mamífero',
        bioma: 'Caatinga',
        habitat: 'Afloramentos rochosos, paredões graníticos e lajedos',
        descricao: 'Roedor herbívoro endêmico do semiárido brasileiro. Possui unhas curtas adaptadas para saltar com firmeza pelas rochas e fendas das formações do Cariri paraibano, onde busca abrigo contra calor extremo e predadores.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://static.inaturalist.org/photos/217443938/large.jpeg',
        foto_credito: '(c) Geraldo M. Pereira, all rights reserved, uploaded by Geraldo M. Pereira',
        local_observacao: 'Lajedo de Pai Mateus, Cabaceiras, PB',
        fonte: 'Fauna Paraibana'
    },
    {
        id_fauna: 'pb-mam-07',
        nome: 'Tamanduá-mirim',
        especie: 'Tamandua tetradactyla',
        tipo_animal: 'Mamífero',
        bioma: 'Caatinga e Mata Atlântica',
        habitat: 'Florestas de galeria, caatinga arbórea e matas úmidas',
        descricao: 'Possui forte cauda preênsil e garras robustas para romper formigueiros e cupinzeiros arbóreos e terrestres. Apresenta pelagem dourada com característico colete negro dorsal.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/10425251/large.jpg',
        foto_credito: '(c) Instituto Últimos Refúgios, some rights reserved (CC BY-NC), uploaded by Instituto Últimos Refúgios',
        local_observacao: 'Área de Proteção Ambiental Tambaba, Conde, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-mam-08',
        nome: 'Peixe-boi-marinho',
        especie: 'Trichechus manatus',
        tipo_animal: 'Mamífero',
        bioma: 'Mata Atlântica',
        habitat: 'Estuários fluviomarinhos, águas calmas e pradarias de capim-agulha',
        descricao: 'Mamífero aquático herbívoro criticamente ameaçado de extinção no Brasil. A APA da Barra do Rio Mamanguape na Paraíba é a principal área de proteção, reprodução e soltura da espécie no país.',
        risco_preservacao: 'Em perigo',
        codigo_status: 'en',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/17174106/large.jpg',
        foto_credito: '(c) U.S. Fish and Wildlife Service Headquarters, some rights reserved (CC BY)',
        local_observacao: 'Barra de Mamanguape, Rio Tinto, PB',
        fonte: 'ICMBio / Projeto Peixe-Boi'
    },
    {
        id_fauna: 'pb-mam-09',
        nome: 'Guaxinim (Mão-pelada)',
        especie: 'Procyon cancrivorus',
        tipo_animal: 'Mamífero',
        bioma: 'Mata Atlântica e Caatinga',
        habitat: 'Manguezais, margens de rios e zonas úmidas costeiras',
        descricao: 'Carnívoro e onívoro noturno com máscara facial negra e cauda anilhada. Habilidoso pescador e forrageador de caranguejos e moluscos em águas rasas estuarinas.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/171203983/large.jpeg',
        foto_credito: '(c) Rodrigo M. Ferronato, some rights reserved (CC BY-NC), uploaded by Rodrigo M. Ferronato',
        local_observacao: 'Estuário do Rio Paraíba, Santa Rita, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-mam-10',
        nome: 'Boto-cinza',
        especie: 'Sotalia guianensis',
        tipo_animal: 'Mamífero',
        bioma: 'Mata Atlântica',
        habitat: 'Águas costeiras marinhas abrigadas, baías e enseadas',
        descricao: 'Pequeno golfinho costeiro de dorso cinza e ventre róseo. Frequenta regularmente as baías e enseadas do litoral paraibano, alimentando-se de pequenos peixes pelágicos e lulas.',
        risco_preservacao: 'Vulnerável',
        codigo_status: 'vu',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/110630841/large.jpeg',
        foto_credito: '(c) Jakob Fahr, some rights reserved (CC BY-NC), uploaded by Jakob Fahr',
        local_observacao: 'Baía da Traição, Litoral Norte, PB',
        fonte: 'iNaturalist'
    },

    // ==========================================
    // AVES (Aves)
    // ==========================================
    {
        id_fauna: 'pb-ave-01',
        nome: 'Guará',
        especie: 'Eudocimus ruber',
        tipo_animal: 'Ave',
        bioma: 'Mata Atlântica',
        habitat: 'Manguezais, bancos de lodo e estuários fluviomarinhos',
        descricao: 'Ave aquática pernalta emblemática dos estuários da Paraíba. Sua plumagem rubra brilhante decorre do consumo contínuo de pequenos caranguejos violinistas ricos em carotenoides.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://static.inaturalist.org/photos/258315551/large.jpg',
        foto_credito: '(c) Luciano Bernardes, all rights reserved, uploaded by Luciano Bernardes',
        local_observacao: 'Estuário do Rio Paraíba, Cabedelo, PB',
        fonte: 'iNaturalist / Fauna PB'
    },
    {
        id_fauna: 'pb-ave-02',
        nome: 'Colhereiro',
        especie: 'Platalea ajaja',
        tipo_animal: 'Ave',
        bioma: 'Mata Atlântica',
        habitat: 'Manguezais, lagoas costeiras e marismas',
        descricao: 'Grande ave de plumagem rosada com bico largo em formato de colher, com o qual tateia o fundo lodoso de águas salobras em movimentos semicirculares à procura de pequenos peixes.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://static.inaturalist.org/photos/32776247/large.jpg',
        foto_credito: '(c) drdad, all rights reserved',
        local_observacao: 'Manguezais do Jacaré, Cabedelo, PB',
        fonte: 'Fauna Paraibana'
    },
    {
        id_fauna: 'pb-ave-03',
        nome: 'Seriema',
        especie: 'Cariama cristata',
        tipo_animal: 'Ave',
        bioma: 'Caatinga',
        habitat: 'Campos abertos, pastagens secas e caatinga arbustiva',
        descricao: 'Ave terrestre de pernas longas e canto possante audível a quilômetros de distância. Predadora de serpentes, lagartos, roedores e grandes insetos do interior paraibano.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/467050157/large.jpg',
        foto_credito: '(c) Mauricio Silvera, some rights reserved (CC BY-NC), uploaded by Mauricio Silvera',
        local_observacao: 'Sertão do Piranhas, Patos, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-ave-04',
        nome: 'Jacucaca',
        especie: 'Penelope jacucaca',
        tipo_animal: 'Ave',
        bioma: 'Caatinga',
        habitat: 'Caatinga arbórea densa e encostas serranas secas',
        descricao: 'Cracídeo de grande porte endêmico da Caatinga nordestina. Alimenta-se de frutos silvestres, brotos e sementes e atua como uma das principais dispersoras de sementes da vegetação nativa.',
        risco_preservacao: 'Vulnerável',
        codigo_status: 'vu',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/240589426/large.jpg',
        foto_credito: 'no rights reserved, uploaded by NINA WENÓLI',
        local_observacao: 'Serra do Teixeira, PB',
        fonte: 'ICMBio / Livro Vermelho'
    },
    {
        id_fauna: 'pb-ave-05',
        nome: 'Carcará',
        especie: 'Caracara plancus',
        tipo_animal: 'Ave',
        bioma: 'Caatinga e Mata Atlântica',
        habitat: 'Áreas abertas, bordas de matas e caatinga',
        descricao: 'Falconiforme oportunista muito comum em todo o estado da Paraíba. Alimenta-se de carcaças, pequenos vertebrados, artrópodes e ovos, desempenhando importante função de limpeza ambiental.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/344678876/large.jpeg',
        foto_credito: '(c) Juan Cruzado Cortés, some rights reserved (CC BY), uploaded by Juan Cruzado Cortés',
        local_observacao: 'Campina Grande, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-ave-06',
        nome: 'Pintassilgo-do-nordeste',
        especie: 'Spinus yarrellii',
        tipo_animal: 'Ave',
        bioma: 'Caatinga e Mata Atlântica',
        habitat: 'Matas secundárias, bordas de brejos e caatinga com árvores frutíferas',
        descricao: 'Pequeno passeriforme de coloração amarela intensa e capuz negro na cabeça. Ameaçado pelo tráfico ilegal de animais silvestres e fragmentação de áreas de forrageio.',
        risco_preservacao: 'Em perigo',
        codigo_status: 'en',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/141187965/large.jpg',
        foto_credito: '(c) Breno Farias, some rights reserved (CC BY-NC-SA), uploaded by Breno Farias',
        local_observacao: 'Brejo Paraibano, Areia, PB',
        fonte: 'ICMBio / Lista Vermelha IUCN'
    },
    {
        id_fauna: 'pb-ave-07',
        nome: 'Periquito-da-caatinga',
        especie: 'Eupsittula cactorum',
        tipo_animal: 'Ave',
        bioma: 'Caatinga',
        habitat: 'Caatinga arbustiva e campos com cactáceas',
        descricao: 'Psitacídeo verde com peito oliváceo e ventre alaranjado, muito barulhento e sociável. Alimenta-se dos frutos e sementes do mandacaru e do facheiro, construindo ninhos em cupinzeiros arbóreos.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/141276572/large.jpg',
        foto_credito: '(c) Breno Farias, some rights reserved (CC BY-NC), uploaded by Breno Farias',
        local_observacao: 'Sousa, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-ave-08',
        nome: 'Gavião-de-asa-larga',
        especie: 'Buteo platypterus',
        tipo_animal: 'Ave',
        bioma: 'Mata Atlântica',
        habitat: 'Brejos de altitude e florestas úmidas de encosta',
        descricao: 'Ave de rapina migratória que utiliza os brejos de altitude da Paraíba para forrageamento. Possui cauda marcada por faixas brancas e pretas distintas.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/112152791/large.jpg',
        foto_credito: '(c) Andy Pearce 🕊, some rights reserved (CC BY-NC), uploaded by Andy Pearce 🕊',
        local_observacao: 'Mata do Pau-Ferro, Areia, PB',
        fonte: 'iNaturalist'
    },

    // ==========================================
    // RÉPTEIS (Reptilia)
    // ==========================================
    {
        id_fauna: 'pb-rep-01',
        nome: 'Tartaruga-de-pente',
        especie: 'Eretmochelys imbricata',
        tipo_animal: 'Réptil',
        bioma: 'Mata Atlântica',
        habitat: 'Recifes de corais costeiros, costões rochosos e praias de desova',
        descricao: 'Tartaruga marinha que utiliza os recifes da costa paraibana para alimentação e praias arenosas para desova durante o verão. Possui bico afilado adaptado para extrair esponjas marinhas de fendas.',
        risco_preservacao: 'Criticamente em perigo',
        codigo_status: 'cr',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/308087101/large.jpeg',
        foto_credito: '(c) malu_md, some rights reserved (CC BY-NC)',
        local_observacao: 'Praia de Intermares, Cabedelo, PB',
        fonte: 'Projeto Guajiru / iNaturalist'
    },
    {
        id_fauna: 'pb-rep-02',
        nome: 'Jacaré-de-papo-amarelo',
        especie: 'Caiman latirostris',
        tipo_animal: 'Réptil',
        bioma: 'Mata Atlântica',
        habitat: 'Lagoas costeiras, rios lentos, brejos e manguezais',
        descricao: 'Grande réptil semiaquático que habita bacias hidrográficas e manguezais do leste paraibano. Possui papel ecológico crucial no controle de moluscos e espécies invasoras de peixes.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://static.inaturalist.org/photos/342308003/large.jpg',
        foto_credito: '(c) Rodrigo Conte, all rights reserved, uploaded by Rodrigo Conte',
        local_observacao: 'Bacia do Rio Mamanguape, PB',
        fonte: 'iNaturalist / Fauna PB'
    },
    {
        id_fauna: 'pb-rep-03',
        nome: 'Cobra-verde-da-caatinga',
        especie: 'Erythrolamprus viridis',
        tipo_animal: 'Réptil',
        bioma: 'Caatinga',
        habitat: 'Caatinga arbustiva e lajedos rochosos',
        descricao: 'Serpente não peçonhenta com coloração verde-esmeralda cintilante, perfeitamente adaptada a caçar lagartos e pequenos anfíbios durante o período diurno no semiárido paraibano.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/668510452/large.jpg',
        foto_credito: '(c) Inacio Oliveira, some rights reserved (CC BY), uploaded by Inacio Oliveira',
        local_observacao: 'Lagedo de Pai Mateus, Cabaceiras, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-rep-04',
        nome: 'Cobra-cipó',
        especie: 'Philodryas nattereri',
        tipo_animal: 'Réptil',
        bioma: 'Caatinga',
        habitat: 'Vegetação arbustiva xerófila e capoeiras',
        descricao: 'Serpente esguia com grande agilidade nos ramos da vegetação de Caatinga. Possui veneno de ação proteolítica leve para imobilização de lagartos e roedores.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/60377054/large.jpeg',
        foto_credito: '(c) José Vinícius de Medeiros, some rights reserved (CC BY-NC-SA), uploaded by José Vinícius de Medeiros',
        local_observacao: 'Cariri Oriental, Boqueirão, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-rep-05',
        nome: 'Teiú',
        especie: 'Salvator merianae',
        tipo_animal: 'Réptil',
        bioma: 'Caatinga e Mata Atlântica',
        habitat: 'Bordas de florestas, caatinga e áreas abertas com solo arenoso',
        descricao: 'Maior lagarto do Nordeste, atingindo até 1,4 metro de comprimento. Onívoro oportunista, consome ovos, pequenos roedores, frutas e carniça. Hiberna nos meses mais secos do ano.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/55249908/large.jpg',
        foto_credito: '(c) Allan Hopkins, some rights reserved (CC BY-NC-ND)',
        local_observacao: 'Jardim Botânico Benjamin Maranhão, João Pessoa, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-rep-06',
        nome: 'Jiboia-da-caatinga',
        especie: 'Boa constrictor',
        tipo_animal: 'Réptil',
        bioma: 'Caatinga e Mata Atlântica',
        habitat: 'Florestas secas, matas ciliares e encostas serranas',
        descricao: 'Serpente constritora de grande porte que atua no controle populacional de roedores e aves. Não possui peçonha e mata suas presas por constrição torácica.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/588689904/large.jpg',
        foto_credito: '(c) nicolas burnel, some rights reserved (CC BY-NC), uploaded by nicolas burnel',
        local_observacao: 'Salgado de São Félix, PB',
        fonte: 'iNaturalist'
    },

    // ==========================================
    // ANFÍBIOS (Amphibia)
    // ==========================================
    {
        id_fauna: 'pb-anf-01',
        nome: 'Sapo-cururu-do-nordeste',
        especie: 'Rhinella jimi',
        tipo_animal: 'Anfíbio',
        bioma: 'Caatinga e Mata Atlântica',
        habitat: 'Áreas abertas, margens de açudes e caatinga',
        descricao: 'Anfíbio anuro robusto adaptado ao semiárido nordestino. Possui glândulas paratóides pós-orbitais que secretam toxinas de defesa e atua vorazmente no controle de insetos agrícolas e pragas urbanas.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/5518079/large.jpeg',
        foto_credito: '(c) Luis Felipe Mayorga, some rights reserved (CC BY-NC), uploaded by Luis Felipe Mayorga',
        local_observacao: 'Agreste Paraibano, Campina Grande, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-anf-02',
        nome: 'Perereca-verde-da-mata',
        especie: 'Boana albomarginata',
        tipo_animal: 'Anfíbio',
        bioma: 'Mata Atlântica',
        habitat: 'Vegetação marginal de brejos de altitude e riachos florestados',
        descricao: 'Hílido arborícola com coloração verde-clara brilhante e discos adesivos bem desenvolvidos nas extremidades dos dedos. Canto estridente emitido ao entardecer após chuvas torrenciais.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/10387293/large.jpg',
        foto_credito: '(c) Instituto Últimos Refúgios, some rights reserved (CC BY-NC), uploaded by Instituto Últimos Refúgios',
        local_observacao: 'Mata do Pau-Ferro, Areia, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-anf-03',
        nome: 'Sapo-do-chifre (Intanha)',
        especie: 'Ceratophrys joazeirensis',
        tipo_animal: 'Anfíbio',
        bioma: 'Caatinga',
        habitat: 'Poças temporárias da caatinga e solos argilosos',
        descricao: 'Anfíbio raro endêmico do semiárido brasileiro com projeções dérmicas em forma de chifre acima dos olhos. Permanece enterrado durante a estiagem prolongada e emerge explosivamente após as primeiras chuvas.',
        risco_preservacao: 'Dados insuficientes',
        codigo_status: 'dd',
        foto_url: 'https://static.inaturalist.org/photos/115444040/large.jpeg',
        foto_credito: '(c) igorjroberto, all rights reserved',
        local_observacao: 'Bacia do Rio Piranhas, Pombal, PB',
        fonte: 'ICMBio / Lista Vermelha'
    },

    // ==========================================
    // PEIXES (Actinopterygii / Chondrichthyes)
    // ==========================================
    {
        id_fauna: 'pb-px-01',
        nome: 'Mero',
        especie: 'Epinephelus itajara',
        tipo_animal: 'Peixe',
        bioma: 'Mata Atlântica',
        habitat: 'Recifes de corais, naufrágios costeiros e estuários com manguezal',
        descricao: 'Um dos maiores peixes ósseos marinhos do Atlântico, podendo atingir mais de 2,5 metros de comprimento. Os juvenis dependem estritamente das raízes dos manguezais para crescimento seguro antes de migrarem para os recifes.',
        risco_preservacao: 'Criticamente em perigo',
        codigo_status: 'cr',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/98481122/large.jpg',
        foto_credito: '(c) victorbach, some rights reserved (CC BY-NC), uploaded by victorbach',
        local_observacao: 'Recifes de Picãozinho / Naufrágio Queimado, João Pessoa, PB',
        fonte: 'ICMBio / Lista Vermelha IUCN'
    },
    {
        id_fauna: 'pb-px-02',
        nome: 'Peixe-donzela-do-nordeste',
        especie: 'Stegastes fuscus',
        tipo_animal: 'Peixe',
        bioma: 'Mata Atlântica',
        habitat: 'Piscinas naturais de recifes de arenito e corais rasos',
        descricao: 'Pequeno peixe territorial e herbívoro comum nas piscinas naturais dos Seixas e Picãozinho. Defende ativamente pequenas fazendas de algas contra outros peixes recifais.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://static.inaturalist.org/photos/14309214/large.jpg',
        foto_credito: '(c) Rodrigo Maia-Nogueira, all rights reserved, uploaded by Rodrigo Maia-Nogueira',
        local_observacao: 'Piscinas Naturais do Seixas, João Pessoa, PB',
        fonte: 'iNaturalist'
    },
    {
        id_fauna: 'pb-px-03',
        nome: 'Traíra',
        especie: 'Hoplias malabaricus',
        tipo_animal: 'Peixe',
        bioma: 'Caatinga e Mata Atlântica',
        habitat: 'Açudes, lagoas marginais e rios de águas calmas',
        descricao: 'Peixe carnívoro de água doce com mandíbula repleta de dentes caniniformes pontiagudos. Predador de emboscada perfeitamente camuflado no fundo lodoso de reservatórios do semiárido.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/313660985/large.jpeg',
        foto_credito: '(c) Marie-Aurélia Sabatte, some rights reserved (CC BY-NC), uploaded by Marie-Aurélia Sabatte',
        local_observacao: 'Açude Epitácio Pessoa (Boqueirão), PB',
        fonte: 'Fauna Paraibana'
    },

    // ==========================================
    // INVERTEBRADOS (Mollusca, Arthropoda, Crustacea)
    // ==========================================
    {
        id_fauna: 'pb-inv-01',
        nome: 'Caranguejo-uçá',
        especie: 'Ucides cordatus',
        tipo_animal: 'Invertebrado',
        bioma: 'Mata Atlântica',
        habitat: 'Bosques de manguezal e lamas estuarinas salobras',
        descricao: 'Crustáceo bioengenheiro fundamental dos manguezais paraibanos. Escava galerias profundas no sedimento que oxigenam a lama e processa grandes volumes de folhas caídas de mangue.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/227804427/large.jpeg',
        foto_credito: '(c) Horacio Alberto Garcia, some rights reserved (CC BY-NC), uploaded by Horacio Alberto Garcia',
        local_observacao: 'Estuário do Rio Paraíba, Cabedelo, PB',
        fonte: 'Fauna Paraibana / ICMBio'
    },
    {
        id_fauna: 'pb-inv-02',
        nome: 'Abelha-jandaíra',
        especie: 'Melipona subnitida',
        tipo_animal: 'Invertebrado',
        bioma: 'Caatinga',
        habitat: 'Troncos ocos de árvores nativas da caatinga (baraúna, umbuzeiro)',
        descricao: 'Abelha nativa sem ferrão (meliponíneo) endêmica do semiárido brasileiro. Principal polinizadora da flora da Caatinga, indispensável para a frutificação de espécies nativas e manutenção da vegetação.',
        risco_preservacao: 'Pouco preocupante',
        codigo_status: 'lc',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/135477977/large.jpg',
        foto_credito: '(c) José Vinícius de Medeiros, some rights reserved (CC BY-NC-SA), uploaded by José Vinícius de Medeiros',
        local_observacao: 'Curimataú Paraibano, Picuí, PB',
        fonte: 'Fauna Paraibana'
    },
    {
        id_fauna: 'pb-inv-03',
        nome: 'Lagosta-vermelha',
        especie: 'Panulirus argus',
        tipo_animal: 'Invertebrado',
        bioma: 'Mata Atlântica',
        habitat: 'Fendas de recifes coralíneos e costões rochosos da plataforma continental',
        descricao: 'Crustáceo decápode marinho que habita fendas escuras em recifes de arenito da costa paraibana. Noturna e detritívora/carnívora, possui longas antenas sensoriais.',
        risco_preservacao: 'Vulnerável',
        codigo_status: 'vu',
        foto_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/30862642/large.jpg',
        foto_credito: '(c) terence zahner, some rights reserved (CC BY-NC), uploaded by terence zahner',
        local_observacao: 'Plataforma Continental, Baía da Traição, PB',
        fonte: 'ICMBio / Lista Vermelha'
    }
];

/**
 * Normaliza um objeto de espécie para a estrutura oficial da Entidade Fauna
 */
export function normalizarEntidadeFauna(dados) {
    const statusObj = formatarStatusConservacao(dados.risco_preservacao || dados.codigo_status);
    const biomaInferido = inferirBioma(dados);

    // Extrair município da string de localidade caso não venha explícito
    let municipioExtraido = dados.municipio;
    if (!municipioExtraido && dados.local_observacao) {
        const partes = dados.local_observacao.split(',');
        municipioExtraido = partes[0].trim();
    }

    return {
        id_fauna: dados.id_fauna || `fauna-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        nome: dados.nome || 'Espécie em catalogação',
        especie: dados.especie || 'Nome científico em validação',
        tipo_animal: dados.tipo_animal || classificarTipoAnimal(dados.iconic_taxon_name || dados.classe),
        bioma: biomaInferido,
        bioma_principal: biomaInferido,
        habitat: dados.habitat || inferirHabitat(dados),
        descricao: dados.descricao || 'Espécie catalogada com registro de ocorrência comprovada no território do estado da Paraíba.',
        risco_preservacao: statusObj.nome,
        codigo_status: statusObj.codigo,
        foto_url: dados.foto_url || 'assets/imagens/placeholder-animal.svg',
        foto_credito: dados.foto_credito || dados.foto_atribuicao || 'Registro fotográfico em catalogação',
        foto_atribuicao: dados.foto_atribuicao || dados.foto_credito || 'Registro fotográfico em catalogação',
        municipio: municipioExtraido || 'Paraíba',
        data_observacao: dados.data_observacao || 'Registro verificado',
        local_observacao: dados.local_observacao || 'Paraíba, Brasil',
        fonte: dados.fonte || 'iNaturalist API'
    };
}

/**
 * Mapeia classes taxonômicas para tipos em português
 */
export function classificarTipoAnimal(taxon) {
    if (!taxon) return 'Outro';
    const t = String(taxon).toLowerCase();
    if (t.includes('mammalia') || t.includes('mamifero')) return 'Mamífero';
    if (t.includes('aves') || t.includes('ave') || t.includes('pássaro')) return 'Ave';
    if (t.includes('reptilia') || t.includes('réptil') || t.includes('reptil')) return 'Réptil';
    if (t.includes('amphibia') || t.includes('anfíbio') || t.includes('anfibio')) return 'Anfíbio';
    if (t.includes('actinopterygii') || t.includes('peixe') || t.includes('chondrichthyes')) return 'Peixe';
    if (t.includes('insecta') || t.includes('mollusca') || t.includes('arachnida') || t.includes('invertebrado') || t.includes('crustacea')) {
        return 'Invertebrado';
    }
    return 'Fauna Silvestre';
}

/**
 * Infere cientificamente o bioma com base na geografia da Paraíba
 */
function inferirBioma(dados) {
    if (dados.bioma) return dados.bioma;
    const texto = `${dados.nome || ''} ${dados.habitat || ''} ${dados.local_observacao || ''} ${dados.place_guess || ''}`.toLowerCase();

    if (texto.includes('caatinga') || texto.includes('patos') || texto.includes('sousa') || texto.includes('cariri') || texto.includes('cabaceiras') || texto.includes('monteiro') || texto.includes('picuí')) {
        return 'Caatinga';
    }
    if (texto.includes('litoral') || texto.includes('mangue') || texto.includes('costa') || texto.includes('cabedelo') || texto.includes('joão pessoa') || texto.includes('areia') || texto.includes('brejo')) {
        return 'Mata Atlântica';
    }
    return 'Caatinga e Mata Atlântica';
}

/**
 * Infere cientificamente o habitat ecológico
 */
function inferirHabitat(dados) {
    const texto = `${dados.nome || ''} ${dados.place_guess || ''} ${dados.habitat || ''}`.toLowerCase();
    if (texto.includes('caatinga')) return 'Caatinga arbustiva e matas secas';
    if (texto.includes('mangue') || texto.includes('estuário')) return 'Manguezais estuarinos e zonas de maré';
    if (texto.includes('recife') || texto.includes('marinho') || texto.includes('praia') || texto.includes('costa')) {
        return 'Recifes costeiros e águas marinhas rasas';
    }
    if (texto.includes('brejo') || texto.includes('serra')) return 'Brejos de altitude e florestas úmidas de serra';
    return 'Florestas úmidas, bordas de matas e vegetação ciliar';
}
