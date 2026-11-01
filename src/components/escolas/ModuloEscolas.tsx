import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EscolaComAssociados, ProvinciaAngola } from '../../types';
import { PROVINCIAS_ANGOLA } from '../../data/angolaGeografia';
import { 
  School, 
  Search, 
  Filter, 
  Users, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  FileText, 
  Download, 
  Printer, 
  ChevronRight,
  X,
  Building2
} from 'lucide-react';

export const ModuloEscolas: React.FC = () => {
  const { escolasComAssociados, associados, navegarPara, exibirToast } = useApp();

  const [busca, setBusca] = useState('');
  const [filtroProvincia, setFiltroProvincia] = useState<string>('Todas');
  const [filtroNivel, setFiltroNivel] = useState<string>('Todos');
  const [escolaDetalhes, setEscolaDetalhes] = useState<EscolaComAssociados | null>(null);

  const listaFiltrada = escolasComAssociados.filter(e => {
    const matchBusca = e.nomeEscola.toLowerCase().includes(busca.toLowerCase()) ||
                       e.codigoEscola.toLowerCase().includes(busca.toLowerCase()) ||
                       e.delegadoSindicalEscola.toLowerCase().includes(busca.toLowerCase());
    const matchProv = filtroProvincia === 'Todas' || e.provincia === filtroProvincia;
    const matchNivel = filtroNivel === 'Todos' || e.nivelEnsino === filtroNivel;
    return matchBusca && matchProv && matchNivel;
  });

  const totalAssociadosEscolas = escolasComAssociados.reduce((acc, curr) => acc + curr.totalAssociadosSinprof, 0);

  const handleExportar = () => {
    exibirToast('A exportar Censo de Escolas com Associados do SINPROF...', 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Mapeamento Escolar</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Censo Nacional de Estabelecimentos de Ensino</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            ESCOLAS COM ASSOCIADOS DO SINPROF
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verificação exaustiva de todas as instituições de ensino públicas e comparticipadas com docentes filiados em Angola.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportar}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Censo de Escolas</span>
          </button>
        </div>
      </div>

      {/* 3 Cartões de Resumo do Censo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Escolas com Presença Sindical</span>
            <School className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-['Space_Grotesk']">
            {escolasComAssociados.length} Registadas
          </p>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ 100% com delegado escolar em funções</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Docentes Filiados nas Escolas</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2 font-['Space_Grotesk']">
            {totalAssociadosEscolas} Professores
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Nestas instituições cadastradas</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Taxa Média de Adesão Escolar</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2 font-['Space_Grotesk']">
            83.2%
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Forte representatividade nos corpos docentes</p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar escola, código ou delegado escolar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full text-xs font-medium bg-transparent focus:outline-none text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Província:</span>
            <select
              value={filtroProvincia}
              onChange={(e) => setFiltroProvincia(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="Todas">Todas as 21 Províncias</option>
              {PROVINCIAS_ANGOLA.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Nível:</span>
            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="Todos">Todos os Níveis</option>
              <option value="Ensino Primário">Ensino Primário</option>
              <option value="Iº Ciclo Secundário">Iº Ciclo Secundário</option>
              <option value="IIº Ciclo Liceu">IIº Ciclo Liceu</option>
              <option value="Instituto Técnico">Instituto Técnico</option>
              <option value="Magistério Pedagógico">Magistério Pedagógico</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Escolas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Escolas com Docentes Associados ({listaFiltrada.length})
          </h3>
          <span className="text-xs text-slate-400">Censo do Ministério da Educação & SINPROF</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Instituição de Ensino / Código</th>
                <th className="px-4 py-3">Província & Município</th>
                <th className="px-4 py-3">Nível de Ensino</th>
                <th className="px-4 py-3">Filiados SINPROF / Geral</th>
                <th className="px-4 py-3">Taxa de Filiação</th>
                <th className="px-4 py-3">Delegado Escolar</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {listaFiltrada.map((escola) => (
                <tr key={escola.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <School className="w-3.5 h-3.5 text-sky-600" />
                      {escola.nomeEscola}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">{escola.codigoEscola}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {escola.provincia}
                    </p>
                    <p className="text-[11px] text-slate-500">{escola.municipio}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {escola.nivelEnsino}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-sky-700">
                      {escola.totalAssociadosSinprof} de {escola.totalProfessoresGeral}
                    </p>
                    <p className="text-[10px] text-slate-400">professores da escola</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-700">{escola.taxaFiliacao}</span>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: escola.taxaFiliacao }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{escola.delegadoSindicalEscola}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-sky-600" />
                      {escola.telefoneDelegado}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setEscolaDetalhes(escola)}
                      className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-bold transition-colors"
                    >
                      Ver Docentes ({escola.professoresNomes.length}) &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETALHES DOS PROFESSORES ASSOCIADOS NA ESCOLA */}
      {escolaDetalhes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Corpo Docente Filiado ao SINPROF
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEscolaDetalhes(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-extrabold text-slate-900">{escolaDetalhes.nomeEscola}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {escolaDetalhes.municipio}, Província de {escolaDetalhes.provincia} · {escolaDetalhes.nivelEnsino}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-sky-800">
                  <span>Delegado Sindical da Escola: {escolaDetalhes.delegadoSindicalEscola}</span>
                  <span className="text-emerald-700">{escolaDetalhes.taxaFiliacao} de filiação</span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Professores Associados Registados nesta Instituição:
                </h5>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {escolaDetalhes.professoresNomes.map((profNome, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        {profNome}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Membro Ativo
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEscolaDetalhes(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  navegarPara('associados', { busca: escolaDetalhes.nomeEscola });
                  setEscolaDetalhes(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-xs"
              >
                Abrir no Módulo de Associados &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
