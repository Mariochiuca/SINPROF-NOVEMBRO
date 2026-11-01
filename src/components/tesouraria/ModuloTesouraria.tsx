import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransacaoFinanceira } from '../../types';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  DollarSign, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Download, 
  Printer,
  X
} from 'lucide-react';

export const ModuloTesouraria: React.FC = () => {
  const { transacoes, adicionarTransacao, estatisticasGerais, usuarioAtual, exibirToast } = useApp();

  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | 'Receita' | 'Despesa'>('Todos');

  const [formData, setFormData] = useState({
    tipo: 'Receita' as 'Receita' | 'Despesa',
    categoria: 'Quotas Sindicais',
    descricao: '',
    valorKz: '',
    formaPagamento: 'Transferência Bancária' as any,
    numeroComprovativo: ''
  });

  const handleSalvarTransacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valorKz) {
      exibirToast('Preencha a descrição e o valor.', 'alerta');
      return;
    }

    adicionarTransacao({
      tipo: formData.tipo,
      categoria: formData.categoria,
      descricao: formData.descricao,
      valorKz: Number(formData.valorKz),
      data: new Date().toISOString().split('T')[0],
      formaPagamento: formData.formaPagamento,
      numeroComprovativo: formData.numeroComprovativo || `COMP-${Date.now().toString().slice(-6)}`,
      aprovadoPor: usuarioAtual.nome
    });

    setModalNovoAberto(false);
    setFormData({
      tipo: 'Receita',
      categoria: 'Quotas Sindicais',
      descricao: '',
      valorKz: '',
      formaPagamento: 'Transferência Bancária',
      numeroComprovativo: ''
    });
  };

  const listaFiltrada = transacoes.filter(t => filtroTipo === 'Todos' || t.tipo === filtroTipo);

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Gestão Financeira</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Caixa Central & Contas Bancárias</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            TESOURARIA NACIONAL
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Movimentação de receitas de quotas, pagamentos operacionais, apoios judiciais e despesas com delegações.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalNovoAberto(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Lançar Movimento de Caixa</span>
          </button>
        </div>
      </div>

      {/* 3 Cartões de Balanço */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Saldo Disponível em Caixa</span>
            <Wallet className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-['Space_Grotesk']">
            {estatisticasGerais.saldoCaixaKz.toLocaleString('pt-AO')} Kz
          </p>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Contas auditadas e conciliadas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Total de Entradas (Receitas)</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2 font-['Space_Grotesk']">
            +{estatisticasGerais.totalReceitasKz.toLocaleString('pt-AO')} Kz
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Quotas SIGFE e novas inscrições</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Total de Saídas (Despesas)</span>
            <ArrowUpRight className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-black text-red-600 mt-2 font-['Space_Grotesk']">
            -{estatisticasGerais.totalDespesasKz.toLocaleString('pt-AO')} Kz
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Apoio jurídico e logística provincial</p>
        </div>
      </div>

      {/* Extrato Financeiro */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Extrato de Movimentos Financeiros</h3>
            <span className="text-xs text-slate-400">({listaFiltrada.length} registos)</span>
          </div>

          <div className="flex items-center gap-1">
            {(['Todos', 'Receita', 'Despesa'] as const).map(tipo => (
              <button
                key={tipo}
                type="button"
                onClick={() => setFiltroTipo(tipo)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  filtroTipo === tipo
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Tipo / Data</th>
                <th className="px-4 py-3">Descrição da Movimentação</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Valor (AOA)</th>
                <th className="px-4 py-3">Forma / Comprovativo</th>
                <th className="px-4 py-3 text-right">Aprovado Por</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {listaFiltrada.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.tipo === 'Receita' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {t.tipo === 'Receita' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {t.tipo}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t.data}</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 max-w-xs">{t.descricao}</td>
                  <td className="px-4 py-3 font-semibold text-sky-700">{t.categoria}</td>
                  <td className="px-4 py-3 font-black text-sm">
                    <span className={t.tipo === 'Receita' ? 'text-emerald-700' : 'text-red-600'}>
                      {t.tipo === 'Receita' ? '+' : '-'}{t.valorKz.toLocaleString('pt-AO')} Kz
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{t.formaPagamento}</p>
                    <p className="text-[10px] font-mono text-slate-400">{t.numeroComprovativo}</p>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 font-medium">
                    {t.aprovadoPor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lançamento */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Novo Lançamento Financeiro</h3>
              <button
                type="button"
                onClick={() => setModalNovoAberto(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarTransacao} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Movimento</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-bold bg-white"
                  >
                    <option value="Receita">Receita (Entrada)</option>
                    <option value="Despesa">Despesa (Saída)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valor em Kwanzas (AOA) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 500000"
                    value={formData.valorKz}
                    onChange={(e) => setFormData({ ...formData, valorKz: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Categoria Contabilística</label>
                <input
                  type="text"
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  placeholder="Ex: Quotas, Apoio Jurídico, Comunicação, Logística"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição Detalhada *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Histórico da operação, beneficiário ou finalidade sindical"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Forma de Pagamento</label>
                  <select
                    value={formData.formaPagamento}
                    onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium bg-white"
                  >
                    <option value="Transferência Bancária">Transferência Bancária</option>
                    <option value="Multicaixa">Multicaixa</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Caixa Geral">Caixa Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nº Comprovativo</label>
                  <input
                    type="text"
                    value={formData.numeroComprovativo}
                    onChange={(e) => setFormData({ ...formData, numeroComprovativo: e.target.value })}
                    placeholder="Ex: BAI-TRANSF-1029"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
