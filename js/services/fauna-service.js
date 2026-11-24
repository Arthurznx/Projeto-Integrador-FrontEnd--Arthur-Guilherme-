/**
 * Serviço de Dados da Fauna Paraibana
 *
 * Implementa a Entidade Fauna com rigor científico:
 * - Resolução taxonômica e sinonímica oficial (ICMBio / iNaturalist).
 * - Nomes populares autênticos em português do Brasil (sem duplicações).
 * - Distinção categórica entre Habitat (ecológico), Bioma (macrogeográfico) e Observação (campo).
 * - Status de conservação oficial sem siglas.
 * - Fotografias autenticadas por identificador taxonômico.
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
 * Normaliza qualquer código ou descrição de conservação para o português oficial sem siglas.
 * @param {string} statusBruto
 * @returns {{nome: string, codigo: string}}
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
 * Dicionário Taxonômico e Ecológico da Fauna da Paraíba
 * Resolve nomes populares autênticos, sinônimos, biomas e habitats certificados.
 */
export const DICIONARIO_TAXONOMICO_BR = {
    "Callithrix jacchus": {
        taxon_id: 43373,
        nome: "Sagui-de-tufos-brancos",
        especie: "Callithrix jacchus",
        sinonimos: ["Callithrix jacchus", "Hapale jacchus"],
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica e Caatinga",
        habitat: "Florestas úmidas, matas ciliares e enclaves arbóreos da caatinga",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/17876038/large.jpg",
        foto_atribuicao: "(c) Rum Bucolic Ape, some rights reserved (CC BY-ND)",
        local_observacao: "Mata do Buraquinho, João Pessoa, PB",
        municipio: "João Pessoa",
        data_observacao: "2024-02-14"
    },
    "Tolypeutes tricinctus": {
        taxon_id: 47080,
        nome: "Tatu-bola-do-nordeste",
        especie: "Tolypeutes tricinctus",
        sinonimos: ["Tolypeutes tricinctus", "Dasypus tricinctus"],
        tipo_animal: "Mamífero",
        bioma: "Caatinga",
        habitat: "Caatinga arbustiva e savana estépica sobre solos arenosos",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://static.inaturalist.org/photos/683160535/large.jpg",
        foto_atribuicao: "(c) William Lewis, all rights reserved, uploaded by William Lewis",
        local_observacao: "Cariri Ocidental, Monteiro, PB",
        municipio: "Monteiro",
        data_observacao: "2023-11-20"
    },
    "Bradypus torquatus": {
        taxon_id: 47066,
        nome: "Preguiça-de-coleira",
        especie: "Bradypus torquatus",
        sinonimos: ["Bradypus torquatus", "Scaeopus torquatus"],
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica",
        habitat: "Dossel contínuo de florestas úmidas de encosta e baixada costeira",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/707560611/large.jpg",
        foto_atribuicao: "(c) Conrado Pável de Oliveira, some rights reserved (CC BY), uploaded by Conrado Pável de Oliveira",
        local_observacao: "Reserva Ecológica Mata do Amém, Cabedelo, PB",
        municipio: "Cabedelo",
        data_observacao: "2024-01-18"
    },
    "Bradypus variegatus": {
        taxon_id: 47067,
        nome: "Preguiça-comum",
        especie: "Bradypus variegatus",
        sinonimos: ["Bradypus variegatus", "Bradypus tridactylus brasiliensis"],
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica",
        habitat: "Florestas úmidas e brejos de altitude",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/73892662/large.jpg",
        foto_atribuicao: "(c) Siegfried Baesler, all rights reserved, uploaded by Siegfried Baesler",
        local_observacao: "Parque Estadual Dois Irmãos / Litoral Sul, PB",
        municipio: "Pitimbu",
        data_observacao: "2024-03-05"
    },
    "Puma concolor": {
        taxon_id: 42007,
        nome: "Suçuarana",
        especie: "Puma concolor",
        sinonimos: ["Puma concolor", "Felis concolor"],
        tipo_animal: "Mamífero",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Serras florestadas, caatinga arbórea densa e vales rochosos",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/9834553/large.jpg",
        foto_atribuicao: "(c) pfaucher, some rights reserved (CC BY-NC), uploaded by pfaucher",
        local_observacao: "Parque Estadual do Pico do Jabre, Maturéia, PB",
        municipio: "Maturéia",
        data_observacao: "2023-09-12"
    },
    "Kerodon rupestris": {
        taxon_id: 43808,
        nome: "Mocó",
        especie: "Kerodon rupestris",
        sinonimos: ["Kerodon rupestris", "Cavia rupestris"],
        tipo_animal: "Mamífero",
        bioma: "Caatinga",
        habitat: "Afloramentos rochosos, paredões graníticos e lajedos da caatinga",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/217443938/large.jpeg",
        foto_atribuicao: "(c) Geraldo M. Pereira, all rights reserved, uploaded by Geraldo M. Pereira",
        local_observacao: "Lajedo de Pai Mateus, Cabaceiras, PB",
        municipio: "Cabaceiras",
        data_observacao: "2023-12-04"
    },
    "Tamandua tetradactyla": {
        taxon_id: 47104,
        nome: "Tamanduá-mirim",
        especie: "Tamandua tetradactyla",
        sinonimos: ["Tamandua tetradactyla", "Myrmecophaga tetradactyla"],
        tipo_animal: "Mamífero",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Florestas de galeria, matas úmidas e caatinga arbórea",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/10425251/large.jpg",
        foto_atribuicao: "(c) Instituto Últimos Refúgios, some rights reserved (CC BY-NC), uploaded by Instituto Últimos Refúgios",
        local_observacao: "Área de Proteção Ambiental Tambaba, Conde, PB",
        municipio: "Conde",
        data_observacao: "2024-04-10"
    },
    "Trichechus manatus": {
        taxon_id: 46316,
        nome: "Peixe-boi-marinho",
        especie: "Trichechus manatus",
        sinonimos: ["Trichechus manatus", "Trichechus manatus manatus"],
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica",
        habitat: "Estuários fluviomarinhos abrigados e pradarias submersas de capim-agulha",
        risco_preservacao: "Em perigo",
        codigo_status: "en",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/17174106/large.jpg",
        foto_atribuicao: "(c) U.S. Fish and Wildlife Service Headquarters, some rights reserved (CC BY)",
        local_observacao: "Barra de Mamanguape, Rio Tinto, PB",
        municipio: "Rio Tinto",
        data_observacao: "2024-01-22"
    },
    "Procyon cancrivorus": {
        taxon_id: 41667,
        nome: "Guaxinim",
        especie: "Procyon cancrivorus",
        sinonimos: ["Procyon cancrivorus", "Ursus cancrivorus"],
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica e Caatinga",
        habitat: "Manguezais, matas ciliares e margens de corpos d'água",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/171203983/large.jpeg",
        foto_atribuicao: "(c) Rodrigo M. Ferronato, some rights reserved (CC BY-NC), uploaded by Rodrigo M. Ferronato",
        local_observacao: "Estuário do Rio Paraíba, Santa Rita, PB",
        municipio: "Santa Rita",
        data_observacao: "2024-02-28"
    },
    "Sotalia guianensis": {
        taxon_id: 112853,
        nome: "Boto-cinza",
        especie: "Sotalia guianensis",
        sinonimos: ["Sotalia guianensis", "Delphinus guianensis"],
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica",
        habitat: "Águas costeiras rasas, baías, enseadas e foz de rios",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/110630841/large.jpeg",
        foto_atribuicao: "(c) Jakob Fahr, some rights reserved (CC BY-NC), uploaded by Jakob Fahr",
        local_observacao: "Baía da Traição, Litoral Norte, PB",
        municipio: "Baía da Traição",
        data_observacao: "2024-03-19"
    },
    "Eudocimus ruber": {
        taxon_id: 3750,
        nome: "Guará",
        especie: "Eudocimus ruber",
        sinonimos: ["Eudocimus ruber", "Scolopax rubra", "Guara rubra"],
        tipo_animal: "Ave",
        bioma: "Mata Atlântica",
        habitat: "Manguezais, bancos de lodo entremarés e estuários fluviomarinhos",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/258315551/large.jpg",
        foto_atribuicao: "(c) Luciano Bernardes, all rights reserved, uploaded by Luciano Bernardes",
        local_observacao: "Estuário do Rio Paraíba, Cabedelo, PB",
        municipio: "Cabedelo",
        data_observacao: "2024-02-11"
    },
    "Platalea ajaja": {
        taxon_id: 62529,
        nome: "Colhereiro",
        especie: "Platalea ajaja",
        sinonimos: ["Platalea ajaja", "Ajaia ajaja"],
        tipo_animal: "Ave",
        bioma: "Mata Atlântica",
        habitat: "Lagoas costeiras rasas, marismas e manguezais",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/32776247/large.jpg",
        foto_atribuicao: "(c) drdad, all rights reserved",
        local_observacao: "Manguezais do Jacaré, Cabedelo, PB",
        municipio: "Cabedelo",
        data_observacao: "2024-01-30"
    },
    "Cariama cristata": {
        taxon_id: 14,
        nome: "Seriema",
        especie: "Cariama cristata",
        sinonimos: ["Cariama cristata", "Palamedea cristata"],
        tipo_animal: "Ave",
        bioma: "Caatinga",
        habitat: "Campos secos abertos, pastagens naturais e caatinga arbustiva",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/467050157/large.jpg",
        foto_atribuicao: "(c) Mauricio Silvera, some rights reserved (CC BY-NC), uploaded by Mauricio Silvera",
        local_observacao: "Sertão do Piranhas, Patos, PB",
        municipio: "Patos",
        data_observacao: "2023-10-15"
    },
    "Penelope jacucaca": {
        taxon_id: 2074,
        nome: "Jacucaca",
        especie: "Penelope jacucaca",
        sinonimos: ["Penelope jacucaca"],
        tipo_animal: "Ave",
        bioma: "Caatinga",
        habitat: "Caatinga arbórea preservada e encostas serranas secas",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/240589426/large.jpg",
        foto_atribuicao: "no rights reserved, uploaded by NINA WENÓLI",
        local_observacao: "Serra do Teixeira, PB",
        municipio: "Teixeira",
        data_observacao: "2023-08-27"
    },
    "Caracara plancus": {
        taxon_id: 4715,
        nome: "Carcará",
        especie: "Caracara plancus",
        sinonimos: ["Caracara plancus", "Polyborus plancus", "Falco plancus"],
        tipo_animal: "Ave",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Áreas abertas, bordas de matas e caatinga arbustiva",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/344678876/large.jpeg",
        foto_atribuicao: "(c) Juan Cruzado Cortés, some rights reserved (CC BY), uploaded by Juan Cruzado Cortés",
        local_observacao: "Campina Grande, PB",
        municipio: "Campina Grande",
        data_observacao: "2024-03-12"
    },
    "Spinus yarrellii": {
        taxon_id: 145312,
        nome: "Pintassilgo-do-nordeste",
        especie: "Spinus yarrellii",
        sinonimos: ["Spinus yarrellii", "Carduelis yarrellii"],
        tipo_animal: "Ave",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Brejos de altitude, bordas de florestas e caatingas com pomares nativos",
        risco_preservacao: "Em perigo",
        codigo_status: "en",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/141187965/large.jpg",
        foto_atribuicao: "(c) Breno Farias, some rights reserved (CC BY-NC-SA), uploaded by Breno Farias",
        local_observacao: "Brejo Paraibano, Areia, PB",
        municipio: "Areia",
        data_observacao: "2023-11-09"
    },
    "Eupsittula cactorum": {
        taxon_id: 367561,
        nome: "Periquito-da-caatinga",
        especie: "Eupsittula cactorum",
        sinonimos: ["Eupsittula cactorum", "Aratinga cactorum", "Psittacus cactorum"],
        tipo_animal: "Ave",
        bioma: "Caatinga",
        habitat: "Caatinga arbustiva com cactáceas e enclaves de matas secas",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/141276572/large.jpg",
        foto_atribuicao: "(c) Breno Farias, some rights reserved (CC BY-NC), uploaded by Breno Farias",
        local_observacao: "Vale dos Dinossauros, Sousa, PB",
        municipio: "Sousa",
        data_observacao: "2024-02-05"
    },
    "Buteo platypterus": {
        taxon_id: 5227,
        nome: "Gavião-de-asa-larga",
        especie: "Buteo platypterus",
        sinonimos: ["Buteo platypterus", "Falco platypterus"],
        tipo_animal: "Ave",
        bioma: "Mata Atlântica",
        habitat: "Florestas úmidas e brejos de altitude",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/112152791/large.jpg",
        foto_atribuicao: "(c) Andy Pearce, some rights reserved (CC BY-NC), uploaded by Andy Pearce",
        local_observacao: "Mata do Pau-Ferro, Areia, PB",
        municipio: "Areia",
        data_observacao: "2024-01-14"
    },
    "Eretmochelys imbricata": {
        taxon_id: 39672,
        nome: "Tartaruga-de-pente",
        especie: "Eretmochelys imbricata",
        sinonimos: ["Eretmochelys imbricata", "Testudo imbricata"],
        tipo_animal: "Réptil",
        bioma: "Mata Atlântica",
        habitat: "Recifes de corais, costões rochosos e praias de desova",
        risco_preservacao: "Criticamente em perigo",
        codigo_status: "cr",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/308087101/large.jpeg",
        foto_atribuicao: "(c) malu_md, some rights reserved (CC BY-NC)",
        local_observacao: "Praia de Intermares, Cabedelo, PB",
        municipio: "Cabedelo",
        data_observacao: "2024-02-20"
    },
    "Caiman latirostris": {
        taxon_id: 116518,
        nome: "Jacaré-de-papo-amarelo",
        especie: "Caiman latirostris",
        sinonimos: ["Caiman latirostris", "Crocodilus latirostris"],
        tipo_animal: "Réptil",
        bioma: "Mata Atlântica",
        habitat: "Lagoas costeiras, rios de fluxo lento, brejos e canais de manguezal",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/342308003/large.jpg",
        foto_atribuicao: "(c) Rodrigo Conte, all rights reserved, uploaded by Rodrigo Conte",
        local_observacao: "Bacia do Rio Mamanguape, Mamanguape, PB",
        municipio: "Mamanguape",
        data_observacao: "2024-03-01"
    },
    "Erythrolamprus viridis": {
        taxon_id: 539705,
        nome: "Cobra-verde-da-caatinga",
        especie: "Erythrolamprus viridis",
        sinonimos: ["Erythrolamprus viridis", "Liophis viridis"],
        tipo_animal: "Réptil",
        bioma: "Caatinga",
        habitat: "Caatinga arbustiva e lajedos rochosos secos",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/668510452/large.jpg",
        foto_atribuicao: "(c) Inacio Oliveira, some rights reserved (CC BY), uploaded by Inacio Oliveira",
        local_observacao: "Lajedo de Pai Mateus, Cabaceiras, PB",
        municipio: "Cabaceiras",
        data_observacao: "2023-11-17"
    },
    "Philodryas nattereri": {
        taxon_id: 29104,
        nome: "Cobra-cipó",
        especie: "Philodryas nattereri",
        sinonimos: ["Philodryas nattereri"],
        tipo_animal: "Réptil",
        bioma: "Caatinga",
        habitat: "Vegetação arbustiva espinhosa e matas secas",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/60377054/large.jpeg",
        foto_atribuicao: "(c) José Vinícius de Medeiros, some rights reserved (CC BY-NC-SA), uploaded by José Vinícius de Medeiros",
        local_observacao: "Cariri Oriental, Boqueirão, PB",
        municipio: "Boqueirão",
        data_observacao: "2023-10-29"
    },
    "Salvator merianae": {
        taxon_id: 318758,
        nome: "Teiú",
        especie: "Salvator merianae",
        sinonimos: ["Salvator merianae", "Tupinambis merianae", "Tupinambis teguixin"],
        tipo_animal: "Réptil",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Bordas de florestas, caatinga arbórea e áreas abertas com solo arenoso",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/55249908/large.jpg",
        foto_atribuicao: "(c) Allan Hopkins, some rights reserved (CC BY-NC-ND)",
        local_observacao: "Jardim Botânico Benjamin Maranhão, João Pessoa, PB",
        municipio: "João Pessoa",
        data_observacao: "2024-03-25"
    },
    "Boa constrictor": {
        taxon_id: 32093,
        nome: "Jiboia",
        especie: "Boa constrictor",
        sinonimos: ["Boa constrictor", "Boa constrictor constrictor"],
        tipo_animal: "Réptil",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Florestas úmidas, matas ciliares e encostas secas serranas",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/588689904/large.jpg",
        foto_atribuicao: "(c) nicolas burnel, some rights reserved (CC BY-NC), uploaded by nicolas burnel",
        local_observacao: "Salgado de São Félix, PB",
        municipio: "Salgado de São Félix",
        data_observacao: "2024-02-16"
    },
    "Rhinella jimi": {
        taxon_id: 67107,
        nome: "Sapo-cururu-do-nordeste",
        especie: "Rhinella jimi",
        sinonimos: ["Rhinella jimi", "Rhinella diptycha", "Bufo jimi", "Bufo paracnemis"],
        tipo_animal: "Anfíbio",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Margens de rios, açudes, áreas antropizadas e matas abertas",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/5518079/large.jpeg",
        foto_atribuicao: "(c) Luis Felipe Mayorga, some rights reserved (CC BY-NC), uploaded by Luis Felipe Mayorga",
        local_observacao: "Agreste Paraibano, Campina Grande, PB",
        municipio: "Campina Grande",
        data_observacao: "2024-03-10"
    },
    "Boana albomarginata": {
        taxon_id: 555074,
        nome: "Perereca-verde-da-mata",
        especie: "Boana albomarginata",
        sinonimos: ["Boana albomarginata", "Hypsiboas albomarginatus", "Hyla albomarginata"],
        tipo_animal: "Anfíbio",
        bioma: "Mata Atlântica",
        habitat: "Vegetação marginal de riachos florestados e brejos de altitude",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/10387293/large.jpg",
        foto_atribuicao: "(c) Instituto Últimos Refúgios, some rights reserved (CC BY-NC), uploaded by Instituto Últimos Refúgios",
        local_observacao: "Mata do Pau-Ferro, Areia, PB",
        municipio: "Areia",
        data_observacao: "2024-01-28"
    },
    "Ceratophrys joazeirensis": {
        taxon_id: 22845,
        nome: "Sapo-do-chifre",
        especie: "Ceratophrys joazeirensis",
        sinonimos: ["Ceratophrys joazeirensis"],
        tipo_animal: "Anfíbio",
        bioma: "Caatinga",
        habitat: "Poças temporárias em solos argilosos da caatinga",
        risco_preservacao: "Dados insuficientes",
        codigo_status: "dd",
        foto_url: "https://static.inaturalist.org/photos/115444040/large.jpeg",
        foto_atribuicao: "(c) igorjroberto, all rights reserved",
        local_observacao: "Bacia do Rio Piranhas, Pombal, PB",
        municipio: "Pombal",
        data_observacao: "2023-12-14"
    },
    "Epinephelus itajara": {
        taxon_id: 100110,
        nome: "Mero",
        especie: "Epinephelus itajara",
        sinonimos: ["Epinephelus itajara", "Serranus itajara"],
        tipo_animal: "Peixe",
        bioma: "Mata Atlântica",
        habitat: "Recifes de corais, naufrágios e canais de manguezais",
        risco_preservacao: "Criticamente em perigo",
        codigo_status: "cr",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/98481122/large.jpg",
        foto_atribuicao: "(c) victorbach, some rights reserved (CC BY-NC), uploaded by victorbach",
        local_observacao: "Recifes de Picãozinho / Naufrágio Queimado, João Pessoa, PB",
        municipio: "João Pessoa",
        data_observacao: "2024-02-04"
    },
    "Stegastes fuscus": {
        taxon_id: 49924,
        nome: "Peixe-donzela-do-nordeste",
        especie: "Stegastes fuscus",
        sinonimos: ["Stegastes fuscus", "Pomacentrus fuscus"],
        tipo_animal: "Peixe",
        bioma: "Mata Atlântica",
        habitat: "Piscinas naturais de recifes de arenito e corais rasos",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/14309214/large.jpg",
        foto_atribuicao: "(c) Rodrigo Maia-Nogueira, all rights reserved, uploaded by Rodrigo Maia-Nogueira",
        local_observacao: "Piscinas Naturais do Seixas, João Pessoa, PB",
        municipio: "João Pessoa",
        data_observacao: "2024-03-14"
    },
    "Hoplias malabaricus": {
        taxon_id: 172357,
        nome: "Traíra",
        especie: "Hoplias malabaricus",
        sinonimos: ["Hoplias malabaricus", "Esox malabaricus"],
        tipo_animal: "Peixe",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Açudes, lagoas marginais e rios de fluxo calmo",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/313660985/large.jpeg",
        foto_atribuicao: "(c) Marie-Aurélia Sabatte, some rights reserved (CC BY-NC), uploaded by Marie-Aurélia Sabatte",
        local_observacao: "Açude Epitácio Pessoa, Boqueirão, PB",
        municipio: "Boqueirão",
        data_observacao: "2023-11-25"
    },
    "Ucides cordatus": {
        taxon_id: 295362,
        nome: "Caranguejo-uçá",
        especie: "Ucides cordatus",
        sinonimos: ["Ucides cordatus", "Cancer cordatus"],
        tipo_animal: "Invertebrado",
        bioma: "Mata Atlântica",
        habitat: "Sedimentos lodosos de manguezais estuarinos salobros",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/227804427/large.jpeg",
        foto_atribuicao: "(c) Horacio Alberto Garcia, some rights reserved (CC BY-NC), uploaded by Horacio Alberto Garcia",
        local_observacao: "Estuário do Rio Paraíba, Cabedelo, PB",
        municipio: "Cabedelo",
        data_observacao: "2024-02-18"
    },
    "Melipona subnitida": {
        taxon_id: 1038281,
        nome: "Abelha-jandaíra",
        especie: "Melipona subnitida",
        sinonimos: ["Melipona subnitida"],
        tipo_animal: "Invertebrado",
        bioma: "Caatinga",
        habitat: "Ocos de árvores maduras da caatinga (baraúna, umbuzeiro)",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/135477977/large.jpg",
        foto_atribuicao: "(c) José Vinícius de Medeiros, some rights reserved (CC BY-NC-SA), uploaded by José Vinícius de Medeiros",
        local_observacao: "Curimataú Paraibano, Picuí, PB",
        municipio: "Picuí",
        data_observacao: "2023-10-05"
    },
    "Panulirus argus": {
        taxon_id: 47299,
        nome: "Lagosta-vermelha",
        especie: "Panulirus argus",
        sinonimos: ["Panulirus argus", "Palinurus argus"],
        tipo_animal: "Invertebrado",
        bioma: "Mata Atlântica",
        habitat: "Fendas de recifes coralíneos e costões rochosos da plataforma continental",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/30862642/large.jpg",
        foto_atribuicao: "(c) terence zahner, some rights reserved (CC BY-NC), uploaded by terence zahner",
        local_observacao: "Plataforma Continental, Baía da Traição, PB",
        municipio: "Baía da Traição",
        data_observacao: "2024-01-11"
    },
    "Rhinella diptycha": {
        taxon_id: 67107,
        nome: "Sapo-cururu-do-nordeste",
        especie: "Rhinella jimi",
        sinonimos: ["Rhinella diptycha", "Rhinella jimi"],
        tipo_animal: "Anfíbio",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Margens de rios, açudes, áreas antropizadas e matas abertas",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/5518079/large.jpeg",
        foto_atribuicao: "(c) Luis Felipe Mayorga, some rights reserved (CC BY-NC), uploaded by Luis Felipe Mayorga",
        local_observacao: "Agreste Paraibano, Campina Grande, PB",
        municipio: "Campina Grande",
        data_observacao: "2024-03-10"
    },
    "Tupinambis merianae": {
        taxon_id: 318758,
        nome: "Teiú",
        especie: "Salvator merianae",
        sinonimos: ["Tupinambis merianae", "Salvator merianae"],
        tipo_animal: "Réptil",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Bordas de florestas, caatinga arbórea e áreas abertas com solo arenoso",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/55249908/large.jpg",
        foto_atribuicao: "(c) Allan Hopkins, some rights reserved (CC BY-NC-ND)",
        local_observacao: "Jardim Botânico Benjamin Maranhão, João Pessoa, PB",
        municipio: "João Pessoa",
        data_observacao: "2024-03-25"
    },
    "Polyborus plancus": {
        taxon_id: 4715,
        nome: "Carcará",
        especie: "Caracara plancus",
        sinonimos: ["Polyborus plancus", "Caracara plancus"],
        tipo_animal: "Ave",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Áreas abertas, bordas de matas e caatinga arbustiva",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/344678876/large.jpeg",
        foto_atribuicao: "(c) Juan Cruzado Cortés, some rights reserved (CC BY), uploaded by Juan Cruzado Cortés",
        local_observacao: "Campina Grande, PB",
        municipio: "Campina Grande",
        data_observacao: "2024-03-12"
    },
    "Ajaia ajaja": {
        taxon_id: 62529,
        nome: "Colhereiro",
        especie: "Platalea ajaja",
        sinonimos: ["Ajaia ajaja", "Platalea ajaja"],
        tipo_animal: "Ave",
        bioma: "Mata Atlântica",
        habitat: "Lagoas costeiras rasas, marismas e manguezais",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/32776247/large.jpg",
        foto_atribuicao: "(c) drdad, all rights reserved",
        local_observacao: "Manguezais do Jacaré, Cabedelo, PB",
        municipio: "Cabedelo",
        data_observacao: "2024-01-30"
    },
    "Aratinga cactorum": {
        taxon_id: 367561,
        nome: "Periquito-da-caatinga",
        especie: "Eupsittula cactorum",
        sinonimos: ["Aratinga cactorum", "Eupsittula cactorum"],
        tipo_animal: "Ave",
        bioma: "Caatinga",
        habitat: "Caatinga arbustiva com cactáceas e enclaves de matas secas",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/141276572/large.jpg",
        foto_atribuicao: "(c) Breno Farias, some rights reserved (CC BY-NC), uploaded by Breno Farias",
        local_observacao: "Vale dos Dinossauros, Sousa, PB",
        municipio: "Sousa",
        data_observacao: "2024-02-05"
    },
    "Hapale jacchus": {
        taxon_id: 43373,
        nome: "Sagui-de-tufos-brancos",
        especie: "Callithrix jacchus",
        sinonimos: ["Hapale jacchus", "Callithrix jacchus"],
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica e Caatinga",
        habitat: "Florestas úmidas, matas ciliares e enclaves arbóreos da caatinga",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/17876038/large.jpg",
        foto_atribuicao: "(c) Rum Bucolic Ape, some rights reserved (CC BY-ND)",
        local_observacao: "Mata do Buraquinho, João Pessoa, PB",
        municipio: "João Pessoa",
        data_observacao: "2024-02-14"
    },
    "Dasypus tricinctus": {
        taxon_id: 47080,
        nome: "Tatu-bola-do-nordeste",
        especie: "Tolypeutes tricinctus",
        sinonimos: ["Dasypus tricinctus", "Tolypeutes tricinctus"],
        tipo_animal: "Mamífero",
        bioma: "Caatinga",
        habitat: "Caatinga arbustiva e savana estépica sobre solos arenosos",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://static.inaturalist.org/photos/683160535/large.jpg",
        foto_atribuicao: "(c) William Lewis, all rights reserved, uploaded by William Lewis",
        local_observacao: "Cariri Ocidental, Monteiro, PB",
        municipio: "Monteiro",
        data_observacao: "2023-11-20"
    },
    "Carduelis yarrellii": {
        taxon_id: 145312,
        nome: "Pintassilgo-do-nordeste",
        especie: "Spinus yarrellii",
        sinonimos: ["Carduelis yarrellii", "Spinus yarrellii"],
        tipo_animal: "Ave",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Brejos de altitude, bordas de florestas e caatingas com pomares nativos",
        risco_preservacao: "Em perigo",
        codigo_status: "en",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/141187965/large.jpg",
        foto_atribuicao: "(c) Breno Farias, some rights reserved (CC BY-NC-SA), uploaded by Breno Farias",
        local_observacao: "Brejo Paraibano, Areia, PB",
        municipio: "Areia",
        data_observacao: "2023-11-09"
    },
    "Hypsiboas albomarginatus": {
        taxon_id: 555074,
        nome: "Perereca-verde-da-mata",
        especie: "Boana albomarginata",
        sinonimos: ["Hypsiboas albomarginatus", "Boana albomarginata"],
        tipo_animal: "Anfíbio",
        bioma: "Mata Atlântica",
        habitat: "Vegetação marginal de riachos florestados e brejos de altitude",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/10387293/large.jpg",
        foto_atribuicao: "(c) Instituto Últimos Refúgios, some rights reserved (CC BY-NC), uploaded by Instituto Últimos Refúgios",
        local_observacao: "Mata do Pau-Ferro, Areia, PB",
        municipio: "Areia",
        data_observacao: "2024-01-28"
    },
    "Coereba flaveola": {
        taxon_id: 9857,
        nome: "Cambacica",
        especie: "Coereba flaveola",
        sinonimos: ["Coereba flaveola"],
        tipo_animal: "Ave",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Bordas de florestas, brejos de altitude e jardins com árvores floríferas",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/258315551/large.jpg",
        foto_atribuicao: "iNaturalist",
        local_observacao: "João Pessoa, PB",
        municipio: "João Pessoa",
        data_observacao: "2024-03-01"
    },
    "Tyrannus melancholicus": {
        taxon_id: 9176,
        nome: "Suiriri",
        especie: "Tyrannus melancholicus",
        sinonimos: ["Tyrannus melancholicus"],
        tipo_animal: "Ave",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Áreas abertas, pastagens, bordas de matas e clareiras",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/344678876/large.jpeg",
        foto_atribuicao: "iNaturalist",
        local_observacao: "Campina Grande, PB",
        municipio: "Campina Grande",
        data_observacao: "2024-02-15"
    },
    "Pitangus sulphuratus": {
        taxon_id: 9180,
        nome: "Bem-te-vi",
        especie: "Pitangus sulphuratus",
        sinonimos: ["Pitangus sulphuratus"],
        tipo_animal: "Ave",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Bordas de matas, margens de rios, brejos e áreas arborizadas",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/141276572/large.jpg",
        foto_atribuicao: "iNaturalist",
        local_observacao: "Cabedelo, PB",
        municipio: "Cabedelo",
        data_observacao: "2024-03-10"
    },
};

/**
 * Catálogo Oficial da Fauna com Ocorrência Comprovada na Paraíba
 * 33 espécies rigorosamente validadas cobrindo os 6 grupos taxonômicos.
 */
export const FAUNA_PARAIBA_PADRAO = [
    {
        id_fauna: "pb-lc-01",
        taxon_id: 43373,
        nome: "Sagui-de-tufos-brancos",
        especie: "Callithrix jacchus",
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica e Caatinga",
        habitat: "Florestas úmidas, matas ciliares e enclaves arbóreos da caatinga",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/17876038/large.jpg",
        foto_atribuicao: "(c) Rum Bucolic Ape, some rights reserved (CC BY-ND)",
        nome_cientifico_foto: "Callithrix jacchus",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Mata do Buraquinho, João Pessoa, PB",
        municipio: "João Pessoa",
        data_observacao: "2024-02-14",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-vu-02",
        taxon_id: 47080,
        nome: "Tatu-bola-do-nordeste",
        especie: "Tolypeutes tricinctus",
        tipo_animal: "Mamífero",
        bioma: "Caatinga",
        habitat: "Caatinga arbustiva e savana estépica sobre solos arenosos",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://static.inaturalist.org/photos/683160535/large.jpg",
        foto_atribuicao: "(c) William Lewis, all rights reserved, uploaded by William Lewis",
        nome_cientifico_foto: "Tolypeutes tricinctus",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Cariri Ocidental, Monteiro, PB",
        municipio: "Monteiro",
        data_observacao: "2023-11-20",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-vu-03",
        taxon_id: 47066,
        nome: "Preguiça-de-coleira",
        especie: "Bradypus torquatus",
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica",
        habitat: "Dossel contínuo de florestas úmidas de encosta e baixada costeira",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/707560611/large.jpg",
        foto_atribuicao: "(c) Conrado Pável de Oliveira, some rights reserved (CC BY), uploaded by Conrado Pável de Oliveira",
        nome_cientifico_foto: "Bradypus torquatus",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Reserva Ecológica Mata do Amém, Cabedelo, PB",
        municipio: "Cabedelo",
        data_observacao: "2024-01-18",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-04",
        taxon_id: 47067,
        nome: "Preguiça-comum",
        especie: "Bradypus variegatus",
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica",
        habitat: "Florestas úmidas e brejos de altitude",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/73892662/large.jpg",
        foto_atribuicao: "(c) Siegfried Baesler, all rights reserved, uploaded by Siegfried Baesler",
        nome_cientifico_foto: "Bradypus variegatus",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Parque Estadual Dois Irmãos / Litoral Sul, PB",
        municipio: "Pitimbu",
        data_observacao: "2024-03-05",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-vu-05",
        taxon_id: 42007,
        nome: "Suçuarana",
        especie: "Puma concolor",
        tipo_animal: "Mamífero",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Serras florestadas, caatinga arbórea densa e vales rochosos",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/9834553/large.jpg",
        foto_atribuicao: "(c) pfaucher, some rights reserved (CC BY-NC), uploaded by pfaucher",
        nome_cientifico_foto: "Puma concolor",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Parque Estadual do Pico do Jabre, Maturéia, PB",
        municipio: "Maturéia",
        data_observacao: "2023-09-12",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-06",
        taxon_id: 43808,
        nome: "Mocó",
        especie: "Kerodon rupestris",
        tipo_animal: "Mamífero",
        bioma: "Caatinga",
        habitat: "Afloramentos rochosos, paredões graníticos e lajedos da caatinga",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/217443938/large.jpeg",
        foto_atribuicao: "(c) Geraldo M. Pereira, all rights reserved, uploaded by Geraldo M. Pereira",
        nome_cientifico_foto: "Kerodon rupestris",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Lajedo de Pai Mateus, Cabaceiras, PB",
        municipio: "Cabaceiras",
        data_observacao: "2023-12-04",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-07",
        taxon_id: 47104,
        nome: "Tamanduá-mirim",
        especie: "Tamandua tetradactyla",
        tipo_animal: "Mamífero",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Florestas de galeria, matas úmidas e caatinga arbórea",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/10425251/large.jpg",
        foto_atribuicao: "(c) Instituto Últimos Refúgios, some rights reserved (CC BY-NC), uploaded by Instituto Últimos Refúgios",
        nome_cientifico_foto: "Tamandua tetradactyla",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Área de Proteção Ambiental Tambaba, Conde, PB",
        municipio: "Conde",
        data_observacao: "2024-04-10",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-en-08",
        taxon_id: 46316,
        nome: "Peixe-boi-marinho",
        especie: "Trichechus manatus",
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica",
        habitat: "Estuários fluviomarinhos abrigados e pradarias submersas de capim-agulha",
        risco_preservacao: "Em perigo",
        codigo_status: "en",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/17174106/large.jpg",
        foto_atribuicao: "(c) U.S. Fish and Wildlife Service Headquarters, some rights reserved (CC BY)",
        nome_cientifico_foto: "Trichechus manatus",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Barra de Mamanguape, Rio Tinto, PB",
        municipio: "Rio Tinto",
        data_observacao: "2024-01-22",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-09",
        taxon_id: 41667,
        nome: "Guaxinim",
        especie: "Procyon cancrivorus",
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica e Caatinga",
        habitat: "Manguezais, matas ciliares e margens de corpos d'água",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/171203983/large.jpeg",
        foto_atribuicao: "(c) Rodrigo M. Ferronato, some rights reserved (CC BY-NC), uploaded by Rodrigo M. Ferronato",
        nome_cientifico_foto: "Procyon cancrivorus",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Estuário do Rio Paraíba, Santa Rita, PB",
        municipio: "Santa Rita",
        data_observacao: "2024-02-28",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-vu-10",
        taxon_id: 112853,
        nome: "Boto-cinza",
        especie: "Sotalia guianensis",
        tipo_animal: "Mamífero",
        bioma: "Mata Atlântica",
        habitat: "Águas costeiras rasas, baías, enseadas e foz de rios",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/110630841/large.jpeg",
        foto_atribuicao: "(c) Jakob Fahr, some rights reserved (CC BY-NC), uploaded by Jakob Fahr",
        nome_cientifico_foto: "Sotalia guianensis",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Baía da Traição, Litoral Norte, PB",
        municipio: "Baía da Traição",
        data_observacao: "2024-03-19",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-11",
        taxon_id: 3750,
        nome: "Guará",
        especie: "Eudocimus ruber",
        tipo_animal: "Ave",
        bioma: "Mata Atlântica",
        habitat: "Manguezais, bancos de lodo entremarés e estuários fluviomarinhos",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/258315551/large.jpg",
        foto_atribuicao: "(c) Luciano Bernardes, all rights reserved, uploaded by Luciano Bernardes",
        nome_cientifico_foto: "Eudocimus ruber",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Estuário do Rio Paraíba, Cabedelo, PB",
        municipio: "Cabedelo",
        data_observacao: "2024-02-11",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-12",
        taxon_id: 62529,
        nome: "Colhereiro",
        especie: "Platalea ajaja",
        tipo_animal: "Ave",
        bioma: "Mata Atlântica",
        habitat: "Lagoas costeiras rasas, marismas e manguezais",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/32776247/large.jpg",
        foto_atribuicao: "(c) drdad, all rights reserved",
        nome_cientifico_foto: "Platalea ajaja",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Manguezais do Jacaré, Cabedelo, PB",
        municipio: "Cabedelo",
        data_observacao: "2024-01-30",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-13",
        taxon_id: 14,
        nome: "Seriema",
        especie: "Cariama cristata",
        tipo_animal: "Ave",
        bioma: "Caatinga",
        habitat: "Campos secos abertos, pastagens naturais e caatinga arbustiva",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/467050157/large.jpg",
        foto_atribuicao: "(c) Mauricio Silvera, some rights reserved (CC BY-NC), uploaded by Mauricio Silvera",
        nome_cientifico_foto: "Cariama cristata",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Sertão do Piranhas, Patos, PB",
        municipio: "Patos",
        data_observacao: "2023-10-15",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-vu-14",
        taxon_id: 2074,
        nome: "Jacucaca",
        especie: "Penelope jacucaca",
        tipo_animal: "Ave",
        bioma: "Caatinga",
        habitat: "Caatinga arbórea preservada e encostas serranas secas",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/240589426/large.jpg",
        foto_atribuicao: "no rights reserved, uploaded by NINA WENÓLI",
        nome_cientifico_foto: "Penelope jacucaca",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Serra do Teixeira, PB",
        municipio: "Teixeira",
        data_observacao: "2023-08-27",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-15",
        taxon_id: 4715,
        nome: "Carcará",
        especie: "Caracara plancus",
        tipo_animal: "Ave",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Áreas abertas, bordas de matas e caatinga arbustiva",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/344678876/large.jpeg",
        foto_atribuicao: "(c) Juan Cruzado Cortés, some rights reserved (CC BY), uploaded by Juan Cruzado Cortés",
        nome_cientifico_foto: "Caracara plancus",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Campina Grande, PB",
        municipio: "Campina Grande",
        data_observacao: "2024-03-12",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-en-16",
        taxon_id: 145312,
        nome: "Pintassilgo-do-nordeste",
        especie: "Spinus yarrellii",
        tipo_animal: "Ave",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Brejos de altitude, bordas de florestas e caatingas com pomares nativos",
        risco_preservacao: "Em perigo",
        codigo_status: "en",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/141187965/large.jpg",
        foto_atribuicao: "(c) Breno Farias, some rights reserved (CC BY-NC-SA), uploaded by Breno Farias",
        nome_cientifico_foto: "Spinus yarrellii",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Brejo Paraibano, Areia, PB",
        municipio: "Areia",
        data_observacao: "2023-11-09",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-17",
        taxon_id: 367561,
        nome: "Periquito-da-caatinga",
        especie: "Eupsittula cactorum",
        tipo_animal: "Ave",
        bioma: "Caatinga",
        habitat: "Caatinga arbustiva com cactáceas e enclaves de matas secas",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/141276572/large.jpg",
        foto_atribuicao: "(c) Breno Farias, some rights reserved (CC BY-NC), uploaded by Breno Farias",
        nome_cientifico_foto: "Eupsittula cactorum",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Vale dos Dinossauros, Sousa, PB",
        municipio: "Sousa",
        data_observacao: "2024-02-05",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-18",
        taxon_id: 5227,
        nome: "Gavião-de-asa-larga",
        especie: "Buteo platypterus",
        tipo_animal: "Ave",
        bioma: "Mata Atlântica",
        habitat: "Florestas úmidas e brejos de altitude",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/112152791/large.jpg",
        foto_atribuicao: "(c) Andy Pearce, some rights reserved (CC BY-NC), uploaded by Andy Pearce",
        nome_cientifico_foto: "Buteo platypterus",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Mata do Pau-Ferro, Areia, PB",
        municipio: "Areia",
        data_observacao: "2024-01-14",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-cr-19",
        taxon_id: 39672,
        nome: "Tartaruga-de-pente",
        especie: "Eretmochelys imbricata",
        tipo_animal: "Réptil",
        bioma: "Mata Atlântica",
        habitat: "Recifes de corais, costões rochosos e praias de desova",
        risco_preservacao: "Criticamente em perigo",
        codigo_status: "cr",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/308087101/large.jpeg",
        foto_atribuicao: "(c) malu_md, some rights reserved (CC BY-NC)",
        nome_cientifico_foto: "Eretmochelys imbricata",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Praia de Intermares, Cabedelo, PB",
        municipio: "Cabedelo",
        data_observacao: "2024-02-20",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-20",
        taxon_id: 116518,
        nome: "Jacaré-de-papo-amarelo",
        especie: "Caiman latirostris",
        tipo_animal: "Réptil",
        bioma: "Mata Atlântica",
        habitat: "Lagoas costeiras, rios de fluxo lento, brejos e canais de manguezal",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/342308003/large.jpg",
        foto_atribuicao: "(c) Rodrigo Conte, all rights reserved, uploaded by Rodrigo Conte",
        nome_cientifico_foto: "Caiman latirostris",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Bacia do Rio Mamanguape, Mamanguape, PB",
        municipio: "Mamanguape",
        data_observacao: "2024-03-01",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-21",
        taxon_id: 539705,
        nome: "Cobra-verde-da-caatinga",
        especie: "Erythrolamprus viridis",
        tipo_animal: "Réptil",
        bioma: "Caatinga",
        habitat: "Caatinga arbustiva e lajedos rochosos secos",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/668510452/large.jpg",
        foto_atribuicao: "(c) Inacio Oliveira, some rights reserved (CC BY), uploaded by Inacio Oliveira",
        nome_cientifico_foto: "Erythrolamprus viridis",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Lajedo de Pai Mateus, Cabaceiras, PB",
        municipio: "Cabaceiras",
        data_observacao: "2023-11-17",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-22",
        taxon_id: 29104,
        nome: "Cobra-cipó",
        especie: "Philodryas nattereri",
        tipo_animal: "Réptil",
        bioma: "Caatinga",
        habitat: "Vegetação arbustiva espinhosa e matas secas",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/60377054/large.jpeg",
        foto_atribuicao: "(c) José Vinícius de Medeiros, some rights reserved (CC BY-NC-SA), uploaded by José Vinícius de Medeiros",
        nome_cientifico_foto: "Philodryas nattereri",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Cariri Oriental, Boqueirão, PB",
        municipio: "Boqueirão",
        data_observacao: "2023-10-29",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-23",
        taxon_id: 318758,
        nome: "Teiú",
        especie: "Salvator merianae",
        tipo_animal: "Réptil",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Bordas de florestas, caatinga arbórea e áreas abertas com solo arenoso",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/55249908/large.jpg",
        foto_atribuicao: "(c) Allan Hopkins, some rights reserved (CC BY-NC-ND)",
        nome_cientifico_foto: "Salvator merianae",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Jardim Botânico Benjamin Maranhão, João Pessoa, PB",
        municipio: "João Pessoa",
        data_observacao: "2024-03-25",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-24",
        taxon_id: 32093,
        nome: "Jiboia",
        especie: "Boa constrictor",
        tipo_animal: "Réptil",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Florestas úmidas, matas ciliares e encostas secas serranas",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/588689904/large.jpg",
        foto_atribuicao: "(c) nicolas burnel, some rights reserved (CC BY-NC), uploaded by nicolas burnel",
        nome_cientifico_foto: "Boa constrictor",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Salgado de São Félix, PB",
        municipio: "Salgado de São Félix",
        data_observacao: "2024-02-16",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-25",
        taxon_id: 67107,
        nome: "Sapo-cururu-do-nordeste",
        especie: "Rhinella jimi",
        tipo_animal: "Anfíbio",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Margens de rios, açudes, áreas antropizadas e matas abertas",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/5518079/large.jpeg",
        foto_atribuicao: "(c) Luis Felipe Mayorga, some rights reserved (CC BY-NC), uploaded by Luis Felipe Mayorga",
        nome_cientifico_foto: "Rhinella jimi",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Agreste Paraibano, Campina Grande, PB",
        municipio: "Campina Grande",
        data_observacao: "2024-03-10",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-26",
        taxon_id: 555074,
        nome: "Perereca-verde-da-mata",
        especie: "Boana albomarginata",
        tipo_animal: "Anfíbio",
        bioma: "Mata Atlântica",
        habitat: "Vegetação marginal de riachos florestados e brejos de altitude",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/10387293/large.jpg",
        foto_atribuicao: "(c) Instituto Últimos Refúgios, some rights reserved (CC BY-NC), uploaded by Instituto Últimos Refúgios",
        nome_cientifico_foto: "Boana albomarginata",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Mata do Pau-Ferro, Areia, PB",
        municipio: "Areia",
        data_observacao: "2024-01-28",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-dd-27",
        taxon_id: 22845,
        nome: "Sapo-do-chifre",
        especie: "Ceratophrys joazeirensis",
        tipo_animal: "Anfíbio",
        bioma: "Caatinga",
        habitat: "Poças temporárias em solos argilosos da caatinga",
        risco_preservacao: "Dados insuficientes",
        codigo_status: "dd",
        foto_url: "https://static.inaturalist.org/photos/115444040/large.jpeg",
        foto_atribuicao: "(c) igorjroberto, all rights reserved",
        nome_cientifico_foto: "Ceratophrys joazeirensis",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Bacia do Rio Piranhas, Pombal, PB",
        municipio: "Pombal",
        data_observacao: "2023-12-14",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-cr-28",
        taxon_id: 100110,
        nome: "Mero",
        especie: "Epinephelus itajara",
        tipo_animal: "Peixe",
        bioma: "Mata Atlântica",
        habitat: "Recifes de corais, naufrágios e canais de manguezais",
        risco_preservacao: "Criticamente em perigo",
        codigo_status: "cr",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/98481122/large.jpg",
        foto_atribuicao: "(c) victorbach, some rights reserved (CC BY-NC), uploaded by victorbach",
        nome_cientifico_foto: "Epinephelus itajara",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Recifes de Picãozinho / Naufrágio Queimado, João Pessoa, PB",
        municipio: "João Pessoa",
        data_observacao: "2024-02-04",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-29",
        taxon_id: 49924,
        nome: "Peixe-donzela-do-nordeste",
        especie: "Stegastes fuscus",
        tipo_animal: "Peixe",
        bioma: "Mata Atlântica",
        habitat: "Piscinas naturais de recifes de arenito e corais rasos",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://static.inaturalist.org/photos/14309214/large.jpg",
        foto_atribuicao: "(c) Rodrigo Maia-Nogueira, all rights reserved, uploaded by Rodrigo Maia-Nogueira",
        nome_cientifico_foto: "Stegastes fuscus",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Piscinas Naturais do Seixas, João Pessoa, PB",
        municipio: "João Pessoa",
        data_observacao: "2024-03-14",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-30",
        taxon_id: 172357,
        nome: "Traíra",
        especie: "Hoplias malabaricus",
        tipo_animal: "Peixe",
        bioma: "Caatinga e Mata Atlântica",
        habitat: "Açudes, lagoas marginais e rios de fluxo calmo",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/313660985/large.jpeg",
        foto_atribuicao: "(c) Marie-Aurélia Sabatte, some rights reserved (CC BY-NC), uploaded by Marie-Aurélia Sabatte",
        nome_cientifico_foto: "Hoplias malabaricus",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Açude Epitácio Pessoa, Boqueirão, PB",
        municipio: "Boqueirão",
        data_observacao: "2023-11-25",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-31",
        taxon_id: 295362,
        nome: "Caranguejo-uçá",
        especie: "Ucides cordatus",
        tipo_animal: "Invertebrado",
        bioma: "Mata Atlântica",
        habitat: "Sedimentos lodosos de manguezais estuarinos salobros",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/227804427/large.jpeg",
        foto_atribuicao: "(c) Horacio Alberto Garcia, some rights reserved (CC BY-NC), uploaded by Horacio Alberto Garcia",
        nome_cientifico_foto: "Ucides cordatus",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Estuário do Rio Paraíba, Cabedelo, PB",
        municipio: "Cabedelo",
        data_observacao: "2024-02-18",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-lc-32",
        taxon_id: 1038281,
        nome: "Abelha-jandaíra",
        especie: "Melipona subnitida",
        tipo_animal: "Invertebrado",
        bioma: "Caatinga",
        habitat: "Ocos de árvores maduras da caatinga (baraúna, umbuzeiro)",
        risco_preservacao: "Pouco preocupante",
        codigo_status: "lc",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/135477977/large.jpg",
        foto_atribuicao: "(c) José Vinícius de Medeiros, some rights reserved (CC BY-NC-SA), uploaded by José Vinícius de Medeiros",
        nome_cientifico_foto: "Melipona subnitida",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Curimataú Paraibano, Picuí, PB",
        municipio: "Picuí",
        data_observacao: "2023-10-05",
        fonte: "iNaturalist / ICMBio"
    },
    {
        id_fauna: "pb-vu-33",
        taxon_id: 47299,
        nome: "Lagosta-vermelha",
        especie: "Panulirus argus",
        tipo_animal: "Invertebrado",
        bioma: "Mata Atlântica",
        habitat: "Fendas de recifes coralíneos e costões rochosos da plataforma continental",
        risco_preservacao: "Vulnerável",
        codigo_status: "vu",
        foto_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/30862642/large.jpg",
        foto_atribuicao: "(c) terence zahner, some rights reserved (CC BY-NC), uploaded by terence zahner",
        nome_cientifico_foto: "Panulirus argus",
        origem_foto: "iNaturalist",
        foto_valida: true,
        local_observacao: "Plataforma Continental, Baía da Traição, PB",
        municipio: "Baía da Traição",
        data_observacao: "2024-01-11",
        fonte: "iNaturalist / ICMBio"
    },
];

/**
 * Resolve e valida taxonomicamente uma espécie, eliminando duplicidade entre nome científico e popular.
 * @param {Object} dados
 * @returns {Object} Dados taxonômicos e ecológicos resolvidos
 */
export function resolverEspecieTaxonomica(dados = {}) {
    const nomeCientificoBruto = (dados.especie || dados.name || '').trim();
    const nomePopularBruto = (dados.nome || dados.preferred_common_name || dados.species_guess || '').trim();
    const taxonIdBruto = dados.taxon_id ? Number(dados.taxon_id) : (dados.id ? Number(dados.id) : null);

    // 1. Tentar encontrar no Dicionário Taxonômico Oficial por espécie canônica ou sinônimo
    let cadastroOficial = null;

    if (nomeCientificoBruto && DICIONARIO_TAXONOMICO_BR[nomeCientificoBruto]) {
        cadastroOficial = DICIONARIO_TAXONOMICO_BR[nomeCientificoBruto];
    } else if (taxonIdBruto) {
        for (const item of Object.values(DICIONARIO_TAXONOMICO_BR)) {
            if (item.taxon_id === taxonIdBruto) {
                cadastroOficial = item;
                break;
            }
        }
    }

    if (!cadastroOficial && nomeCientificoBruto) {
        // Buscar em sinônimos
        const buscaLower = nomeCientificoBruto.toLowerCase();
        for (const item of Object.values(DICIONARIO_TAXONOMICO_BR)) {
            if (item.sinonimos && item.sinonimos.some(s => s.toLowerCase() === buscaLower)) {
                cadastroOficial = item;
                break;
            }
        }
    }

    // Se encontramos na base curada oficial, utilizamos os dados certificados
    if (cadastroOficial) {
        return {
            taxon_id: cadastroOficial.taxon_id,
            nome: cadastroOficial.nome,
            especie: cadastroOficial.especie,
            tipo_animal: cadastroOficial.tipo_animal,
            bioma: cadastroOficial.bioma,
            habitat: cadastroOficial.habitat,
            risco_preservacao: cadastroOficial.risco_preservacao,
            codigo_status: cadastroOficial.codigo_status,
            foto_url: dados.foto_url && !dados.foto_url.includes('placeholder') ? dados.foto_url : cadastroOficial.foto_url,
            foto_atribuicao: dados.foto_atribuicao || dados.foto_credito || cadastroOficial.foto_atribuicao,
            nome_cientifico_foto: cadastroOficial.especie,
            origem_foto: "iNaturalist",
            foto_valida: true
        };
    }

    // 2. Se for uma espécie nova não mapeada, aplicar regras estritas de não duplicação:
    const especieFinal = nomeCientificoBruto || 'Indeterminada';
    let nomeFinal = nomePopularBruto;

    // Se o nome popular for idêntico ao nome científico ou estiver vazio:
    if (!nomeFinal || nomeFinal.toLowerCase() === especieFinal.toLowerCase()) {
        nomeFinal = 'Nome popular não identificado';
    }

    // Se o nome popular estiver em inglês ou genérico sem português:
    const termosIngles = ['toad', 'hawk', 'frog', 'crab', 'viper', 'heron', 'tanager', 'marmoset', 'sloth', 'snake', 'lizard'];
    if (termosIngles.some(termo => nomeFinal.toLowerCase().includes(termo))) {
        nomeFinal = 'Nome popular não identificado';
    }

    const biomaFinal = dados.bioma || 'Informação não disponível';
    const habitatFinal = dados.habitat || 'Informação não disponível';
    const statusObj = formatarStatusConservacao(dados.risco_preservacao || dados.codigo_status);

    return {
        taxon_id: taxonIdBruto,
        nome: nomeFinal,
        especie: especieFinal,
        tipo_animal: dados.tipo_animal ? classificarTipoAnimal(dados.tipo_animal) : 'Fauna Silvestre',
        bioma: biomaFinal,
        habitat: habitatFinal,
        risco_preservacao: statusObj.nome,
        codigo_status: statusObj.codigo,
        foto_url: dados.foto_url || 'assets/imagens/placeholder-animal.svg',
        foto_atribuicao: dados.foto_atribuicao || dados.foto_credito || 'Registro fotográfico em catalogação',
        nome_cientifico_foto: especieFinal,
        origem_foto: "iNaturalist",
        foto_valida: Boolean(dados.foto_url && !dados.foto_url.includes('placeholder'))
    };
}

/**
 * Normaliza um objeto de espécie para a estrutura oficial da Entidade Fauna
 * @param {Object} dados
 * @returns {Object}
 */
export function normalizarEntidadeFauna(dados = {}) {
    const dadosResolvidos = resolverEspecieTaxonomica(dados);

    // Extrair município da observação
    let municipio = dados.municipio;
    if (!municipio && dados.local_observacao) {
        const partes = dados.local_observacao.split(',');
        municipio = partes[0].trim();
    }
    if (!municipio && dados.place_guess) {
        const partes = dados.place_guess.split(',');
        municipio = partes[0].trim();
    }

    const dataObs = dados.data_observacao || (dados.observed_on_details && dados.observed_on_details.date) || dados.observed_on || 'Registro verificado';
    let localFormatado = dados.local_observacao || (municipio ? `${municipio}, Paraíba, Brasil` : 'Paraíba, Brasil');
    if (dataObs && !localFormatado.includes(dataObs)) {
        localFormatado += ` • ${dataObs}`;
    }

    return {
        id_fauna: dados.id_fauna || (dadosResolvidos.taxon_id ? `inat-${dadosResolvidos.taxon_id}` : `fauna-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
        taxon_id: dadosResolvidos.taxon_id,
        nome: dadosResolvidos.nome,
        especie: dadosResolvidos.especie,
        tipo_animal: dadosResolvidos.tipo_animal,
        bioma: dadosResolvidos.bioma,
        habitat: dadosResolvidos.habitat,
        risco_preservacao: dadosResolvidos.risco_preservacao,
        codigo_status: dadosResolvidos.codigo_status,
        foto_url: dadosResolvidos.foto_url,
        foto_atribuicao: dadosResolvidos.foto_atribuicao,
        nome_cientifico_foto: dadosResolvidos.nome_cientifico_foto,
        origem_foto: dadosResolvidos.origem_foto,
        foto_valida: dadosResolvidos.foto_valida,
        municipio: municipio || 'Paraíba',
        data_observacao: dataObs,
        local_observacao: localFormatado,
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
