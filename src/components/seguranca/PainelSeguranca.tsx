import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Database, 
  Server, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  EyeOff, 
  Clock,
  Laptop
} from 'lucide-react';

export const PainelSeguranca: React.FC = () => {
  const { logsSeguranca, usuarioAtual } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Cibersegurança & Proteção de Dados</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Conformidade APD Angola (Lei nº 22/11)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            CENTRO DE SEGURANÇA & AUDITORIA DE DADOS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mecanismos criptográficos avançados, trilha de auditoria inviolável, mascaramento de dados sensíveis e controlo de acesso RBAC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-extrabold border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Nível de Segurança: MÁXIMO</span>
          </span>
        </div>
      </div>

      {/* 4 Pilares de Proteção de Dados Implementados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl w-fit mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold uppercase text-slate-800">Criptografia em Trânsito</h4>
          <p className="text-sm font-extrabold text-sky-700 mt-1">TLS 1.3 / SSL 256-bit</p>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Todos os pacotes de dados transmitidos entre o navegador e o servidor são cifrados ponta-a-ponta.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-3">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold uppercase text-slate-800">Criptografia em Repouso</h4>
          <p className="text-sm font-extrabold text-emerald-700 mt-1">AES-256 + SHA-256</p>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Palavras-passe com hash salgado e base de dados relacional com proteção de integridade criptográfica.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-fit mb-3">
            <EyeOff className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold uppercase text-slate-800">Mascaramento de Dados</h4>
          <p className="text-sm font-extrabold text-purple-700 mt-1">Privacidade Restrita</p>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Salários, filiação e documentos só são visíveis mediante privilégios RBAC expressamente autorizados.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold uppercase text-slate-800">Trilha de Auditoria</h4>
          <p className="text-sm font-extrabold text-amber-700 mt-1">Registo Inviolável</p>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Cada inscrição, alteração salarial ou liquidação de quota é gravada com IP, data/hora e identificador.
          </p>
        </div>

      </div>

      {/* TRILHA DE AUDITORIA & LOGS EM TEMPO REAL */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Trilha de Auditoria em Tempo Real (Security Audit Trail)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Total: {logsSeguranca.length} eventos monitorizados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Data e Hora</th>
                <th className="px-4 py-3">Utilizador / Perfil</th>
                <th className="px-4 py-3">Ação Registada</th>
                <th className="px-4 py-3">Módulo</th>
                <th className="px-4 py-3">Endereço IP / Origem</th>
                <th className="px-4 py-3">Dispositivo</th>
                <th className="px-4 py-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {logsSeguranca.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-800">{log.dataHora}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{log.usuario}</p>
                    <p className="text-[10px] text-sky-700 font-semibold">{log.perfil}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800 max-w-xs">{log.acao}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {log.modulo}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">{log.enderecoIp}</td>
                  <td className="px-4 py-3 text-slate-500">{log.dispositivo}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'Sucesso'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.status === 'Alerta'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
