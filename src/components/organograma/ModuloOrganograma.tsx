import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MembroOrganograma, ProvinciaAngola } from '../../types';
import { PROVINCIAS_ANGOLA } from '../../data/angolaGeografia';
import { 
  Network, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUpDown, 
  User, 
  Briefcase, 
  Building2, 
  Printer, 
  Download,
  Image as ImageIcon
} from 'lucide-react';

export const ModuloOrganograma: React.FC = () => {
  const { membrosOrganograma, usuarioAtual } = useApp();

  const [busca, setBusca] = useState('');
  const [criterioOrdenacao, setCriterioOrdenacao] = useState<'funcao' | 'nome' | 'cargo' | 'municipio' | 'foto'>('funcao');
  const [filtroProvincia, setFiltroProvincia] = useState<string>('Todas');
  const [modoVisualizacao, setModoVisualizacao] = useState<'grade' | 'hierarquia'>('grade');

  // Filtragem e Ordenação
  const listaProcessada = membrosOrganograma
    .filter(m => {
      const matchBusca = m.nome.toLowerCase().includes(busca.toLowerCase()) ||
                         m.cargo.toLowerCase().includes(busca.toLowerCase()) ||
                         m.municipio.toLowerCase().includes(busca.toLowerCase()) ||
                         m.provincia.toLowerCase().includes(busca.toLowerCase());
      const matchProv = filtroProvincia === 'Todas' || m.provincia === filtroProvincia;
      return matchBusca && matchProv;
    })
    .sort((a, b) => {
      if (criterioOrdenacao === 'nome') {
        return a.nome.localeCompare(b.nome);
      }
      if (criterioOrdenacao === 'cargo') {
        return a.cargo.localeCompare(b.cargo);
      }
      if (criterioOrdenacao === 'municipio') {
        return a.municipio.localeCompare(b.municipio);
      }
      if (criterioOrdenacao === 'funcao') {
        return a.funcao.localeCompare(b.funcao);
      }
      // Se ordenado por foto, membros com foto vêm primeiro
      return (b.fotoUrl ? 1 : 0) - (a.fotoUrl ? 1 : 0);
    });

  // Agrupamento por Função para a Vista Hierárquica
  const funcoesUnicas = Array.from(new Set(membrosOrganograma.map(m => m.funcao)));

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Estrutura de Direcção</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Quadro Directivo Nacional & Local</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            ORGANOGRAMA INSTITUCIONAL DO SINPROF
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organização hierárquica dos dirigentes sindicais por função, nome, cargo, fotografia, província e município.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Organograma Oficial</span>
        </button>
      </div>

      {/* BARRA DE BOTÕES DE ORGANIZAÇÃO (REQUISITO EXPLÍCITO) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Pesquisar por nome, cargo, função ou município..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full text-xs font-medium bg-transparent focus:outline-none text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Filtrar Província:</span>
            <select
              value={filtroProvincia}
              onChange={(e) => setFiltroProvincia(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
            >
              <option value="Todas">Todas as Províncias</option>
              {PROVINCIAS_ANGOLA.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* BOTÕES PARA ORGANIZAR O ORGANOGRAMA */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5 mr-1">
            <ArrowUpDown className="w-4 h-4 text-sky-600" />
            Organizar Organograma Por:
          </span>

          <button
            type="button"
            onClick={() => setCriterioOrdenacao('funcao')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              criterioOrdenacao === 'funcao'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Por Função
          </button>

          <button
            type="button"
            onClick={() => setCriterioOrdenacao('nome')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              criterioOrdenacao === 'nome'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Por Nome
          </button>

          <button
            type="button"
            onClick={() => setCriterioOrdenacao('cargo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              criterioOrdenacao === 'cargo'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Por Cargo
          </button>

          <button
            type="button"
            onClick={() => setCriterioOrdenacao('foto')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              criterioOrdenacao === 'foto'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Por Foto</span>
          </button>

          <button
            type="button"
            onClick={() => setCriterioOrdenacao('municipio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              criterioOrdenacao === 'municipio'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Por Município</span>
          </button>
        </div>
      </div>

      {/* EXIBIÇÃO DOS DIRIGENTES EM CARTÕES COM FOTO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listaProcessada.map((membro) => (
          <div
            key={membro.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Foto, Nome e Cargo */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={membro.fotoUrl}
                    alt={membro.nome}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-sky-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    {membro.funcao}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-1 truncate">
                    {membro.nome}
                  </h3>
                  <p className="text-xs font-bold text-amber-600 truncate">
                    {membro.cargo}
                  </p>
                </div>
              </div>

              {/* Informações detalhadas */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Município & Província:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-600" />
                    {membro.municipio}, {membro.provincia}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Habilitação:</span>
                  <span className="font-semibold text-slate-800">{membro.grauAcademico}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Tempo de Função:</span>
                  <span className="font-semibold text-slate-800">{membro.tempoNoCargo}</span>
                </div>
              </div>
            </div>

            {/* Rodapé com Contactos */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-mono font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-sky-600" />
                {membro.telefone}
              </span>
              <a
                href={`mailto:${membro.email}`}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contactar</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
