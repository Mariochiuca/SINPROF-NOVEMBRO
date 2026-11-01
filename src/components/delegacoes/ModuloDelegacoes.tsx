import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Delegacao, ProvinciaAngola } from '../../types';
import { PROVINCIAS_ANGOLA, DADOS_RADAR_PROVINCIAS } from '../../data/angolaGeografia';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  School, 
  AlertTriangle, 
  Calendar, 
  Search, 
  CheckCircle2, 
  Clock,
  Filter
} from 'lucide-react';

export const ModuloDelegacoes: React.FC = () => {
  const { delegacoes, navegarPara } = useApp();

  const [busca, setBusca] = useState('');
  const [filtroAtividade, setFiltroAtividade] = useState<'Todos' | 'Alta Actividade' | 'Activa' | 'Baixa Actividade'>('Todos');

  // Mesclar as delegações ativas com os dados das 21 províncias
  const listaDelegacoes = PROVINCIAS_ANGOLA.map(prov => {
    const dadosRadar = DADOS_RADAR_PROVINCIAS[prov];
    const delExistente = delegacoes.find(d => d.provincia === prov);

    return {
      provincia: prov,
      capital: dadosRadar.capital,
      delegado: dadosRadar.delegadoResponsavel,
      telefone: dadosRadar.contactoDelegado,
      email: `${prov.toLowerCase().replace(/\s+/g, '')}@sinprof.ao`,
      membros: dadosRadar.professoresAssociados,
      escolas: dadosRadar.instituicoesEnsino,
      reclamacoes: dadosRadar.reclamacoesRegistadas,
      estadoAtividade: dadosRadar.statusAlerta === 'Crítico' ? 'Baixa Actividade' : 'Activa',
      ultimaReuniao: delExistente ? delExistente.ultimaReuniao : '2026-10-10'
    };
  });

  const listaFiltrada = listaDelegacoes.filter(d => {
    const matchBusca = d.provincia.toLowerCase().includes(busca.toLowerCase()) ||
                       d.delegado.toLowerCase().includes(busca.toLowerCase()) ||
                       d.capital.toLowerCase().includes(busca.toLowerCase());
    const matchAtiv = filtroAtividade === 'Todos' || d.estadoAtividade === filtroAtividade;
    return matchBusca && matchAtiv;
  });

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Estrutura Orgânica</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Representação Territorial Nacional</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            DELEGAÇÕES PROVINCIAIS & MUNICIPAIS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordenação das 21 Delegações Provinciais do SINPROF, sedes administrativas e secretariados municipais.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navegarPara('radar')}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <MapPin className="w-4 h-4 text-amber-300" />
          <span>Ver Distribuição no Radar &rarr;</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar por província, capital ou delegado..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full text-xs font-medium bg-transparent focus:outline-none text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1">
          {(['Todos', 'Activa', 'Baixa Actividade'] as const).map(tipo => (
            <button
              key={tipo}
              type="button"
              onClick={() => setFiltroAtividade(tipo as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filtroAtividade === tipo
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {/* Grade com as 21 Delegações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listaFiltrada.map((del) => (
          <div 
            key={del.provincia}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-sky-600 tracking-wider">Delegação Provincial</span>
                  <h3 className="text-base font-black text-slate-900 font-['Space_Grotesk']">{del.provincia}</h3>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Sede: {del.capital}
                  </p>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  del.estadoAtividade === 'Baixa Actividade'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {del.estadoAtividade}
                </span>
              </div>

              {/* Informações do Delegado */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                <p className="text-[10px] uppercase font-bold text-slate-400">Delegado Responsável</p>
                <p className="font-bold text-slate-900">{del.delegado}</p>
                <div className="flex items-center gap-2 text-slate-600 pt-1 border-t border-slate-200/50">
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <span className="font-semibold text-slate-800">{del.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span className="text-[11px] text-slate-500 truncate">{del.email}</span>
                </div>
              </div>

              {/* Estatísticas Rápidas */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="p-2 bg-sky-50 rounded-lg">
                  <p className="text-[9px] uppercase font-bold text-sky-800">Docentes</p>
                  <p className="text-xs font-black text-sky-950 mt-0.5">{del.membros.toLocaleString('pt-AO')}</p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <p className="text-[9px] uppercase font-bold text-amber-800">Escolas</p>
                  <p className="text-xs font-black text-amber-950 mt-0.5">{del.escolas}</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <p className="text-[9px] uppercase font-bold text-red-800">Queixas</p>
                  <p className="text-xs font-black text-red-950 mt-0.5">{del.reclamacoes}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">
                Última reunião: {del.ultimaReuniao}
              </span>
              <button
                type="button"
                onClick={() => navegarPara('radar', { provincia: del.provincia })}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
              >
                Detalhes &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
