import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  CreditCard, 
  Scale, 
  MapPin, 
  BrainCircuit, 
  AlertTriangle, 
  Building2, 
  TrendingUp, 
  CalendarDays, 
  FileText, 
  ShieldCheck, 
  BarChart3, 
  School,
  Maximize2,
  ExternalLink,
  Filter,
  RefreshCw
} from 'lucide-react';
import { PROVINCIAS_ANGOLA } from '../../data/angolaGeografia';

export const PainelPrincipal: React.FC = () => {
  const { 
    usuarioAtual, 
    estatisticasGerais, 
    associados, 
    processos, 
    reunioes, 
    indicadoresIntel,
    navegarPara 
  } = useApp();

  const [abaVisao, setAbaVisao] = useState<'nativa' | 'powerbi'>('nativa');
  const [powerBiUrl, setPowerBiUrl] = useState('');
  const [filtroProvinciaPowerBi, setFiltroProvinciaPowerBi] = useState<string>('Todas');
  const [telaCheia, setTelaCheia] = useState(false);

  const alertasCriticos = indicadoresIntel.filter(i => i.gravidade === 'Critico');
  const proximasReunioes = reunioes.filter(r => r.estado === 'Agendada').slice(0, 2);

  // Cálculos para o Power BI
  const totalSalariosEstimados = associados.reduce((acc, a) => acc + (a.salarioKz || 250000), 0) * 1250;
  const totalQuotasPrevistas = Math.round(totalSalariosEstimados * 0.01);

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Painel de Controlo</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">{new Date().toLocaleDateString('pt-AO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            Bem-vindo(a), {usuarioAtual.nome}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sessão autenticada como <strong className="text-slate-800">{usuarioAtual.cargo}</strong> ({usuarioAtual.perfil}).
          </p>
        </div>

        {/* Alternador de Visualização: Visão Geral vs Power BI */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setAbaVisao('nativa')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              abaVisao === 'nativa'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Visão Geral do Sistema
          </button>
          <button
            type="button"
            onClick={() => setAbaVisao('powerbi')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-black transition-all ${
              abaVisao === 'powerbi'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-slate-950" />
            <span>DASHBOARD POWER BI</span>
          </button>
        </div>
      </div>

      {/* SEÇÃO 1: DASHBOARD POWER BI INTEGRADO */}
      {abaVisao === 'powerbi' ? (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6 ${telaCheia ? 'fixed inset-4 z-50 overflow-y-auto' : ''}`}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 font-['Space_Grotesk']">
                    Microsoft Power BI · SINPROF Executive Analytics
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Live Data Feed
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Relatório analítico de efetivos docentes, arrecadação da quota (1% do salário) e eficácia sindical em Angola
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTelaCheia(!telaCheia)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{telaCheia ? 'Sair de Ecrã Completo' : 'Ecrã Completo'}</span>
              </button>
            </div>
          </div>

          {/* Slicers / Filtros do Power BI */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="font-bold text-slate-700">Filtro Geográfico (Slicer):</span>
              <select
                value={filtroProvinciaPowerBi}
                onChange={(e) => setFiltroProvinciaPowerBi(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800"
              >
                <option value="Todas">Todas as 21 Províncias</option>
                {PROVINCIAS_ANGOLA.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="text-slate-500 text-[11px]">
              Actualizado às {new Date().toLocaleTimeString()} · Modelo Relacional em Estrela (Star Schema)
            </div>
          </div>

          {/* VISUALIZAÇÃO INTERATIVA DO POWER BI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-900 text-white border-l-4 border-amber-400">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Massa Salarial Estimada</p>
              <p className="text-xl font-black text-white mt-1">
                {(totalSalariosEstimados / 1000000000).toFixed(2)}B AOA
              </p>
              <p className="text-[10px] text-amber-400 font-semibold mt-1">Salário médio: 285.000 Kz</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white border-l-4 border-emerald-400">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Quota Sindical Regulamentar (1%)</p>
              <p className="text-xl font-black text-emerald-400 mt-1">
                {(totalQuotasPrevistas / 1000000).toFixed(1)}M AOA / Mês
              </p>
              <p className="text-[10px] text-emerald-300 font-semibold mt-1">1% do salário por lei</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white border-l-4 border-sky-400">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Escolas Representadas</p>
              <p className="text-xl font-black text-sky-400 mt-1">
                3.415 Unidades
              </p>
              <p className="text-[10px] text-sky-200 font-semibold mt-1">162 Municípios</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white border-l-4 border-purple-400">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Índice de Resolubilidade</p>
              <p className="text-xl font-black text-purple-400 mt-1">
                87.4%
              </p>
              <p className="text-[10px] text-purple-200 font-semibold mt-1">Vitórias no contencioso</p>
            </div>

          </div>

          {/* Gráficos do Dashboard Power BI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Gráfico 1: Docentes por Grau de Carreira (1º ao 13º) */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3">
                Distribuição de Docentes por Grau de Carreira (1º ao 13º Grau)
              </h4>

              <div className="space-y-2">
                {[
                  { grau: '13º Grau (Catedráticos)', qtd: 8, perc: 8 },
                  { grau: '11º ao 12º Grau (Mestres & Especialistas)', qtd: 18, perc: 18 },
                  { grau: '9º ao 10º Grau (Licenciados Seniores)', qtd: 32, perc: 32 },
                  { grau: '6º ao 8º Grau (Licenciados & Bacharéis)', qtd: 26, perc: 26 },
                  { grau: '1º ao 5º Grau (Ensino Médio e Início)', qtd: 16, perc: 16 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>{item.grau}</span>
                      <span className="font-mono font-bold text-slate-900">{item.perc}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-600 to-amber-500 rounded-full"
                        style={{ width: `${item.perc}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico 2: Arrecadação de Quotas Mensais (1% do Salário) vs Previsão */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3">
                  Evolução Mensal da Quota (1% SIGFE & Multicaixa)
                </h4>

                <div className="grid grid-cols-6 gap-2 text-center pt-4">
                  {[
                    { mes: 'Mai', real: 41.2, prev: 40.0 },
                    { mes: 'Jun', real: 42.1, prev: 41.0 },
                    { mes: 'Jul', real: 43.5, prev: 42.0 },
                    { mes: 'Ago', real: 44.8, prev: 43.5 },
                    { mes: 'Set', real: 46.2, prev: 45.0 },
                    { mes: 'Out', real: 48.4, prev: 46.5 },
                  ].map((m, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-full bg-slate-200 h-28 rounded-lg flex items-end justify-center p-1">
                        <div
                          className="w-full bg-sky-600 rounded-md transition-all hover:bg-amber-400"
                          style={{ height: `${(m.real / 50) * 100}%` }}
                          title={`Realizado: ${m.real}M AOA`}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 mt-2">{m.mes}</span>
                      <span className="text-[10px] text-emerald-600 font-extrabold">{m.real}M</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Fonte: Ministério das Finanças / SIGFE & Multicaixa</span>
                <span className="font-bold text-emerald-700">Taxa de Liquidação: 98.2%</span>
              </div>
            </div>

          </div>

          {/* Campo de incorporação de URL externa do Power BI */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Conectar Relatório Externo Publicado no Power BI (URL Web de Embed):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://app.powerbi.com/view?r=eyJrIjoi..."
                  value={powerBiUrl}
                  onChange={(e) => setPowerBiUrl(e.target.value)}
                  className="flex-1 text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                />
                {powerBiUrl && (
                  <a
                    href={powerBiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-slate-900 text-amber-400 hover:bg-slate-800 rounded-lg font-bold flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Abrir Link</span>
                  </a>
                )}
              </div>
            </div>

            {powerBiUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-slate-300 bg-white shadow-inner">
                <div className="bg-slate-800 text-amber-400 px-4 py-2 text-[11px] font-bold flex items-center justify-between">
                  <span>Visualização Embutida do Power BI</span>
                  <span className="text-[10px] text-slate-300">Conexão Segura</span>
                </div>
                <iframe
                  src={powerBiUrl}
                  title="Power BI Embedded Dashboard"
                  className="w-full h-[500px] border-none"
                  allowFullScreen
                />
              </div>
            )}
          </div>

        </div>
      ) : (
        /* SEÇÃO 2: VISÃO NATIVA PADRÃO */
        <>
          {/* 4 Cards de Métricas Principais (KPIs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div 
              onClick={() => navegarPara('associados')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Associados Registados</span>
                <div className="p-2 bg-sky-50 text-sky-600 rounded-xl group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2 font-['Space_Grotesk']">
                {estatisticasGerais.totalAssociados.toLocaleString('pt-AO')}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +5.2% este mês
                </span>
                <span className="text-slate-400 font-medium">21 Províncias</span>
              </div>
            </div>

            <div 
              onClick={() => navegarPara('escolas')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Escolas Representadas</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <School className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2 font-['Space_Grotesk']">
                {estatisticasGerais.totalEscolasRepresentadas.toLocaleString('pt-AO')}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Censo de Escolas</span>
                <span className="text-emerald-600 font-bold">100% Cobertura</span>
              </div>
            </div>

            <div 
              onClick={() => navegarPara('juridico')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Processos Jurídicos</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Scale className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2 font-['Space_Grotesk']">
                {processos.length} Ações
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-purple-700 font-semibold">{estatisticasGerais.processosAtivos} em andamento</span>
                <span className="text-slate-400 font-medium">Contencioso</span>
              </div>
            </div>

            <div 
              onClick={() => navegarPara('inteligencia')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alertas de Atenção</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-amber-600 mt-2 font-['Space_Grotesk']">
                {alertasCriticos.length} Críticos
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-red-600 font-bold">Uíge, Cuando, Cubango</span>
                <span className="text-slate-400 font-medium">IA Sindical</span>
              </div>
            </div>

          </div>

          {/* Destaque Central: Radar Nacional e Reuniões */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Situação dos Professores nas 21 Províncias
                      </h3>
                      <p className="text-xs text-slate-500">
                        Radar geo-estratégico de Angola com representação detalhada
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navegarPara('radar')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    Abrir Mapa Completo &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Luanda</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-700 rounded">Atenção</span>
                    </div>
                    <p className="text-lg font-black text-sky-700 mt-1">18.450 profs.</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">342 reclamações / Viana e Cazenga</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Benguela</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded">Normal</span>
                    </div>
                    <p className="text-lg font-black text-sky-700 mt-1">12.640 profs.</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Quadro estável com 280 escolas</p>
                  </div>

                  <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Uíge</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-red-600 text-white rounded">Crítico</span>
                    </div>
                    <p className="text-lg font-black text-red-600 mt-1">7.120 profs.</p>
                    <p className="text-[11px] text-red-700 mt-0.5">Atrasos salariais em Maquela e Negage</p>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-sky-900 to-slate-900 text-white flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                      Censo de Escolas com Associados do SINPROF
                    </p>
                    <p className="text-xs text-slate-200 mt-0.5">
                      Verifique todas as instituições de ensino do país que possuem professores filiados.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navegarPara('escolas')}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold shrink-0 shadow-sm transition-colors"
                  >
                    Ver Escolas &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900">Reuniões & Assembleias</h3>
                </div>
                <button
                  type="button"
                  onClick={() => navegarPara('reunioes')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700"
                >
                  Ver todas
                </button>
              </div>

              <div className="space-y-3">
                {proximasReunioes.map((reun) => (
                  <div key={reun.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-bold text-sky-700">{reun.data} · {reun.horario}</span>
                      <span className="text-[10px] font-semibold bg-slate-200 px-1.5 py-0.2 rounded">{reun.provincia}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{reun.titulo}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{reun.local}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navegarPara('organograma')}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Users className="w-4 h-4 text-sky-600" />
                  <span>Consultar Organograma Institucional</span>
                </button>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
