import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DADOS_RADAR_PROVINCIAS, PROVINCIAS_ANGOLA } from '../../data/angolaGeografia';
import { 
  FileBarChart, 
  Printer, 
  Download, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Scale, 
  Wallet,
  Calendar
} from 'lucide-react';

export const ModuloRelatorios: React.FC = () => {
  const { associados, quotas, transacoes, processos, estatisticasGerais, usuarioAtual, exibirToast } = useApp();

  const [tipoRelatorio, setTipoRelatorio] = useState<'geral' | 'financeiro' | 'juridico'>('geral');

  const handleImprimir = () => {
    exibirToast('A preparar relatório oficial para impressão...', 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Direcção Nacional</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Documentação e Prestação de Contas</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            RELATÓRIOS EXECUTIVOS & ESTATÍSTICOS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Relatórios consolidados de filiação docente, arrecadação financeira de quotas e eficácia jurídica do contencioso.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleImprimir}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório Oficial</span>
          </button>
        </div>
      </div>

      {/* Seleção do Tipo de Relatório */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setTipoRelatorio('geral')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            tipoRelatorio === 'geral' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Relatório Geral de Docentes (21 Províncias)</span>
        </button>

        <button
          type="button"
          onClick={() => setTipoRelatorio('financeiro')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            tipoRelatorio === 'financeiro' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Balancete Financeiro & Quotas</span>
        </button>

        <button
          type="button"
          onClick={() => setTipoRelatorio('juridico')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            tipoRelatorio === 'juridico' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Relatório Jurídico & Reclamações</span>
        </button>
      </div>

      {/* ÁREA DE IMPRESSÃO / FOLHA OFICIAL TIMBRADA */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Cabeçalho do Relatório */}
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
              SINDICATO NACIONAL DE PROFESSORES (SINPROF)
            </p>
            <p className="text-[11px] font-bold text-sky-700">REPÚBLICA DE ANGOLA</p>
            <p className="text-[10px] text-slate-500">
              Emitido em: {new Date().toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Título do Relatório Selecionado */}
        <div className="text-center py-2 bg-slate-50 border-y border-slate-200">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
            {tipoRelatorio === 'geral' && 'RELATÓRIO NACIONAL DE EFETIVOS DOCENTES & DELEGAÇÕES'}
            {tipoRelatorio === 'financeiro' && 'BALANCETE GERAL DE TESOURARIA & COBRANÇA DE QUOTAS'}
            {tipoRelatorio === 'juridico' && 'SITUAÇÃO DO CONTENCIOSO & RECLAMAÇÕES SALARIAIS'}
          </h2>
          <p className="text-xs text-sky-800 font-semibold mt-0.5">
            Ano Social e Económico de {new Date().getFullYear()}
          </p>
        </div>

        {/* Conteúdo Específico */}
        {tipoRelatorio === 'geral' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] uppercase font-bold text-slate-500">Total Nacional</p>
                <p className="text-lg font-black text-slate-900">{estatisticasGerais.totalAssociados.toLocaleString('pt-AO')}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] uppercase font-bold text-slate-500">Províncias Cobertas</p>
                <p className="text-lg font-black text-sky-700">21 de 21</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] uppercase font-bold text-slate-500">Taxa de Adesão</p>
                <p className="text-lg font-black text-emerald-700">68.4%</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] uppercase font-bold text-slate-500">Instituições</p>
                <p className="text-lg font-black text-amber-700">3.415 Escolas</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold text-slate-700 text-[10px] uppercase">
                <tr>
                  <th className="p-2 border">Província</th>
                  <th className="p-2 border">Capital</th>
                  <th className="p-2 border">Professores</th>
                  <th className="p-2 border">Escolas</th>
                  <th className="p-2 border">Delegado Responsável</th>
                  <th className="p-2 border">Estado</th>
                </tr>
              </thead>
              <tbody>
                {PROVINCIAS_ANGOLA.map(p => {
                  const d = DADOS_RADAR_PROVINCIAS[p];
                  return (
                    <tr key={p} className="border-b">
                      <td className="p-2 border font-bold text-slate-900">{p}</td>
                      <td className="p-2 border">{d.capital}</td>
                      <td className="p-2 border font-bold text-sky-700">{d.professoresAssociados.toLocaleString('pt-AO')}</td>
                      <td className="p-2 border">{d.instituicoesEnsino}</td>
                      <td className="p-2 border">{d.delegadoResponsavel}</td>
                      <td className="p-2 border font-semibold">{d.statusAlerta}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tipoRelatorio === 'financeiro' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-[10px] uppercase font-bold text-emerald-800">Total Arrecadado</p>
                <p className="text-lg font-black text-emerald-700">+{estatisticasGerais.totalReceitasKz.toLocaleString('pt-AO')} Kz</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-[10px] uppercase font-bold text-red-800">Total Despesas</p>
                <p className="text-lg font-black text-red-600">-{estatisticasGerais.totalDespesasKz.toLocaleString('pt-AO')} Kz</p>
              </div>
              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200">
                <p className="text-[10px] uppercase font-bold text-sky-800">Saldo Líquido</p>
                <p className="text-lg font-black text-sky-700">{estatisticasGerais.saldoCaixaKz.toLocaleString('pt-AO')} Kz</p>
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase text-slate-700">Resumo dos Últimos Lançamentos:</h4>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold text-slate-700 text-[10px] uppercase">
                <tr>
                  <th className="p-2 border">Data</th>
                  <th className="p-2 border">Tipo</th>
                  <th className="p-2 border">Categoria & Descrição</th>
                  <th className="p-2 border">Valor (AOA)</th>
                  <th className="p-2 border">Comprovativo</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map(t => (
                  <tr key={t.id} className="border-b">
                    <td className="p-2 border">{t.data}</td>
                    <td className="p-2 border font-bold">{t.tipo}</td>
                    <td className="p-2 border">{t.descricao}</td>
                    <td className="p-2 border font-bold">{t.valorKz.toLocaleString('pt-AO')} Kz</td>
                    <td className="p-2 border font-mono">{t.numeroComprovativo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tipoRelatorio === 'juridico' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-700">Ações em Curso no Contencioso:</h4>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold text-slate-700 text-[10px] uppercase">
                <tr>
                  <th className="p-2 border">Nº Processo</th>
                  <th className="p-2 border">Assunto / Matéria</th>
                  <th className="p-2 border">Autor</th>
                  <th className="p-2 border">Província</th>
                  <th className="p-2 border">Prioridade</th>
                  <th className="p-2 border">Estado</th>
                </tr>
              </thead>
              <tbody>
                {processos.map(p => (
                  <tr key={p.id} className="border-b">
                    <td className="p-2 border font-mono font-bold text-sky-700">{p.numeroProcesso}</td>
                    <td className="p-2 border font-bold text-slate-900">{p.titulo}</td>
                    <td className="p-2 border">{p.autorNome}</td>
                    <td className="p-2 border">{p.provincia}</td>
                    <td className="p-2 border font-bold">{p.prioridade}</td>
                    <td className="p-2 border">{p.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Assinatura no Rodapé */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs">
          <div>
            <p className="text-[10px] text-slate-400">Certificado pelo Gabinete de Estatística e Informática</p>
            <p className="text-[10px] text-slate-400 font-mono">REGISTO-AO-SINPROF-2026</p>
          </div>

          <div className="text-center">
            <div className="w-48 border-b border-slate-800 mb-1"></div>
            <p className="font-bold text-slate-900">{usuarioAtual.nome}</p>
            <p className="text-[10px] text-slate-500">{usuarioAtual.cargo}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
