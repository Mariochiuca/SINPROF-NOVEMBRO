import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Menu, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  AlertTriangle,
  Lock
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  onOpenLogoutModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar, onOpenLogoutModal }) => {
  const { 
    usuarioAtual, 
    navegarPara, 
    indicadoresIntel,
    logout
  } = useApp();

  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
  const alertasCriticos = indicadoresIntel.filter(i => i.gravidade === 'Critico');

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Lado Esquerdo: Mobile Hamburger & Logotipo Oficial */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label="Abrir menu lateral"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div 
              onClick={() => navegarPara('painel')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <img 
                src="/assets/aistudio/simipro_3ab834f4.png" 
                alt="SINPROF Logotipo" 
                className="w-10 h-10 object-contain drop-shadow-xs transition-transform group-hover:scale-105"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-sky-600 font-['Space_Grotesk']">SINPROF</span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded">ANGOLA</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase hidden sm:block">
                  Sindicato Nacional de Professores
                </p>
              </div>
            </div>
          </div>

          {/* CENTRO: Indicador de Segurança & Conexão Criptografada */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Sistema Seguro & Protegido</span>
            <span className="text-slate-300">·</span>
            <span className="text-[11px] text-slate-500 font-medium">Conformidade APD Angola</span>
          </div>

          {/* Lado Direito: Notificações, Dados do Utilizador & Botão Sair */}
          <div className="flex items-center gap-3">
            
            {/* Botão de Notificações de Alertas Sindicais */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                aria-label="Ver alertas"
              >
                <Bell className="w-5 h-5" />
                {alertasCriticos.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </button>

              {/* Popover de Notificações */}
              {mostrarNotificacoes && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Alertas do Sindicato</h4>
                    </div>
                    <span className="text-[10px] text-slate-500">{alertasCriticos.length} críticos</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto px-2 py-1 divide-y divide-slate-100">
                    {indicadoresIntel.map((alerta) => (
                      <div 
                        key={alerta.id} 
                        onClick={() => {
                          navegarPara('inteligencia');
                          setMostrarNotificacoes(false);
                        }}
                        className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold uppercase ${
                            alerta.gravidade === 'Critico' ? 'text-red-600' : 'text-amber-600'
                          }`}>
                            {alerta.provincia} {alerta.municipio ? `(${alerta.municipio})` : ''}
                          </span>
                          <span className="text-[10px] text-slate-400">{alerta.dataIdentificacao}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">{alerta.titulo}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{alerta.acaoRecomendada}</p>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 pt-2 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        navegarPara('inteligencia');
                        setMostrarNotificacoes(false);
                      }}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700"
                    >
                      Aceder ao Centro de Inteligência &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Identificação do Utilizador Autenticado */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {usuarioAtual.nome.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">{usuarioAtual.nome}</div>
                <div className="text-[11px] text-sky-700 font-semibold leading-tight">{usuarioAtual.perfil}</div>
              </div>
            </div>

            {/* Botão Sair Seguro */}
            <button
              type="button"
              onClick={onOpenLogoutModal}
              className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Encerrar Sessão / Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
