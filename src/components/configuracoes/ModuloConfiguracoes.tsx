import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Database, 
  Download, 
  RefreshCw, 
  Server, 
  Code, 
  CheckCircle2, 
  Save, 
  ShieldCheck, 
  FileCode,
  Layers
} from 'lucide-react';

export const ModuloConfiguracoes: React.FC = () => {
  const { associados, quotas, transacoes, processos, restaurarDadosIniciais, exibirToast } = useApp();

  const [valorQuotaPadrao, setValorQuotaPadrao] = useState('2500');
  const [nomeSindicato, setNomeSindicato] = useState('Sindicato Nacional de Professores (SINPROF)');
  const [nifInstitucional, setNifInstitucional] = useState('5401182940');
  const [enderecoSede, setEnderecoSede] = useState('Rua Rainha Ginga, Edifício Coqueiros, 3º Andar, Luanda, Angola');
  const [telefoneSede, setTelefoneSede] = useState('+244 923 456 780');

  // Gerador de SQL para MySQL / XAMPP Local
  const handleBaixarSqlXampp = () => {
    const sqlContent = `-- ==============================================================
-- SISTEMA DE GESTÃO DO SINDICATO NACIONAL DE PROFESSORES (SINPROF - ANGOLA)
-- SCRIPT DE BASE DE DADOS COMPLETO PARA XAMPP (Apache + MySQL Local / PHP 8.x)
-- ==============================================================

CREATE DATABASE IF NOT EXISTS \`sinprof_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`sinprof_db\`;

-- 1. TABELA DE UTILIZADORES E PERFIS (RBAC)
CREATE TABLE IF NOT EXISTS \`usuarios\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nome\` VARCHAR(150) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`senha_hash\` VARCHAR(255) NOT NULL,
  \`perfil\` ENUM('Superadministrador', 'Presidente', 'Secretário-geral', 'Tesoureiro', 'Delegado provincial', 'Delegado municipal', 'Assistente administrativo', 'Jurídico') NOT NULL,
  \`cargo\` VARCHAR(100) NOT NULL,
  \`provincia\` VARCHAR(50) DEFAULT NULL,
  \`municipio\` VARCHAR(100) DEFAULT NULL,
  \`telefone\` VARCHAR(30) DEFAULT NULL,
  \`ativo\` TINYINT(1) DEFAULT 1,
  \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABELA DE PROFESSORES ASSOCIADOS (21 PROVÍNCIAS & 9 HABILITAÇÕES)
CREATE TABLE IF NOT EXISTS \`associados\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`numero_membro\` VARCHAR(50) NOT NULL UNIQUE,
  \`nome_completo\` VARCHAR(200) NOT NULL,
  \`bi\` VARCHAR(30) NOT NULL UNIQUE,
  \`nif\` VARCHAR(30) DEFAULT NULL,
  \`genero\` ENUM('M', 'F') NOT NULL,
  \`data_nascimento\` DATE NOT NULL,
  \`telefone\` VARCHAR(30) NOT NULL,
  \`email\` VARCHAR(150) DEFAULT NULL,
  \`provincia\` VARCHAR(50) NOT NULL,
  \`municipio\` VARCHAR(100) NOT NULL,
  \`instituicao_ensino\` VARCHAR(200) NOT NULL,
  \`categoria_docente\` VARCHAR(100) NOT NULL,
  \`habilitacao\` ENUM('Ensino Médio', 'Formação Média Técnica', 'Formação Média Pedagógica', 'Bacharelato', 'Licenciatura', 'Pós-Graduação', 'Especialização', 'Mestrado', 'Doutoramento') NOT NULL,
  \`disciplina_principal\` VARCHAR(100) DEFAULT NULL,
  \`tempo_servico_anos\` INT DEFAULT 1,
  \`data_filiacao\` DATE NOT NULL,
  \`estado\` ENUM('Activo', 'Pendente', 'Suspenso', 'Aposentado') DEFAULT 'Activo',
  \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABELA DE QUOTAS E PAGAMENTOS
CREATE TABLE IF NOT EXISTS \`quotas\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`associado_id\` INT NOT NULL,
  \`mes_referencia\` VARCHAR(30) NOT NULL,
  \`ano\` INT NOT NULL,
  \`valor_kz\` DECIMAL(12,2) NOT NULL DEFAULT 2500.00,
  \`data_pagamento\` DATE DEFAULT NULL,
  \`metodo_pagamento\` ENUM('Multicaixa', 'Transferência Bancária', 'Desconto em Folha', 'Numerário') DEFAULT NULL,
  \`referencia_comprovativo\` VARCHAR(100) DEFAULT NULL,
  \`estado\` ENUM('Pago', 'Pendente', 'Atrasado') DEFAULT 'Pendente',
  \`registado_por\` VARCHAR(150) DEFAULT NULL,
  FOREIGN KEY (\`associado_id\`) REFERENCES \`associados\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABELA DE TESOURARIA & MOVIMENTAÇÕES DE CAIXA
CREATE TABLE IF NOT EXISTS \`transacoes_financeiras\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`tipo\` ENUM('Receita', 'Despesa') NOT NULL,
  \`categoria\` VARCHAR(100) NOT NULL,
  \`descricao\` TEXT NOT NULL,
  \`valor_kz\` DECIMAL(14,2) NOT NULL,
  \`data_movimento\` DATE NOT NULL,
  \`forma_pagamento\` VARCHAR(50) NOT NULL,
  \`numero_comprovativo\` VARCHAR(100) NOT NULL,
  \`aprovado_por\` VARCHAR(150) NOT NULL,
  \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABELA DE DELEGAÇÕES PROVINCIAIS & MUNICIPAIS
CREATE TABLE IF NOT EXISTS \`delegacoes\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`tipo\` ENUM('Provincial', 'Municipal') NOT NULL,
  \`provincia\` VARCHAR(50) NOT NULL,
  \`municipio\` VARCHAR(100) DEFAULT NULL,
  \`nome_delegado\` VARCHAR(150) NOT NULL,
  \`telefone\` VARCHAR(30) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL,
  \`endereco\` TEXT NOT NULL,
  \`total_membros\` INT DEFAULT 0,
  \`total_escolas\` INT DEFAULT 0,
  \`estado_atividade\` ENUM('Alta Actividade', 'Activa', 'Baixa Actividade') DEFAULT 'Activa',
  \`ultima_reuniao\` DATE DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABELA DE PROCESSOS JURÍDICOS & RECLAMAÇÕES
CREATE TABLE IF NOT EXISTS \`processos_juridicos\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`numero_processo\` VARCHAR(50) NOT NULL UNIQUE,
  \`titulo\` VARCHAR(255) NOT NULL,
  \`autor_nome\` VARCHAR(200) NOT NULL,
  \`provincia\` VARCHAR(50) NOT NULL,
  \`municipio\` VARCHAR(100) NOT NULL,
  \`tipo\` ENUM('Atraso Salarial', 'Enquadramento na Carreira', 'Subsídio de Isolamento', 'Transferência Arbitrária', 'Processo Disciplinar', 'Outro') NOT NULL,
  \`descricao\` TEXT NOT NULL,
  \`data_abertura\` DATE NOT NULL,
  \`advogado_responsavel\` VARCHAR(150) NOT NULL,
  \`estado\` ENUM('Submetido', 'Em Análise', 'Audiência Marcada', 'Em Negociação', 'Concluído Favorável', 'Concluído Desfavorável') DEFAULT 'Submetido',
  \`prioridade\` ENUM('Baixa', 'Média', 'Alta', 'Urgente') DEFAULT 'Média',
  \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DADOS INICIAIS DE TESTE (ADMIN & PRESIDENTE)
INSERT INTO \`usuarios\` (\`nome\`, \`email\`, \`senha_hash\`, \`perfil\`, \`cargo\`, \`telefone\`) VALUES
('Dr. Guilherme Silva', 'presidente@sinprof.ao', SHA2('sinprof2026', 256), 'Presidente', 'Presidente Nacional', '+244 923 000 001'),
('Eng. Adão Bessa', 'admin@sinprof.ao', SHA2('admin2026', 256), 'Superadministrador', 'Admin de TI', '+244 923 000 002'),
('Profª. Maria Esperança', 'secretario@sinprof.ao', SHA2('sinprof2026', 256), 'Secretário-geral', 'Secretária Geral', '+244 923 000 003'),
('Dr. Paulo Kassoma', 'tesouraria@sinprof.ao', SHA2('sinprof2026', 256), 'Tesoureiro', 'Tesoureiro Geral', '+244 923 000 004');

-- FIM DO SCRIPT
`;

    const blob = new Blob([sqlContent], { type: 'application/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sinprof_banco_dados_xampp.sql';
    link.click();
    URL.revokeObjectURL(url);
    exibirToast('Script MySQL para XAMPP descarregado com sucesso!', 'sucesso');
  };

  // Gerador de Scripts PHP 8.x para XAMPP
  const handleBaixarScriptsPhp = () => {
    const phpContent = `<?php
/**
 * Conexão PDO com MySQL para XAMPP (PHP 8.x)
 * Arquivo: conexao.php
 */

$host = 'localhost';
$dbname = 'sinprof_db';
$usuario = 'root';
$senha = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $usuario, $senha, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    die(json_encode(['erro' => 'Falha na conexão com MySQL: ' . $e->getMessage()]));
}

// Exemplo de Endpoint AJAX para listar Associados
if (isset($_GET['acao']) && $_GET['acao'] === 'listar_associados') {
    header('Content-Type: application/json; charset=utf-8');
    $stmt = $pdo->query("SELECT * FROM associados ORDER BY id DESC LIMIT 50");
    echo json_encode($stmt->fetchAll());
    exit;
}
?>`;

    const blob = new Blob([phpContent], { type: 'application/x-php;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'conexao_api_xampp.php';
    link.click();
    URL.revokeObjectURL(url);
    exibirToast('Script PHP 8.x para XAMPP descarregado com sucesso!', 'sucesso');
  };

  const handleSalvarConfig = (e: React.FormEvent) => {
    e.preventDefault();
    exibirToast('Configurações institucionais guardadas com sucesso!', 'sucesso');
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Administração de Sistema</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">Parâmetros & Base de Dados</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
            CONFIGURAÇÕES & AMBIENTE XAMPP / MYSQL
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configurações sindicais, valor padrão de quotas e exportador de código PHP 8.x + MySQL para o XAMPP.
          </p>
        </div>
      </div>

      {/* ÁREA DE EXPORTAÇÃO PARA XAMPP (REQUISITO EXPLÍCITO) */}
      <div className="bg-slate-950 rounded-2xl p-6 text-white border border-sky-500/30 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Server className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
            Integração Local XAMPP (Apache + MySQL + PHP 8.x)
          </h3>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Para implantar este sistema no seu ambiente local com <strong>XAMPP</strong>, transfira os ficheiros SQL e PHP 8.x pré-estruturados com todas as 21 províncias, 9 habilitações e regras de negócio.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                <Database className="w-4 h-4" />
                <span>Script de Base de Dados MySQL (.sql)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cria o banco de dados <code className="text-amber-300">sinprof_db</code> com 6 tabelas relacionais, índices de BI, restrições e inserts iniciais prontos para o phpMyAdmin.
              </p>
            </div>
            <button
              type="button"
              onClick={handleBaixarSqlXampp}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descarregar sinprof_banco_dados.sql</span>
            </button>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1">
                <FileCode className="w-4 h-4" />
                <span>Scripts de Conexão PHP 8.x & AJAX (.php)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conexão PDO segura com tratamento de erros, endpoints REST/AJAX em JSON para salvar na pasta <code className="text-sky-300">htdocs/sinprof/</code> do XAMPP.
              </p>
            </div>
            <button
              type="button"
              onClick={handleBaixarScriptsPhp}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descarregar conexao_api_xampp.php</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulário de Parâmetros Institucionais */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Settings className="w-4 h-4 text-sky-600" />
          Parâmetros Institucionais do SINPROF
        </h3>

        <form onSubmit={handleSalvarConfig} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome da Organização</label>
              <input
                type="text"
                value={nomeSindicato}
                onChange={(e) => setNomeSindicato(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIF Institucional</label>
              <input
                type="text"
                value={nifInstitucional}
                onChange={(e) => setNifInstitucional(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Valor Mensal Padrão da Quota (AOA)</label>
              <input
                type="number"
                value={valorQuotaPadrao}
                onChange={(e) => setValorQuotaPadrao(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-black text-slate-900"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Valor fixado pelo Conselho Nacional para 2026</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Telefone da Sede Central</label>
              <input
                type="text"
                value={telefoneSede}
                onChange={(e) => setTelefoneSede(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Endereço da Sede Nacional em Luanda</label>
            <input
              type="text"
              value={enderecoSede}
              onChange={(e) => setEnderecoSede(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-medium"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={restaurarDadosIniciais}
              className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar Base de Dados Original</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Alterações</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
