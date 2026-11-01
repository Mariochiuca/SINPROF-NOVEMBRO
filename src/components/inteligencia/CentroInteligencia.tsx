import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProvinciaAngola } from '../../types';
import { DADOS_RADAR_PROVINCIAS, PROVINCIAS_ANGOLA } from '../../data/angolaGeografia';
import { 
  BrainCircuit, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  Building2, 
  Users, 
  Flame, 
  CheckCircle2, 
  Printer, 
  Copy, 
  Send,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Wallet,
  Clock
} from 'lucide-react';

export const CentroInteligencia: React.FC = () => {
  const { indicadoresIntel, usuarioAtual, navegarPara, exibirToast } = useApp();

  const [provinciaParecer, setProvinciaParecer] = useState<ProvinciaAngola>('Uíge');
  const [tipoParecer, setTipoParecer] = useState<'Intervenção Sindical' | 'Alerta Salarial' | 'Campanha de Filiação' | 'Reestruturação de Delegação'>('Intervenção Sindical');
  const [parecerGerado, setParecerGerado] = useState<boolean>(true);
  const [abaAtiva, setAbaAtiva] = useState<'diagnosticos' | 'previsoes' | 'gerador_pareceres'>('diagnosticos');

  const dadosProvinciaAlvo = DADOS_RADAR_PROVINCIAS[provinciaParecer];

  // Dificuldades consolidadas dos professores
  const dificuldadesProfessores = [
    { tema: 'Atrasos Salariais e Subsídios de Isolamento', percentual: 46, gravidade: 'Crítico', provinciasAfetadas: 'Uíge, Cuando, Cubango, Moxico' },
    { tema: 'Não Reclassificação na Carreira Pedagógica', percentual: 24, gravidade: 'Alto', provinciasAfetadas: 'Luanda, Benguela, Huambo' },
    { tema: 'Condições de Trabalho e Infraestruturas Escolares', percentual: 18, gravidade: 'Médio', provinciasAfetadas: 'Bengo, Cunene, Zaire, Bié' },
    { tema: 'Transferências Arbitrárias e Assédio Laboral', percentual: 12, gravidade: 'Médio', provinciasAfetadas: 'Cuanza Sul, Lunda Norte, Namibe' },
  ];

  // Municípios com baixa densidade sindical identificados pela IA
  const municipiosBaixaDensidade = [
    { provincia: 'Moxico Leste', municipio: 'Alto Zambeze (Cazombo)', associados: 185, potencialEstimado: 890, taxaAdesao: '20.7%' },
    { provincia: 'Cubango', municipio: 'Mavinga', associados: 142, potencialEstimado: 620, taxaAdesao: '22.9%' },
    { provincia: 'Icolo e Bengo', municipio: 'Bela Vista', associados: 98, potencialEstimado: 380, taxaAdesao: '25.7%' },
    { provincia: 'Cuando', municipio: 'Dirico', associados: 110, potencialEstimado: 410, taxaAdesao: '26.8%' },
    { provincia: 'Lunda Sul', municipio: 'Muconda', associados: 160, potencialEstimado: 540, taxaAdesao: '29.6%' },
  ];

  // Delegações com baixa atividade
  const delegacoesBaixaAtividade = [
    { delegacao: 'Delegação Provincial do Cubango', delegado: 'Prof. Bento Tchimbele', diasSemAtividade: 81, motivo: 'Dificuldade de comunicações locais e falta de transporte' },
    { delegacao: 'Delegação Provincial de Moxico Leste', delegado: 'Profª. Beatriz Muene', diasSemAtividade: 64, motivo: 'Processo de instalação da nova sede provincial' },
    { delegacao: 'Delegação Municipal de Mungo (Huambo)', delegado: 'Secretariado Local', diasSemAtividade: 52, motivo: 'Ausência de renovação de mandatos' },
  ];

  const handleCopiarParecer = () => {
    navigator.clipboard.writeText(`PARECER EXECUTIVO DO SINPROF - ${provinciaParecer}\nRecomendação: Intervenção Sindical Imediata.\nEmitido por: ${usuarioAtual.nome}`);
    exibirToast('Parecer executivo copiado para a área de transferência!', 'sucesso');
  };

  const handleImprimirParecer = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Principal do Centro de Inteligência */}
      <div className="bg-slate-950 rounded-2xl p-6 text-white border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <BrainCircuit className="w-80 h-80 text-amber-400" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Módulo de Análise Preditiva & Diagnóstico
                </span>
                <span className="text-slate-400 text-xs">SINPROF Inteligência</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Space_Grotesk']">
                CENTRO DE INTELIGÊNCIA SINDICAL
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl mt-1">
                Motor inteligente que analisa indicadores em tempo real, detecta precocemente tensões salariais,
                identifica lacunas de filiação e gera relatórios executivos de intervenção para a Direcção Nacional.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAbaAtiva('gerador_pareceres')}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Gerar Parecer de Intervenção</span>
              </button>
            </div>
          </div>

          {/* Abas de Navegação Interna */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setAbaAtiva('diagnosticos')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                abaAtiva === 'diagnosticos'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Diagnósticos Críticos ({indicadoresIntel.length})
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('previsoes')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                abaAtiva === 'previsoes'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Previsão de Receitas & Quotas
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('gerador_pareceres')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                abaAtiva === 'gerador_pareceres'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Gerador de Pareceres Executivos
            </button>
          </div>
        </div>
      </div>

      {/* ABA 1: DIAGNÓSTICOS EM TEMPO REAL */}
      {abaAtiva === 'diagnosticos' && (
        <div className="space-y-6">
          
          {/* Alertas Automatizados da IA Sindical */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Situações que Precisam de Atenção Imediata
                </h3>
              </div>
              <span className="text-xs text-slate-500">Actualizado automaticamente pelo sistema</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {indicadoresIntel.map((alerta) => (
                <div 
                  key={alerta.id}
                  className={`p-4 rounded-xl border transition-all ${
                    alerta.gravidade === 'Critico'
                      ? 'bg-red-50/60 border-red-200'
                      : alerta.gravidade === 'Atencao'
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-sky-50/60 border-sky-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      alerta.gravidade === 'Critico'
                        ? 'bg-red-600 text-white'
                        : alerta.gravidade === 'Atencao'
                        ? 'bg-amber-500 text-white'
                        : 'bg-sky-600 text-white'
                    }`}>
                      {alerta.gravidade}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{alerta.dataIdentificacao}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1">{alerta.titulo}</h4>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">{alerta.descricao}</p>

                  <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                    <p className="text-[10px] uppercase font-bold text-sky-800 mb-0.5">
                      Recomendação da Inteligência Sindical:
                    </p>
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {alerta.acaoRecomendada}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/50">
                    <span className="text-[11px] font-bold text-slate-500">
                      Província: <span className="text-slate-900">{alerta.provincia}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setProvinciaParecer(alerta.provincia);
                        setAbaAtiva('gerador_pareceres');
                      }}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                    >
                      Gerar Parecer &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grelha de Diagnósticos Específicos Requisitados */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. ANÁLISE DAS PRINCIPAIS DIFICULDADES DOS PROFESSORES */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Principais Dificuldades dos Professores
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Distribuição temática das queixas recebidas pelo SINPROF em âmbito nacional.
                </p>

                <div className="space-y-3">
                  {dificuldadesProfessores.map((dif, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{dif.tema}</span>
                        <span className="font-bold text-slate-900">{dif.percentual}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-amber-500' : 'bg-sky-500'
                          }`}
                          style={{ width: `${dif.percentual}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">Províncias mais afetadas: {dif.provinciasAfetadas}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">
                  Fonte: Gabinete Jurídico e Atendimento Sindical
                </span>
              </div>
            </div>

            {/* 2. IDENTIFICAÇÃO DE MUNICÍPIOS COM POUCOS ASSOCIADOS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-sky-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Municípios com Baixa Densidade Sindical
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Regiões prioritárias para campanhas de filiação e expansão da representatividade.
                </p>

                <div className="space-y-2.5">
                  {municipiosBaixaDensidade.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{item.municipio}</p>
                        <p className="text-[11px] text-slate-500">{item.provincia}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-amber-600">{item.taxaAdesao}</p>
                        <p className="text-[10px] text-slate-400">{item.associados} de {item.potencialEstimado} profs.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    navegarPara('comunicacoes');
                    exibirToast('A abrir convocatória de brigada de filiação...', 'info');
                  }}
                  className="w-full py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-bold text-center transition-colors"
                >
                  Confrontar com Plano de Filiação &rarr;
                </button>
              </div>
            </div>

            {/* 3. DELEGAÇÕES COM BAIXA ACTIVIDADE */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Delegações com Baixa Actividade
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Estruturas sem submissão de relatórios ou reuniões há mais de 45 dias.
                </p>

                <div className="space-y-2.5">
                  {delegacoesBaixaAtividade.map((del, idx) => (
                    <div key={idx} className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">{del.delegacao}</p>
                        <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                          {del.diasSemAtividade} dias
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">Responsável: {del.delegado}</p>
                      <p className="text-[10px] text-red-600 mt-0.5 italic">{del.motivo}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navegarPara('delegacoes')}
                  className="w-full py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold text-center transition-colors"
                >
                  Gerir Delegações &rarr;
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ABA 2: PREVISÃO FINANCEIRA DE RECEITAS */}
      {abaAtiva === 'previsoes' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Previsão de Receitas Baseada no Histórico de Quotas
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Modelo preditivo linear com ponderação de adesão docente e retenção SIGFE
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Projeção Anual Consolidada</span>
              <span className="text-xl font-black text-emerald-600">542.400.000 Kz</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold">1º Trimestre (Realizado)</p>
              <p className="text-xl font-black text-slate-900 mt-1">128.500.000 Kz</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Meta atingida em 102%</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold">2º Trimestre (Realizado)</p>
              <p className="text-xl font-black text-slate-900 mt-1">134.200.000 Kz</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Meta atingida em 104%</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold">3º Trimestre (Realizado)</p>
              <p className="text-xl font-black text-slate-900 mt-1">139.800.000 Kz</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Meta atingida em 106%</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-xs text-emerald-800 font-semibold">4º Trimestre (Previsão IA)</p>
              <p className="text-xl font-black text-emerald-700 mt-1">139.900.000 Kz</p>
              <p className="text-[10px] text-emerald-800 font-bold mt-1">▲ Crescimento previsto de 14.5%</p>
            </div>
          </div>

          <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs text-sky-950 leading-relaxed">
              <p className="font-bold text-sky-900 mb-1">Parecer da Auditoria Preditiva:</p>
              A estabilidade do repasse consignado em folha via SIGFE em 16 das 21 províncias garante fluxo de caixa positivo para cobrir despesas operacionais do Caderno Reivindicativo e investimentos na modernização das sedes provinciais do SINPROF.
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: GERADOR DE PARECERES EXECUTIVOS AUTOMÁTICOS */}
      {abaAtiva === 'gerador_pareceres' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Gerador Automático de Relatórios e Pareceres Executivos
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Gere pareceres formais prontos para despacho com base nos dados reais do sindicato
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopiarParecer}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Parecer</span>
              </button>
              <button
                type="button"
                onClick={handleImprimirParecer}
                className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Parecer Oficial</span>
              </button>
            </div>
          </div>

          {/* Configuração do Parecer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Província em Análise:
              </label>
              <select
                value={provinciaParecer}
                onChange={(e) => setProvinciaParecer(e.target.value as ProvinciaAngola)}
                className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-sky-500"
              >
                {PROVINCIAS_ANGOLA.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Finalidade do Documento:
              </label>
              <select
                value={tipoParecer}
                onChange={(e) => setTipoParecer(e.target.value as any)}
                className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-sky-500"
              >
                <option value="Intervenção Sindical">Intervenção Sindical Imediata</option>
                <option value="Alerta Salarial">Alerta Formal de Atraso Salarial</option>
                <option value="Campanha de Filiação">Diretriz de Expansão e Filiação</option>
                <option value="Reestruturação de Delegação">Reestruturação e Apoio à Delegação</option>
              </select>
            </div>
          </div>

          {/* VISUALIZAÇÃO DO DOCUMENTO EM PAPEL TIMBRADO DO SINPROF */}
          <div className="p-8 bg-white border-2 border-slate-200 rounded-xl shadow-md space-y-6 print:border-none print:shadow-none print:p-0">
            
            {/* Cabeçalho Oficial do Parecer */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/aistudio/sim_1e264224.png" 
                  alt="SINPROF" 
                  className="h-12 object-contain"
                />
              </div>
              <div className="text-right">
                <p className="text-xs font-black uppercase text-slate-900 font-['Space_Grotesk']">
                  GABINETE DO PRESIDENTE NACIONAL
                </p>
                <p className="text-[11px] font-bold text-sky-700">CENTRO DE INTELIGÊNCIA SINDICAL</p>
                <p className="text-[10px] text-slate-500">
                  Refª: CIS-SINPROF-AO-{new Date().getFullYear()}/{Math.floor(100 + Math.random() * 900)}
                </p>
              </div>
            </div>

            {/* Título do Parecer */}
            <div className="text-center py-2 bg-slate-50 border-y border-slate-200">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                PARECER EXECUTIVO E RECOMENDAÇÃO DE MEDIDAS SINDICAIS
              </h2>
              <p className="text-xs text-sky-800 font-bold mt-0.5">
                ASSUNTO: {tipoParecer.toUpperCase()} NA PROVÍNCIA DE {provinciaParecer.toUpperCase()}
              </p>
            </div>

            {/* Corpo Fático */}
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed font-serif">
              <p>
                <strong>1. CONTEXTO FÁTICO & INDICADORES:</strong> O Centro de Inteligência Sindical do SINPROF procedeu à análise 
                dos dados consolidados referentes à província de <strong>{provinciaParecer}</strong> (Capital: {dadosProvinciaAlvo.capital}), 
                onde se encontram registados <strong>{dadosProvinciaAlvo.professoresAssociados.toLocaleString('pt-AO')} professores filiados</strong> em 
                <strong> {dadosProvinciaAlvo.instituicoesEnsino} instituições de ensino</strong>.
              </p>

              <p>
                <strong>2. DIAGNÓSTICO DE RISCO:</strong> A região apresenta atualmente um índice de alerta classificado como 
                <span className="font-bold uppercase text-red-600"> {dadosProvinciaAlvo.statusAlerta}</span>, com 
                <strong> {dadosProvinciaAlvo.reclamacoesRegistadas} reclamações sindicais ativas</strong> e 
                <strong> {dadosProvinciaAlvo.processosPendentes} processos contenciosos</strong> em curso.
              </p>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 not-italic font-sans text-xs">
                <p className="font-bold text-slate-900 mb-1">Necessidades prioritárias apuradas:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                  {dadosProvinciaAlvo.necessidadesIdentificadas.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <p>
                <strong>3. RECOMENDAÇÃO OPERACIONAL À DIRECÇÃO NACIONAL:</strong> Face à gravidade e ao risco de paralisação 
                das atividades docentes na província de {provinciaParecer}, recomenda-se:
              </p>

              <ol className="list-decimal list-inside space-y-1 font-sans text-xs bg-amber-50/50 p-3 rounded border border-amber-200">
                <li>
                  Deslocação imediata de uma Delegação Executiva Nacional chefiada por membro do Secretariado Geral para reunião com o Gabinete Provincial de Educação.
                </li>
                <li>
                  Emissão de Notificação Formal de Pré-Aviso com prazo regulamentar de 10 dias úteis para regularização das pendências laborais.
                </li>
                <li>
                  Reforço do apoio jurídico ao Delegado Provincial ({dadosProvinciaAlvo.delegadoResponsavel}) e convocatória extraordinária de assembleia dos professores.
                </li>
              </ol>

              <p className="pt-4 text-slate-600">
                Luanda, {new Date().toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' })}.
              </p>
            </div>

            {/* Assinatura */}
            <div className="pt-8 border-t border-slate-200 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-slate-400">Verificação digital SINPROF-AO</p>
                <p className="text-[10px] text-slate-400 font-mono">HASH: 98AF-4421-SINPROF-INTEL</p>
              </div>

              <div className="text-center">
                <div className="w-48 border-b border-slate-800 mb-1"></div>
                <p className="text-xs font-bold text-slate-900">Dr. Guilherme Silva</p>
                <p className="text-[10px] text-slate-500">Presidente Nacional do SINPROF</p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
