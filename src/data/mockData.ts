import {
  Usuario,
  Associado,
  QuotaPagamento,
  TransacaoFinanceira,
  Delegacao,
  ProcessoJuridico,
  DocumentoOficial,
  ReuniaoAssembleia,
  Comunicado,
  IndicadorInteligencia,
  EscolaComAssociados,
  MembroOrganograma,
  LogSeguranca
} from '../types';

export const USUARIOS_INICIAIS: Usuario[] = [
  {
    id: 'user-1',
    nome: 'Dr. Guilherme Silva',
    email: 'presidente@sinprof.ao',
    senhaHash: 'sinprof2026',
    perfil: 'Presidente',
    cargo: 'Presidente Nacional do SINPROF',
    telefone: '+244 923 000 001',
    ativo: true,
    criadoEm: '2022-01-15',
    ultimoAcesso: 'Hoje às 15:20'
  },
  {
    id: 'user-2',
    nome: 'Eng. Adão Bessa (SuperAdmin)',
    email: 'admin@sinprof.ao',
    senhaHash: 'admin2026',
    perfil: 'Superadministrador',
    cargo: 'Administrador de Sistemas & TI',
    telefone: '+244 923 000 002',
    ativo: true,
    criadoEm: '2021-06-10',
    ultimoAcesso: 'Hoje às 16:45'
  },
  {
    id: 'user-3',
    nome: 'Profª. Maria Esperança',
    email: 'secretario@sinprof.ao',
    senhaHash: 'sinprof2026',
    perfil: 'Secretário-geral',
    cargo: 'Secretária-Geral Nacional',
    telefone: '+244 923 000 003',
    ativo: true,
    criadoEm: '2022-02-01',
    ultimoAcesso: 'Ontem às 18:10'
  },
  {
    id: 'user-4',
    nome: 'Dr. Paulo Kassoma',
    email: 'tesouraria@sinprof.ao',
    senhaHash: 'sinprof2026',
    perfil: 'Tesoureiro',
    cargo: 'Tesoureiro Nacional',
    telefone: '+244 923 000 004',
    ativo: true,
    criadoEm: '2022-01-20',
    ultimoAcesso: 'Hoje às 11:30'
  },
  {
    id: 'user-5',
    nome: 'Prof. António Gaspar',
    email: 'delegado.luanda@sinprof.ao',
    senhaHash: 'sinprof2026',
    perfil: 'Delegado provincial',
    cargo: 'Delegado Provincial de Luanda',
    provincia: 'Luanda',
    telefone: '+244 923 456 781',
    ativo: true,
    criadoEm: '2022-03-11',
    ultimoAcesso: 'Hoje às 09:15'
  },
  {
    id: 'user-6',
    nome: 'Prof. Mateus Canda',
    email: 'delegado.viana@sinprof.ao',
    senhaHash: 'sinprof2026',
    perfil: 'Delegado municipal',
    cargo: 'Secretário Municipal de Viana',
    provincia: 'Luanda',
    municipio: 'Viana',
    telefone: '+244 924 556 778',
    ativo: true,
    criadoEm: '2022-04-15',
    ultimoAcesso: 'Ontem às 14:00'
  },
  {
    id: 'user-7',
    nome: 'Kátia dos Santos',
    email: 'atendimento@sinprof.ao',
    senhaHash: 'sinprof2026',
    perfil: 'Assistente administrativo',
    cargo: 'Técnica de Atendimento e Inscrições',
    telefone: '+244 923 000 007',
    ativo: true,
    criadoEm: '2023-01-10',
    ultimoAcesso: 'Hoje às 14:50'
  },
  {
    id: 'user-8',
    nome: 'Drª. Eunice Muanza',
    email: 'juridico@sinprof.ao',
    senhaHash: 'sinprof2026',
    perfil: 'Jurídico',
    cargo: 'Directora do Gabinete Jurídico e Contencioso',
    telefone: '+244 923 000 008',
    ativo: true,
    criadoEm: '2022-05-18',
    ultimoAcesso: 'Hoje às 13:40'
  }
];

export const ASSOCIADOS_INICIAIS: Associado[] = [
  {
    id: 'assoc-1',
    numeroMembro: 'SINPROF-AO-2024-0012',
    nomeCompleto: 'João Baptista Chivela',
    bi: '002341982LA041',
    dataEmissaoBI: '2021-04-10',
    numeroAgente: 'AG-MED-884120',
    estadoCivil: 'Casado(a)',
    filiacaoPai: 'Manuel Chivela',
    filiacaoMae: 'Rosa Quaresma Chivela',
    genero: 'M',
    dataNascimento: '1984-05-14',
    telefone: '+244 923 881 204',
    email: 'joao.chivela@escola.ao',
    provincia: 'Luanda',
    municipio: 'Cazenga',
    instituicaoEnsino: 'Complexo Escolar nº 2048 - Ngola Kiluanje',
    categoriaDocente: 'Professor do Ensino Secundário do 2º Ciclo',
    habilitacao: 'Licenciatura',
    disciplinaPrincipal: 'Língua Portuguesa e Literatura',
    anoIngressoMED: 2010,
    grauCarreira: '9º Grau',
    salarioKz: 320000,
    quotizante: true,
    valorQuotaCalculadoKz: 3200, // 1% de 320.000
    tempoServicoAnos: 14,
    dataFiliacao: '2016-03-12',
    estado: 'Activo',
    observacoes: 'Delegado sindical da escola e membro da comissão negociadora local.'
  },
  {
    id: 'assoc-2',
    numeroMembro: 'SINPROF-AO-2024-0045',
    nomeCompleto: 'Helena Teresa Cangombe',
    bi: '004128931BE033',
    dataEmissaoBI: '2020-08-15',
    numeroAgente: 'AG-MED-771923',
    estadoCivil: 'Solteiro(a)',
    filiacaoPai: 'António Cangombe',
    filiacaoMae: 'Teresa Samba Cangombe',
    genero: 'F',
    dataNascimento: '1990-08-22',
    telefone: '+244 924 991 305',
    email: 'helena.cangombe@escola.ao',
    provincia: 'Benguela',
    municipio: 'Lobito',
    instituicaoEnsino: 'Liceu Comandante Cassanje',
    categoriaDocente: 'Professora do Ensino Secundário do 1º Ciclo',
    habilitacao: 'Formação Média Pedagógica',
    disciplinaPrincipal: 'Matemática e Geometria',
    anoIngressoMED: 2015,
    grauCarreira: '6º Grau',
    salarioKz: 240000,
    quotizante: true,
    valorQuotaCalculadoKz: 2400, // 1% de 240.000
    tempoServicoAnos: 9,
    dataFiliacao: '2018-09-01',
    estado: 'Activo'
  },
  {
    id: 'assoc-3',
    numeroMembro: 'SINPROF-AO-2024-0078',
    nomeCompleto: 'Domingos Francisco Quipungo',
    bi: '001928471HU029',
    dataEmissaoBI: '2019-11-20',
    numeroAgente: 'AG-MED-550182',
    estadoCivil: 'Casado(a)',
    filiacaoPai: 'Francisco Quipungo',
    filiacaoMae: 'Maria Tchiteculo',
    genero: 'M',
    dataNascimento: '1979-11-03',
    telefone: '+244 925 334 118',
    email: 'domingos.quipungo@escola.ao',
    provincia: 'Huíla',
    municipio: 'Lubango',
    instituicaoEnsino: 'Instituto Médio Politécnico do Lubango',
    categoriaDocente: 'Professor Auxiliar do Ensino Técnico',
    habilitacao: 'Mestrado',
    disciplinaPrincipal: 'Física Geral e Aplicada',
    anoIngressoMED: 2004,
    grauCarreira: '11º Grau',
    salarioKz: 420000,
    quotizante: true,
    valorQuotaCalculadoKz: 4200, // 1% de 420.000
    tempoServicoAnos: 20,
    dataFiliacao: '2011-04-18',
    estado: 'Activo'
  },
  {
    id: 'assoc-4',
    numeroMembro: 'SINPROF-AO-2024-0102',
    nomeCompleto: 'Maria da Graça Makuntima',
    bi: '003847291UI042',
    dataEmissaoBI: '2022-01-18',
    numeroAgente: 'AG-MED-994102',
    estadoCivil: 'Solteiro(a)',
    filiacaoPai: 'Paulo Makuntima',
    filiacaoMae: 'Graça Luvualu',
    genero: 'F',
    dataNascimento: '1992-02-18',
    telefone: '+244 922 447 881',
    email: 'maria.makuntima@escola.ao',
    provincia: 'Uíge',
    municipio: 'Uíge',
    instituicaoEnsino: 'Escola Primária nº 115 - Quilomosso',
    categoriaDocente: 'Professora do Ensino Primário',
    habilitacao: 'Formação Média Pedagógica',
    disciplinaPrincipal: 'Ensino Integrado Primário',
    anoIngressoMED: 2018,
    grauCarreira: '4º Grau',
    salarioKz: 210000,
    quotizante: true,
    valorQuotaCalculadoKz: 2100, // 1% de 210.000
    tempoServicoAnos: 6,
    dataFiliacao: '2020-02-10',
    estado: 'Activo'
  },
  {
    id: 'assoc-5',
    numeroMembro: 'SINPROF-AO-2024-0155',
    nomeCompleto: 'Sebastião Lucas Chindundo',
    bi: '005918234HA038',
    dataEmissaoBI: '2018-05-12',
    numeroAgente: 'AG-MED-663819',
    estadoCivil: 'Casado(a)',
    filiacaoPai: 'Lucas Chindundo',
    filiacaoMae: 'Helena Epalanga',
    genero: 'M',
    dataNascimento: '1987-07-30',
    telefone: '+244 923 772 109',
    email: 'sebastiao.chindundo@escola.ao',
    provincia: 'Huambo',
    municipio: 'Caála',
    instituicaoEnsino: 'Complexo Escolar Samacau',
    categoriaDocente: 'Professor do Ensino Primário e Secundário',
    habilitacao: 'Licenciatura',
    disciplinaPrincipal: 'História e Filosofia',
    anoIngressoMED: 2013,
    grauCarreira: '7º Grau',
    salarioKz: 280000,
    quotizante: true,
    valorQuotaCalculadoKz: 2800, // 1% de 280.000
    tempoServicoAnos: 11,
    dataFiliacao: '2015-06-20',
    estado: 'Activo'
  },
  {
    id: 'assoc-6',
    numeroMembro: 'SINPROF-AO-2024-0189',
    nomeCompleto: 'Esperança Neves Dumba',
    bi: '002948192CU044',
    dataEmissaoBI: '2023-03-24',
    numeroAgente: 'AG-MED-881290',
    estadoCivil: 'União de Facto',
    filiacaoPai: 'Gabriel Dumba',
    filiacaoMae: 'Neves Chissapa',
    genero: 'F',
    dataNascimento: '1995-12-05',
    telefone: '+244 945 119 443',
    email: 'esperanca.dumba@escola.ao',
    provincia: 'Cuando',
    municipio: 'Menongue',
    instituicaoEnsino: 'Magistério Primário de Menongue',
    categoriaDocente: 'Professora Assistente de Pedagogia',
    habilitacao: 'Pós-Graduação',
    disciplinaPrincipal: 'Didática Geral e Práticas Pedagógicas',
    anoIngressoMED: 2019,
    grauCarreira: '5º Grau',
    salarioKz: 260000,
    quotizante: true,
    valorQuotaCalculadoKz: 2600, // 1% de 260.000
    tempoServicoAnos: 5,
    dataFiliacao: '2021-08-14',
    estado: 'Activo'
  }
];

export const ESCOLAS_COM_ASSOCIADOS_INICIAIS: EscolaComAssociados[] = [
  {
    id: 'esc-1',
    nomeEscola: 'Complexo Escolar nº 2048 - Ngola Kiluanje',
    codigoEscola: 'ESC-LUA-CAZ-2048',
    provincia: 'Luanda',
    municipio: 'Cazenga',
    nivelEnsino: 'IIº Ciclo Liceu',
    totalProfessoresGeral: 48,
    totalAssociadosSinprof: 38,
    delegadoSindicalEscola: 'Prof. João Baptista Chivela',
    telefoneDelegado: '+244 923 881 204',
    taxaFiliacao: '79.1%',
    professoresNomes: ['João Baptista Chivela', 'Teresa Bento', 'Carlos Quipungo', 'Esperança Neto']
  },
  {
    id: 'esc-2',
    nomeEscola: 'Liceu Comandante Cassanje',
    codigoEscola: 'ESC-BEN-LOB-0104',
    provincia: 'Benguela',
    municipio: 'Lobito',
    nivelEnsino: 'Iº Ciclo Secundário',
    totalProfessoresGeral: 34,
    totalAssociadosSinprof: 29,
    delegadoSindicalEscola: 'Profª. Helena Teresa Cangombe',
    telefoneDelegado: '+244 924 991 305',
    taxaFiliacao: '85.2%',
    professoresNomes: ['Helena Teresa Cangombe', 'Manuel Kwanza', 'Rosa Calueio']
  },
  {
    id: 'esc-3',
    nomeEscola: 'Instituto Médio Politécnico do Lubango',
    codigoEscola: 'ESC-HUI-LUB-0052',
    provincia: 'Huíla',
    municipio: 'Lubango',
    nivelEnsino: 'Instituto Técnico',
    totalProfessoresGeral: 62,
    totalAssociadosSinprof: 51,
    delegadoSindicalEscola: 'Prof. Domingos Francisco Quipungo',
    telefoneDelegado: '+244 925 334 118',
    taxaFiliacao: '82.2%',
    professoresNomes: ['Domingos Francisco Quipungo', 'Simão Tchiteculo', 'Ana Kiala']
  },
  {
    id: 'esc-4',
    nomeEscola: 'Escola Primária nº 115 - Quilomosso',
    codigoEscola: 'ESC-UIG-UIG-0115',
    provincia: 'Uíge',
    municipio: 'Uíge',
    nivelEnsino: 'Ensino Primário',
    totalProfessoresGeral: 24,
    totalAssociadosSinprof: 22,
    delegadoSindicalEscola: 'Profª. Maria da Graça Makuntima',
    telefoneDelegado: '+244 922 447 881',
    taxaFiliacao: '91.6%',
    professoresNomes: ['Maria da Graça Makuntima', 'Filipe Zombo', 'Paulina Damba']
  },
  {
    id: 'esc-5',
    nomeEscola: 'Complexo Escolar Samacau',
    codigoEscola: 'ESC-HUA-CAA-0331',
    provincia: 'Huambo',
    municipio: 'Caála',
    nivelEnsino: 'Iº Ciclo Secundário',
    totalProfessoresGeral: 38,
    totalAssociadosSinprof: 31,
    delegadoSindicalEscola: 'Prof. Sebastião Lucas Chindundo',
    telefoneDelegado: '+244 923 772 109',
    taxaFiliacao: '81.5%',
    professoresNomes: ['Sebastião Lucas Chindundo', 'Beatriz Epalanga']
  },
  {
    id: 'esc-6',
    nomeEscola: 'Magistério Primário de Menongue',
    codigoEscola: 'ESC-CUA-MEN-0018',
    provincia: 'Cuando',
    municipio: 'Menongue',
    nivelEnsino: 'Magistério Pedagógico',
    totalProfessoresGeral: 30,
    totalAssociadosSinprof: 24,
    delegadoSindicalEscola: 'Profª. Esperança Neves Dumba',
    telefoneDelegado: '+244 945 119 443',
    taxaFiliacao: '80.0%',
    professoresNomes: ['Esperança Neves Dumba', 'Gabriel Dumba Júnior']
  }
];

export const MEMBROS_ORGANOGRAMA_INICIAIS: MembroOrganograma[] = [
  {
    id: 'org-1',
    nome: 'Dr. Guilherme Silva',
    cargo: 'Presidente Nacional',
    funcao: 'Direcção Nacional',
    provincia: 'Luanda',
    municipio: 'Luanda',
    telefone: '+244 923 000 001',
    email: 'presidente@sinprof.ao',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    grauAcademico: 'Doutoramento em Ciências da Educação',
    tempoNoCargo: '4 Anos'
  },
  {
    id: 'org-2',
    nome: 'Profª. Maria Esperança',
    cargo: 'Secretária-Geral Nacional',
    funcao: 'Secretariado Executivo',
    provincia: 'Luanda',
    municipio: 'Luanda',
    telefone: '+244 923 000 003',
    email: 'secretario@sinprof.ao',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    grauAcademico: 'Mestrado em Gestão Escolar',
    tempoNoCargo: '3 Anos'
  },
  {
    id: 'org-3',
    nome: 'Dr. Paulo Kassoma',
    cargo: 'Tesoureiro Geral',
    funcao: 'Secretariado Executivo',
    provincia: 'Luanda',
    municipio: 'Luanda',
    telefone: '+244 923 000 004',
    email: 'tesouraria@sinprof.ao',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    grauAcademico: 'Licenciatura em Economia e Finanças',
    tempoNoCargo: '4 Anos'
  },
  {
    id: 'org-4',
    nome: 'Drª. Eunice Muanza',
    cargo: 'Directora do Gabinete Jurídico',
    funcao: 'Gabinete Jurídico',
    provincia: 'Luanda',
    municipio: 'Luanda',
    telefone: '+244 923 000 008',
    email: 'juridico@sinprof.ao',
    fotoUrl: 'https://images.unsplash.com/photo-1580894732488-82512a8a5e84?w=150',
    grauAcademico: 'Pós-Graduação em Direito do Trabalho',
    tempoNoCargo: '3 Anos'
  },
  {
    id: 'org-5',
    nome: 'Prof. António Gaspar',
    cargo: 'Delegado Provincial de Luanda',
    funcao: 'Coordenação Provincial',
    provincia: 'Luanda',
    municipio: 'Luanda',
    telefone: '+244 923 456 781',
    email: 'luanda@sinprof.ao',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    grauAcademico: 'Licenciatura em Pedagogia',
    tempoNoCargo: '2 Anos'
  },
  {
    id: 'org-6',
    nome: 'Prof. Simão Tchissola',
    cargo: 'Delegado Provincial de Benguela',
    funcao: 'Coordenação Provincial',
    provincia: 'Benguela',
    municipio: 'Benguela',
    telefone: '+244 924 887 990',
    email: 'benguela@sinprof.ao',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    grauAcademico: 'Licenciatura em História',
    tempoNoCargo: '3 Anos'
  },
  {
    id: 'org-7',
    nome: 'Prof. Mateus Canda',
    cargo: 'Secretário Municipal de Viana',
    funcao: 'Secretariado Municipal',
    provincia: 'Luanda',
    municipio: 'Viana',
    telefone: '+244 924 556 778',
    email: 'viana@sinprof.ao',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    grauAcademico: 'Licenciatura em Língua Portuguesa',
    tempoNoCargo: '1 Ano'
  }
];

export const LOGS_SEGURANCA_INICIAIS: LogSeguranca[] = [
  {
    id: 'log-1',
    dataHora: '2026-10-31 16:45:12',
    usuario: 'admin@sinprof.ao',
    perfil: 'Superadministrador',
    acao: 'Início de Sessão Autenticado com Sucesso',
    modulo: 'Autenticação',
    enderecoIp: '197.231.14.88 (Luanda - Angola)',
    dispositivo: 'Windows 11 / Chrome 129',
    status: 'Sucesso'
  },
  {
    id: 'log-2',
    dataHora: '2026-10-31 16:30:05',
    usuario: 'presidente@sinprof.ao',
    perfil: 'Presidente',
    acao: 'Consulta ao Radar Nacional de Professores',
    modulo: 'Radar Nacional',
    enderecoIp: '197.231.14.88 (Luanda - Angola)',
    dispositivo: 'iPadOS / Safari',
    status: 'Sucesso'
  },
  {
    id: 'log-3',
    dataHora: '2026-10-31 15:10:44',
    usuario: 'atendimento@sinprof.ao',
    perfil: 'Assistente administrativo',
    acao: 'Registo de Novo Associado Docente com Validação de BI',
    modulo: 'Associados',
    enderecoIp: '197.231.14.92 (Cazenga - Luanda)',
    dispositivo: 'Windows 10 / Edge',
    status: 'Sucesso'
  },
  {
    id: 'log-4',
    dataHora: '2026-10-31 12:02:18',
    usuario: 'desconhecido@isp.ao',
    perfil: 'Não Autenticado',
    acao: 'Tentativa de Acesso com Senha Inválida (Bloqueado)',
    modulo: 'Segurança',
    enderecoIp: '41.223.119.5',
    dispositivo: 'Android / Chrome Mobile',
    status: 'Bloqueado'
  }
];

export const QUOTAS_INICIAIS: QuotaPagamento[] = [
  {
    id: 'quota-1',
    associadoId: 'assoc-1',
    associadoNome: 'João Baptista Chivela',
    associadoNumero: 'SINPROF-AO-2024-0012',
    provincia: 'Luanda',
    mesReferencia: 'Outubro/2026',
    ano: 2026,
    valorKz: 3200,
    dataPagamento: '2026-10-05',
    metodoPagamento: 'Desconto em Folha',
    referenciaComprovativo: 'SIGFE-AO-10-2026-4412',
    estado: 'Pago',
    registadoPor: 'Dr. Paulo Kassoma'
  },
  {
    id: 'quota-2',
    associadoId: 'assoc-2',
    associadoNome: 'Helena Teresa Cangombe',
    associadoNumero: 'SINPROF-AO-2024-0045',
    provincia: 'Benguela',
    mesReferencia: 'Outubro/2026',
    ano: 2026,
    valorKz: 2400,
    dataPagamento: '2026-10-08',
    metodoPagamento: 'Multicaixa',
    referenciaComprovativo: 'MCX-99412-BG',
    estado: 'Pago',
    registadoPor: 'Dr. Paulo Kassoma'
  },
  {
    id: 'quota-3',
    associadoId: 'assoc-3',
    associadoNome: 'Domingos Francisco Quipungo',
    associadoNumero: 'SINPROF-AO-2024-0078',
    provincia: 'Huíla',
    mesReferencia: 'Outubro/2026',
    ano: 2026,
    valorKz: 4200,
    dataPagamento: '2026-10-02',
    metodoPagamento: 'Transferência Bancária',
    referenciaComprovativo: 'BAI-TRANSF-881203',
    estado: 'Pago',
    registadoPor: 'Dr. Paulo Kassoma'
  },
  {
    id: 'quota-4',
    associadoId: 'assoc-4',
    associadoNome: 'Maria da Graça Makuntima',
    associadoNumero: 'SINPROF-AO-2024-0102',
    provincia: 'Uíge',
    mesReferencia: 'Outubro/2026',
    ano: 2026,
    valorKz: 2100,
    estado: 'Atrasado',
    registadoPor: 'Sistema Automático'
  }
];

export const TRANSACOES_INICIAIS: TransacaoFinanceira[] = [
  {
    id: 'trans-1',
    tipo: 'Receita',
    categoria: 'Quotas Sindicais Mensais (1% Salário)',
    descricao: 'Repasse consolidado de quotas docentes via Ministério das Finanças (SIGFE) - Mês Setembro',
    valorKz: 42500000,
    data: '2026-10-03',
    formaPagamento: 'Transferência Bancária',
    numeroComprovativo: 'MINFIN-REP-2026-09',
    aprovadoPor: 'Dr. Paulo Kassoma'
  },
  {
    id: 'trans-2',
    tipo: 'Despesa',
    categoria: 'Apoio Jurídico e Contencioso',
    descricao: 'Custas processuais e honorários na acção colectiva sobre subsídios do Uíge',
    valorKz: 3200000,
    data: '2026-10-08',
    formaPagamento: 'Transferência Bancária',
    numeroComprovativo: 'HON-ADV-10-2026',
    aprovadoPor: 'Dr. Guilherme Silva'
  }
];

export const DELEGACOES_INICIAIS: Delegacao[] = [
  {
    id: 'del-1',
    tipo: 'Provincial',
    provincia: 'Luanda',
    nomeDelegado: 'Prof. António Gaspar',
    telefone: '+244 923 456 781',
    email: 'luanda@sinprof.ao',
    endereco: 'Rua Rainha Ginga, Edifício Coqueiros, 3º Andar, Luanda',
    totalMembros: 18450,
    totalEscolas: 420,
    reclamacoesAbertas: 342,
    estadoAtividade: 'Alta Actividade',
    ultimaReuniao: '2026-10-22'
  },
  {
    id: 'del-2',
    tipo: 'Provincial',
    provincia: 'Benguela',
    nomeDelegado: 'Prof. Simão Tchissola',
    telefone: '+244 924 887 990',
    email: 'benguela@sinprof.ao',
    endereco: 'Avenida Norton de Matos, Prédio do Magistério, Benguela',
    totalMembros: 12640,
    totalEscolas: 280,
    reclamacoesAbertas: 185,
    estadoAtividade: 'Alta Actividade',
    ultimaReuniao: '2026-10-19'
  }
];

export const PROCESSOS_INICIAIS: ProcessoJuridico[] = [
  {
    id: 'proc-1',
    numeroProcesso: 'SINPROF-JUR-2026-014',
    titulo: 'Atraso Salarial Colectivo dos Professores de Maquela do Zombo e Negage',
    autorNome: 'Comissão Sindical de Uíge / 42 Professores Afetados',
    provincia: 'Uíge',
    municipio: 'Uíge',
    tipo: 'Atraso Salarial',
    descricao: 'Corte e retenção de salários e subsídios por mais de 90 dias sem justificação administrativa pelo Gabinete Provincial de Educação.',
    dataAbertura: '2026-09-14',
    advogadoResponsavel: 'Drª. Eunice Muanza',
    estado: 'Em Negociação',
    prioridade: 'Urgente',
    historicoDespachos: [
      {
        data: '2026-09-14',
        despacho: 'Submissão de Notificação Prévia à Direcção Provincial de Educação.',
        responsavel: 'Drª. Eunice Muanza'
      }
    ]
  }
];

export const DOCUMENTOS_INICIAIS: DocumentoOficial[] = [
  {
    id: 'doc-1',
    titulo: 'Estatuto Orgânico do SINPROF - Edição Atualizada 2024-2028',
    categoria: 'Estatuto',
    numeroReferencia: 'ESTAT-SINPROF-2024',
    dataPublicacao: '2024-03-15',
    tamanhoKb: 2450,
    descricao: 'Documento fundamental que rege os direitos, deveres, órgãos deliberativos e disciplinares do sindicato.',
    autor: 'Conselho Nacional do SINPROF',
    publico: true
  }
];

export const REUNIOES_INICIAIS: ReuniaoAssembleia[] = [
  {
    id: 'reun-1',
    titulo: 'Conselho Nacional Ordinário do SINPROF',
    tipo: 'Conselho Nacional',
    data: '2026-11-15',
    horario: '09:00 - 17:00',
    local: 'Auditório Central do Magistério Mutu-ya-Kevela, Luanda',
    provincia: 'Luanda',
    pauta: [
      '1. Apreciação do Relatório do Centro de Inteligência Sindical',
      '2. Ponto de situação das negociações do Caderno Reivindicativo com o MED'
    ],
    estado: 'Agendada',
    participantesEstimados: 120
  }
];

export const COMUNICADOS_INICIAIS: Comunicado[] = [
  {
    id: 'com-1',
    titulo: 'Comunicado Oficial: Posição do SINPROF sobre os Atrasos Salariais em Várias Províncias',
    subtitulo: 'A Direcção Nacional exige cumprimento rigoroso dos compromissos assumidos pelo MED',
    dataPublicacao: '2026-10-28',
    conteudo: 'O Secretariado Nacional do SINPROF reuniu em sessão de emergência para analisar a persistência de cortes e atrasos nas remunerações de docentes em regiões do interior.',
    autor: 'Dr. Guilherme Silva - Presidente Nacional',
    destinatarios: 'Todos os Professores',
    importante: true
  }
];

export const INDICADORES_INTELIGENCIA_INICIAIS: IndicadorInteligencia[] = [
  {
    id: 'intel-1',
    tipo: 'alerta_salarios',
    titulo: 'Pico de Reclamações Salariais no Uíge (Alerta Crítico)',
    descricao: 'Foram registadas 42 novas reclamações de atraso salarial no Uíge nas últimas 3 semanas, com concentração crítica nos municípios de Maquela do Zombo e Negage.',
    provincia: 'Uíge',
    municipio: 'Negage',
    gravidade: 'Critico',
    acaoRecomendada: 'Envio imediato de uma Delegação Executiva Nacional a Uíge e audiência de urgência com o Governador Provincial.',
    dataIdentificacao: '2026-10-29'
  }
];
