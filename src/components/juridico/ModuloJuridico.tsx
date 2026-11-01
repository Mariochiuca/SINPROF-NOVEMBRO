import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProcessoJuridico, ProvinciaAngola } from '../../types';
import { PROVINCIAS_ANGOLA, MUNICIPIOS_POR_PROVINCIA } from '../../data/angolaGeografia';
import { 
  Scale, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Send,
  MessageSquare,
  ShieldAlert,
  X
} from 'lucide-react';

export const ModuloJuridico: React.FC = () => {
  const { processos, adicionarProcesso, adicionarDespacho, usuarioAtual, exibirToast } = useApp();

  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [processoDetalhe, setProcessoDetalhe] = useState<ProcessoJuridico | null>(null);
  const [novoDespachoTexto, setNovoDespachoTexto] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    autorNome: '',
    provincia: 'Uíge' as ProvinciaAngola,
    municipio: 'Negage',
    tipo: 'Atraso Salarial' as ProcessoJuridico['tipo'],
    descricao: '',
    advogadoResponsavel: 'Drª. Eunice Muanza',
    prioridade: 'Urgente' as ProcessoJuridico['prioridade'],
    estado: 'Submetido' as ProcessoJuridico['estado']
  });

  const handleSalvarProcesso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.autorNome.trim()) {
      exibirToast('Preencha o título do processo e o autor.', 'alerta');
      return;
    }

    adicionarProcesso({
      titulo: formData.titulo,
      autorNome: formData.autorNome,
      provincia: formData.provincia,
      municipio: formData.municipio,
      tipo: formData.tipo,
      descricao: formData.descricao,
      advogadoResponsavel: formData.advogadoResponsavel,
      prioridade: formData.prioridade,
      estado: formData.estado
    });

    setModalNovoAberto(false);
    setFormData({
      titulo: '',
      autorNome: '',
      provincia: 'Uíge',
      municipio: 'Negage',
      tipo: 'Atraso Salarial',
      descricao: '',
      advogadoResponsavel: 'Drª. Eunice Muanza',
      prioridade: 'Alta',
      estado: 'Submetido'
    });
  };

  const handleAdicionarDespacho = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoDespachoTexto.trim() || !processoDetalhe) return;

    adicionarDespacho(processoDetalhe.id, novoDespachoTexto);
    // Atualizar no estado local do modal
    setProcessoDetalhe(prev => prev ? {
      ...prev,
      historicoDespachos: [
        ...prev.historicoDespachos,
        {
          data: new Date().toISOString().split('T')[0],
          despacho: novoDespachoTexto,
          responsavel: usuarioAtual.nome
        }
      ]
    } : null);

    setNovoDespachoTexto('');
  };

  const listaFiltrada = processos.filter(p => {
    const matchBusca = p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                       p.numeroProcesso.toLowerCase().includes(busca.toLowerCase()) ||
                       p.autorNome.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = filtroTipo === 'Todos' || p.tipo === filtroTipo;
    return matchBusca && matchTipo;
  });

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Defesa da Classe Docente</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Gabinete Jurídico & Contencioso</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            PROCESSOS JURÍDICOS & RECLAMAÇÕES
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhamento processual de reclamações salariais, reclassificação de categorias, assédio laboral e recursos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalNovoAberto(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Instaurar Novo Processo</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar por processo, autor ou assunto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full text-xs font-medium bg-transparent focus:outline-none text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Tipo:</span>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-sky-500"
          >
            <option value="Todos">Todos os Tipos</option>
            <option value="Atraso Salarial">Atraso Salarial</option>
            <option value="Enquadramento na Carreira">Enquadramento na Carreira</option>
            <option value="Subsídio de Isolamento">Subsídio de Isolamento</option>
            <option value="Transferência Arbitrária">Transferência Arbitrária</option>
            <option value="Processo Disciplinar">Processo Disciplinar</option>
          </select>
        </div>
      </div>

      {/* Lista de Processos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listaFiltrada.map((proc) => (
          <div 
            key={proc.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  {proc.numeroProcesso}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  proc.prioridade === 'Urgente'
                    ? 'bg-red-100 text-red-700 animate-pulse'
                    : proc.prioridade === 'Alta'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {proc.prioridade}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">
                {proc.titulo}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                {proc.descricao}
              </p>

              <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                <p className="text-[10px] uppercase font-bold text-slate-400">Autor / Reclamante</p>
                <p className="font-semibold text-slate-800">{proc.autorNome}</p>
                <p className="text-[11px] text-sky-600 font-medium">
                  {proc.provincia} ({proc.municipio})
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                proc.estado.startsWith('Concluído')
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {proc.estado}
              </span>

              <button
                type="button"
                onClick={() => setProcessoDetalhe(proc)}
                className="px-3 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold transition-colors"
              >
                Ver Despachos ({proc.historicoDespachos.length}) &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETALHE DO PROCESSO & DESPACHOS */}
      {processoDetalhe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-700">
                  {processoDetalhe.numeroProcesso}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  Dossiê Jurídico & Despachos
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setProcessoDetalhe(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900">{processoDetalhe.titulo}</h4>
                <p className="text-xs text-slate-600 mt-1">{processoDetalhe.descricao}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                  <span>Advogada: {processoDetalhe.advogadoResponsavel}</span>
                  <span>Aberto em: {processoDetalhe.dataAbertura}</span>
                </div>
              </div>

              {/* Linha do Tempo dos Despachos */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Histórico de Despachos & Diligências ({processoDetalhe.historicoDespachos.length})
                </h4>

                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {processoDetalhe.historicoDespachos.map((desp, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-slate-700">{desp.responsavel}</span>
                        <span>{desp.data}</span>
                      </div>
                      <p className="text-slate-800 font-medium leading-relaxed">{desp.despacho}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adicionar Novo Despacho */}
              <form onSubmit={handleAdicionarDespacho} className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Inserir Novo Despacho / Andamento:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ex: Audiência concluída; aguardando homologação do acordo..."
                    value={novoDespachoTexto}
                    onChange={(e) => setNovoDespachoTexto(e.target.value)}
                    className="flex-1 text-xs p-2 rounded-lg border border-slate-300 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold"
                  >
                    Registar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO PROCESSO */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Instaurar Novo Processo Jurídico</h3>
              <button
                type="button"
                onClick={() => setModalNovoAberto(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarProcesso} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Processo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Reclamação de Atraso Salarial Coletivo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Autor / Coletivo de Professores *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do professor ou comissão de docentes"
                  value={formData.autorNome}
                  onChange={(e) => setFormData({ ...formData, autorNome: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Província *</label>
                  <select
                    value={formData.provincia}
                    onChange={(e) => {
                      const p = e.target.value as ProvinciaAngola;
                      setFormData({ ...formData, provincia: p, municipio: (MUNICIPIOS_POR_PROVINCIA[p] || [])[0] || 'Sede' });
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-bold bg-white"
                  >
                    {PROVINCIAS_ANGOLA.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Matéria</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium bg-white"
                  >
                    <option value="Atraso Salarial">Atraso Salarial</option>
                    <option value="Enquadramento na Carreira">Enquadramento na Carreira</option>
                    <option value="Subsídio de Isolamento">Subsídio de Isolamento</option>
                    <option value="Transferência Arbitrária">Transferência Arbitrária</option>
                    <option value="Processo Disciplinar">Processo Disciplinar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição e Fatos Reivindicados</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva detalhadamente a violação laboral ou reivindicação sindical"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                />
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
                  className="px-5 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm"
                >
                  Instaurar Processo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
