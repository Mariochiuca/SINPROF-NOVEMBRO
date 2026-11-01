import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Usuario, PerfilUsuario, ProvinciaAngola } from '../../types';
import { PROVINCIAS_ANGOLA, MUNICIPIOS_POR_PROVINCIA } from '../../data/angolaGeografia';
import { 
  UserCog, 
  ShieldCheck, 
  UserPlus, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  Users,
  Building2,
  Mail,
  Send,
  CheckCircle2,
  Edit,
  Trash2,
  AlertTriangle,
  KeyRound,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { enviarEmailConfirmacaoResend } from '../../services/resendEmailService';

export const ModuloUsuarios: React.FC = () => {
  const { 
    usuarios, 
    usuarioAtual, 
    trocarUsuario, 
    adicionarUsuario, 
    atualizarUsuario, 
    removerUsuario, 
    trocarPerfil,
    exibirToast 
  } = useApp();

  const isSuperadmin = usuarioAtual.perfil === 'Superadministrador';

  // Estados dos Modais
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalRemoverAberto, setModalRemoverAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [usuarioRemovendo, setUsuarioRemovendo] = useState<Usuario | null>(null);

  // Form para Novo Utilizador
  const [formDataNovo, setFormDataNovo] = useState({
    nome: '',
    email: '',
    perfil: 'Delegado provincial' as PerfilUsuario,
    cargo: 'Delegado Provincial',
    provincia: 'Luanda' as ProvinciaAngola,
    municipio: '',
    telefone: '+244 923 000 000',
    ativo: true
  });

  // Form para Edição de Utilizador
  const [formDataEditar, setFormDataEditar] = useState({
    nome: '',
    email: '',
    perfil: 'Delegado provincial' as PerfilUsuario,
    cargo: '',
    provincia: 'Luanda' as ProvinciaAngola,
    municipio: '',
    telefone: '',
    ativo: true
  });

  const perfisMatriz: { perfil: PerfilUsuario; descricao: string; modulos: string[] }[] = [
    {
      perfil: 'Superadministrador',
      descricao: 'Acesso total e irrestrito a todos os módulos, criação, edição e exclusão de utilizadores, configurações e logs do sistema.',
      modulos: ['Todos os Módulos (Painel, Radar, IA, Associados, Quotas, Tesouraria, Delegações, Jurídico, Documentos, Reuniões, Comunicados, Relatórios, Utilizadores, Configurações)']
    },
    {
      perfil: 'Presidente',
      descricao: 'Indicadores executivos, relatórios, gestão geral, Radar Nacional e Centro de Inteligência.',
      modulos: ['Painel Principal', 'Radar Nacional', 'Inteligência Sindical', 'Relatórios', 'Associados', 'Quotas', 'Tesouraria', 'Delegações', 'Jurídico', 'Documentos', 'Reuniões', 'Comunicações']
    },
    {
      perfil: 'Secretário-geral',
      descricao: 'Gestão de associados, expediente documental, arquivo digital e convocatória de reuniões.',
      modulos: ['Painel Principal', 'Associados', 'Documentos', 'Reuniões e Assembleia', 'Comunicações', 'Delegações', 'Relatórios']
    },
    {
      perfil: 'Tesoureiro',
      descricao: 'Controlo de quotas mensais, arrecadação, receitas, despesas e fluxo de caixa.',
      modulos: ['Painel Principal', 'Quotas e Pagamentos', 'Tesouraria', 'Relatórios Financeiros']
    },
    {
      perfil: 'Delegado provincial',
      descricao: 'Gestão político-sindical da sua província, membros locais e representações.',
      modulos: ['Painel Principal', 'Radar Nacional', 'Associados da Província', 'Quotas Locais', 'Delegações', 'Reuniões', 'Comunicações']
    },
    {
      perfil: 'Delegado municipal',
      descricao: 'Gestão da sua área de circunscrição municipal e atendimento direto às escolas.',
      modulos: ['Painel Principal', 'Associados do Município', 'Quotas Municipais', 'Reuniões', 'Comunicações']
    },
    {
      perfil: 'Assistente administrativo',
      descricao: 'Inscrições de professores, emissão de cartões e atendimento ao público.',
      modulos: ['Painel Principal', 'Inscrição de Associados', 'Quotas e Recibos', 'Documentos']
    },
    {
      perfil: 'Jurídico',
      descricao: 'Acompanhamento de reclamações, processos contenciosos e defesas laborais.',
      modulos: ['Painel Principal', 'Processos Jurídicos e Reclamações', 'Relatórios Jurídicos', 'Documentos']
    }
  ];

  // Feedback do envio via Resend (código de 6 dígitos real)
  const [statusResend, setStatusResend] = useState<{ email: string; codigo: string; mensagem: string } | null>(null);
  const [enviandoResend, setEnviandoResend] = useState<string | null>(null);

  const dispararEmailResend = async (userEmail: string, userNome: string) => {
    setEnviandoResend(userEmail);
    try {
      const res = await enviarEmailConfirmacaoResend(userEmail, userNome);
      setStatusResend({
        email: userEmail,
        codigo: res.codigo,
        mensagem: res.mensagem
      });
      exibirToast(`Código real de 6 dígitos gerado e enviado: ${res.codigo}`, 'sucesso');
    } catch (e: any) {
      exibirToast(`Erro no envio: ${e.message}`, 'erro');
    } finally {
      setEnviandoResend(null);
    }
  };

  // Abrir Modal de Edição
  const abrirEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setFormDataEditar({
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      cargo: usuario.cargo,
      provincia: usuario.provincia || 'Luanda',
      municipio: usuario.municipio || '',
      telefone: usuario.telefone || '',
      ativo: usuario.ativo !== false
    });
    setModalEditarAberto(true);
  };

  // Salvar Edição
  const handleSalvarEdicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioEditando) return;

    atualizarUsuario(usuarioEditando.id, {
      nome: formDataEditar.nome,
      email: formDataEditar.email,
      perfil: formDataEditar.perfil,
      cargo: formDataEditar.cargo,
      provincia: formDataEditar.provincia,
      municipio: formDataEditar.municipio,
      telefone: formDataEditar.telefone,
      ativo: formDataEditar.ativo
    });

    setModalEditarAberto(false);
    setUsuarioEditando(null);
  };

  // Abrir Modal de Remoção
  const abrirRemover = (usuario: Usuario) => {
    if (usuario.id === usuarioAtual.id) {
      exibirToast('Não é possível remover a sua própria conta em sessão.', 'alerta');
      return;
    }
    setUsuarioRemovendo(usuario);
    setModalRemoverAberto(true);
  };

  // Confirmar Remoção
  const confirmarRemocao = () => {
    if (!usuarioRemovendo) return;
    removerUsuario(usuarioRemovendo.id);
    setModalRemoverAberto(false);
    setUsuarioRemovendo(null);
  };

  // Criar Novo Utilizador com Código Real
  const handleCriarNovo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDataNovo.nome.trim() || !formDataNovo.email.trim()) return;

    adicionarUsuario({
      nome: formDataNovo.nome,
      email: formDataNovo.email,
      perfil: formDataNovo.perfil,
      cargo: formDataNovo.cargo,
      provincia: formDataNovo.provincia,
      municipio: formDataNovo.municipio,
      telefone: formDataNovo.telefone,
      ativo: formDataNovo.ativo
    });

    // Dispara código real de 6 dígitos via Resend
    await dispararEmailResend(formDataNovo.email, formDataNovo.nome);

    setModalNovoAberto(false);
    setFormDataNovo({
      nome: '',
      email: '',
      perfil: 'Delegado provincial',
      cargo: 'Delegado Provincial',
      provincia: 'Luanda',
      municipio: '',
      telefone: '+244 923 000 000',
      ativo: true
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Segurança & Controlo de Acesso</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">RBAC (Role-Based Access Control)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            UTILIZADORES E PERMISSÕES DO SISTEMA
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Autonomia total do Superadministrador para cadastrar, editar permissões, alterar dados e remover utilizadores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Perfil: <strong>{usuarioAtual.perfil}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setModalNovoAberto(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Utilizador</span>
          </button>
        </div>
      </div>

      {/* Banner de Autonomia do Superadministrador */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 rounded-2xl p-4 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">Autonomia do Superadministrador Ativa</h4>
            <p className="text-xs text-slate-200 font-medium">
              Acesso irrestrito: Pode <strong>criar</strong> novas contas, <strong>editar</strong> cargos e perfis, e <strong>remover</strong> utilizadores do sistema com validação segura de código real de 6 dígitos.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white/10 rounded-lg text-[11px] font-bold text-sky-200 border border-white/10">
            {usuarios.length} Contas Registadas
          </span>
        </div>
      </div>

      {/* Banner de Feedback Resend com Código Real */}
      {statusResend && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-md animate-fadeIn flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">Código Real de 6 Dígitos Gerado</span>
                <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded-full">Resend API Ready</span>
              </div>
              <p className="text-xs text-emerald-800 mt-1 font-medium">
                Enviado para: <strong>{statusResend.email}</strong>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-emerald-700 font-semibold">Código de Verificação:</span>
                <span className="px-3 py-1 bg-white border-2 border-emerald-500 rounded-lg font-mono font-black text-lg text-emerald-700 tracking-widest shadow-xs">
                  {statusResend.codigo}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">(válido para ativação)</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStatusResend(null)}
            className="self-end md:self-center text-xs font-bold text-emerald-800 hover:text-emerald-950 px-4 py-2 bg-white rounded-xl border border-emerald-300 shadow-xs"
          >
            Fechar Aviso
          </button>
        </div>
      )}

      {/* Tabela de Utilizadores Cadastrados com Edição e Exclusão */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Utilizadores Registados no SINPROF ({usuarios.length})</h3>
            <p className="text-xs text-slate-400">Pode editar dados, alternar perfis, reenviar código de 6 dígitos ou remover utilizadores.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Total: {usuarios.filter(u => u.ativo !== false).length} Ativos / {usuarios.filter(u => u.ativo === false).length} Inativos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Nome / Cargo</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Perfil Obrigatório</th>
                <th className="px-4 py-3">Jurisdição / Província</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Ações do Superadmin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {usuarios.map(u => {
                const isAtual = usuarioAtual.id === u.id;
                const estaEnviando = enviandoResend === u.email;
                return (
                  <tr key={u.id} className={`transition-colors ${isAtual ? 'bg-sky-50/70 font-semibold' : 'hover:bg-slate-50'}`}>
                    <td className="px-4 py-3 text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          u.perfil === 'Superadministrador' 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : isAtual 
                              ? 'bg-sky-600 text-white' 
                              : 'bg-slate-200 text-slate-700'
                        }`}>
                          {u.nome.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold flex items-center gap-1.5">
                            {u.nome}
                            {isAtual && (
                              <span className="text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.2 rounded font-extrabold">Você</span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500 font-normal">{u.cargo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.perfil === 'Superadministrador'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : u.perfil === 'Presidente'
                            ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                            : 'bg-sky-100 text-sky-800'
                      }`}>
                        {u.perfil}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-semibold">
                      {u.provincia ? `${u.provincia}${u.municipio ? ` (${u.municipio})` : ''}` : 'Âmbito Nacional'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.telefone || 'N/A'}</td>
                    <td className="px-4 py-3">
                      {u.ativo !== false ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3" /> Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <X className="w-3 h-3" /> Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Botão Enviar Código Real Resend */}
                        <button
                          type="button"
                          onClick={() => dispararEmailResend(u.email, u.nome)}
                          disabled={estaEnviando}
                          title="Enviar código de verificação de 6 dígitos via Resend"
                          className="px-2.5 py-1 bg-white hover:bg-sky-50 text-sky-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-sky-300 shadow-2xs"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span className="hidden lg:inline">{estaEnviando ? 'Enviando...' : 'Código 6D'}</span>
                        </button>

                        {/* Botão Editar Utilizador */}
                        <button
                          type="button"
                          onClick={() => abrirEditar(u)}
                          title="Editar utilizador, cargo, província e perfil"
                          className="p-1.5 bg-white hover:bg-amber-50 text-amber-700 hover:text-amber-800 rounded-lg text-xs font-bold transition-colors border border-amber-300 shadow-2xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Botão Remover Utilizador (Superadmin ou Gestor) */}
                        <button
                          type="button"
                          onClick={() => abrirRemover(u)}
                          disabled={isAtual}
                          title={isAtual ? "Não pode remover a conta em uso" : "Remover utilizador"}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-colors border shadow-2xs ${
                            isAtual 
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                              : 'bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border-rose-300'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Botão Simular Acesso */}
                        {!isAtual && (
                          <button
                            type="button"
                            onClick={() => trocarUsuario(u.id)}
                            title="Alternar para a perspetiva deste utilizador"
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                          >
                            Simular
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MATRIZ OFICIAL DE PERMISSÕES POR PERFIL */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-sky-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Matriz Regulamentar de Perfis & Permissões (Conforme Especificado no Estatuto)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {perfisMatriz.map(p => {
            const isPerfilAtivo = usuarioAtual.perfil === p.perfil;
            return (
              <div 
                key={p.perfil}
                className={`p-4 rounded-xl border transition-all ${
                  isPerfilAtivo
                    ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-300'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    {p.perfil}
                  </h4>
                  {isPerfilAtivo && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-600 text-white">
                      Activo Agora
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-1 font-medium">{p.descricao}</p>

                <div className="mt-3 pt-2 border-t border-slate-200/60">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Módulos Autorizados:</p>
                  <p className="text-xs font-semibold text-sky-900">{p.modulos.join(', ')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Novo Utilizador */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Cadastrar Novo Utilizador</h3>
                <p className="text-xs text-slate-500">Criação pelo Superadministrador com código real de verificação</p>
              </div>
              <button
                type="button"
                onClick={() => setModalNovoAberto(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarNovo} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Prof. Manuel Gonçalves"
                  value={formDataNovo.nome}
                  onChange={(e) => setFormDataNovo({ ...formDataNovo, nome: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-sky-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Institucional *</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: manuel.goncalves@sinprof.ao"
                  value={formDataNovo.email}
                  onChange={(e) => setFormDataNovo({ ...formDataNovo, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-sky-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Perfil Regulamentar</label>
                  <select
                    value={formDataNovo.perfil}
                    onChange={(e) => {
                      const novoPerfil = e.target.value as PerfilUsuario;
                      setFormDataNovo({ 
                        ...formDataNovo, 
                        perfil: novoPerfil,
                        cargo: novoPerfil
                      });
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-bold bg-white focus:ring-2 focus:ring-sky-500 outline-hidden"
                  >
                    {perfisMatriz.map(p => (
                      <option key={p.perfil} value={p.perfil}>{p.perfil}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Província</label>
                  <select
                    value={formDataNovo.provincia}
                    onChange={(e) => setFormDataNovo({ ...formDataNovo, provincia: e.target.value as any, municipio: '' })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-sky-500 outline-hidden"
                  >
                    {PROVINCIAS_ANGOLA.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Município</label>
                  <select
                    value={formDataNovo.municipio}
                    onChange={(e) => setFormDataNovo({ ...formDataNovo, municipio: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-sky-500 outline-hidden"
                  >
                    <option value="">Selecione...</option>
                    {(MUNICIPIOS_POR_PROVINCIA[formDataNovo.provincia] || []).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formDataNovo.telefone}
                    onChange={(e) => setFormDataNovo({ ...formDataNovo, telefone: e.target.value })}
                    placeholder="+244 9..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-sky-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cargo Oficial</label>
                <input
                  type="text"
                  value={formDataNovo.cargo}
                  onChange={(e) => setFormDataNovo({ ...formDataNovo, cargo: e.target.value })}
                  placeholder="Ex: Delegado Municipal de Viana"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-sky-500 outline-hidden"
                />
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-sky-900 text-xs">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Código Real de 6 Dígitos
                </p>
                <p className="text-[11px] text-sky-700 mt-0.5">
                  Ao salvar, o sistema gera o código real de 6 dígitos e despacha via Resend para validação do utilizador.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm"
                >
                  Cadastrar & Gerar Código
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Utilizador */}
      {modalEditarAberto && usuarioEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Editar Utilizador</h3>
                <p className="text-xs text-slate-500">Alteração de privilégios e dados cadastrais pelo Superadmin</p>
              </div>
              <button
                type="button"
                onClick={() => setModalEditarAberto(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formDataEditar.nome}
                  onChange={(e) => setFormDataEditar({ ...formDataEditar, nome: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Institucional *</label>
                <input
                  type="email"
                  required
                  value={formDataEditar.email}
                  onChange={(e) => setFormDataEditar({ ...formDataEditar, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Perfil Regulamentar</label>
                  <select
                    value={formDataEditar.perfil}
                    onChange={(e) => setFormDataEditar({ ...formDataEditar, perfil: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-bold bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  >
                    {perfisMatriz.map(p => (
                      <option key={p.perfil} value={p.perfil}>{p.perfil}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Província</label>
                  <select
                    value={formDataEditar.provincia}
                    onChange={(e) => setFormDataEditar({ ...formDataEditar, provincia: e.target.value as any, municipio: '' })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  >
                    {PROVINCIAS_ANGOLA.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Município</label>
                  <select
                    value={formDataEditar.municipio}
                    onChange={(e) => setFormDataEditar({ ...formDataEditar, municipio: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  >
                    <option value="">Selecione...</option>
                    {(MUNICIPIOS_POR_PROVINCIA[formDataEditar.provincia] || []).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formDataEditar.telefone}
                    onChange={(e) => setFormDataEditar({ ...formDataEditar, telefone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cargo Oficial</label>
                <input
                  type="text"
                  value={formDataEditar.cargo}
                  onChange={(e) => setFormDataEditar({ ...formDataEditar, cargo: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estado da Conta</label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="status"
                      checked={formDataEditar.ativo === true}
                      onChange={() => setFormDataEditar({ ...formDataEditar, ativo: true })}
                      className="text-emerald-600"
                    />
                    <span>Ativo (Acesso Liberado)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="status"
                      checked={formDataEditar.ativo === false}
                      onChange={() => setFormDataEditar({ ...formDataEditar, ativo: false })}
                      className="text-rose-600"
                    />
                    <span>Inativo (Acesso Bloqueado)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalEditarAberto(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Remoção de Utilizador */}
      {modalRemoverAberto && usuarioRemovendo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-bold text-slate-900 text-center">Remover Utilizador</h3>
            <p className="text-xs text-slate-600 text-center mt-2">
              Tem certeza de que deseja excluir permanentemente o utilizador <strong>{usuarioRemovendo.nome}</strong> ({usuarioRemovendo.email})?
            </p>
            <p className="text-[11px] text-rose-600 text-center mt-1 font-semibold">
              Esta ação removerá todas as permissões de acesso deste perfil ao sistema SINPROF.
            </p>

            <div className="flex items-center justify-center gap-3 mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalRemoverAberto(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarRemocao}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
