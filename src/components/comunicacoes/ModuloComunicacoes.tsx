import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Comunicado } from '../../types';
import { 
  Megaphone, 
  Plus, 
  Send, 
  AlertCircle, 
  Printer, 
  FileText, 
  Search, 
  CheckCircle,
  X
} from 'lucide-react';

export const ModuloComunicacoes: React.FC = () => {
  const { comunicados, adicionarComunicado, usuarioAtual, exibirToast } = useApp();

  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [comunicadoLeitura, setComunicadoLeitura] = useState<Comunicado | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    conteudo: '',
    destinatarios: 'Todos os Professores' as Comunicado['destinatarios'],
    importante: true
  });

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.conteudo.trim()) return;

    adicionarComunicado({
      titulo: formData.titulo,
      subtitulo: formData.subtitulo,
      conteudo: formData.conteudo,
      destinatarios: formData.destinatarios,
      importante: formData.importante,
      autor: `${usuarioAtual.nome} (${usuarioAtual.cargo})`
    });

    setModalNovoAberto(false);
    setFormData({
      titulo: '',
      subtitulo: '',
      conteudo: '',
      destinatarios: 'Todos os Professores',
      importante: true
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Gabinete de Imprensa</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Comunicação Oficial aos Docentes</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            COMUNICAÇÕES & INFORMATIVOS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Emissão de comunicados de imprensa, orientações sindicais, avisos e boletins informativos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalNovoAberto(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Emitir Novo Comunicado</span>
        </button>
      </div>

      {/* Lista de Comunicados */}
      <div className="space-y-4">
        {comunicados.map(com => (
          <div 
            key={com.id}
            className={`p-6 rounded-2xl border transition-all ${
              com.importante
                ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                {com.importante && (
                  <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold uppercase rounded">
                    URGENTE
                  </span>
                )}
                <span className="text-xs font-bold text-sky-800">
                  Destinatários: {com.destinatarios}
                </span>
              </div>
              <span className="text-xs text-slate-400">Publicado em: {com.dataPublicacao}</span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 mt-3">{com.titulo}</h3>
            {com.subtitulo && (
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{com.subtitulo}</p>
            )}

            <div className="mt-3 text-xs text-slate-700 leading-relaxed font-serif bg-white/70 p-4 rounded-xl border border-slate-200/60">
              {com.conteudo}
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60">
              <span className="text-[11px] text-slate-500 font-medium">
                Assinado por: <strong>{com.autor}</strong>
              </span>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Comunicado</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo Comunicado */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Redigir Comunicado Oficial</h3>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Comunicado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Posição do SINPROF sobre os Acordos com o MED"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo / Linha de Apoio</label>
                <input
                  type="text"
                  placeholder="Ex: Esclarecimento formal à opinião pública e classe docente"
                  value={formData.subtitulo}
                  onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Público-Alvo</label>
                  <select
                    value={formData.destinatarios}
                    onChange={(e) => setFormData({ ...formData, destinatarios: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium bg-white"
                  >
                    <option value="Todos os Professores">Todos os Professores</option>
                    <option value="Delegados Provinciais">Delegados Provinciais</option>
                    <option value="Delegados Municipais">Delegados Municipais</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.importante}
                      onChange={(e) => setFormData({ ...formData, importante: e.target.checked })}
                      className="rounded text-sky-600"
                    />
                    <span>Classificar como Urgente</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Texto do Comunicado *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Redija o texto oficial do comunicado a ser transmitido..."
                  value={formData.conteudo}
                  onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
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
                  Publicar Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
