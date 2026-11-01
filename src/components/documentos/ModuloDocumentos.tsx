import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentoOficial } from '../../types';
import { 
  FolderOpen, 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle,
  X
} from 'lucide-react';

export const ModuloDocumentos: React.FC = () => {
  const { documentos, adicionarDocumento, exibirToast, usuarioAtual } = useApp();

  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [docVisualizado, setDocVisualizado] = useState<DocumentoOficial | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    categoria: 'Circular' as DocumentoOficial['categoria'],
    numeroReferencia: '',
    descricao: '',
    tamanhoKb: 450,
    autor: usuarioAtual.nome,
    publico: true
  });

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim()) return;

    adicionarDocumento({
      ...formData,
      numeroReferencia: formData.numeroReferencia || `DOC-${Date.now().toString().slice(-5)}`
    });

    setModalNovoAberto(false);
    setFormData({
      titulo: '',
      categoria: 'Circular',
      numeroReferencia: '',
      descricao: '',
      tamanhoKb: 450,
      autor: usuarioAtual.nome,
      publico: true
    });
  };

  const handleDownload = (doc: DocumentoOficial) => {
    // Simula download de arquivo de texto formal
    const conteudo = `REPÚBLICA DE ANGOLA\nSINDICATO NACIONAL DE PROFESSORES (SINPROF)\n\nDOCUMENTO OFICIAL: ${doc.titulo}\nReferência: ${doc.numeroReferencia}\nData: ${doc.dataPublicacao}\nAutor: ${doc.autor}\n\n${doc.descricao}\n\nDocumento autêntico certificado digitalmente pelo SINPROF.`;
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.numeroReferencia.replace(/\//g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    exibirToast(`Download concluído: ${doc.titulo}`, 'sucesso');
  };

  const listaFiltrada = documentos.filter(d => {
    const matchBusca = d.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                       d.numeroReferencia.toLowerCase().includes(busca.toLowerCase());
    const matchCat = filtroCategoria === 'Todas' || d.categoria === filtroCategoria;
    return matchBusca && matchCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Secretaria Geral</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Acervo Oficial do SINPROF</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            DOCUMENTOS & ARQUIVO DIGITAL
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Estatuto orgânico, Caderno Reivindicativo Nacional, acordos bilaterais com o MED, resoluções e circulares.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalNovoAberto(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Documento</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar documento ou número de referência..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full text-xs font-medium bg-transparent focus:outline-none text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Categoria:</span>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-sky-500"
          >
            <option value="Todas">Todas as Categorias</option>
            <option value="Estatuto">Estatutos</option>
            <option value="Resolução">Resoluções & Caderno</option>
            <option value="Acordo MED">Acordos MED</option>
            <option value="Circular">Circulares</option>
          </select>
        </div>
      </div>

      {/* Grade de Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listaFiltrada.map(doc => (
          <div 
            key={doc.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  {doc.numeroReferencia}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {doc.categoria}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">
                {doc.titulo}
              </h3>

              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {doc.descricao}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>{doc.autor}</span>
                <span>{(doc.tamanhoKb / 1024).toFixed(1)} MB</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Publicado em: {doc.dataPublicacao}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDocVisualizado(doc)}
                  className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-lg"
                  title="Visualizar"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Visualização */}
      {docVisualizado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">{docVisualizado.categoria} Oficial</h3>
              </div>
              <button
                type="button"
                onClick={() => setDocVisualizado(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-slate-900">{docVisualizado.titulo}</h2>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <p className="font-semibold text-slate-900 mb-2">Ementa / Síntese do Conteúdo:</p>
                <p>{docVisualizado.descricao}</p>
                <p className="mt-3 text-[11px] text-slate-500">
                  Emitido por: <strong>{docVisualizado.autor}</strong> · Referência: <strong>{docVisualizado.numeroReferencia}</strong>
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDocVisualizado(null)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => handleDownload(docVisualizado)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Descarregar Ficheiro</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Documento */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Registar Documento Oficial</h3>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Documento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Resolução sobre o Caderno Reivindicativo 2026"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium bg-white"
                  >
                    <option value="Estatuto">Estatuto</option>
                    <option value="Resolução">Resolução</option>
                    <option value="Acordo MED">Acordo MED</option>
                    <option value="Circular">Circular</option>
                    <option value="Edital">Edital</option>
                    <option value="Minuta Reclamação">Minuta Reclamação</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Referência</label>
                  <input
                    type="text"
                    placeholder="Ex: CIRC-SG-2026-05"
                    value={formData.numeroReferencia}
                    onChange={(e) => setFormData({ ...formData, numeroReferencia: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição / Ementa</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Breve resumo ou orientações constantes do documento"
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
                  className="px-5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm"
                >
                  Publicar no Acervo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
