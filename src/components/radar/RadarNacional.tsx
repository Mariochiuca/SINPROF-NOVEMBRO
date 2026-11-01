import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProvinciaAngola } from '../../types';
import { 
  PROVINCIAS_ANGOLA, 
  MUNICIPIOS_POR_PROVINCIA, 
  DADOS_RADAR_PROVINCIAS, 
  DadosProvinciaRadar 
} from '../../data/angolaGeografia';
import { 
  MapPin, 
  Users, 
  School, 
  AlertTriangle, 
  Scale, 
  Building2, 
  CheckCircle2, 
  Search, 
  Eye, 
  FileText, 
  Filter,
  Phone,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

export const RadarNacional: React.FC = () => {
  const { usuarioAtual, navegarPara, exibirToast, navegacaoParams } = useApp();

  const [provinciaSelecionada, setProvinciaSelecionada] = useState<ProvinciaAngola>(() => {
    if (navegacaoParams?.provincia && PROVINCIAS_ANGOLA.includes(navegacaoParams.provincia)) {
      return navegacaoParams.provincia;
    }
    return 'Luanda';
  });

  React.useEffect(() => {
    if (navegacaoParams?.provincia && PROVINCIAS_ANGOLA.includes(navegacaoParams.provincia)) {
      setProvinciaSelecionada(navegacaoParams.provincia);
    }
  }, [navegacaoParams]);
  const [municipioFiltro, setMunicipioFiltro] = useState<string>('Todos');
  const [filtroStatus, setFiltroStatus] = useState<'Todos' | 'Normal' | 'Atenção' | 'Crítico'>('Todos');
  const [buscaProvincia, setBuscaProvincia] = useState<string>('');
  const [modoVisualizacao, setModoVisualizacao] = useState<'mapa' | 'tabela'>('mapa');
  const [zoomNivel, setZoomNivel] = useState(1);

  const dadosProvincia: DadosProvinciaRadar = DADOS_RADAR_PROVINCIAS[provinciaSelecionada];
  const municipiosDaProvincia = MUNICIPIOS_POR_PROVINCIA[provinciaSelecionada] || [];

  const totalAssociadosNacional = Object.values(DADOS_RADAR_PROVINCIAS).reduce((acc, curr) => acc + curr.professoresAssociados, 0);
  const totalEscolasNacional = Object.values(DADOS_RADAR_PROVINCIAS).reduce((acc, curr) => acc + curr.instituicoesEnsino, 0);
  const totalReclamacoesNacional = Object.values(DADOS_RADAR_PROVINCIAS).reduce((acc, curr) => acc + curr.reclamacoesRegistadas, 0);
  const totalProcessosNacional = Object.values(DADOS_RADAR_PROVINCIAS).reduce((acc, curr) => acc + curr.processosPendentes, 0);
  const provinciasCriticas = Object.values(DADOS_RADAR_PROVINCIAS).filter(p => p.statusAlerta === 'Crítico');

  const listaFiltrada = PROVINCIAS_ANGOLA.filter(p => {
    const dados = DADOS_RADAR_PROVINCIAS[p];
    const matchBusca = p.toLowerCase().includes(buscaProvincia.toLowerCase()) || dados.capital.toLowerCase().includes(buscaProvincia.toLowerCase());
    const matchStatus = filtroStatus === 'Todos' || dados.statusAlerta === filtroStatus;
    return matchBusca && matchStatus;
  });

  const handleImprimirRelatorioSituacao = () => {
    exibirToast(`A gerar Relatório de Situação da Província de ${provinciaSelecionada}...`, 'info');
    setTimeout(() => {
      window.print();
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-sky-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <MapPin className="w-80 h-80 text-amber-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Inovação Geográfica
              </span>
              <span className="text-sky-300 text-xs font-semibold">
                Divisão Político-Administrativa Oficial de Angola (21 Províncias)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Space_Grotesk']">
              RADAR NACIONAL DE PROFESSORES
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Mapeamento de alta precisão territorial para acompanhamento integral de associados, instituições escolares,
              reclamações salariais e intervenções sindicais em toda a República de Angola.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleImprimirRelatorioSituacao}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Dossiê</span>
            </button>
            <button
              type="button"
              onClick={() => navegarPara('escolas')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-md transition-colors"
            >
              <School className="w-4 h-4" />
              <span>Ver Censo de Escolas &rarr;</span>
            </button>
          </div>
        </div>

        {/* Métricas Nacionais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-sky-800/60">
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3.5 border border-white/10">
            <p className="text-[11px] text-sky-200 font-medium">Professores Filiados no País</p>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {totalAssociadosNacional.toLocaleString('pt-AO')}
            </p>
            <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">68.4% de cobertura</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3.5 border border-white/10">
            <p className="text-[11px] text-sky-200 font-medium">Escolas Representadas</p>
            <p className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
              {totalEscolasNacional.toLocaleString('pt-AO')}
            </p>
            <p className="text-[10px] text-slate-300 font-medium mt-0.5">Iº, IIº Ciclos e Magistérios</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3.5 border border-white/10">
            <p className="text-[11px] text-sky-200 font-medium">Reclamações Registadas</p>
            <p className="text-xl sm:text-2xl font-black text-red-300 mt-0.5">
              {totalReclamacoesNacional.toLocaleString('pt-AO')}
            </p>
            <p className="text-[10px] text-red-400 font-medium mt-0.5">Atrasos & Carreira</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3.5 border border-white/10">
            <p className="text-[11px] text-sky-200 font-medium">Processos Jurídicos</p>
            <p className="text-xl sm:text-2xl font-black text-sky-300 mt-0.5">
              {totalProcessosNacional.toLocaleString('pt-AO')}
            </p>
            <p className="text-[10px] text-sky-300 font-medium mt-0.5">No Contencioso</p>
          </div>
        </div>
      </div>

      {/* Alerta de Províncias em Tensão Crítica */}
      {provinciasCriticas.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 rounded-xl text-red-600 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-900 uppercase tracking-wide">
                Intervenção Sindical Imediata Recomendada
              </h4>
              <p className="text-xs text-red-700">
                {provinciasCriticas.length} províncias com alto volume de cortes salariais: {' '}
                <span className="font-bold">{provinciasCriticas.map(p => p.provincia).join(', ')}</span>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {provinciasCriticas.map(p => (
              <button
                key={p.provincia}
                type="button"
                onClick={() => setProvinciaSelecionada(p.provincia)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Inspecionar {p.provincia}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Barra de Filtros e Alternador */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar por província ou cidade capital..."
            value={buscaProvincia}
            onChange={(e) => setBuscaProvincia(e.target.value)}
            className="w-full text-xs font-semibold bg-transparent focus:outline-none text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['Todos', 'Normal', 'Atenção', 'Crítico'] as const).map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setFiltroStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  filtroStatus === status
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setModoVisualizacao('mapa')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                modoVisualizacao === 'mapa' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
              }`}
            >
              Mapa & Dossiê
            </button>
            <button
              type="button"
              onClick={() => setModoVisualizacao('tabela')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                modoVisualizacao === 'tabela' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
              }`}
            >
              Tabela das 21 Províncias
            </button>
          </div>
        </div>
      </div>

      {modoVisualizacao === 'mapa' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* MAPA DE ANGOLA DETALHADO E BEM REPRESENTADO (7 COLUNAS) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Cartografia Vetorial Representativa de Angola
                </h3>
                <p className="text-xs text-slate-500">
                  Polígonos provinciais com mapa de calor sindical em tempo real
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomNivel(prev => Math.min(prev + 0.2, 1.6))}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                  title="Aumentar zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomNivel(prev => Math.max(prev - 0.2, 0.8))}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                  title="Diminuir zoom"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SVG DETALHADO COM AS 21 PROVÍNCIAS DE ANGOLA */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-sky-50/50 to-slate-50 rounded-2xl border border-slate-100 p-2 overflow-hidden flex items-center justify-center">
              <svg 
                viewBox="100 20 460 510" 
                className="w-full h-full select-none transition-transform duration-300"
                style={{ transform: `scale(${zoomNivel})` }}
              >
                {/* Costa do Oceano Atlântico */}
                <path
                  d="M 115 30 Q 120 100 140 180 T 150 280 T 140 380 T 125 480"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="6"
                  strokeOpacity="0.3"
                />

                {/* Polígonos de cada Província */}
                {PROVINCIAS_ANGOLA.map((prov) => {
                  const d = DADOS_RADAR_PROVINCIAS[prov];
                  const isSelecionada = provinciaSelecionada === prov;

                  let fillColor = '#ecfdf5'; // Normal (Emerald)
                  let strokeColor = '#10b981';
                  if (d.statusAlerta === 'Atenção') {
                    fillColor = '#fffbeb'; // Amber
                    strokeColor = '#f59e0b';
                  }
                  if (d.statusAlerta === 'Crítico') {
                    fillColor = '#fef2f2'; // Red
                    strokeColor = '#ef4444';
                  }

                  if (isSelecionada) {
                    fillColor = '#0284c7'; // Active Sky Blue
                    strokeColor = '#0369a1';
                  }

                  return (
                    <g 
                      key={prov} 
                      onClick={() => setProvinciaSelecionada(prov)}
                      className="cursor-pointer transition-all duration-200 group"
                    >
                      {/* O Polígono Regional da Província */}
                      <path
                        d={d.svgPolygon}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isSelecionada ? "3" : "1.5"}
                        className="transition-colors hover:fill-sky-200"
                      />

                      {/* Ponto indicador de capital */}
                      <circle
                        cx={d.coordenadasSvg.x}
                        cy={d.coordenadasSvg.y}
                        r={isSelecionada ? 5 : 3.5}
                        fill={isSelecionada ? '#facc15' : strokeColor}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />

                      {/* Rótulo com o Nome da Província */}
                      <text
                        x={d.coordenadasSvg.x}
                        y={d.coordenadasSvg.y + (isSelecionada ? 14 : 11)}
                        textAnchor="middle"
                        fontSize={isSelecionada ? "10" : "8"}
                        fontWeight={isSelecionada ? "900" : "700"}
                        fill={isSelecionada ? "#ffffff" : "#0f172a"}
                        className="select-none pointer-events-none drop-shadow-xs"
                      >
                        {prov}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legenda Flutuante */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg text-xs">
                <p className="text-[10px] uppercase font-bold text-slate-400">Província Selecionada:</p>
                <p className="font-black text-sky-700 text-sm">{dadosProvincia.provincia}</p>
                <p className="text-[11px] text-slate-500 font-medium">Sede: {dadosProvincia.capital}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    dadosProvincia.statusAlerta === 'Crítico' ? 'bg-red-500' : dadosProvincia.statusAlerta === 'Atenção' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span className="text-[10px] font-bold text-slate-700">Estado: {dadosProvincia.statusAlerta}</span>
                </div>
              </div>
            </div>

            {/* Carrossel de Acesso Direto às 21 Províncias */}
            <div className="mt-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Acesso Rápido por Província ({listaFiltrada.length}):
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                {listaFiltrada.map(prov => {
                  const d = DADOS_RADAR_PROVINCIAS[prov];
                  const ativo = provinciaSelecionada === prov;
                  return (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setProvinciaSelecionada(prov)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                        ativo
                          ? 'bg-sky-600 text-white shadow-xs font-bold'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        d.statusAlerta === 'Crítico' ? 'bg-red-500' : d.statusAlerta === 'Atenção' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <span>{prov}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DOSSIÊ DETALHADO DA PROVÍNCIA (5 COLUNAS) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Província</span>
                  <h2 className="text-2xl font-black text-slate-900 font-['Space_Grotesk'] mt-0.5">
                    {dadosProvincia.provincia}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Capital: {dadosProvincia.capital}</p>
                </div>

                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                  dadosProvincia.statusAlerta === 'Crítico'
                    ? 'bg-red-100 text-red-700'
                    : dadosProvincia.statusAlerta === 'Atenção'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {dadosProvincia.statusAlerta}
                </span>
              </div>

              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                {dadosProvincia.descricaoSituacao}
              </div>

              {/* 4 Indicadores Chave */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100">
                  <span className="text-[11px] font-bold text-sky-800">Professores</span>
                  <p className="text-xl font-black text-sky-950 mt-1">
                    {dadosProvincia.professoresAssociados.toLocaleString('pt-AO')}
                  </p>
                  <p className="text-[10px] text-sky-700">membros filiados</p>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100">
                  <span className="text-[11px] font-bold text-amber-800">Escolas</span>
                  <p className="text-xl font-black text-amber-950 mt-1">
                    {dadosProvincia.instituicoesEnsino}
                  </p>
                  <p className="text-[10px] text-amber-700">com delegações</p>
                </div>

                <div className="p-3 bg-red-50/70 rounded-xl border border-red-100">
                  <span className="text-[11px] font-bold text-red-800">Reclamações</span>
                  <p className="text-xl font-black text-red-950 mt-1">
                    {dadosProvincia.reclamacoesRegistadas}
                  </p>
                  <p className="text-[10px] text-red-700">atrasos & cortes</p>
                </div>

                <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100">
                  <span className="text-[11px] font-bold text-purple-800">Processos</span>
                  <p className="text-xl font-black text-purple-950 mt-1">
                    {dadosProvincia.processosPendentes}
                  </p>
                  <p className="text-[10px] text-purple-700">no contencioso</p>
                </div>
              </div>

              {/* Delegado Provincial */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Delegado Provincial</p>
                  <p className="text-xs font-extrabold text-slate-900">{dadosProvincia.delegadoResponsavel}</p>
                  <p className="text-[11px] text-sky-700 font-semibold">{dadosProvincia.contactoDelegado}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold block">Delegações</span>
                  <span className="text-sm font-black text-slate-900">{dadosProvincia.delegacoesExistentes} sedes</span>
                </div>
              </div>

            </div>

            {/* Necessidades Identificadas na Região */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Necessidades Identificadas na Região
              </h3>

              <div className="space-y-2">
                {dadosProvincia.necessidadesIdentificadas.map((nec, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-950 font-medium"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{nec}</span>
                  </div>
                ))}
              </div>

              {/* Filtro por Município */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase">
                  Acompanhar por Município ({municipiosDaProvincia.length} municípios):
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={municipioFiltro}
                    onChange={(e) => setMunicipioFiltro(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  >
                    <option value="Todos">Todos os Municípios de {dadosProvincia.provincia}</option>
                    {municipiosDaProvincia.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      navegarPara('associados', { provincia: dadosProvincia.provincia, municipio: municipioFiltro !== 'Todos' ? municipioFiltro : undefined });
                    }}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                  >
                    Filtrar &rarr;
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* VISTA TABELA DAS 21 PROVÍNCIAS */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Quadro Geral Consolidado das 21 Províncias de Angola
            </h3>
            <span className="text-xs text-slate-500">Ordenado por representatividade docente</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Província</th>
                  <th className="px-4 py-3">Capital</th>
                  <th className="px-4 py-3">Professores</th>
                  <th className="px-4 py-3">Escolas</th>
                  <th className="px-4 py-3">Reclamações</th>
                  <th className="px-4 py-3">Processos</th>
                  <th className="px-4 py-3">Delegado Responsável</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {listaFiltrada.map(p => {
                  const d = DADOS_RADAR_PROVINCIAS[p];
                  return (
                    <tr key={p} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-sky-600" />
                        {p}
                      </td>
                      <td className="px-4 py-3">{d.capital}</td>
                      <td className="px-4 py-3 font-bold text-sky-700">
                        {d.professoresAssociados.toLocaleString('pt-AO')}
                      </td>
                      <td className="px-4 py-3">{d.instituicoesEnsino}</td>
                      <td className="px-4 py-3 font-semibold text-red-600">{d.reclamacoesRegistadas}</td>
                      <td className="px-4 py-3">{d.processosPendentes}</td>
                      <td className="px-4 py-3 text-slate-600">{d.delegadoResponsavel}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.statusAlerta === 'Crítico'
                            ? 'bg-red-100 text-red-700'
                            : d.statusAlerta === 'Atenção'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {d.statusAlerta}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setProvinciaSelecionada(p);
                            setModoVisualizacao('mapa');
                          }}
                          className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded font-bold text-[11px]"
                        >
                          Ver no Mapa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
