import React from 'react';
import { useApp } from '../../context/AppContext';
import { ModuloId } from '../../types';
import {
  LayoutDashboard,
  MapPin,
  BrainCircuit,
  Users,
  School,
  Network,
  CreditCard,
  Wallet,
  Building2,
  Scale,
  FolderOpen,
  CalendarDays,
  Megaphone,
  FileBarChart,
  UserCog,
  ShieldCheck,
  Settings,
  LogOut,
  Lock,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenLogoutModal: () => void;
}

interface MenuItem {
  id: ModuloId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile, onOpenLogoutModal }) => {
  const { moduloAtivo, navegarPara, temPermissao, usuarioAtual, processos } = useApp();

  const menuItems: MenuItem[] = [
    {
      id: 'painel',
      label: 'Painel Principal',
      icon: LayoutDashboard
    },
    {
      id: 'radar',
      label: 'Radar Nacional',
      icon: MapPin,
      badge: '21 Prov.',
      badgeColor: 'bg-amber-400 text-slate-950 font-bold',
      highlight: true
    },
    {
      id: 'inteligencia',
      label: 'Inteligência Sindical',
      icon: BrainCircuit,
      badge: 'Análise IA',
      badgeColor: 'bg-sky-400 text-slate-950 font-bold',
      highlight: true
    },
    {
      id: 'associados',
      label: 'Associados',
      icon: Users
    },
    {
      id: 'escolas',
      label: 'Censo de Escolas',
      icon: School,
      badge: '3.415',
      badgeColor: 'bg-emerald-500 text-white font-bold'
    },
    {
      id: 'organograma',
      label: 'Organograma Oficial',
      icon: Network
    },
    {
      id: 'quotas',
      label: 'Quotas e Pagamentos',
      icon: CreditCard
    },
    {
      id: 'tesouraria',
      label: 'Tesouraria',
      icon: Wallet
    },
    {
      id: 'delegacoes',
      label: 'Delegações',
      icon: Building2
    },
    {
      id: 'juridico',
      label: 'Processos Jurídicos',
      icon: Scale,
      badge: processos.filter(p => !p.estado.startsWith('Concluído')).length.toString(),
      badgeColor: 'bg-red-500 text-white font-bold'
    },
    {
      id: 'documentos',
      label: 'Documentos',
      icon: FolderOpen
    },
    {
      id: 'reunioes',
      label: 'Reuniões e Assembleia',
      icon: CalendarDays
    },
    {
      id: 'comunicacoes',
      label: 'Comunicações',
      icon: Megaphone
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: FileBarChart
    },
    {
      id: 'usuarios',
      label: 'Utilizadores e Permissões',
      icon: UserCog
    },
    {
      id: 'seguranca',
      label: 'Segurança & Auditoria',
      icon: ShieldCheck
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: Settings
    }
  ];

  const handleItemClick = (id: ModuloId) => {
    navegarPara(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800">
      
      {/* Topo da Sidebar: Logotipo Oficial */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/aistudio/simipro_3ab834f4.png" 
            alt="SINPROF" 
            className="w-9 h-9 object-contain"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-white tracking-wider font-['Space_Grotesk']">SINPROF</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded">AO</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-tight">Sindicato Nacional de Professores</p>
          </div>
        </div>

        {/* Botão Fechar no Mobile */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Cartão de Resumo do Utilizador Ativo */}
      <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white text-xs">
            {usuarioAtual.nome.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{usuarioAtual.nome}</p>
            <p className="text-[11px] text-amber-400 font-medium truncate">{usuarioAtual.perfil}</p>
          </div>
        </div>
      </div>

      {/* Menu de Navegação dos Módulos */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const permitido = temPermissao(item.id);
          const isAtivo = moduloAtivo === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              disabled={!permitido}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                isAtivo
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30 font-bold'
                  : item.highlight
                  ? 'bg-slate-800/70 text-slate-100 hover:bg-slate-800 hover:text-white border border-sky-500/20'
                  : permitido
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-600 cursor-not-allowed opacity-50'
              }`}
              title={!permitido ? `Módulo bloqueado para o perfil ${usuarioAtual.perfil}` : item.label}
            >
              <div className="flex items-center gap-3 min-w-0">
                <IconComponent className={`w-4 h-4 shrink-0 ${
                  isAtivo 
                    ? 'text-white' 
                    : item.highlight 
                    ? 'text-amber-400' 
                    : permitido 
                    ? 'text-slate-400 group-hover:text-sky-400' 
                    : 'text-slate-600'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge && permitido && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${item.badgeColor || 'bg-slate-700 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
                {!permitido && (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Rodapé da Sidebar: Botão Sair */}
      <div className="p-3 border-t border-slate-800">
        <button
          type="button"
          onClick={() => {
            onCloseMobile();
            onOpenLogoutModal();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair do Sistema</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
