<?php
/**
 * SINPROF - Sindicato Nacional de Professores (Angola)
 * Ficheiro de Configuração & Conexão Inteligente à Base de Dados MySQL (XAMPP / PHP 8.x)
 * Localização no XAMPP: C:\xampp\htdocs\sinprof\config.php
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Definição da base de dados padrão
define('DB_NAME', 'sinprof_db');

// Chave da API do Resend (opcional para envio de e-mails de confirmação)
define('RESEND_API_KEY', getenv('RESEND_API_KEY') ?: 're_123456789_sinprof_angola');

/**
 * Conexão Inteligente com Auto-Detecção de Host, Porta e Senha no XAMPP
 * Testa automaticamente combinações comuns do XAMPP no Windows:
 * 1) 127.0.0.1:3306 (senha vazia)
 * 2) localhost:3306 (senha vazia)
 * 3) 127.0.0.1:3307 (senha vazia - caso haja conflito de porta)
 * 4) localhost:3307 (senha vazia)
 * 5) 127.0.0.1:3306 (senha 'root')
 */
function obterConexao(): ?PDO {
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $candidatos = [
        ['host' => '127.0.0.1', 'port' => 3306, 'user' => 'root', 'pass' => ''],
        ['host' => 'localhost', 'port' => 3306, 'user' => 'root', 'pass' => ''],
        ['host' => '127.0.0.1', 'port' => 3307, 'user' => 'root', 'pass' => ''],
        ['host' => 'localhost', 'port' => 3307, 'user' => 'root', 'pass' => ''],
        ['host' => '127.0.0.1', 'port' => 3306, 'user' => 'root', 'pass' => 'root'],
        ['host' => 'localhost', 'port' => 3306, 'user' => 'root', 'pass' => 'root'],
        ['host' => '127.0.0.1', 'port' => 3308, 'user' => 'root', 'pass' => '']
    ];

    $ultimoErro = '';

    foreach ($candidatos as $cand) {
        try {
            // 1. Conecta ao servidor MySQL
            $dsnServer = "mysql:host={$cand['host']};port={$cand['port']};charset=utf8mb4";
            $pdoServer = new PDO($dsnServer, $cand['user'], $cand['pass'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT => 2
            ]);

            // 2. Garante a existência da base de dados sinprof_db
            $pdoServer->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");

            // 3. Conecta à base de dados sinprof_db
            $dsnDb = "mysql:host={$cand['host']};port={$cand['port']};dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsnDb, $cand['user'], $cand['pass'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);

            // 4. Inicializa tabelas essenciais se necessário
            inicializarTabelasSeNecessario($pdo);

            // Armazena credenciais funcionais em constantes caso não definidas
            if (!defined('DB_HOST_ACTIVO')) {
                define('DB_HOST_ACTIVO', $cand['host']);
                define('DB_PORT_ACTIVO', $cand['port']);
                define('DB_USER_ACTIVO', $cand['user']);
            }

            return $pdo;
        } catch (PDOException $e) {
            $ultimoErro = $e->getMessage();
            continue; // Tenta o próximo candidato
        }
    }

    error_log("[SINPROF XAMPP] Não foi possível conectar ao MySQL: " . $ultimoErro);
    return null;
}

/**
 * Cria as tabelas do sistema automaticamente se for a primeira execução no XAMPP
 */
function inicializarTabelasSeNecessario(PDO $pdo): void {
    // Tabela de utilizadores (RBAC) com suporte a Superadministrador total
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `usuarios` (
            `id` VARCHAR(50) PRIMARY KEY,
            `nome` VARCHAR(150) NOT NULL,
            `email` VARCHAR(150) NOT NULL UNIQUE,
            `senha_hash` VARCHAR(255) DEFAULT NULL,
            `perfil` VARCHAR(50) NOT NULL,
            `cargo` VARCHAR(100) NOT NULL,
            `provincia` VARCHAR(50) DEFAULT NULL,
            `municipio` VARCHAR(100) DEFAULT NULL,
            `telefone` VARCHAR(30) DEFAULT NULL,
            `ativo` TINYINT(1) DEFAULT 1,
            `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Inserção do Superadministrador padrão caso a tabela esteja vazia
    $stmtCheck = $pdo->query("SELECT COUNT(*) as total FROM `usuarios`");
    $totalUsers = (int)$stmtCheck->fetchColumn();
    if ($totalUsers === 0) {
        $pdo->exec("
            INSERT INTO `usuarios` (`id`, `nome`, `email`, `perfil`, `cargo`, `provincia`, `municipio`, `telefone`, `ativo`) VALUES
            ('usr-001', 'Dr. Guilherme Silva', 'admin@sinprof.ao', 'Superadministrador', 'Gestor Nacional de Sistemas', 'Luanda', 'Luanda', '+244 923 111 222', 1),
            ('usr-002', 'Prof. Francisco Teixeira', 'presidente@sinprof.ao', 'Presidente', 'Presidente da Direcção Nacional', 'Luanda', 'Luanda', '+244 923 000 001', 1),
            ('usr-003', 'Profa. Adélia Manuel', 'secretaria@sinprof.ao', 'Secretário-geral', 'Secretária-Geral', 'Luanda', 'Luanda', '+244 923 000 002', 1),
            ('usr-004', 'Dra. Rosa Chaves', 'tesouraria@sinprof.ao', 'Tesoureiro', 'Secretária Nacional para Administração e Finanças', 'Luanda', 'Luanda', '+244 923 000 003', 1),
            ('usr-005', 'Dr. Manuel Domingos', 'benguela@sinprof.ao', 'Delegado provincial', 'Secretário Provincial de Benguela', 'Benguela', 'Benguela', '+244 923 000 004', 1),
            ('usr-006', 'Prof. Alberto Cassule', 'viana@sinprof.ao', 'Delegado municipal', 'Secretário Municipal de Viana', 'Luanda', 'Viana', '+244 923 000 005', 1),
            ('usr-007', 'Ana Paula Kiala', 'atendimento@sinprof.ao', 'Assistente administrativo', 'Assistente de Inscrições e Apoio ao Membro', 'Luanda', 'Luanda', '+244 923 000 006', 1),
            ('usr-008', 'Dr. Paulo Sebastião', 'juridico@sinprof.ao', 'Jurídico', 'Chefe do Gabinete Jurídico e Contencioso', 'Luanda', 'Luanda', '+244 923 000 007', 1);
        ");
    }

    // Tabela de associados com todos os campos exigidos
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `associados` (
            `id` VARCHAR(50) PRIMARY KEY,
            `numero_membro` VARCHAR(50) NOT NULL UNIQUE,
            `nome_completo` VARCHAR(200) NOT NULL,
            `bi` VARCHAR(30) NOT NULL UNIQUE,
            `data_emissao_bi` DATE DEFAULT NULL,
            `numero_agente` VARCHAR(50) NOT NULL,
            `estado_civil` VARCHAR(30) NOT NULL,
            `filiacao_pai` VARCHAR(150) DEFAULT NULL,
            `filiacao_mae` VARCHAR(150) DEFAULT NULL,
            `genero` CHAR(1) NOT NULL,
            `data_nascimento` DATE NOT NULL,
            `telefone` VARCHAR(30) NOT NULL,
            `email` VARCHAR(150) DEFAULT NULL,
            `provincia` VARCHAR(50) NOT NULL,
            `municipio` VARCHAR(100) NOT NULL,
            `instituicao_ensino` VARCHAR(200) NOT NULL,
            `categoria_docente` VARCHAR(150) NOT NULL,
            `habilitacao` VARCHAR(100) NOT NULL,
            `disciplina_principal` VARCHAR(100) DEFAULT NULL,
            `ano_ingresso_med` INT NOT NULL,
            `grau_carreira` VARCHAR(50) NOT NULL,
            `salario_kz` DECIMAL(12,2) NOT NULL,
            `quotizante` TINYINT(1) DEFAULT 1,
            `valor_quota_kz` DECIMAL(12,2) NOT NULL,
            `tempo_servico_anos` INT DEFAULT 5,
            `data_filiacao` DATE NOT NULL,
            `estado` VARCHAR(30) DEFAULT 'Activo',
            `observacoes` TEXT DEFAULT NULL,
            `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Tabela de quotas
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `quotas` (
            `id` VARCHAR(50) PRIMARY KEY,
            `associado_id` VARCHAR(50) NOT NULL,
            `associado_nome` VARCHAR(200) NOT NULL,
            `associado_numero` VARCHAR(50) NOT NULL,
            `provincia` VARCHAR(50) NOT NULL,
            `mes_referencia` VARCHAR(30) NOT NULL,
            `ano` INT NOT NULL,
            `valor_kz` DECIMAL(12,2) NOT NULL,
            `data_pagamento` DATE DEFAULT NULL,
            `metodo_pagamento` VARCHAR(50) DEFAULT NULL,
            `referencia_comprovativo` VARCHAR(100) DEFAULT NULL,
            `estado` VARCHAR(30) DEFAULT 'Pendente',
            `registado_por` VARCHAR(150) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
}
