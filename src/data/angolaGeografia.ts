import { ProvinciaAngola, HabilitacaoLiteraria, GrauCarreiraDocente, EstadoCivil } from '../types';

export const PROVINCIAS_ANGOLA: ProvinciaAngola[] = [
  'Bengo',
  'Benguela',
  'Bié',
  'Cabinda',
  'Cuando',
  'Cuanza Norte',
  'Cuanza Sul',
  'Cubango',
  'Cunene',
  'Huambo',
  'Huíla',
  'Icolo e Bengo',
  'Luanda',
  'Lunda Norte',
  'Lunda Sul',
  'Malanje',
  'Moxico',
  'Moxico Leste',
  'Namibe',
  'Uíge',
  'Zaire'
];

export const HABILITACOES_LITERARIAS: HabilitacaoLiteraria[] = [
  'Ensino Médio',
  'Formação Média Técnica',
  'Formação Média Pedagógica',
  'Bacharelato',
  'Licenciatura',
  'Pós-Graduação',
  'Especialização',
  'Mestrado',
  'Doutoramento'
];

export const ESTADOS_CIVIS: EstadoCivil[] = [
  'Solteiro(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viúvo(a)',
  'União de Facto'
];

export const GRAUS_CARREIRA: GrauCarreiraDocente[] = [
  '1º Grau',
  '2º Grau',
  '3º Grau',
  '4º Grau',
  '5º Grau',
  '6º Grau',
  '7º Grau',
  '8º Grau',
  '9º Grau',
  '10º Grau',
  '11º Grau',
  '12º Grau',
  '13º Grau'
];

export const MUNICIPIOS_POR_PROVINCIA: Record<ProvinciaAngola, string[]> = {
  'Bengo': ['Dande (Caxito)', 'Ambriz', 'Bula Atumba', 'Dembos', 'Nambuangongo', 'Pango Aluquém'],
  'Benguela': ['Benguela', 'Lobito', 'Catumbela', 'Baía Farta', 'Balombo', 'Bocoio', 'Chongorói', 'Caimbambo', 'Ganda', 'Cubal'],
  'Bié': ['Cuito', 'Andulo', 'Camacupa', 'Catabola', 'Chinguar', 'Chitembo', 'Cuemba', 'Cunhinga', 'Nharêa'],
  'Cabinda': ['Cabinda', 'Cacongo', 'Buco-Zau', 'Belize'],
  'Cuando': ['Menongue', 'Cuchi', 'Cuangar', 'Dirico'],
  'Cuanza Norte': ['Cazengo (Ndalatando)', 'Cambambe', 'Golungo Alto', 'Lucala', 'Samba Caju', 'Ambaca', 'Banga', 'Bolongongo', 'Ngonguembo', 'Quiculungo'],
  'Cuanza Sul': ['Sumbe', 'Porto Amboim', 'Gabela (Amboim)', 'Cela (Waku Kungo)', 'Libolo', 'Quibala', 'Cassongue', 'Condo', 'Ebo', 'Mussende', 'Seles', 'Kilenda'],
  'Cubango': ['Mavinga', 'Rivungo', 'Calai', 'Nancova'],
  'Cunene': ['Cuanhama (Ondjiva)', 'Ombadja', 'Namacunde', 'Cahama', 'Curoca', 'Cuvelai'],
  'Huambo': ['Huambo', 'Caála', 'Bailundo', 'Ekunha', 'Longonjo', 'Ucuma', 'Chicala-Choloanga', 'Chinjenje', 'Mungo', 'Londuimbali', 'Katchiungo'],
  'Huíla': ['Lubango', 'Chibia', 'Humpata', 'Matala', 'Quilengues', 'Cacula', 'Caluquembe', 'Chicomba', 'Chipindo', 'Cuvango', 'Gambos', 'Jamba', 'Kuvango'],
  'Icolo e Bengo': ['Catete', 'Bom Jesus', 'Cabolombo', 'Cassoneca', 'Bela Vista'],
  'Luanda': ['Luanda', 'Cazenga', 'Viana', 'Belas', 'Kilamba Kiaxi', 'Talatona', 'Cacuaco'],
  'Lunda Norte': ['Chitato (Dundo)', 'Cambulo', 'Capenda-Camulemba', 'Caungula', 'Cuango', 'Cuílo', 'Lubalo', 'Lucapa', 'Xá-Muteba'],
  'Lunda Sul': ['Saurimo', 'Cacolo', 'Dala', 'Muconda'],
  'Malanje': ['Malanje', 'Cacuso', 'Calandula', 'Cambundi-Catembo', 'Cangandala', 'Kiuaba Nzoji', 'Cunda-dia-Baze', 'Luquembo', 'Marimba', 'Massango', 'Mucari', 'Quela', 'Quirima'],
  'Moxico': ['Luena (Moxico)', 'Camanongue', 'Léua', 'Luchazes', 'Cameia'],
  'Moxico Leste': ['Luau', 'Alto Zambeze (Cazombo)', 'Bundas', 'Lumbala Nguimbo'],
  'Namibe': ['Moçâmedes', 'Tômbwa', 'Bibala', 'Camucuio', 'Virei'],
  'Uíge': ['Uíge', 'Negage', 'Songo', 'Damba', 'Ambuíla', 'Bembe', 'Bungo', 'Cangola', 'Maquela do Zombo', 'Milunga', 'Mucaba', 'Puri', 'Quimbele', 'Quitexe', 'Sanza Pombo', 'Zombo'],
  'Zaire': ['Mbanza Kongo', 'Soyo', 'N\'zeto', 'Tomboco', 'Cuimba', 'Nóqui']
};

export interface DadosProvinciaRadar {
  provincia: ProvinciaAngola;
  capital: string;
  professoresAssociados: number;
  instituicoesEnsino: number;
  reclamacoesRegistadas: number;
  processosPendentes: number;
  delegacoesExistentes: number;
  delegadoResponsavel: string;
  contactoDelegado: string;
  statusAlerta: 'Normal' | 'Atenção' | 'Crítico';
  necessidadesIdentificadas: string[];
  coordenadasSvg: { x: number; y: number };
  svgPolygon: string; // Polígono representativo detalhado para o mapa de Angola
  descricaoSituacao: string;
}

export const DADOS_RADAR_PROVINCIAS: Record<ProvinciaAngola, DadosProvinciaRadar> = {
  'Cabinda': {
    provincia: 'Cabinda',
    capital: 'Cabinda',
    professoresAssociados: 5410,
    instituicoesEnsino: 132,
    reclamacoesRegistadas: 94,
    processosPendentes: 26,
    delegacoesExistentes: 3,
    delegadoResponsavel: 'Profª. Maria Luísa Buco',
    contactoDelegado: '+244 923 118 774',
    statusAlerta: 'Normal',
    necessidadesIdentificadas: [
      'Subsídio de insularidade/enclave fronteiriço',
      'Formação continuada pedagógica para o ensino secundário'
    ],
    coordenadasSvg: { x: 140, y: 55 },
    svgPolygon: 'M 125 40 L 155 40 L 155 70 L 125 70 Z',
    descricaoSituacao: 'Enclave com representação sindical organizada nos 4 municípios fronteiriços.'
  },
  'Zaire': {
    provincia: 'Zaire',
    capital: 'Mbanza Kongo',
    professoresAssociados: 3590,
    instituicoesEnsino: 98,
    reclamacoesRegistadas: 67,
    processosPendentes: 15,
    delegacoesExistentes: 3,
    delegadoResponsavel: 'Prof. Simão Lulendo',
    contactoDelegado: '+244 937 441 552',
    statusAlerta: 'Normal',
    necessidadesIdentificadas: [
      'Apoio a professores do município do Soyo (custo de vida)',
      'Reabilitação de escolas históricas em Mbanza Kongo'
    ],
    coordenadasSvg: { x: 195, y: 110 },
    svgPolygon: 'M 155 85 L 240 85 L 235 135 L 175 140 L 155 110 Z',
    descricaoSituacao: 'Região norte com forte património cultural e estabilidade sindical.'
  },
  'Uíge': {
    provincia: 'Uíge',
    capital: 'Uíge',
    professoresAssociados: 7120,
    instituicoesEnsino: 220,
    reclamacoesRegistadas: 165,
    processosPendentes: 51,
    delegacoesExistentes: 5,
    delegadoResponsavel: 'Prof. Filipe Makuntima',
    contactoDelegado: '+244 922 778 991',
    statusAlerta: 'Crítico',
    necessidadesIdentificadas: [
      '42 queixas formais de cortes salariais arbitrários em Maquela e Negage',
      'Falta de respostas da Direcção Provincial aos ofícios do SINPROF',
      'Atrasos na inserção de novos docentes no sistema SIGFE'
    ],
    coordenadasSvg: { x: 275, y: 130 },
    svgPolygon: 'M 240 85 L 320 85 L 325 155 L 255 160 L 235 135 Z',
    descricaoSituacao: 'Alerta máximo. Recomenda-se envio de comissão executiva nacional para averiguação urgente.'
  },
  'Bengo': {
    provincia: 'Bengo',
    capital: 'Caxito',
    professoresAssociados: 3820,
    instituicoesEnsino: 114,
    reclamacoesRegistadas: 68,
    processosPendentes: 19,
    delegacoesExistentes: 3,
    delegadoResponsavel: 'Prof. Manuel Kwanza',
    contactoDelegado: '+244 912 345 678',
    statusAlerta: 'Normal',
    necessidadesIdentificadas: [
      'Subsidiação de deslocação docente para Nambuangongo',
      'Infraestruturas escolares com deficiência de água potável'
    ],
    coordenadasSvg: { x: 200, y: 165 },
    svgPolygon: 'M 175 140 L 235 135 L 230 185 L 180 180 Z',
    descricaoSituacao: 'Quadro estável com acompanhamento regular das escolas do Dande e Dembos.'
  },
  'Luanda': {
    provincia: 'Luanda',
    capital: 'Luanda',
    professoresAssociados: 18450,
    instituicoesEnsino: 420,
    reclamacoesRegistadas: 342,
    processosPendentes: 87,
    delegacoesExistentes: 8,
    delegadoResponsavel: 'Prof. António Gaspar',
    contactoDelegado: '+244 923 456 781',
    statusAlerta: 'Atenção',
    necessidadesIdentificadas: [
      'Reclassificação de carreiras pedagógicas',
      'Pagamento de subsídios de coordenação atrasados',
      'Superlotação em turmas do IIº Ciclo em Viana e Cacuaco'
    ],
    coordenadasSvg: { x: 180, y: 195 },
    svgPolygon: 'M 160 185 L 195 180 L 190 215 L 165 210 Z',
    descricaoSituacao: 'Maior polo de docentes do país. Forte pressão sobre reclassificações e descongelamento salarial.'
  },
  'Icolo e Bengo': {
    provincia: 'Icolo e Bengo',
    capital: 'Catete',
    professoresAssociados: 2150,
    instituicoesEnsino: 68,
    reclamacoesRegistadas: 45,
    processosPendentes: 12,
    delegacoesExistentes: 2,
    delegadoResponsavel: 'Profª. Teresa Quaresma',
    contactoDelegado: '+244 934 112 344',
    statusAlerta: 'Normal',
    necessidadesIdentificadas: [
      'Transporte para professores em zonas rurais',
      'Melhoria do apetrechamento de laboratórios didáticos'
    ],
    coordenadasSvg: { x: 215, y: 205 },
    svgPolygon: 'M 195 180 L 230 185 L 225 220 L 190 215 Z',
    descricaoSituacao: 'Nova estrutura provincial em fase de consolidação das delegações municipais.'
  },
  'Cuanza Norte': {
    provincia: 'Cuanza Norte',
    capital: 'Ndalatando',
    professoresAssociados: 4120,
    instituicoesEnsino: 120,
    reclamacoesRegistadas: 78,
    processosPendentes: 18,
    delegacoesExistentes: 3,
    delegadoResponsavel: 'Prof. David Ndalamba',
    contactoDelegado: '+244 928 334 112',
    statusAlerta: 'Normal',
    necessidadesIdentificadas: [
      'Enquadramento de docentes bacharéis em licenciados',
      'Apoio jurídico a professores do Cazengo'
    ],
    coordenadasSvg: { x: 250, y: 195 },
    svgPolygon: 'M 230 180 L 280 180 L 275 225 L 225 220 Z',
    descricaoSituacao: 'Actividade sindical regular com assembleias municipais periódicas.'
  },
  'Malanje': {
    provincia: 'Malanje',
    capital: 'Malanje',
    professoresAssociados: 5640,
    instituicoesEnsino: 160,
    reclamacoesRegistadas: 118,
    processosPendentes: 29,
    delegacoesExistentes: 4,
    delegadoResponsavel: 'Prof. Barnabé Quissanga',
    contactoDelegado: '+244 921 665 443',
    statusAlerta: 'Atenção',
    necessidadesIdentificadas: [
      'Atrasos sistemáticos nas promoções por antiguidade',
      'Docentes do interior sem acesso a serviços bancários próximos'
    ],
    coordenadasSvg: { x: 315, y: 205 },
    svgPolygon: 'M 280 165 L 360 160 L 350 250 L 275 235 Z',
    descricaoSituacao: 'Negociações em curso com o Gabinete Provincial de Educação para regularizar promoções.'
  },
  'Lunda Norte': {
    provincia: 'Lunda Norte',
    capital: 'Dundo',
    professoresAssociados: 3670,
    instituicoesEnsino: 110,
    reclamacoesRegistadas: 89,
    processosPendentes: 23,
    delegacoesExistentes: 3,
    delegadoResponsavel: 'Prof. Celestino Muacanhica',
    contactoDelegado: '+244 932 445 119',
    statusAlerta: 'Atenção',
    necessidadesIdentificadas: [
      'Custo de vida elevado na região diamantífera sem compensação salarial',
      'Descontos irregulares nos salários de docentes do Chitato'
    ],
    coordenadasSvg: { x: 410, y: 165 },
    svgPolygon: 'M 360 120 L 475 140 L 460 205 L 355 190 Z',
    descricaoSituacao: 'Reclamação forte de defasagem do poder de compra e necessidade de subsídio de zona.'
  },
  'Lunda Sul': {
    provincia: 'Lunda Sul',
    capital: 'Saurimo',
    professoresAssociados: 3180,
    instituicoesEnsino: 95,
    reclamacoesRegistadas: 72,
    processosPendentes: 16,
    delegacoesExistentes: 2,
    delegadoResponsavel: 'Prof. Américo Tchipango',
    contactoDelegado: '+244 928 991 334',
    statusAlerta: 'Normal',
    necessidadesIdentificadas: [
      'Formação pedagógica especializada em Saurimo',
      'Apetrechamento de gabinetes de apoio ao professor'
    ],
    coordenadasSvg: { x: 425, y: 235 },
    svgPolygon: 'M 360 200 L 465 205 L 455 270 L 355 255 Z',
    descricaoSituacao: 'Situação estável mas com necessidade de expansão nos municípios de Dala e Muconda.'
  },
  'Cuanza Sul': {
    provincia: 'Cuanza Sul',
    capital: 'Sumbe',
    professoresAssociados: 7850,
    instituicoesEnsino: 210,
    reclamacoesRegistadas: 145,
    processosPendentes: 39,
    delegacoesExistentes: 5,
    delegadoResponsavel: 'Prof. Joaquim Muando',
    contactoDelegado: '+244 927 445 993',
    statusAlerta: 'Atenção',
    necessidadesIdentificadas: [
      'Atraso salarial de docentes contratados na Cela e Amboim',
      'Casos de assédio laboral na Direcção Municipal de Educação'
    ],
    coordenadasSvg: { x: 235, y: 260 },
    svgPolygon: 'M 180 220 L 275 225 L 265 295 L 185 285 Z',
    descricaoSituacao: 'Alerta de tensão laboral devido a retenções indevidas na folha de pagamento.'
  },
  'Benguela': {
    provincia: 'Benguela',
    capital: 'Benguela',
    professoresAssociados: 12640,
    instituicoesEnsino: 280,
    reclamacoesRegistadas: 185,
    processosPendentes: 44,
    delegacoesExistentes: 6,
    delegadoResponsavel: 'Prof. Simão Tchissola',
    contactoDelegado: '+244 924 887 990',
    statusAlerta: 'Normal',
    necessidadesIdentificadas: [
      'Regularização de pagamento de horas extraordinárias',
      'Resolução de disputas sobre transferências arbitrárias'
    ],
    coordenadasSvg: { x: 195, y: 335 },
    svgPolygon: 'M 175 290 L 245 295 L 235 375 L 170 365 Z',
    descricaoSituacao: 'Forte mobilização sindical e bom índice de pagamento de quotas associativas.'
  },
  'Huambo': {
    provincia: 'Huambo',
    capital: 'Huambo',
    professoresAssociados: 11200,
    instituicoesEnsino: 265,
    reclamacoesRegistadas: 162,
    processosPendentes: 38,
    delegacoesExistentes: 6,
    delegadoResponsavel: 'Prof. Faustino Samucongo',
    contactoDelegado: '+244 923 889 001',
    statusAlerta: 'Normal',
    necessidadesIdentificadas: [
      'Agilização da transição de carreira para mestres e doutores',
      'Distribuição atempada de batas e material didático'
    ],
    coordenadasSvg: { x: 260, y: 335 },
    svgPolygon: 'M 245 295 L 305 295 L 295 365 L 235 365 Z',
    descricaoSituacao: 'Um dos baluartes sindicais do SINPROF. Alta adesão às deliberações sindicais.'
  },
  'Bié': {
    provincia: 'Bié',
    capital: 'Cuito',
    professoresAssociados: 6980,
    instituicoesEnsino: 185,
    reclamacoesRegistadas: 112,
    processosPendentes: 31,
    delegacoesExistentes: 4,
    delegadoResponsavel: 'Prof. Zacarias Calueio',
    contactoDelegado: '+244 931 776 221',
    statusAlerta: 'Atenção',
    necessidadesIdentificadas: [
      'Atraso nos subsídios de isolamento no Cuemba e Chitembo',
      'Falta de manuais escolares nas escolas primárias rurais'
    ],
    coordenadasSvg: { x: 325, y: 310 },
    svgPolygon: 'M 300 260 L 370 255 L 360 365 L 295 365 Z',
    descricaoSituacao: 'Necessidade de intervenção sindical junto ao governo provincial para subsídios de periferia.'
  },
  'Moxico': {
    provincia: 'Moxico',
    capital: 'Luena',
    professoresAssociados: 4150,
    instituicoesEnsino: 125,
    reclamacoesRegistadas: 96,
    processosPendentes: 27,
    delegacoesExistentes: 3,
    delegadoResponsavel: 'Prof. Jonas Chindumbo',
    contactoDelegado: '+244 935 889 110',
    statusAlerta: 'Atenção',
    necessidadesIdentificadas: [
      'Distâncias quilométricas entre sedes municipais e escolas',
      'Subsídio de isolamento não pago em comunas de difícil acesso'
    ],
    coordenadasSvg: { x: 410, y: 325 },
    svgPolygon: 'M 370 260 L 460 270 L 445 375 L 360 365 Z',
    descricaoSituacao: 'Reestruturação após a divisão territorial para focar nos municípios de Luena, Camanongue e Léua.'
  },
  'Moxico Leste': {
    provincia: 'Moxico Leste',
    capital: 'Luau',
    professoresAssociados: 2310,
    instituicoesEnsino: 72,
    reclamacoesRegistadas: 81,
    processosPendentes: 20,
    delegacoesExistentes: 2,
    delegadoResponsavel: 'Profª. Beatriz Muene',
    contactoDelegado: '+244 941 223 887',
    statusAlerta: 'Crítico',
    necessidadesIdentificadas: [
      'Instalação definitiva da delegação provincial no Luau',
      'Proteção e garantias a professores fronteiriços',
      'Problemas no abastecimento de energia elétrica em escolas'
    ],
    coordenadasSvg: { x: 485, y: 315 },
    svgPolygon: 'M 460 270 L 530 280 L 520 380 L 445 375 Z',
    descricaoSituacao: 'Nova província oriental com carência de infraestruturas administrativas sindicais.'
  },
  'Huíla': {
    provincia: 'Huíla',
    capital: 'Lubango',
    professoresAssociados: 10450,
    instituicoesEnsino: 254,
    reclamacoesRegistadas: 151,
    processosPendentes: 42,
    delegacoesExistentes: 5,
    delegadoResponsavel: 'Profª. Adelaide Tchiteculo',
    contactoDelegado: '+244 925 771 992',
    statusAlerta: 'Normal',
    necessidadesIdentificadas: [
      'Pagamento pontual de subsídios de exames',
      'Melhoria das condições sanitárias nas escolas do interior'
    ],
    coordenadasSvg: { x: 230, y: 415 },
    svgPolygon: 'M 185 375 L 285 375 L 275 450 L 180 445 Z',
    descricaoSituacao: 'Excelente articulação sindical no Lubango, Matala e Caluquembe.'
  },
  'Namibe': {
    provincia: 'Namibe',
    capital: 'Moçâmedes',
    professoresAssociados: 3410,
    instituicoesEnsino: 88,
    reclamacoesRegistadas: 49,
    processosPendentes: 14,
    delegacoesExistentes: 2,
    delegadoResponsavel: 'Prof. Ernesto Cativa',
    contactoDelegado: '+244 926 554 332',
    statusAlerta: 'Normal',
    necessidadesIdentificadas: [
      'Apoio a professores que lecionam no deserto do Virei e Iona',
      'Melhoria do subsídio de risco ambiental e aridez'
    ],
    coordenadasSvg: { x: 155, y: 435 },
    svgPolygon: 'M 140 375 L 185 375 L 180 465 L 135 460 Z',
    descricaoSituacao: 'Boa organização sindical com cumprimento integral do plano de cobrança de quotas.'
  },
  'Cunene': {
    provincia: 'Cunene',
    capital: 'Ondjiva',
    professoresAssociados: 3950,
    instituicoesEnsino: 118,
    reclamacoesRegistadas: 88,
    processosPendentes: 21,
    delegacoesExistentes: 2,
    delegadoResponsavel: 'Profª. Esperança Hifitikeko',
    contactoDelegado: '+244 929 881 223',
    statusAlerta: 'Atenção',
    necessidadesIdentificadas: [
      'Escolas afetadas pela seca sazonal nos municípios do sul',
      'Melhoria do subsídio de fronteira e transporte escolar'
    ],
    coordenadasSvg: { x: 245, y: 475 },
    svgPolygon: 'M 185 450 L 300 450 L 290 515 L 180 510 Z',
    descricaoSituacao: 'Desafios climáticos exigem flexibilização do calendário e apoio aos docentes.'
  },
  'Cuando': {
    provincia: 'Cuando',
    capital: 'Menongue',
    professoresAssociados: 2840,
    instituicoesEnsino: 92,
    reclamacoesRegistadas: 98,
    processosPendentes: 24,
    delegacoesExistentes: 2,
    delegadoResponsavel: 'Prof. Gabriel Dumba',
    contactoDelegado: '+244 945 667 889',
    statusAlerta: 'Crítico',
    necessidadesIdentificadas: [
      'Atraso crítico no subsídio de isolamento (6 meses)',
      'Escassez de habitação para professores deslocados',
      'Falta de docentes de Matemática e Física'
    ],
    coordenadasSvg: { x: 350, y: 435 },
    svgPolygon: 'M 290 375 L 390 375 L 380 470 L 285 465 Z',
    descricaoSituacao: 'Situação de vulnerabilidade dos professores no interior com elevado risco de greve local.'
  },
  'Cubango': {
    provincia: 'Cubango',
    capital: 'Mavinga',
    professoresAssociados: 1620,
    instituicoesEnsino: 58,
    reclamacoesRegistadas: 74,
    processosPendentes: 17,
    delegacoesExistentes: 1,
    delegadoResponsavel: 'Prof. Bento Tchimbele',
    contactoDelegado: '+244 933 221 445',
    statusAlerta: 'Crítico',
    necessidadesIdentificadas: [
      'Dificuldade extrema de comunicação e transporte',
      'Pagamento de salários via multicaixa indisponível na região',
      'Necessidade urgente de apoio alimentar e alojamento'
    ],
    coordenadasSvg: { x: 440, y: 465 },
    svgPolygon: 'M 390 380 L 510 385 L 490 510 L 380 500 Z',
    descricaoSituacao: 'Região fronteiriça com condições severas. A Direcção Nacional deve intervir urgentemente.'
  }
};
