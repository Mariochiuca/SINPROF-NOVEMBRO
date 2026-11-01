import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TelaLogin } from './components/auth/TelaLogin';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { PainelPrincipal } from './components/dashboard/PainelPrincipal';
import { RadarNacional } from './components/radar/RadarNacional';
import { CentroInteligencia } from './components/inteligencia/CentroInteligencia';
import { ModuloAssociados } from './components/associados/ModuloAssociados';
import { ModuloEscolas } from './components/escolas/ModuloEscolas';
import { ModuloOrganograma } from './components/organograma/ModuloOrganograma';
import { ModuloQuotas } from './components/quotas/ModuloQuotas';
import { ModuloTesouraria } from './components/tesouraria/ModuloTesouraria';
import { ModuloDelegacoes } from './components/delegacoes/ModuloDelegacoes';
import { ModuloJuridico } from './components/juridico/ModuloJuridico';
import { ModuloDocumentos } from './components/documentos/ModuloDocumentos';
import { ModuloReunioes } from './components/reunioes/ModuloReunioes';
import { ModuloComunicacoes } from './components/comunicacoes/ModuloComunicacoes';
import { ModuloRelatorios } from './components/relatorios/ModuloRelatorios';
import { ModuloUsuarios } from './components/usuarios/ModuloUsuarios';
import { PainelSeguranca } from './components/seguranca/PainelSeguranca';
import { ModuloConfiguracoes } from './components/configuracoes/ModuloConfiguracoes';
import { 
  ShieldAlert, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X,
  UserCheck
} from 'lucide-react';
import { PerfilUsuario } from './types';

const AppContent: React.FC = () => {
  const { 
    autenticado,
    logout,
    moduloAtivo, 
    temPermissao, 
    usuarioAtual, 
    navegarPara, 
    alertaToast, 
    fecharToast,
    trocarPerfil
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Se o utilizador não estiver autenticado, exibe a Tela de Login
  if (!autenticado) {
    return <TelaLogin />;
  }

  // Verificação de permissões do perfil
  const temAcessoAoModulo = temPermissao(moduloAtivo);

  // Renderizador do módulo ativo
  const renderModulo = () => {
    if (!temAcessoAoModulo) {
      return (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Acesso Restrito ao Módulo</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            O seu perfil de acesso atual (<strong className="text-slate-800">{usuarioAtual.perfil}</strong>) não possui 
            permissões estatutárias para visualizar este módulo.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => navegarPara('painel')}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Voltar ao Painel Principal
            </button>
            <button
              type="button"
              onClick={() => trocarPerfil('Presidente')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              Alternar para Presidente
            </button>
          </div>
        </div>
      );
    }

    switch (moduloAtivo) {
      case 'painel':
        return <PainelPrincipal />;
      case 'radar':
        return <RadarNacional />;
      case 'inteligencia':
        return <CentroInteligencia />;
      case 'associados':
        return <ModuloAssociados />;
      case 'escolas':
        return <ModuloEscolas />;
      case 'organograma':
        return <ModuloOrganograma />;
      case 'quotas':
        return <ModuloQuotas />;
      case 'tesouraria':
        return <ModuloTesouraria />;
      case 'delegacoes':
        return <ModuloDelegacoes />;
      case 'juridico':
        return <ModuloJuridico />;
      case 'documentos':
        return <ModuloDocumentos />;
      case 'reunioes':
        return <ModuloReunioes />;
      case 'comunicacoes':
        return <ModuloComunicacoes />;
      case 'relatorios':
        return <ModuloRelatorios />;
      case 'usuarios':
        return <ModuloUsuarios />;
      case 'seguranca':
        return <PainelSeguranca />;
      case 'configuracoes':
        return <ModuloConfiguracoes />;
      default:
        return <PainelPrincipal />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Menu Lateral Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenLogoutModal={() => setLogoutModalOpen(true)}
      />

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Barra Superior */}
        <Navbar
          onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
          onOpenLogoutModal={() => setLogoutModalOpen(true)}
        />

        {/* Conteúdo Dinâmico */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderModulo()}
        </main>

        {/* Rodapé Limpo (sem o texto removido conforme solicitado) */}
        <footer className="py-4 px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <p>
              © {new Date().getFullYear()} <strong>SINPROF</strong> - Sindicato Nacional de Professores de Angola. Todos os direitos reservados.
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              República de Angola · Defesa e Dignidade da Classe Docente
            </p>
          </div>
        </footer>

      </div>

      {/* NOTIFICAÇÃO TOAST GLOBAL */}
      {alertaToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 animate-slide-up max-w-md">
          {alertaToast.tipo === 'sucesso' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {alertaToast.tipo === 'alerta' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
          {alertaToast.tipo === 'erro' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          {alertaToast.tipo === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}

          <p className="text-xs font-medium flex-1">{alertaToast.mensagem}</p>

          <button
            type="button"
            onClick={fecharToast}
            className="p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MODAL DE SAIR / ENCERRAMENTO DE SESSÃO */}
      {logoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <LogOut className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-slate-900">Encerrar Sessão</h3>
              </div>
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Deseja terminar a sessão atual de <strong>{usuarioAtual.nome}</strong> ({usuarioAtual.cargo}) e regressar ao ecrã de início de sessão?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoutModalOpen(false);
                  logout();
                }}
                className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs"
              >
                Terminar Sessão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
