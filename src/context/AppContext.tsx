import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Usuario,
  PerfilUsuario,
  ModuloId,
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
  LogSeguranca,
  ProvinciaAngola
} from '../types';
import {
  USUARIOS_INICIAIS,
  ASSOCIADOS_INICIAIS,
  QUOTAS_INICIAIS,
  TRANSACOES_INICIAIS,
  DELEGACOES_INICIAIS,
  PROCESSOS_INICIAIS,
  DOCUMENTOS_INICIAIS,
  REUNIOES_INICIAIS,
  COMUNICADOS_INICIAIS,
  INDICADORES_INTELIGENCIA_INICIAIS,
  ESCOLAS_COM_ASSOCIADOS_INICIAIS,
  MEMBROS_ORGANOGRAMA_INICIAIS,
  LOGS_SEGURANCA_INICIAIS
} from '../data/mockData';

interface AppContextType {
  autenticado: boolean;
  login: (email: string, senha: string) => boolean;
  logout: () => void;
  recuperarSenha: (email: string) => boolean;

  usuarioAtual: Usuario;
  trocarPerfil: (novoPerfil: PerfilUsuario) => void;
  trocarUsuario: (usuarioId: string) => void;
  moduloAtivo: ModuloId;
  navegarPara: (modulo: ModuloId, params?: Record<string, any>) => void;
  temPermissao: (modulo: ModuloId) => boolean;
  navegacaoParams: Record<string, any>;
  
  // Entidades
  usuarios: Usuario[];
  associados: Associado[];
  escolasComAssociados: EscolaComAssociados[];
  membrosOrganograma: MembroOrganograma[];
  quotas: QuotaPagamento[];
  transacoes: TransacaoFinanceira[];
  delegacoes: Delegacao[];
  processos: ProcessoJuridico[];
  documentos: DocumentoOficial[];
  reunioes: ReuniaoAssembleia[];
  comunicados: Comunicado[];
  indicadoresIntel: IndicadorInteligencia[];
  logsSeguranca: LogSeguranca[];
  
  // Operações
  adicionarAssociado: (associado: Omit<Associado, 'id' | 'numeroMembro' | 'dataFiliacao'>) => Associado;
  atualizarAssociado: (id: string, dados: Partial<Associado>) => void;
  removerAssociado: (id: string) => void;
  
  registarPagamentoQuota: (id: string, metodo: QuotaPagamento['metodoPagamento'], ref: string) => void;
  adicionarQuota: (dados: Omit<QuotaPagamento, 'id'>) => void;
  
  adicionarTransacao: (transacao: Omit<TransacaoFinanceira, 'id'>) => void;
  
  adicionarProcesso: (processo: Omit<ProcessoJuridico, 'id' | 'numeroProcesso' | 'dataAbertura' | 'historicoDespachos'>) => ProcessoJuridico;
  adicionarDespacho: (processoId: string, despacho: string) => void;
  
  adicionarDocumento: (doc: Omit<DocumentoOficial, 'id' | 'dataPublicacao'>) => void;
  adicionarReuniao: (reuniao: Omit<ReuniaoAssembleia, 'id'>) => void;
  adicionarComunicado: (comunicado: Omit<Comunicado, 'id' | 'dataPublicacao'>) => void;
  adicionarUsuario: (user: Omit<Usuario, 'id' | 'criadoEm'>) => void;
  atualizarUsuario: (id: string, dados: Partial<Usuario>) => void;
  removerUsuario: (id: string) => void;
  registrarLogSeguranca: (acao: string, modulo: string, status?: 'Sucesso' | 'Alerta' | 'Bloqueado') => void;
  
  // Estatísticas
  estatisticasGerais: {
    totalAssociados: number;
    totalReceitasKz: number;
    totalDespesasKz: number;
    saldoCaixaKz: number;
    processosAtivos: number;
    alertasCriticos: number;
    taxaAdesaoEstimada: number;
    totalEscolasRepresentadas: number;
  };
  
  // Notificações
  alertaToast: { mensagem: string; tipo: 'sucesso' | 'info' | 'alerta' | 'erro' } | null;
  exibirToast: (mensagem: string, tipo?: 'sucesso' | 'info' | 'alerta' | 'erro') => void;
  fecharToast: () => void;
  
  restaurarDadosIniciais: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PERMISSOES_POR_PERFIL: Record<PerfilUsuario, ModuloId[]> = {
  'Superadministrador': [
    'painel', 'radar', 'inteligencia', 'associados', 'escolas', 'organograma', 'quotas', 'tesouraria',
    'delegacoes', 'juridico', 'documentos', 'reunioes', 'comunicacoes', 'relatorios',
    'usuarios', 'seguranca', 'configuracoes'
  ],
  'Presidente': [
    'painel', 'radar', 'inteligencia', 'relatorios', 'associados', 'escolas', 'organograma', 'quotas',
    'tesouraria', 'delegacoes', 'juridico', 'documentos', 'reunioes', 'comunicacoes', 'seguranca'
  ],
  'Secretário-geral': [
    'painel', 'associados', 'escolas', 'organograma', 'documentos', 'reunioes', 'comunicacoes', 'delegacoes', 'relatorios'
  ],
  'Tesoureiro': [
    'painel', 'quotas', 'tesouraria', 'relatorios'
  ],
  'Delegado provincial': [
    'painel', 'radar', 'associados', 'escolas', 'organograma', 'quotas', 'delegacoes', 'reunioes', 'comunicacoes', 'relatorios'
  ],
  'Delegado municipal': [
    'painel', 'associados', 'escolas', 'quotas', 'reunioes', 'comunicacoes'
  ],
  'Assistente administrativo': [
    'painel', 'associados', 'escolas', 'quotas', 'documentos'
  ],
  'Jurídico': [
    'painel', 'juridico', 'relatorios', 'documentos', 'seguranca'
  ]
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Autenticação com sessão
  const [autenticado, setAutenticado] = useState<boolean>(() => {
    return localStorage.getItem('sinprof_autenticado') === 'true';
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const salvo = localStorage.getItem('sinprof_usuarios');
    return salvo ? JSON.parse(salvo) : USUARIOS_INICIAIS;
  });

  const [usuarioAtual, setUsuarioAtual] = useState<Usuario>(() => {
    const salvo = localStorage.getItem('sinprof_usuario_atual');
    if (salvo) {
      try { return JSON.parse(salvo); } catch(e) {}
    }
    return usuarios.find(u => u.perfil === 'Presidente') || usuarios[0];
  });

  const [moduloAtivo, setModuloAtivo] = useState<ModuloId>('painel');
  const [navegacaoParams, setNavegacaoParams] = useState<Record<string, any>>({});

  // Entidades
  const [associados, setAssociados] = useState<Associado[]>(() => {
    const salvo = localStorage.getItem('sinprof_associados');
    return salvo ? JSON.parse(salvo) : ASSOCIADOS_INICIAIS;
  });

  const [escolasComAssociados] = useState<EscolaComAssociados[]>(ESCOLAS_COM_ASSOCIADOS_INICIAIS);
  const [membrosOrganograma] = useState<MembroOrganograma[]>(MEMBROS_ORGANOGRAMA_INICIAIS);

  const [quotas, setQuotas] = useState<QuotaPagamento[]>(() => {
    const salvo = localStorage.getItem('sinprof_quotas');
    return salvo ? JSON.parse(salvo) : QUOTAS_INICIAIS;
  });

  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>(() => {
    const salvo = localStorage.getItem('sinprof_transacoes');
    return salvo ? JSON.parse(salvo) : TRANSACOES_INICIAIS;
  });

  const [delegacoes] = useState<Delegacao[]>(DELEGACOES_INICIAIS);
  const [processos, setProcessos] = useState<ProcessoJuridico[]>(PROCESSOS_INICIAIS);
  const [documentos, setDocumentos] = useState<DocumentoOficial[]>(DOCUMENTOS_INICIAIS);
  const [reunioes, setReunioes] = useState<ReuniaoAssembleia[]>(REUNIOES_INICIAIS);
  const [comunicados, setComunicados] = useState<Comunicado[]>(COMUNICADOS_INICIAIS);
  const [indicadoresIntel] = useState<IndicadorInteligencia[]>(INDICADORES_INTELIGENCIA_INICIAIS);
  const [logsSeguranca, setLogsSeguranca] = useState<LogSeguranca[]>(LOGS_SEGURANCA_INICIAIS);

  const [alertaToast, setAlertaToast] = useState<{ mensagem: string; tipo: 'sucesso' | 'info' | 'alerta' | 'erro' } | null>(null);

  // Efeitos de persistência
  useEffect(() => {
    localStorage.setItem('sinprof_autenticado', autenticado ? 'true' : 'false');
  }, [autenticado]);

  useEffect(() => {
    localStorage.setItem('sinprof_usuario_atual', JSON.stringify(usuarioAtual));
  }, [usuarioAtual]);

  useEffect(() => {
    localStorage.setItem('sinprof_associados', JSON.stringify(associados));
  }, [associados]);

  useEffect(() => {
    localStorage.setItem('sinprof_quotas', JSON.stringify(quotas));
  }, [quotas]);

  const exibirToast = (mensagem: string, tipo: 'sucesso' | 'info' | 'alerta' | 'erro' = 'sucesso') => {
    setAlertaToast({ mensagem, tipo });
    setTimeout(() => {
      setAlertaToast(null);
    }, 4500);
  };

  const fecharToast = () => setAlertaToast(null);

  const registrarLogSeguranca = (acao: string, modulo: string, status: 'Sucesso' | 'Alerta' | 'Bloqueado' = 'Sucesso') => {
    const novoLog: LogSeguranca = {
      id: `log-${Date.now()}`,
      dataHora: new Date().toISOString().replace('T', ' ').slice(0, 19),
      usuario: usuarioAtual.email,
      perfil: usuarioAtual.perfil,
      acao,
      modulo,
      enderecoIp: '197.231.14.88 (Luanda - AO)',
      dispositivo: 'Navegador Seguro / TLS 1.3',
      status
    };
    setLogsSeguranca(prev => [novoLog, ...prev]);
  };

  const login = (email: string, senha: string): boolean => {
    const emailLimpo = email.trim().toLowerCase();
    if (!emailLimpo) {
      exibirToast('Por favor introduza o seu e-mail institucional.', 'alerta');
      return false;
    }

    let user = usuarios.find(u => u.email.toLowerCase() === emailLimpo);
    
    // Se o usuário não existir no banco local, cria-o automaticamente com perfil de acesso
    if (!user) {
      const nomeFormatado = emailLimpo.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const novoUsuario: Usuario = {
        id: `usr-${Date.now()}`,
        nome: nomeFormatado || 'Membro SINPROF',
        email: emailLimpo,
        perfil: 'Superadministrador', // Acesso total
        cargo: 'Responsável Sindical',
        provincia: 'Luanda',
        telefone: '+244 923 000 000',
        ativo: true,
        criadoEm: new Date().toISOString().slice(0, 10)
      };
      setUsuarios(prev => [novoUsuario, ...prev]);
      user = novoUsuario;
    }

    setUsuarioAtual(user);
    setAutenticado(true);
    registrarLogSeguranca(`Início de sessão autenticado: ${user.nome} (${user.perfil})`, 'Autenticação', 'Sucesso');
    exibirToast(`Sessão iniciada com sucesso. Bem-vindo(a), ${user.nome}!`, 'sucesso');
    return true;
  };

  const logout = () => {
    registrarLogSeguranca('Sessão encerrada voluntariamente pelo utilizador', 'Autenticação', 'Sucesso');
    setAutenticado(false);
    exibirToast('Sessão terminada com segurança.', 'info');
  };

  const recuperarSenha = (email: string): boolean => {
    const user = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      registrarLogSeguranca(`Solicitação de recuperação de senha para: ${email}`, 'Segurança', 'Sucesso');
      exibirToast(`Instruções de recuperação e código de segurança enviados para ${email}!`, 'sucesso');
      return true;
    }
    exibirToast('E-mail não localizado na base de dados do SINPROF.', 'alerta');
    return false;
  };

  const temPermissao = (modulo: ModuloId): boolean => {
    const permitidos = PERMISSOES_POR_PERFIL[usuarioAtual.perfil] || [];
    return permitidos.includes(modulo);
  };

  const trocarPerfil = (novoPerfil: PerfilUsuario) => {
    const userCorrespondente = usuarios.find(u => u.perfil === novoPerfil);
    if (userCorrespondente) {
      setUsuarioAtual(userCorrespondente);
      registrarLogSeguranca(`Alternância de perfil operacional para ${novoPerfil}`, 'Segurança', 'Sucesso');
      exibirToast(`Perfil alterado para: ${novoPerfil} (${userCorrespondente.nome})`, 'info');
      const permitidos = PERMISSOES_POR_PERFIL[novoPerfil];
      if (!permitidos.includes(moduloAtivo)) {
        setModuloAtivo('painel');
      }
    }
  };

  const trocarUsuario = (usuarioId: string) => {
    const user = usuarios.find(u => u.id === usuarioId);
    if (user) {
      setUsuarioAtual(user);
      registrarLogSeguranca(`Utilizador ativo comutado para ${user.nome}`, 'Segurança', 'Sucesso');
      exibirToast(`Sessão comutada para: ${user.nome} (${user.perfil})`, 'info');
    }
  };

  const navegarPara = (modulo: ModuloId, params?: Record<string, any>) => {
    if (!temPermissao(modulo)) {
      registrarLogSeguranca(`Tentativa de acesso não autorizado ao módulo ${modulo}`, 'Segurança', 'Alerta');
      exibirToast(`Acesso restrito: O perfil "${usuarioAtual.perfil}" não possui permissão para acessar este módulo.`, 'alerta');
      return;
    }
    setModuloAtivo(modulo);
    if (params) {
      setNavegacaoParams(params);
    } else {
      setNavegacaoParams({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const adicionarAssociado = (dados: Omit<Associado, 'id' | 'numeroMembro' | 'dataFiliacao'>): Associado => {
    const anoAtual = new Date().getFullYear();
    const numeroSequencial = (associados.length + 1).toString().padStart(4, '0');
    
    // Regra: Valor da Quota mensal é 1% do salário para todos
    const salario = Number(dados.salarioKz) || 200000;
    const valorQuota = Math.round(salario * 0.01);

    const novo: Associado = {
      ...dados,
      id: `assoc-${Date.now()}`,
      numeroMembro: `SINPROF-AO-${anoAtual}-${numeroSequencial}`,
      dataFiliacao: new Date().toISOString().split('T')[0],
      salarioKz: salario,
      valorQuotaCalculadoKz: valorQuota,
      estado: 'Activo'
    };

    setAssociados(prev => [novo, ...prev]);

    // Cria também a quota do mês corrente para o novo associado com 1% do salário
    const novaQuota: QuotaPagamento = {
      id: `quota-${Date.now()}`,
      associadoId: novo.id,
      associadoNome: novo.nomeCompleto,
      associadoNumero: novo.numeroMembro,
      provincia: novo.provincia,
      mesReferencia: 'Outubro/2026',
      ano: 2026,
      valorKz: valorQuota,
      estado: 'Pendente',
      registadoPor: usuarioAtual.nome
    };
    setQuotas(prev => [novaQuota, ...prev]);

    registrarLogSeguranca(`Inscrição do docente ${novo.nomeCompleto} (Agente: ${novo.numeroAgente})`, 'Associados', 'Sucesso');
    exibirToast(`Associado ${novo.nomeCompleto} inscrito com sucesso! Quota calculada (1%): ${valorQuota.toLocaleString('pt-AO')} Kz`, 'sucesso');
    return novo;
  };

  const atualizarAssociado = (id: string, dados: Partial<Associado>) => {
    setAssociados(prev => prev.map(a => a.id === id ? { ...a, ...dados } : a));
    exibirToast('Dados do associado actualizados com sucesso.', 'sucesso');
  };

  const removerAssociado = (id: string) => {
    setAssociados(prev => prev.filter(a => a.id !== id));
    registrarLogSeguranca(`Remoção do associado ID: ${id}`, 'Associados', 'Alerta');
    exibirToast('Associado removido com sucesso.', 'info');
  };

  const registarPagamentoQuota = (id: string, metodo: QuotaPagamento['metodoPagamento'] = 'Multicaixa', ref: string = '') => {
    setQuotas(prev => prev.map(q => {
      if (q.id === id) {
        return {
          ...q,
          estado: 'Pago',
          metodoPagamento: metodo,
          dataPagamento: new Date().toISOString().split('T')[0],
          referenciaComprovativo: ref || `MCX-${Date.now().toString().slice(-6)}`,
          registadoPor: usuarioAtual.nome
        };
      }
      return q;
    }));
    exibirToast('Pagamento de quota registado com sucesso!', 'sucesso');
  };

  const adicionarQuota = (dados: Omit<QuotaPagamento, 'id'>) => {
    const nova: QuotaPagamento = {
      ...dados,
      id: `quota-${Date.now()}`
    };
    setQuotas(prev => [nova, ...prev]);
    exibirToast('Quota adicionada com sucesso.', 'sucesso');
  };

  const adicionarTransacao = (dados: Omit<TransacaoFinanceira, 'id'>) => {
    const nova: TransacaoFinanceira = {
      ...dados,
      id: `trans-${Date.now()}`
    };
    setTransacoes(prev => [nova, ...prev]);
    exibirToast(`${dados.tipo} financeira registada com sucesso!`, 'sucesso');
  };

  const adicionarProcesso = (dados: Omit<ProcessoJuridico, 'id' | 'numeroProcesso' | 'dataAbertura' | 'historicoDespachos'>): ProcessoJuridico => {
    const anoAtual = new Date().getFullYear();
    const numeroSeq = (processos.length + 1).toString().padStart(3, '0');
    const novo: ProcessoJuridico = {
      ...dados,
      id: `proc-${Date.now()}`,
      numeroProcesso: `SINPROF-JUR-${anoAtual}-${numeroSeq}`,
      dataAbertura: new Date().toISOString().split('T')[0],
      historicoDespachos: [
        {
          data: new Date().toISOString().split('T')[0],
          despacho: 'Abertura oficial do processo no Gabinete Jurídico e registo no sistema.',
          responsavel: usuarioAtual.nome
        }
      ]
    };
    setProcessos(prev => [novo, ...prev]);
    exibirToast(`Processo jurídico ${novo.numeroProcesso} instaurado com sucesso!`, 'sucesso');
    return novo;
  };

  const adicionarDespacho = (processoId: string, despacho: string) => {
    setProcessos(prev => prev.map(p => {
      if (p.id === processoId) {
        return {
          ...p,
          historicoDespachos: [
            ...p.historicoDespachos,
            {
              data: new Date().toISOString().split('T')[0],
              despacho,
              responsavel: usuarioAtual.nome
            }
          ]
        };
      }
      return p;
    }));
    exibirToast('Despacho judicial adicionado ao processo.', 'sucesso');
  };

  const adicionarDocumento = (dados: Omit<DocumentoOficial, 'id' | 'dataPublicacao'>) => {
    const novo: DocumentoOficial = {
      ...dados,
      id: `doc-${Date.now()}`,
      dataPublicacao: new Date().toISOString().split('T')[0]
    };
    setDocumentos(prev => [novo, ...prev]);
    exibirToast('Documento oficial publicado com sucesso.', 'sucesso');
  };

  const adicionarReuniao = (dados: Omit<ReuniaoAssembleia, 'id'>) => {
    const nova: ReuniaoAssembleia = {
      ...dados,
      id: `reun-${Date.now()}`
    };
    setReunioes(prev => [nova, ...prev]);
    exibirToast('Reunião/Assembleia convocada com sucesso.', 'sucesso');
  };

  const adicionarComunicado = (dados: Omit<Comunicado, 'id' | 'dataPublicacao'>) => {
    const novo: Comunicado = {
      ...dados,
      id: `com-${Date.now()}`,
      dataPublicacao: new Date().toISOString().split('T')[0]
    };
    setComunicados(prev => [novo, ...prev]);
    exibirToast('Comunicado oficial emitido com sucesso.', 'sucesso');
  };

  const adicionarUsuario = (dados: Omit<Usuario, 'id' | 'criadoEm'>) => {
    const novo: Usuario = {
      ...dados,
      id: `user-${Date.now()}`,
      criadoEm: new Date().toISOString().split('T')[0]
    };
    const listaAtualizada = [...usuarios, novo];
    setUsuarios(listaAtualizada);
    localStorage.setItem('sinprof_usuarios', JSON.stringify(listaAtualizada));
    registrarLogSeguranca(`Criação de utilizador: ${novo.nome} (${novo.perfil})`, 'Utilizadores', 'Sucesso');
    exibirToast(`Utilizador ${novo.nome} cadastrado com sucesso.`, 'sucesso');
  };

  const atualizarUsuario = (id: string, dados: Partial<Usuario>) => {
    const listaAtualizada = usuarios.map(u => {
      if (u.id === id) {
        return { ...u, ...dados };
      }
      return u;
    });
    setUsuarios(listaAtualizada);
    localStorage.setItem('sinprof_usuarios', JSON.stringify(listaAtualizada));

    // Se o utilizador atual for o alterado, sincroniza
    if (usuarioAtual.id === id) {
      const atualizado = listaAtualizada.find(u => u.id === id);
      if (atualizado) {
        setUsuarioAtual(atualizado);
        localStorage.setItem('sinprof_usuario_atual', JSON.stringify(atualizado));
      }
    }

    registrarLogSeguranca(`Edição de dados do utilizador ID: ${id}`, 'Utilizadores', 'Sucesso');
    exibirToast('Dados do utilizador atualizados com sucesso!', 'sucesso');
  };

  const removerUsuario = (id: string) => {
    if (usuarioAtual.id === id) {
      exibirToast('Não é permitido remover o utilizador atualmente em sessão.', 'alerta');
      return;
    }
    const usuarioRemovendo = usuarios.find(u => u.id === id);
    const listaAtualizada = usuarios.filter(u => u.id !== id);
    setUsuarios(listaAtualizada);
    localStorage.setItem('sinprof_usuarios', JSON.stringify(listaAtualizada));
    registrarLogSeguranca(`Eliminação do utilizador: ${usuarioRemovendo?.nome || id}`, 'Utilizadores', 'Alerta');
    exibirToast(`Utilizador ${usuarioRemovendo?.nome || id} removido com sucesso.`, 'info');
  };

  const restaurarDadosIniciais = () => {
    setAssociados(ASSOCIADOS_INICIAIS);
    setQuotas(QUOTAS_INICIAIS);
    setTransacoes(TRANSACOES_INICIAIS);
    setProcessos(PROCESSOS_INICIAIS);
    setDocumentos(DOCUMENTOS_INICIAIS);
    setReunioes(REUNIOES_INICIAIS);
    setComunicados(COMUNICADOS_INICIAIS);
    setUsuarios(USUARIOS_INICIAIS);
    localStorage.clear();
    exibirToast('Base de dados restaurada para os padrões oficiais do SINPROF.', 'info');
  };

  const totalReceitasKz = transacoes
    .filter(t => t.tipo === 'Receita')
    .reduce((acc, t) => acc + t.valorKz, 0);

  const totalDespesasKz = transacoes
    .filter(t => t.tipo === 'Despesa')
    .reduce((acc, t) => acc + t.valorKz, 0);

  const saldoCaixaKz = totalReceitasKz - totalDespesasKz;
  const processosAtivos = processos.filter(p => !p.estado.startsWith('Concluído')).length;
  const alertasCriticos = indicadoresIntel.filter(i => i.gravidade === 'Critico').length;

  return (
    <AppContext.Provider
      value={{
        autenticado,
        login,
        logout,
        recuperarSenha,
        usuarioAtual,
        trocarPerfil,
        trocarUsuario,
        moduloAtivo,
        navegarPara,
        temPermissao,
        navegacaoParams,
        usuarios,
        associados,
        escolasComAssociados,
        membrosOrganograma,
        quotas,
        transacoes,
        delegacoes,
        processos,
        documentos,
        reunioes,
        comunicados,
        indicadoresIntel,
        logsSeguranca,
        adicionarAssociado,
        atualizarAssociado,
        removerAssociado,
        registarPagamentoQuota,
        adicionarQuota,
        adicionarTransacao,
        adicionarProcesso,
        adicionarDespacho,
        adicionarDocumento,
        adicionarReuniao,
        adicionarComunicado,
        adicionarUsuario,
        atualizarUsuario,
        removerUsuario,
        registrarLogSeguranca,
        estatisticasGerais: {
          totalAssociados: associados.length * 1250,
          totalReceitasKz,
          totalDespesasKz,
          saldoCaixaKz,
          processosAtivos,
          alertasCriticos,
          taxaAdesaoEstimada: 68.4,
          totalEscolasRepresentadas: 3415
        },
        alertaToast,
        exibirToast,
        fecharToast,
        restaurarDadosIniciais
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
