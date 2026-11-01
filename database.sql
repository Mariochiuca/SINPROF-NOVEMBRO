-- ==============================================================
-- SINPROF - SINDICATO NACIONAL DE PROFESSORES (ANGOLA)
-- SCRIPT COMPLETO DE BASE DE DADOS MYSQL PARA XAMPP (PHP 8.x)
-- Local: C:\xampp\htdocs\sinprof\database.sql
-- ==============================================================

CREATE DATABASE IF NOT EXISTS `sinprof_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sinprof_db`;

-- 1. TABELA DE UTILIZADORES E CONTROLO DE ACESSO (RBAC)
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nome` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `senha_hash` VARCHAR(255) DEFAULT NULL,
  `perfil` ENUM('Superadministrador', 'Presidente', 'Secretário-geral', 'Tesoureiro', 'Delegado provincial', 'Delegado municipal', 'Assistente administrativo', 'Jurídico') NOT NULL,
  `cargo` VARCHAR(100) NOT NULL,
  `provincia` VARCHAR(50) DEFAULT NULL,
  `municipio` VARCHAR(100) DEFAULT NULL,
  `telefone` VARCHAR(30) DEFAULT NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABELA DE PROFESSORES ASSOCIADOS
DROP TABLE IF EXISTS `associados`;
CREATE TABLE `associados` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `numero_membro` VARCHAR(50) NOT NULL UNIQUE,
  `nome_completo` VARCHAR(200) NOT NULL,
  `bi` VARCHAR(30) NOT NULL UNIQUE,
  `data_emissao_bi` DATE DEFAULT NULL,
  `numero_agente` VARCHAR(50) NOT NULL,
  `estado_civil` VARCHAR(30) NOT NULL,
  `filiacao_pai` VARCHAR(150) DEFAULT NULL,
  `filiacao_mae` VARCHAR(150) DEFAULT NULL,
  `genero` ENUM('M', 'F') NOT NULL,
  `data_nascimento` DATE NOT NULL,
  `telefone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `provincia` VARCHAR(50) NOT NULL,
  `municipio` VARCHAR(100) NOT NULL,
  `instituicao_ensino` VARCHAR(200) NOT NULL,
  `categoria_docente` VARCHAR(150) NOT NULL,
  `habilitacao` ENUM('Ensino Médio', 'Formação Média Técnica', 'Formação Média Pedagógica', 'Bacharelato', 'Licenciatura', 'Pós-Graduação', 'Especialização', 'Mestrado', 'Doutoramento') NOT NULL,
  `disciplina_principal` VARCHAR(100) DEFAULT NULL,
  `ano_ingresso_med` INT NOT NULL,
  `grau_carreira` VARCHAR(50) NOT NULL,
  `salario_kz` DECIMAL(12,2) NOT NULL,
  `quotizante` TINYINT(1) DEFAULT 1,
  `valor_quota_kz` DECIMAL(12,2) NOT NULL,
  `tempo_servico_anos` INT DEFAULT 5,
  `data_filiacao` DATE NOT NULL,
  `estado` ENUM('Activo', 'Pendente', 'Suspenso', 'Aposentado') DEFAULT 'Activo',
  `observacoes` TEXT DEFAULT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABELA DE QUOTAS MENSAIS E PAGAMENTOS (1% DO SALÁRIO)
DROP TABLE IF EXISTS `quotas`;
CREATE TABLE `quotas` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `associado_id` VARCHAR(50) NOT NULL,
  `associado_nome` VARCHAR(200) NOT NULL,
  `associado_numero` VARCHAR(50) NOT NULL,
  `provincia` VARCHAR(50) NOT NULL,
  `mes_referencia` VARCHAR(30) NOT NULL,
  `ano` INT NOT NULL,
  `valor_kz` DECIMAL(12,2) NOT NULL,
  `data_pagamento` DATE DEFAULT NULL,
  `metodo_pagamento` ENUM('Multicaixa', 'Transferência Bancária', 'Desconto em Folha / SIGFE', 'Numerário') DEFAULT NULL,
  `referencia_comprovativo` VARCHAR(100) DEFAULT NULL,
  `estado` ENUM('Pago', 'Pendente', 'Atrasado') DEFAULT 'Pendente',
  `registado_por` VARCHAR(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABELA DE TESOURARIA E MOVIMENTOS DE CAIXA
DROP TABLE IF EXISTS `transacoes_financeiras`;
CREATE TABLE `transacoes_financeiras` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `tipo` ENUM('Receita', 'Despesa') NOT NULL,
  `categoria` VARCHAR(100) NOT NULL,
  `descricao` TEXT NOT NULL,
  `valor_kz` DECIMAL(14,2) NOT NULL,
  `data_movimento` DATE NOT NULL,
  `forma_pagamento` VARCHAR(50) NOT NULL,
  `numero_comprovativo` VARCHAR(100) NOT NULL,
  `aprovado_por` VARCHAR(150) NOT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABELA DE PROCESSOS JURÍDICOS
DROP TABLE IF EXISTS `processos_juridicos`;
CREATE TABLE `processos_juridicos` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `numero_processo` VARCHAR(50) NOT NULL UNIQUE,
  `titulo` VARCHAR(255) NOT NULL,
  `autor_nome` VARCHAR(200) NOT NULL,
  `provincia` VARCHAR(50) NOT NULL,
  `municipio` VARCHAR(100) NOT NULL,
  `tipo` VARCHAR(100) NOT NULL,
  `descricao` TEXT NOT NULL,
  `advogado_responsavel` VARCHAR(150) NOT NULL,
  `data_abertura` DATE NOT NULL,
  `prioridade` ENUM('Baixa', 'Média', 'Alta', 'Urgente') NOT NULL,
  `estado` ENUM('Submetido', 'Em Análise', 'Audiência Marcada', 'Sentença Favorável', 'Concluído') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABELA DE ESCOLAS COM ASSOCIADOS
DROP TABLE IF EXISTS `escolas`;
CREATE TABLE `escolas` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `codigo_escola` VARCHAR(50) NOT NULL UNIQUE,
  `nome_escola` VARCHAR(200) NOT NULL,
  `provincia` VARCHAR(50) NOT NULL,
  `municipio` VARCHAR(100) NOT NULL,
  `bairro` VARCHAR(100) DEFAULT NULL,
  `nivel_ensino` VARCHAR(100) NOT NULL,
  `total_professores` INT NOT NULL,
  `total_associados_sinprof` INT NOT NULL,
  `delegado_sindical` VARCHAR(150) NOT NULL,
  `contacto_delegado` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABELA DE MEMBROS DO ORGANOGRAMA
DROP TABLE IF EXISTS `organograma`;
CREATE TABLE `organograma` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nome` VARCHAR(150) NOT NULL,
  `cargo` VARCHAR(150) NOT NULL,
  `funcao` VARCHAR(150) NOT NULL,
  `provincia` VARCHAR(50) NOT NULL,
  `municipio` VARCHAR(100) NOT NULL,
  `telefone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `foto_url` VARCHAR(255) DEFAULT NULL,
  `nivel_hierarquico` INT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================================================
-- INSERÇÃO DE DADOS INICIAIS DE TESTE & DEMONSTRAÇÃO
-- ==============================================================

-- Utilizadores Oficiais
INSERT INTO `usuarios` (`id`, `nome`, `email`, `perfil`, `cargo`, `provincia`, `telefone`, `ativo`) VALUES
('usr-1', 'Prof. Francisco Teixeira', 'presidente@sinprof.ao', 'Presidente', 'Presidente da Direcção Nacional', 'Luanda', '+244 923 000 001', 1),
('usr-2', 'Hermínia do Nascimento', 'secretario@sinprof.ao', 'Secretário-geral', 'Secretária-Geral', 'Luanda', '+244 923 000 002', 1),
('usr-3', 'António Kiala', 'tesouraria@sinprof.ao', 'Tesoureiro', 'Tesoureiro-Geral', 'Luanda', '+244 923 000 003', 1),
('usr-4', 'Dr. Mateus Chitombi', 'delegado.luanda@sinprof.ao', 'Delegado provincial', 'Delegado Provincial de Luanda', 'Luanda', '+244 923 000 004', 1),
('usr-5', 'Dra. Eunice Muanza', 'juridico@sinprof.ao', 'Jurídico', 'Chefe do Gabinete Jurídico', 'Luanda', '+244 923 000 005', 1),
('usr-6', 'Administrador Central', 'admin@sinprof.ao', 'Superadministrador', 'Superadministrador do Sistema', 'Luanda', '+244 923 000 000', 1);

-- Professores Associados (Com Número de Agente e Quota de 1%)
INSERT INTO `associados` 
(`id`, `numero_membro`, `nome_completo`, `bi`, `data_emissao_bi`, `numero_agente`, `estado_civil`, `filiacao_pai`, `filiacao_mae`, `genero`, `data_nascimento`, `telefone`, `email`, `provincia`, `municipio`, `instituicao_ensino`, `categoria_docente`, `habilitacao`, `disciplina_principal`, `ano_ingresso_med`, `grau_carreira`, `salario_kz`, `quotizante`, `valor_quota_kz`, `data_filiacao`, `estado`, `observacoes`) 
VALUES
('assoc-1', 'SINP-2018-0492', 'João Baptista Chivela', '004928172LA041', '2021-04-12', 'AG-MED-849201', 'Casado(a)', 'Baptista Chivela', 'Madalena Domingos', 'M', '1984-03-12', '+244 923 881 201', 'j.chivela@escola.ao', 'Luanda', 'Cazenga', 'Magistério Mutu-ya-Kevela', 'Professor do Ensino Secundário do 2º Ciclo', 'Licenciatura', 'Língua Portuguesa', 2012, '8º Grau', 320000.00, 1, 3200.00, '2018-02-15', 'Activo', 'Docente com quota debitada via SIGFE'),
('assoc-2', 'SINP-2020-1108', 'Maria Teresa Domingos Cangombe', '001928472BE039', '2022-08-19', 'AG-MED-491028', 'Solteiro(a)', 'Domingos Cangombe', 'Teresa Kwanza', 'F', '1990-07-25', '+244 931 445 902', 'm.cangombe@escola.ao', 'Benguela', 'Lobito', 'Liceu Comandante Cassanje', 'Professora do Ensino Secundário do 1º Ciclo', 'Mestrado', 'Matemática & Física', 2016, '9º Grau', 380000.00, 1, 3800.00, '2020-05-10', 'Activo', 'Membro da comissão sindical escolar'),
('assoc-3', 'SINP-2016-0129', 'Manuel Gaspar Tchipango', '008172938HU044', '2019-11-04', 'AG-MED-391820', 'Casado(a)', 'Gaspar Tchipango', 'Albertina Ndala', 'M', '1979-11-04', '+244 945 112 390', 'm.tchipango@escola.ao', 'Huambo', 'Caála', 'Complexo Escolar Dr. António Agostinho Neto', 'Professor do Ensino Primário Diplomado', 'Formação Média Pedagógica', 'Ensino Primário Integrado', 2008, '7º Grau', 260000.00, 1, 2600.00, '2016-01-20', 'Activo', 'Activo sindicalmente na zona rural'),
('assoc-4', 'SINP-2022-3841', 'Esperança Feliciana Luvumbo', '002819481UI042', '2023-01-15', 'AG-MED-771920', 'Divorciado(a)', 'Feliciano Luvumbo', 'Joana Kifangondo', 'F', '1993-02-18', '+244 928 990 123', 'e.luvumbo@escola.ao', 'Uíge', 'Negage', 'Instituto Politécnico do Uíge', 'Professora do Ensino Técnico-Profissional', 'Licenciatura', 'Química & Biologia', 2019, '6º Grau', 270000.00, 1, 2700.00, '2022-09-01', 'Activo', 'Processo de atraso salarial aberto no Gabinete Jurídico');

-- Escolas com Associados do SINPROF
INSERT INTO `escolas` (`id`, `codigo_escola`, `nome_escola`, `provincia`, `municipio`, `bairro`, `nivel_ensino`, `total_professores`, `total_associados_sinprof`, `delegado_sindical`, `contacto_delegado`) VALUES
('esc-1', 'ESC-LUA-0104', 'Magistério Mutu-ya-Kevela', 'Luanda', 'Ingombota', 'Coqueiros', 'Ensino Médio e Pedagógico', 142, 118, 'Prof. João Baptista Chivela', '+244 923 881 201'),
('esc-2', 'ESC-BGL-0042', 'Liceu Comandante Cassanje', 'Benguela', 'Lobito', 'Compão', 'Ensino Secundário do 2º Ciclo', 88, 71, 'Profª. Maria Teresa Cangombe', '+244 931 445 902'),
('esc-3', 'ESC-HMB-0019', 'Complexo Escolar Dr. Agostinho Neto', 'Huambo', 'Caála', 'Centro', 'Ensino Primário e Iº Ciclo', 64, 52, 'Prof. Manuel Gaspar Tchipango', '+244 945 112 390'),
('esc-4', 'ESC-UIG-0088', 'Instituto Politécnico do Uíge', 'Uíge', 'Negage', 'Zona Verde', 'Técnico-Profissional', 95, 79, 'Profª. Esperança Feliciana Luvumbo', '+244 928 990 123');
