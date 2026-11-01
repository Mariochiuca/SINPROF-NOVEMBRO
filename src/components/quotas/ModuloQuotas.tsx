import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuotaPagamento } from '../../types';
import { PROVINCIAS_ANGOLA } from '../../data/angolaGeografia';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Printer, 
  Filter, 
  FileText,
  DollarSign,
  Download,
  X
} from 'lucide-react';

export const ModuloQuotas: React.FC = () => {
  const { quotas, registarPagamentoQuota, exibirToast, usuarioAtual } = useApp();

  const [busca, setBusca] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Pago' | 'Pendente' | 'Atrasado'>('Todos');
  const [filtroProvincia, setFiltroProvincia] = useState<string>('Todas');
  const [quotaRecibo, setQuotaRecibo] = useState<QuotaPagamento | null>(null);

  const totalQuotasPagas = quotas.filter(q => q.estado === 'Pago').reduce((acc, q) => acc + q.valorKz, 0);
  const totalQuotasPendentes = quotas.filter(q => q.estado !== 'Pago').reduce((acc, q) => acc + q.valorKz, 0);

  const listaFiltrada = quotas.filter(q => {
    const matchBusca = q.associadoNome.toLowerCase().includes(busca.toLowerCase()) ||
                       q.associadoNumero.toLowerCase().includes(busca.toLowerCase());
    const matchEstado = filtroEstado === 'Todos' || q.estado === filtroEstado;
    const matchProv = filtroProvincia === 'Todas' || q.provincia === filtroProvincia;
    return matchBusca && matchEstado && matchProv;
  });

  const handleLiquidar = (quota: QuotaPagamento) => {
    registarPagamentoQuota(quota.id, 'Multicaixa', `MCX-${Date.now().toString().slice(-6)}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Tesouraria Sindical</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Controlo de Quotas dos Membros</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            QUOTAS E PAGAMENTOS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestão mensal de contribuições sindicais regulamentadas (2.500 Kz/mês por associado) e emissão de recibos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-right">
            <p className="text-[10px] uppercase font-bold text-emerald-800">Arrecadado</p>
            <p className="text-sm font-black text-emerald-700">{totalQuotasPagas.toLocaleString('pt-AO')} Kz</p>
          </div>
          <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-right">
            <p className="text-[10px] uppercase font-bold text-amber-800">Em Cobrança</p>
            <p className="text-sm font-black text-amber-700">{totalQuotasPendentes.toLocaleString('pt-AO')} Kz</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar por associado ou número..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full text-xs font-medium bg-transparent focus:outline-none text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            {(['Todos', 'Pago', 'Pendente', 'Atrasado'] as const).map(estado => (
              <button
                key={estado}
                type="button"
                onClick={() => setFiltroEstado(estado)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  filtroEstado === estado
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {estado}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
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
        </div>
      </div>

      {/* Lista de Quotas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Associado / Nº Membro</th>
                <th className="px-4 py-3">Província</th>
                <th className="px-4 py-3">Mês de Referência</th>
                <th className="px-4 py-3">Valor (AOA)</th>
                <th className="px-4 py-3">Método / Comprovativo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {listaFiltrada.map((quota) => (
                <tr key={quota.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-extrabold text-slate-900">{quota.associadoNome}</p>
                    <p className="text-[11px] text-sky-700 font-mono">{quota.associadoNumero}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{quota.provincia}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{quota.mesReferencia}</td>
                  <td className="px-4 py-3 font-black text-slate-900">
                    {quota.valorKz.toLocaleString('pt-AO')} Kz
                  </td>
                  <td className="px-4 py-3">
                    {quota.metodoPagamento ? (
                      <div>
                        <p className="font-semibold text-slate-800">{quota.metodoPagamento}</p>
                        <p className="text-[10px] font-mono text-slate-400">{quota.referenciaComprovativo}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Não liquidado</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      quota.estado === 'Pago'
                        ? 'bg-emerald-100 text-emerald-800'
                        : quota.estado === 'Atrasado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {quota.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {quota.estado === 'Pago' ? (
                        <button
                          type="button"
                          onClick={() => setQuotaRecibo(quota)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-bold text-xs flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Recibo</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleLiquidar(quota)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow-xs"
                        >
                          Liquidar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL RECIBO DE QUOTA OFICIAL SINPROF */}
      {quotaRecibo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Recibo de Quota Sindical Oficial
              </h3>
              <button
                type="button"
                onClick={() => setQuotaRecibo(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4 print:p-0 print:border-none print:bg-transparent">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <img 
                  src="/assets/aistudio/sim_1e264224.png" 
                  alt="SINPROF" 
                  className="h-10 object-contain"
                />
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Recibo Nº</p>
                  <p className="text-xs font-mono font-black text-slate-900">
                    REC-AO-{quotaRecibo.ano}-{quotaRecibo.id.slice(-5)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Membro Associado</p>
                  <p className="font-extrabold text-slate-900 text-sm">{quotaRecibo.associadoNome}</p>
                  <p className="font-mono text-sky-700">{quotaRecibo.associadoNumero}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Mês de Referência</p>
                    <p className="font-bold text-slate-900">{quotaRecibo.mesReferencia}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Província</p>
                    <p className="font-bold text-slate-900">{quotaRecibo.provincia}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Forma de Pagamento</p>
                    <p className="font-bold text-slate-900">{quotaRecibo.metodoPagamento}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Comprovativo</p>
                    <p className="font-mono font-bold text-slate-900">{quotaRecibo.referenciaComprovativo}</p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 mt-3 flex items-center justify-between">
                  <span className="font-bold text-slate-700">Total Liquidado:</span>
                  <span className="text-base font-black text-emerald-700">{quotaRecibo.valorKz.toLocaleString('pt-AO')} Kz</span>
                </div>

                <p className="text-[10px] text-slate-400 text-center pt-2">
                  Autenticado eletronicamente pela Tesouraria Nacional do SINPROF (Angola).
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuotaRecibo(null)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Recibo</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
