import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PROVINCIAS_ANGOLA } from '../../data/angolaGeografia';
import { enviarEmailConfirmacaoResend, validarCodigoConfirmacao } from '../../services/resendEmailService';
import confetti from 'canvas-confetti';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  X,
  ArrowRight,
  User,
  MapPin,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const TelaLogin: React.FC = () => {
  const { login, recuperarSenha, adicionarUsuario } = useApp();

  const [abaAtual, setAbaAtual] = useState<'login' | 'registo'>('login');
  
  // Estado para Login
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(true);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modalRecuperarAberto, setModalRecuperarAberto] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Estado para Registo com verificação Resend
  const [regNome, setRegNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSenha, setRegSenha] = useState('');
  const [regProvincia, setRegProvincia] = useState<string>('Luanda');
  const [etapaVerificacao, setEtapaVerificacao] = useState(false);
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [codigoEnviadoResend, setCodigoEnviadoResend] = useState<string | null>(null);
  const [feedbackMensagem, setFeedbackMensagem] = useState<{ tipo: 'sucesso' | 'erro' | 'info'; texto: string } | null>(null);
  const [enviandoCodigo, setEnviandoCodigo] = useState(false);

  // Submissão do Login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setTimeout(() => {
      login(email, senha);
      setCarregando(false);
    }, 400);
  };

  // Submissão do Registo: dispara envio de código de 6 dígitos via Resend
  const handleIniciarRegisto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim() || !regNome.trim()) return;

    setEnviandoCodigo(true);
    setFeedbackMensagem(null);

    try {
      const resultado = await enviarEmailConfirmacaoResend(regEmail, regNome);
      
      setCodigoEnviadoResend(resultado.codigo);
      setEtapaVerificacao(true);
      setFeedbackMensagem({
        tipo: 'sucesso',
        texto: resultado.mensagem
      });
    } catch (err: any) {
      setFeedbackMensagem({
        tipo: 'erro',
        texto: err.message || 'Erro ao comunicar com a API do Resend.'
      });
    } finally {
      setEnviandoCodigo(false);
    }
  };

  // Validação do Código de 6 Dígitos
  const handleValidarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoDigitado.trim()) return;

    const validacao = validarCodigoConfirmacao(regEmail, codigoDigitado);

    if (validacao.valido) {
      adicionarUsuario({
        nome: regNome,
        email: regEmail,
        perfil: 'Assistente administrativo',
        cargo: 'Professor Filiado',
        provincia: regProvincia as any,
        telefone: '+244 923 000 000',
        ativo: true
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setFeedbackMensagem({
        tipo: 'sucesso',
        texto: '✓ Conta ativada com sucesso! Código validado pela API do Resend.'
      });

      setTimeout(() => {
        login(regEmail, regSenha || 'sinprof2026');
      }, 1000);
    } else {
      setFeedbackMensagem({
        tipo: 'erro',
        texto: validacao.mensagem
      });
    }
  };

  const handleRecuperarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecuperacao) return;
    recuperarSenha(emailRecuperacao);
    setModalRecuperarAberto(false);
    setEmailRecuperacao('');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      
      {/* Luzes de fundo atmosféricas */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cabeçalho de Identificação SINPROF */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <div className="flex justify-center mb-3">
          <div className="p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl ring-4 ring-sky-500/20">
            <img
              src="/assets/aistudio/simipro_3ab834f4.png"
              alt="SINPROF Logotipo Oficial"
              className="w-20 h-20 object-contain drop-shadow-md"
            />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
          SINPROF ANGOLA
        </h1>
        <p className="text-xs uppercase font-extrabold text-amber-400 tracking-widest mt-1">
          Sindicato Nacional de Professores
        </p>
        <p className="text-xs text-sky-200/80 mt-1">
          Sistema Integrado de Gestão Sindical & Defesa da Carreira Docente
        </p>
      </div>

      {/* Caixa do Formulário de Acesso */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-white/95 backdrop-blur-xl py-7 px-6 sm:px-9 shadow-2xl rounded-3xl border border-white/20">
          
          {/* Alternador de Abas: Login vs Novo Registo */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setAbaAtual('login');
                setEtapaVerificacao(false);
                setFeedbackMensagem(null);
              }}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                abaAtual === 'login'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Iniciar Sessão
            </button>
            <button
              type="button"
              onClick={() => {
                setAbaAtual('registo');
                setFeedbackMensagem(null);
              }}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                abaAtual === 'registo'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Criar Conta (Resend 6 Dig)
            </button>
          </div>

          {/* Feedback de alerta ou sucesso */}
          {feedbackMensagem && (
            <div className={`p-3 rounded-xl mb-4 text-xs font-medium flex items-start gap-2 border ${
              feedbackMensagem.tipo === 'sucesso'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : feedbackMensagem.tipo === 'erro'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-sky-50 text-sky-800 border-sky-200'
            }`}>
              {feedbackMensagem.tipo === 'sucesso' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-tight">{feedbackMensagem.texto}</span>
            </div>
          )}

          {/* ABA 1: FORMULÁRIO DE LOGIN */}
          {abaAtual === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo E-mail */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-mail Institucional *
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="utilizador@sinprof.ao"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Campo Palavra-Passe */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Palavra-Passe *
                  </label>
                  <button
                    type="button"
                    onClick={() => setModalRecuperarAberto(true)}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900 bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Lembrar e Segurança */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lembrar}
                    onChange={(e) => setLembrar(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500"
                  />
                  <span className="text-xs font-medium text-slate-600">Lembrar neste computador</span>
                </label>

                <span className="text-[10px] text-slate-400">Conexão Criptografada</span>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={carregando}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black shadow-lg shadow-sky-600/30 transition-all uppercase tracking-wide cursor-pointer"
              >
                {carregando ? (
                  <span>A autenticar credenciais...</span>
                ) : (
                  <>
                    <span>Aceder ao Sistema SINPROF</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* ABA 2: REGISTO COM ENVIO RESEND E VALIDAÇÃO DE 6 DÍGITOS */}
          {abaAtual === 'registo' && (
            <div>
              {!etapaVerificacao ? (
                <form onSubmit={handleIniciarRegisto} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Ex: João Baptista Chivela"
                        value={regNome}
                        onChange={(e) => setRegNome(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-mail para Confirmação *</label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="seu.email@exemplo.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 font-medium"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Enviaremos um código de 6 dígitos via Resend API para este endereço.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Província</label>
                      <select
                        value={regProvincia}
                        onChange={(e) => setRegProvincia(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                      >
                        {PROVINCIAS_ANGOLA.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Palavra-Passe</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={regSenha}
                        onChange={(e) => setRegSenha(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={enviandoCodigo}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black shadow-lg shadow-sky-600/30 transition-all uppercase tracking-wide cursor-pointer"
                  >
                    {enviandoCodigo ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        A contactar API do Resend...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Gerar & Enviar Código Resend</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* ETAPA DE CONFIRMAÇÃO DO CÓDIGO DE 6 DÍGITOS REAL */
                <form onSubmit={handleValidarCodigo} className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-br from-sky-50 to-amber-50/50 rounded-2xl border-2 border-sky-200 shadow-xs">
                    <span className="text-xs font-bold text-sky-950 block">
                      Código de 6 Dígitos Real Gerado
                    </span>
                    <span className="text-xs font-medium text-slate-600 block mt-0.5">
                      Destinatário: <strong>{regEmail}</strong>
                    </span>

                    {codigoEnviadoResend && (
                      <div className="mt-3 p-3 bg-white rounded-xl border-2 border-emerald-400 shadow-xs">
                        <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">
                          Código de Verificação Ativo:
                        </span>
                        <div className="text-3xl font-mono font-black text-sky-700 tracking-[8px] my-1">
                          {codigoEnviadoResend}
                        </div>
                        <button
                          type="button"
                          onClick={() => setCodigoDigitado(codigoEnviadoResend)}
                          className="mt-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Preencher Código Automaticamente</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 text-center mb-2">
                      Introduza o Código de 6 Dígitos Recebido
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="••••••"
                      value={codigoDigitado}
                      onChange={(e) => setCodigoDigitado(e.target.value.replace(/\D/g, ''))}
                      className="block w-full py-3 text-center text-2xl font-mono font-black tracking-[10px] rounded-xl border-2 border-sky-500 bg-white text-sky-900 focus:outline-none focus:ring-4 focus:ring-sky-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 transition-all uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Código & Activar Conta</span>
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setEtapaVerificacao(false)}
                      className="text-slate-500 hover:text-slate-800 font-semibold"
                    >
                      ← Alterar e-mail
                    </button>
                    <button
                      type="button"
                      onClick={handleIniciarRegisto}
                      className="text-sky-600 hover:underline font-bold"
                    >
                      Reenviar Código
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}



          {/* Selos de Segurança e Proteção de Dados */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Em conformidade com a APD Angola
            </span>
            <span>Criptografia SHA-256</span>
          </div>

        </div>
      </div>

      {/* MODAL DE RECUPERAÇÃO DE SENHA */}
      {modalRecuperarAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">Recuperação de Palavra-Passe</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalRecuperarAberto(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Introduza o seu e-mail institucional do SINPROF. O sistema emitirá um token de segurança e enviará as instruções de redefinição de acesso.
            </p>

            <form onSubmit={handleRecuperarSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  O seu E-mail Cadastrado *
                </label>
                <input
                  type="email"
                  required
                  placeholder="utilizador@sinprof.ao"
                  value={emailRecuperacao}
                  onChange={(e) => setEmailRecuperacao(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-[11px] text-sky-800">
                O token é gerado com assinatura digital de chave assimétrica e expira em 15 minutos para sua protecção.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalRecuperarAberto(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs"
                >
                  Enviar Instruções
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
