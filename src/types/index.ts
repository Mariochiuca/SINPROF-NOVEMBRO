/**
 * Tipos e interfaces atualizadas do Sistema de Gestão SINPROF (Angola)
 */

export type PerfilUsuario = 
  | 'Superadministrador'
  | 'Presidente'
  | 'Secretário-geral'
  | 'Tesoureiro'
  | 'Delegado provincial'
  | 'Delegado municipal'
  | 'Assistente administrativo'
  | 'Jurídico';

export type ModuloId = 
  | 'painel'
  | 'radar'
  | 'inteligencia'
  | 'associados'
  | 'escolas'
  | 'organograma'
  | 'quotas'
  | 'tesouraria'
  | 'delegacoes'
  | 'juridico'
  | 'documentos'
  | 'reunioes'
  | 'comunicacoes'
  | 'relatorios'
  | 'usuarios'
  | 'seguranca'
  | 'configuracoes';

export type HabilitacaoLiteraria = 
  | 'Ensino Médio'
  | 'Formação Média Técnica'
  | 'Formação Média Pedagógica'
  | 'Bacharelato'
  | 'Licenciatura'
  | 'Pós-Graduação'
  | 'Especialização'
  | 'Mestrado'
  | 'Doutoramento';

export type EstadoCivil = 
  | 'Solteiro(a)'
  | 'Casado(a)'
  | 'Divorciado(a)'
  | 'Viúvo(a)'
  | 'União de Facto';

export type GrauCarreiraDocente = 
  | '1º Grau'
  | '2º Grau'
  | '3º Grau'
  | '4º Grau'
  | '5º Grau'
  | '6º Grau'
  | '7º Grau'
  | '8º Grau'
  | '9º Grau'
  | '10º Grau'
  | '11º Grau'
  | '12º Grau'
  | '13º Grau';

export type ProvinciaAngola = 
  | 'Bengo'
  | 'Benguela'
  | 'Bié'
  | 'Cabinda'
  | 'Cuando'
  | 'Cuanza Norte'
  | 'Cuanza Sul'
  | 'Cubango'
  | 'Cunene'
  | 'Huambo'
  | 'Huíla'
  | 'Icolo e Bengo'
  | 'Luanda'
  | 'Lunda Norte'
  | 'Lunda Sul'
  | 'Malanje'
  | 'Moxico'
  | 'Moxico Leste'
  | 'Namibe'
  | 'Uíge'
  | 'Zaire';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senhaHash?: string;
  perfil: PerfilUsuario;
  cargo: string;
  provincia?: ProvinciaAngola;
  municipio?: string;
  telefone: string;
  ativo: boolean;
  avatar?: string;
  criadoEm: string;
  ultimoAcesso?: string;
}

export interface Associado {
  id: string;
  numeroMembro: string;
  nomeCompleto: string;
  bi: string;
  dataEmissaoBI: string;
  numeroAgente: string; // Em substituição do NIF
  estadoCivil: EstadoCivil;
  filiacaoPai: string;
  filiacaoMae: string;
  genero: 'M' | 'F';
  dataNascimento: string;
  telefone: string;
  email: string;
  provincia: ProvinciaAngola;
  municipio: string;
  instituicaoEnsino: string;
  categoriaDocente: string;
  habilitacao: HabilitacaoLiteraria;
  disciplinaPrincipal: string;
  anoIngressoMED: number;
  grauCarreira: GrauCarreiraDocente;
  salarioKz: number;
  quotizante: boolean; // SIM ou NÃO
  valorQuotaCalculadoKz: number; // 1% do salário para todos
  tempoServicoAnos: number;
  dataFiliacao: string;
  estado: 'Activo' | 'Pendente' | 'Suspenso' | 'Aposentado';
  fotoUrl?: string;
  observacoes?: string;
}

export interface EscolaComAssociados {
  id: string;
  nomeEscola: string;
  codigoEscola: string;
  provincia: ProvinciaAngola;
  municipio: string;
  nivelEnsino: 'Ensino Primário' | 'Iº Ciclo Secundário' | 'IIº Ciclo Liceu' | 'Instituto Técnico' | 'Magistério Pedagógico';
  totalProfessoresGeral: number;
  totalAssociadosSinprof: number;
  delegadoSindicalEscola: string;
  telefoneDelegado: string;
  taxaFiliacao: string;
  professoresNomes: string[];
}

export interface MembroOrganograma {
  id: string;
  nome: string;
  cargo: string;
  funcao: 'Direcção Nacional' | 'Secretariado Executivo' | 'Conselho Fiscal' | 'Gabinete Jurídico' | 'Coordenação Provincial' | 'Secretariado Municipal';
  provincia: ProvinciaAngola;
  municipio: string;
  telefone: string;
  email: string;
  fotoUrl: string;
  grauAcademico: string;
  tempoNoCargo: string;
}

export interface QuotaPagamento {
  id: string;
  associadoId: string;
  associadoNome: string;
  associadoNumero: string;
  provincia: ProvinciaAngola;
  mesReferencia: string;
  ano: number;
  valorKz: number;
  dataPagamento?: string;
  metodoPagamento?: 'Multicaixa' | 'Transferência Bancária' | 'Desconto em Folha' | 'Numerário';
  referenciaComprovativo?: string;
  estado: 'Pago' | 'Pendente' | 'Atrasado';
  registadoPor: string;
}

export interface TransacaoFinanceira {
  id: string;
  tipo: 'Receita' | 'Despesa';
  categoria: string;
  descricao: string;
  valorKz: number;
  data: string;
  provincia?: ProvinciaAngola;
  formaPagamento: 'Multicaixa' | 'Transferência Bancária' | 'Cheque' | 'Caixa Geral';
  numeroComprovativo: string;
  aprovadoPor: string;
  anexoDoc?: string;
}

export interface Delegacao {
  id: string;
  tipo: 'Provincial' | 'Municipal';
  provincia: ProvinciaAngola;
  municipio?: string;
  nomeDelegado: string;
  telefone: string;
  email: string;
  endereco: string;
  totalMembros: number;
  totalEscolas: number;
  reclamacoesAbertas: number;
  estadoAtividade: 'Alta Actividade' | 'Activa' | 'Baixa Actividade';
  ultimaReuniao: string;
}

export interface ProcessoJuridico {
  id: string;
  numeroProcesso: string;
  titulo: string;
  associadoId?: string;
  autorNome: string;
  provincia: ProvinciaAngola;
  municipio: string;
  tipo: 'Atraso Salarial' | 'Enquadramento na Carreira' | 'Subsídio de Isolamento' | 'Transferência Arbitrária' | 'Processo Disciplinar' | 'Outro';
  descricao: string;
  dataAbertura: string;
  advogadoResponsavel: string;
  estado: 'Submetido' | 'Em Análise' | 'Audiência Marcada' | 'Em Negociação' | 'Concluído Favorável' | 'Concluído Desfavorável';
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  historicoDespachos: {
    data: string;
    despacho: string;
    responsavel: string;
  }[];
}

export interface DocumentoOficial {
  id: string;
  titulo: string;
  categoria: 'Estatuto' | 'Circular' | 'Resolução' | 'Acordo MED' | 'Edital' | 'Minuta Reclamação' | 'Outro';
  numeroReferencia: string;
  dataPublicacao: string;
  tamanhoKb: number;
  descricao: string;
  autor: string;
  publico: boolean;
}

export interface ReuniaoAssembleia {
  id: string;
  titulo: string;
  tipo: 'Assembleia Geral' | 'Conselho Nacional' | 'Reunião Provincial' | 'Reunião Municipal';
  data: string;
  horario: string;
  local: string;
  provincia: ProvinciaAngola;
  pauta: string[];
  estado: 'Agendada' | 'Em Curso' | 'Concluída' | 'Cancelada';
  participantesEstimados: number;
  ataPublicada?: boolean;
  ataConteudo?: string;
}

export interface Comunicado {
  id: string;
  titulo: string;
  subtitulo: string;
  dataPublicacao: string;
  conteudo: string;
  autor: string;
  destinatarios: 'Todos os Professores' | 'Delegados Provinciais' | 'Delegados Municipais';
  importante: boolean;
}

export interface IndicadorInteligencia {
  id: string;
  tipo: 'alerta_salarios' | 'baixa_adesao' | 'baixa_atividade' | 'previsao_financeira' | 'carreira';
  titulo: string;
  descricao: string;
  provincia: ProvinciaAngola;
  municipio?: string;
  gravidade: 'Critico' | 'Atencao' | 'Informativo';
  acaoRecomendada: string;
  dataIdentificacao: string;
}

export interface LogSeguranca {
  id: string;
  dataHora: string;
  usuario: string;
  perfil: string;
  acao: string;
  modulo: string;
  enderecoIp: string;
  dispositivo: string;
  status: 'Sucesso' | 'Alerta' | 'Bloqueado';
}
