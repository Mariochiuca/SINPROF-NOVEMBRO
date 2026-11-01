import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReuniaoAssembleia, ProvinciaAngola } from '../../types';
import { PROVINCIAS_ANGOLA } from '../../data/angolaGeografia';
import { 
  CalendarDays, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Search,
  X
} from 'lucide-react';

export const ModuloReunioes: React.FC = () => {
  const { reunioes, adicionarReuniao, usuarioAtual, exibirToast } = useApp();

  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [reuniaoAta, setReuniaoAta] = useState<ReuniaoAssembleia | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'Assembleia Geral' as ReuniaoAssembleia['tipo'],
    data: '2026-11-20',
    horario: '10:00 - 14:00',
    local: 'Sede Provincial do SINPROF',
    provincia: 'Luanda' as ProvinciaAngola,
    pautaTexto: '1. Ponto de situação das quotas\n2. Discussão do Caderno Reivindicativo\n3. Diversos',
    participantesEstimados: 80
  });

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim()) return;

    adicionarReuniao({
      titulo: formData.titulo,
      tipo: formData.tipo,
      data: formData.data,
      horario: formData.horario,
      local: formData.local,
      provincia: formData.provincia,
      pauta: formData.pautaTexto.split('\n').filter(p => p.trim()),
      estado: 'Agendada',
      participantesEstimados: Number(formData.participantesEstimados) || 50
    });

    setModalNovoAberto(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Democracia Sindical</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Órgãos Deliberativos do SINPROF</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            REUNIÕES E ASSEMBLEIAS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Convocatórias de Assembleia Geral, sessões do Conselho Nacional, atas e controlo de presenças.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalNovoAberto(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Convocar Assembleia / Reunião</span>
        </button>
      </div>

      {/* Grade de Reuniões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reunioes.map((reun) => (
          <div 
            key={reun.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
                  {reun.tipo}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  reun.estado === 'Agendada'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {reun.estado}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2">
                {reun.titulo}
              </h3>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-1.5 font-bold text-slate-800">
                  <CalendarDays className="w-3.5 h-3.5 text-sky-600" />
                  {reun.data} · {reun.horario}
                </p>
                <p className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {reun.local} ({reun.provincia})
                </p>
                <p className="flex items-center gap-1.5 text-slate-500">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {reun.participantesEstimados} delegados esperados
                </p>
              </div>

              {/* Ordem de Trabalhos / Pauta */}
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Ordem de Trabalhos (Pauta):</p>
                <ul className="space-y-0.5 text-xs text-slate-700">
                  {reun.pauta.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="truncate">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              {reun.ataPublicada ? (
                <button
                  type="button"
                  onClick={() => setReuniaoAta(reun)}
                  className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Acta Publicada</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 italic">Convocatória em circulação</span>
              )}

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700"
                title="Imprimir Convocatória"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Acta */}
      {reuniaoAta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Acta Oficial da Sessão</h3>
              <button
                type="button"
                onClick={() => setReuniaoAta(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900">{reuniaoAta.titulo}</h4>
              <p className="text-xs text-slate-500">Realizada em {reuniaoAta.data} · {reuniaoAta.local}</p>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-serif">
                {reuniaoAta.ataConteudo || 'A sessão deliberou pela aprovação de todas as medidas sindicais de apoio à classe docente.'}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReuniaoAta(null)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold"
              >
                Imprimir Acta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Reunião */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Convocar Nova Assembleia / Reunião</h3>
              <button
                type="button"
                onClick={() => setModalNovoAberto(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título da Convocatória *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Assembleia Provincial de Professores do Cuanza Sul"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Encontro</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium bg-white"
                  >
                    <option value="Assembleia Geral">Assembleia Geral</option>
                    <option value="Conselho Nacional">Conselho Nacional</option>
                    <option value="Reunião Provincial">Reunião Provincial</option>
                    <option value="Reunião Municipal">Reunião Municipal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Província *</label>
                  <select
                    value={formData.provincia}
                    onChange={(e) => setFormData({ ...formData, provincia: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-bold bg-white"
                  >
                    {PROVINCIAS_ANGOLA.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Horário</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 09:00 - 13:00"
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Local / Auditório</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Auditório do Magistério Primário do Sumbe"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pauta / Ordem de Trabalhos (1 por linha)</label>
                <textarea
                  rows={3}
                  value={formData.pautaTexto}
                  onChange={(e) => setFormData({ ...formData, pautaTexto: e.target.value })}
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
                  className="px-5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm"
                >
                  Publicar Convocatória
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
