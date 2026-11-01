<?php
/**
 * SINPROF - Sindicato Nacional de Professores (Angola)
 * Instalador & Diagnosticador Automático da Base de Dados MySQL (XAMPP / PHP 8.x)
 * Aceda no navegador: http://localhost/sinprof/instalar.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

$msgSucesso = '';
$msgErro = '';
$tabelasCriadas = [];
$conexaoDetectada = null;

// Combinações de conexão testadas no XAMPP Windows
$candidatos = [
    ['host' => '127.0.0.1', 'port' => 3306, 'user' => 'root', 'pass' => '', 'desc' => '127.0.0.1:3306 (Padrão XAMPP)'],
    ['host' => 'localhost', 'port' => 3306, 'user' => 'root', 'pass' => '', 'desc' => 'localhost:3306 (Socket/Local)'],
    ['host' => '127.0.0.1', 'port' => 3307, 'user' => 'root', 'pass' => '', 'desc' => '127.0.0.1:3307 (Porta alternativa XAMPP)'],
    ['host' => 'localhost', 'port' => 3307, 'user' => 'root', 'pass' => '', 'desc' => 'localhost:3307 (Porta alternativa)'],
    ['host' => '127.0.0.1', 'port' => 3306, 'user' => 'root', 'pass' => 'root', 'desc' => '127.0.0.1:3306 (Senha: root)'],
    ['host' => 'localhost', 'port' => 3306, 'user' => 'root', 'pass' => 'root', 'desc' => 'localhost:3306 (Senha: root)'],
];

$pdoMySQL = null;
$tentativasErros = [];

foreach ($candidatos as $cand) {
    try {
        $dsn = "mysql:host={$cand['host']};port={$cand['port']};charset=utf8mb4";
        $p = new PDO($dsn, $cand['user'], $cand['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 2
        ]);
        $pdoMySQL = $p;
        $conexaoDetectada = $cand;
        break;
    } catch (PDOException $e) {
        $tentativasErros[] = "{$cand['desc']}: " . $e->getMessage();
    }
}

// Ação de Instalação Automática
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['executar_instalacao']) && $pdoMySQL) {
    try {
        // 1. Cria a base de dados sinprof_db
        $pdoMySQL->exec("CREATE DATABASE IF NOT EXISTS `sinprof_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
        $pdoMySQL->exec("USE `sinprof_db`;");

        // 2. Importa o script SQL database.sql
        $caminhoSql = __DIR__ . '/database.sql';
        if (file_exists($caminhoSql)) {
            $sqlConteudo = file_get_contents($caminhoSql);
            
            // Remove comentários de cabeçalho e divide em comandos individuais
            $linhas = explode("\n", $sqlConteudo);
            $queryLimpa = '';
            foreach ($linhas as $linha) {
                $linhaTrim = trim($linha);
                if (str_starts_with($linhaTrim, '--') || str_starts_with($linhaTrim, '/*')) {
                    continue;
                }
                $queryLimpa .= $linha . "\n";
            }

            $comandos = explode(';', $queryLimpa);
            foreach ($comandos as $cmd) {
                $cmdTrim = trim($cmd);
                if (!empty($cmdTrim)) {
                    $pdoMySQL->exec($cmdTrim);
                }
            }
        }

        // 3. Garante que o Superadministrador existe
        $stmtSuper = $pdoMySQL->prepare("
            INSERT INTO `usuarios` (`id`, `nome`, `email`, `perfil`, `cargo`, `provincia`, `municipio`, `telefone`, `ativo`) 
            VALUES ('usr-admin', 'Superadministrador Nacional', 'admin@sinprof.ao', 'Superadministrador', 'Gestor Geral do Sistema', 'Luanda', 'Luanda', '+244 923 000 001', 1)
            ON DUPLICATE KEY UPDATE `perfil` = 'Superadministrador', `ativo` = 1
        ");
        $stmtSuper->execute();

        // 4. Lista as tabelas criadas
        $stmtTabelas = $pdoMySQL->query("SHOW TABLES FROM `sinprof_db`");
        $tabelasCriadas = $stmtTabelas->fetchAll(PDO::FETCH_COLUMN);

        $msgSucesso = "Base de dados `sinprof_db` instalada e configurada com sucesso no XAMPP! Total de tabelas: " . count($tabelasCriadas);
    } catch (Exception $e) {
        $msgErro = "Erro ao configurar a base de dados: " . $e->getMessage();
    }
}

// Verifica tabelas existentes se já estiver conectado
$tabelasExistentes = [];
$totalAssociados = 0;
$totalUsuarios = 0;

if ($pdoMySQL) {
    try {
        $stmtCheckDb = $pdoMySQL->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'sinprof_db'");
        if ($stmtCheckDb->fetch()) {
            $pdoMySQL->exec("USE `sinprof_db`;");
            $stmtTabs = $pdoMySQL->query("SHOW TABLES FROM `sinprof_db`");
            $tabelasExistentes = $stmtTabs->fetchAll(PDO::FETCH_COLUMN);

            if (in_array('usuarios', $tabelasExistentes)) {
                $totalUsuarios = (int)$pdoMySQL->query("SELECT COUNT(*) FROM `usuarios`")->fetchColumn();
            }
            if (in_array('associados', $tabelasExistentes)) {
                $totalAssociados = (int)$pdoMySQL->query("SELECT COUNT(*) FROM `associados`")->fetchColumn();
            }
        }
    } catch (Exception $e) {}
}
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instalador & Conexão XAMPP - SINPROF Angola</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
    <style>
        :root {
            --sky-600: #0284c7;
            --sky-700: #0369a1;
            --amber-500: #f59e0b;
            --emerald-600: #059669;
            --rose-600: #e11d48;
            --slate-900: #0f172a;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #0369a1 100%);
            min-height: 100vh;
            color: #334155;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        .container {
            background: #ffffff;
            border-radius: 24px;
            max-width: 800px;
            width: 100%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .header {
            background: linear-gradient(135deg, #0284c7 0%, #0c4a6e 100%);
            color: white;
            padding: 32px 40px;
            text-align: center;
            position: relative;
        }
        .header h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header p {
            color: #bae6fd;
            font-size: 13px;
            margin-top: 6px;
        }
        .content {
            padding: 36px 40px;
        }
        .status-box {
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .status-success {
            background: #f0fdf4;
            border: 1.5px solid #86efac;
            color: #166534;
        }
        .status-error {
            background: #fff1f2;
            border: 1.5px solid #fecdd3;
            color: #9f1239;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .badge-success { background: #dcfce7; color: #15803d; }
        .badge-error { background: #ffe4e6; color: #be123c; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }
        .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 16px;
        }
        .card-label {
            font-size: 11px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 700;
        }
        .card-value {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 4px;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 28px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s;
            border: none;
        }
        .btn-primary {
            background: #0284c7;
            color: white;
            box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
        }
        .btn-primary:hover {
            background: #0369a1;
            transform: translateY(-1px);
        }
        .btn-success {
            background: #059669;
            color: white;
            box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4);
        }
        .btn-success:hover {
            background: #047857;
            transform: translateY(-1px);
        }
        .btn-secondary {
            background: #f1f5f9;
            color: #334155;
        }
        .btn-secondary:hover {
            background: #e2e8f0;
        }
        .troubleshoot {
            background: #f8fafc;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            border-radius: 0 12px 12px 0;
            margin-top: 24px;
            font-size: 13px;
            line-height: 1.6;
        }
        .troubleshoot ol {
            padding-left: 20px;
            margin-top: 8px;
        }
        .troubleshoot li {
            margin-bottom: 6px;
        }
        .table-pill {
            display: inline-block;
            background: #e0f2fe;
            color: #0369a1;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-family: monospace;
            margin: 2px;
            font-weight: 600;
        }
        .footer {
            text-align: center;
            padding: 20px 40px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>SINPROF - ANGOLA</h1>
        <p>Instalador & Diagnóstico de Base de Dados MySQL para XAMPP (Local)</p>
    </div>

    <div class="content">

        <?php if ($msgSucesso): ?>
            <div class="status-box status-success">
                <div>
                    <h3 style="font-size: 16px; font-weight: 800;">✓ Instalação Concluída com Sucesso!</h3>
                    <p style="font-size: 13px; margin-top: 4px;"><?php echo htmlspecialchars($msgSucesso); ?></p>
                </div>
            </div>
        <?php endif; ?>

        <?php if ($msgErro): ?>
            <div class="status-box status-error">
                <div>
                    <h3 style="font-size: 16px; font-weight: 800;">Aviso de Instalação</h3>
                    <p style="font-size: 13px; margin-top: 4px;"><?php echo htmlspecialchars($msgErro); ?></p>
                </div>
            </div>
        <?php endif; ?>

        <!-- Bloco de Status da Conexão MySQL -->
        <?php if ($conexaoDetectada): ?>
            <div class="status-box status-success">
                <span class="badge badge-success">Conectado</span>
                <div>
                    <h3 style="font-size: 15px; font-weight: 700;">Serviço MySQL Detectado e Ativo no XAMPP!</h3>
                    <p style="font-size: 12px; margin-top: 2px;">
                        Host: <strong><?php echo $conexaoDetectada['host']; ?></strong> · Porta: <strong><?php echo $conexaoDetectada['port']; ?></strong> · Utilizador: <strong><?php echo $conexaoDetectada['user']; ?></strong>
                    </p>
                </div>
            </div>
        <?php else: ?>
            <div class="status-box status-error">
                <span class="badge badge-error">Desconectado</span>
                <div>
                    <h3 style="font-size: 15px; font-weight: 700;">Não foi possível comunicar com o MySQL do XAMPP</h3>
                    <p style="font-size: 12px; margin-top: 2px;">
                        O serviço MySQL pode estar parado no Painel de Controlo do XAMPP.
                    </p>
                </div>
            </div>
        <?php endif; ?>

        <!-- Estatísticas Atuais -->
        <div class="grid">
            <div class="card">
                <div class="card-label">PHP Versão</div>
                <div class="card-value"><?php echo phpversion(); ?></div>
            </div>
            <div class="card">
                <div class="card-label">Base de Dados</div>
                <div class="card-value" style="color: <?php echo !empty($tabelasExistentes) ? '#059669' : '#e11d48'; ?>;">
                    <?php echo !empty($tabelasExistentes) ? 'sinprof_db (Ativa)' : 'Pendente'; ?>
                </div>
            </div>
            <div class="card">
                <div class="card-label">Tabelas Criadas</div>
                <div class="card-value"><?php echo count($tabelasExistentes); ?> / 12</div>
            </div>
            <div class="card">
                <div class="card-label">Professores Cadastrados</div>
                <div class="card-value"><?php echo $totalAssociados; ?></div>
            </div>
        </div>

        <!-- Tabelas Existentes -->
        <?php if (!empty($tabelasExistentes)): ?>
            <div style="margin-bottom: 24px;">
                <p style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px; text-transform: uppercase;">
                    Tabelas Registadas na Base de Dados:
                </p>
                <div>
                    <?php foreach ($tabelasExistentes as $t): ?>
                        <span class="table-pill"><?php echo htmlspecialchars($t); ?></span>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- Ações do Instalador -->
        <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 20px;">
            <?php if ($conexaoDetectada): ?>
                <form method="POST" style="display: inline;">
                    <input type="hidden" name="executar_instalacao" value="1">
                    <button type="submit" class="btn btn-primary">
                        ⚡ <?php echo !empty($tabelasExistentes) ? 'Recriar / Sincronizar Base de Dados' : 'Criar Base de Dados & Importar Tabelas'; ?>
                    </button>
                </form>
            <?php endif; ?>

            <a href="index.php" class="btn btn-success">
                ➔ Abrir Sistema SINPROF
            </a>

            <a href="instalar.php" class="btn btn-secondary">
                🔄 Recarregar Diagnóstico
            </a>
        </div>

        <!-- Instruções de Resolução de Problemas se o MySQL estiver desconectado -->
        <?php if (!$conexaoDetectada): ?>
            <div class="troubleshoot">
                <strong style="color: #b45309; font-size: 14px;">Como Ligar o MySQL no XAMPP (Passo a Passo Rápido):</strong>
                <ol>
                    <li>Abra o aplicativo <strong>XAMPP Control Panel</strong> no seu computador Windows.</li>
                    <li>Na linha do <strong>MySQL</strong>, verifique o botão ao lado. Se estiver escrito <strong>Start</strong>, clique nele.</li>
                    <li>Aguarde até o módulo MySQL ficar com o fundo <strong>verde</strong> indicando que está em execução.</li>
                    <li>Se der erro de porta no XAMPP (Port 3306 in use), clique em <strong>Config</strong> (ao lado do MySQL) &gt; <strong>my.ini</strong>, altere <code>port=3306</code> para <code>port=3307</code>, salve o arquivo e inicie novamente.</li>
                    <li>Depois de iniciar o MySQL, volte a esta página e clique em <a href="instalar.php" style="color: #0284c7; font-weight: 700;">Recarregar Diagnóstico</a>.</li>
                </ol>
            </div>
        <?php endif; ?>

    </div>

    <div class="footer">
        SINPROF - Sindicato Nacional de Professores · República de Angola · Compatível com XAMPP PHP 8.x & MySQL
    </div>
</div>

</body>
</html>
