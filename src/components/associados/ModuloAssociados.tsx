import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Associado, ProvinciaAngola, HabilitacaoLiteraria, EstadoCivil, GrauCarreiraDocente } from '../../types';
import { 
  PROVINCIAS_ANGOLA, 
  HABILITACOES_LITERARIAS, 
  MUNICIPIOS_POR_PROVINCIA, 
  ESTADOS_CIVIS, 
  GRAUS_CARREIRA 
} from '../../data/angolaGeografia';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  CreditCard, 
  Download, 
  Printer, 
  Trash2, 
  CheckCircle, 
  QrCode, 
  MapPin, 
  GraduationCap, 
  School, 
  X,
  FileCheck2,
  Calendar,
  Briefcase
} from 'lucide-react';

export const ModuloAssociados: React.FC = () => {
  const { associados, adicionarAssociado, removerAssociado, exibirToast, usuarioAtual } = useApp();

  const [busca, setBusca] = useState('');
  const [filtroProvincia, setFiltroProvincia] = useState<string>('Todas');
  const [filtroHabilitacao, setFiltroHabilitacao] = useState<string>('Todas');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [associadoCartao, setAssociadoCartao] = useState<Associado | null>(null);

  // Estado do formulário de novo associado com todos os novos campos requeridos
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    bi: '',
    dataEmissaoBI: '2022-05-10',
    numeroAgente: '', // Em substituição do NIF
    estadoCivil: 'Casado(a)' as EstadoCivil,
    filiacaoPai: '',
    filiacaoMae: '',
    genero: 'M' as 'M' | 'F',
    dataNascimento: '1988-06-15',
    telefone: '+244 923 ',
    email: '',
    provincia: 'Luanda' as ProvinciaAngola,
    municipio: 'Cazenga',
    instituicaoEnsino: '',
    categoriaDocente: 'Professor do Ensino Secundário do 2º Ciclo',
    habilitacao: 'Licenciatura' as HabilitacaoLiteraria,
    disciplinaPrincipal: '',
    anoIngressoMED: 2015,
    grauCarreira: '8º Grau' as GrauCarreiraDocente,
    salarioKz: 280000,
    quotizante: true, // SIM ou NÃO
    tempoServicoAnos: 9,
    observacoes: ''
  });

  // Cálculo em tempo real: Valor da Quota mensal é 1% do salário para todos
  const quotaCalculada1PorCento = Math.round((Number(formData.salarioKz) || 0) * 0.01);

  const handleProvinciaChange = (prov: ProvinciaAngola) => {
    const municList = MUNICIPIOS_POR_PROVINCIA[prov] || [];
    setFormData(prev => ({
      ...prev,
      provincia: prov,
      municipio: municList[0] || 'Sede'
    }));
  };

  const handleSubmitNovo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomeCompleto.trim() || !formData.bi.trim()) {
      exibirToast('Por favor preencha o Nome Completo e o BI.', 'alerta');
      return;
    }

    adicionarAssociado({
      nomeCompleto: formData.nomeCompleto,
      bi: formData.bi,
      dataEmissaoBI: formData.dataEmissaoBI,
      numeroAgente: formData.numeroAgente || `AG-MED-${Math.floor(100000 + Math.random() * 900000)}`,
      estadoCivil: formData.estadoCivil,
      filiacaoPai: formData.filiacaoPai || 'Não Consta',
      filiacaoMae: formData.filiacaoMae || 'Não Consta',
      genero: formData.genero,
      dataNascimento: formData.dataNascimento,
      telefone: formData.telefone,
      email: formData.email || `${formData.nomeCompleto.toLowerCase().replace(/\s+/g, '.')}@escola.ao`,
      provincia: formData.provincia,
      municipio: formData.municipio,
      instituicaoEnsino: formData.instituicaoEnsino || 'Complexo Escolar Provincial',
      categoriaDocente: formData.categoriaDocente,
      habilitacao: formData.habilitacao,
      disciplinaPrincipal: formData.disciplinaPrincipal || 'Educação Geral',
      anoIngressoMED: Number(formData.anoIngressoMED) || 2015,
      grauCarreira: formData.grauCarreira,
      salarioKz: Number(formData.salarioKz) || 200000,
      quotizante: formData.quotizante,
      valorQuotaCalculadoKz: quotaCalculada1PorCento,
      tempoServicoAnos: Number(formData.tempoServicoAnos) || 5,
      estado: 'Activo',
      observacoes: formData.observacoes
    });

    setModalNovoAberto(false);
  };

  // Pesquisa por BI ou Nome (Requisito estrito)
  const listaFiltrada = associados.filter(a => {
    const matchBusca = a.nomeCompleto.toLowerCase().includes(busca.toLowerCase()) || 
                       a.bi.toLowerCase().includes(busca.toLowerCase()) ||
                       a.numeroAgente.toLowerCase().includes(busca.toLowerCase()) ||
                       a.numeroMembro.toLowerCase().includes(busca.toLowerCase());
    const matchProv = filtroProvincia === 'Todas' || a.provincia === filtroProvincia;
    const matchHab = filtroHabilitacao === 'Todas' || a.habilitacao === filtroHabilitacao;
    return matchBusca && matchProv && matchHab;
  });

  const handleExportarCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Numero_Membro;Nome;BI;Data_Emissao_BI;Numero_Agente;Estado_Civil;Filiacao_Pai;Filiacao_Mae;Provincia;Municipio;Escola;Grau_Carreira;Salario_AOA;Quota_1_Porcento;Quotizante\n"
      + listaFiltrada.map(a => `"${a.numeroMembro}";"${a.nomeCompleto}";"${a.bi}";"${a.dataEmissaoBI}";"${a.numeroAgente}";"${a.estadoCivil}";"${a.filiacaoPai}";"${a.filiacaoMae}";"${a.provincia}";"${a.municipio}";"${a.instituicaoEnsino}";"${a.grauCarreira}";"${a.salarioKz}";"${a.valorQuotaCalculadoKz}";"${a.quotizante ? 'SIM' : 'NÃO'}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sinprof_associados_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    exibirToast('Lista de associados exportada com sucesso (CSV).', 'sucesso');
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Gestão de Efetivos</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Registo Oficial de Docentes do MED & SINPROF</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            ASSOCIADOS & PROFESSORES FILIADOS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastro de docentes com Número de Agente, dados de filiação, grau de carreira (1º ao 13º) e quota mensal de 1% do salário.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportarCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setModalNovoAberto(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Inscrever Novo Professor</span>
          </button>
        </div>
      </div>

      {/* BARRA DE PESQUISA POR BI OU NOME E FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-lg bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
          <Search className="w-4 h-4 text-sky-600 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisa rápida por BI ou Nome do Professor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full text-xs font-semibold bg-transparent focus:outline-none text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Província:</span>
            <select
              value={filtroProvincia}
              onChange={(e) => setFiltroProvincia(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
            >
              <option value="Todas">Todas as 21 Províncias</option>
              {PROVINCIAS_ANGOLA.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Habilitação:</span>
            <select
              value={filtroHabilitacao}
              onChange={(e) => setFiltroHabilitacao(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
            >
              <option value="Todas">Todas as Habilitações</option>
              {HABILITACOES_LITERARIAS.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Associados com todos os novos campos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-700">
            Total Encontrado: <span className="text-sky-600 font-extrabold">{listaFiltrada.length} professores filiados</span>
          </p>
          <span className="text-[11px] text-slate-400">Regra Estatutária: Quota de 1% do Salário Base</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Professor / Filiação</th>
                <th className="px-4 py-3">BI & Emissão / Nº Agente</th>
                <th className="px-4 py-3">Província / Município / Escola</th>
                <th className="px-4 py-3">Grau de Carreira / MED</th>
                <th className="px-4 py-3">Salário Base (AOA)</th>
                <th className="px-4 py-3">Quota (1% Salário)</th>
                <th className="px-4 py-3">Quotizante</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {listaFiltrada.map((assoc) => (
                <tr key={assoc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-extrabold text-slate-900">{assoc.nomeCompleto}</p>
                    <p className="text-[10px] text-slate-500">
                      Filho de: {assoc.filiacaoPai} & {assoc.filiacaoMae}
                    </p>
                    <p className="text-[10px] text-sky-700 font-mono">{assoc.numeroMembro}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-slate-900 font-bold">{assoc.bi}</p>
                    <p className="text-[10px] text-slate-400">Emitido: {assoc.dataEmissaoBI}</p>
                    <p className="text-[10px] text-sky-800 font-bold font-mono">Agente: {assoc.numeroAgente}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-600" />
                      {assoc.provincia} ({assoc.municipio})
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{assoc.instituicaoEnsino}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                      {assoc.grauCarreira}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ingresso MED: {assoc.anoIngressoMED}</p>
                    <p className="text-[10px] text-slate-500">{assoc.habilitacao}</p>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    {assoc.salarioKz.toLocaleString('pt-AO')} Kz
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {assoc.valorQuotaCalculadoKz.toLocaleString('pt-AO')} Kz
                    </span>
                    <span className="block text-[9px] text-slate-400 mt-0.5">1% do salário</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      assoc.quotizante ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {assoc.quotizante ? 'SIM' : 'NÃO'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAssociadoCartao(assoc)}
                        className="px-2.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-bold flex items-center gap-1"
                        title="Emitir Cartão de Membro Oficial"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Cartão</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removerAssociado(assoc.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CADASTRO COM TODOS OS CAMPOS SOLICITADOS & DECLARAÇÃO DO ARTIGO 24º */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Ficha Oficial de Inscrição do Professor Associado
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalNovoAberto(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNovo} className="space-y-4 mt-4 text-xs">
              
              {/* 1. DADOS PESSOAIS E FILIAÇÃO */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                  1. Identificação Pessoal, BI & Filiação
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nome Completo do Docente *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Manuel António da Silva"
                      value={formData.nomeCompleto}
                      onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Número de Agente (MED) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: AG-MED-771920"
                      value={formData.numeroAgente}
                      onChange={(e) => setFormData({ ...formData, numeroAgente: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bilhete de Identidade (BI) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 004128931LA042"
                      value={formData.bi}
                      onChange={(e) => setFormData({ ...formData, bi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Data de Emissão do BI *</label>
                    <input
                      type="date"
                      required
                      value={formData.dataEmissaoBI}
                      onChange={(e) => setFormData({ ...formData, dataEmissaoBI: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Estado Civil *</label>
                    <select
                      value={formData.estadoCivil}
                      onChange={(e) => setFormData({ ...formData, estadoCivil: e.target.value as EstadoCivil })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                    >
                      {ESTADOS_CIVIS.map(ec => (
                        <option key={ec} value={ec}>{ec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Filiação: Nome do Pai *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome completo do pai"
                      value={formData.filiacaoPai}
                      onChange={(e) => setFormData({ ...formData, filiacaoPai: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Filiação: Nome da Mãe *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome completo da mãe"
                      value={formData.filiacaoMae}
                      onChange={(e) => setFormData({ ...formData, filiacaoMae: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Género</label>
                    <select
                      value={formData.genero}
                      onChange={(e) => setFormData({ ...formData, genero: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Data de Nascimento</label>
                    <input
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Telefone (Unitel / Africell)</label>
                    <input
                      type="text"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* 2. LOCALIZAÇÃO TERRITORIAL (21 PROVÍNCIAS) */}
              <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-3">
                <p className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                  2. Lotação Territorial (21 Províncias de Angola)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Província *</label>
                    <select
                      value={formData.provincia}
                      onChange={(e) => handleProvinciaChange(e.target.value as ProvinciaAngola)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                    >
                      {PROVINCIAS_ANGOLA.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Município de Lotação *</label>
                    <select
                      value={formData.municipio}
                      onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 bg-white"
                    >
                      {(MUNICIPIOS_POR_PROVINCIA[formData.provincia] || []).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Instituição de Ensino / Escola *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Complexo Escolar nº 2048 - Ngola Kiluanje"
                    value={formData.instituicaoEnsino}
                    onChange={(e) => setFormData({ ...formData, instituicaoEnsino: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                  />
                </div>
              </div>

              {/* 3. DADOS DE CARREIRA, GRAU (1º AO 13º), SALÁRIO E QUOTA (1%) */}
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-3">
                <p className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                  3. Carreira Docente, Grau (1º ao 13º), Salário & Quota (1%)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Grau de Carreira (1º a 13º) *</label>
                    <select
                      value={formData.grauCarreira}
                      onChange={(e) => setFormData({ ...formData, grauCarreira: e.target.value as GrauCarreiraDocente })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-purple-900 bg-white"
                    >
                      {GRAUS_CARREIRA.map(gc => (
                        <option key={gc} value={gc}>{gc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ano de Ingresso ao MED *</label>
                    <input
                      type="number"
                      min="1975"
                      max="2026"
                      required
                      value={formData.anoIngressoMED}
                      onChange={(e) => setFormData({ ...formData, anoIngressoMED: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Habilitações Literárias *</label>
                    <select
                      value={formData.habilitacao}
                      onChange={(e) => setFormData({ ...formData, habilitacao: e.target.value as HabilitacaoLiteraria })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                    >
                      {HABILITACOES_LITERARIAS.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Salário Base Mensal (AOA) *</label>
                    <input
                      type="number"
                      required
                      min="50000"
                      value={formData.salarioKz}
                      onChange={(e) => setFormData({ ...formData, salarioKz: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Quota Mensal Calculada (1%)</label>
                    <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 font-black text-sm flex items-center justify-between">
                      <span>{quotaCalculada1PorCento.toLocaleString('pt-AO')} Kz</span>
                      <span className="text-[10px] font-bold bg-emerald-200 px-1.5 py-0.5 rounded">1% Auto</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">É Quotizante? *</label>
                    <select
                      value={formData.quotizante ? 'SIM' : 'NÃO'}
                      onChange={(e) => setFormData({ ...formData, quotizante: e.target.value === 'SIM' })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                    >
                      <option value="SIM">SIM (Desconto em Folha / MCX)</option>
                      <option value="NÃO">NÃO (Isento temporariamente)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ÁREA DO BOTÃO GUARDAR */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-black bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-lg shadow-sky-600/30 uppercase tracking-wide cursor-pointer"
                >
                  Guardar Inscrição do Associado
                </button>
              </div>

              {/* DECLARAÇÃO LEGAL OBRIGATÓRIA ABAIXO DO BOTÃO GUARDAR (REQUISITO EXPLÍCITO) */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 font-serif leading-relaxed text-center">
                <p className="text-xs font-bold italic">
                  "De acordo com o previsto no Artigo 24º da Lei, declaro por honra e voluntariamente perante a Direcção de que sou filiado/a ao sindicato."
                </p>
                <p className="text-[10px] font-sans text-amber-800 font-semibold mt-1">
                  Artigo 24º da Lei Sindical da República de Angola · SINPROF
                </p>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL CARTÃO DE IDENTIFICAÇÃO OFICIAL */}
      {associadoCartao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-sky-600" />
                Cartão de Identificação Sindical Oficial (SINPROF)
              </h3>
              <button
                type="button"
                onClick={() => setAssociadoCartao(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* O CARTÃO DE MEMBRO COM AS CORES OFICIAIS */}
            <div className="relative rounded-2xl p-5 text-white overflow-hidden shadow-xl border-2 border-sky-400 bg-gradient-to-br from-sky-600 via-sky-700 to-slate-900">
              <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
                <img 
                  src="/assets/aistudio/simipro_3ab834f4.png" 
                  alt="SINPROF" 
                  className="w-44 h-44 object-contain translate-x-8 translate-y-8"
                />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-white/20">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/assets/aistudio/simipro_3ab834f4.png" 
                    alt="SINPROF" 
                    className="w-10 h-10 object-contain drop-shadow-sm bg-white rounded-full p-0.5"
                  />
                  <div>
                    <h4 className="text-sm font-black tracking-wider text-white font-['Space_Grotesk']">SINPROF</h4>
                    <p className="text-[9px] uppercase tracking-wide text-amber-300 font-bold">
                      Sindicato Nacional de Professores
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                    MEMBRO EFECTIVO
                  </span>
                  <p className="text-[9px] text-sky-200 mt-0.5">REPÚBLICA DE ANGOLA</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="w-20 h-24 rounded-xl bg-slate-100 text-slate-800 flex flex-col items-center justify-center border-2 border-amber-400 shrink-0 shadow-inner">
                  <span className="text-xl font-black text-sky-700">
                    {associadoCartao.nomeCompleto.substring(0, 2).toUpperCase()}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase mt-1">Foto</span>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-sky-200">Nome do Titular</p>
                    <p className="text-xs font-black text-white truncate">{associadoCartao.nomeCompleto}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-sky-200">BI</p>
                      <p className="font-mono font-bold text-white">{associadoCartao.bi}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-sky-200">Nº de Agente</p>
                      <p className="font-mono font-bold text-amber-300">{associadoCartao.numeroAgente}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-sky-200">Grau Carreira</p>
                      <p className="font-bold text-white">{associadoCartao.grauCarreira}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-sky-200">Província</p>
                      <p className="font-bold text-white truncate">{associadoCartao.provincia}</p>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 bg-white rounded-lg shrink-0 flex flex-col items-center shadow-xs">
                  <QrCode className="w-12 h-12 text-slate-900" />
                  <span className="text-[8px] font-mono text-slate-700 font-bold">VÁLIDO</span>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-white/20 flex items-center justify-between text-[9px]">
                <p className="font-mono font-bold text-amber-300">
                  {associadoCartao.numeroMembro}
                </p>
                <p className="text-sky-200">
                  Quota 1%: {associadoCartao.valorQuotaCalculadoKz.toLocaleString('pt-AO')} Kz/mês
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAssociadoCartao(null)}
                className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Cartão</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
