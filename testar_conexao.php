<?php
/**
 * SINPROF - Diagnóstico de Conexão MySQL / XAMPP
 * URL: http://localhost/sinprof/testar_conexao.php
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = obterConexao();

if ($pdo) {
    try {
        $stmtTabs = $pdo->query("SHOW TABLES FROM `sinprof_db`");
        $tabelas = $stmtTabs->fetchAll(PDO::FETCH_COLUMN);

        $stmtUsers = $pdo->query("SELECT `id`, `nome`, `email`, `perfil`, `cargo`, `ativo` FROM `usuarios`");
        $usuarios = $stmtUsers->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Conexão com a Base de Dados MySQL no XAMPP estabelecida com sucesso!',
            'diagnostico' => [
                'php_version' => phpversion(),
                'host' => defined('DB_HOST_ACTIVO') ? DB_HOST_ACTIVO : '127.0.0.1',
                'port' => defined('DB_PORT_ACTIVO') ? DB_PORT_ACTIVO : 3306,
                'database' => DB_NAME,
                'total_tabelas' => count($tabelas),
                'tabelas' => $tabelas,
                'total_usuarios' => count($usuarios),
                'usuarios' => $usuarios
            ]
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Conectado ao servidor MySQL, mas ocorreu um erro: ' . $e->getMessage()
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Não foi possível conectar ao MySQL do XAMPP.',
        'orientacao' => [
            '1' => 'Abra o XAMPP Control Panel',
            '2' => 'Clique no botão Start ao lado de MySQL para ligar o serviço',
            '3' => 'Aceda a http://localhost/sinprof/instalar.php para configurar automaticamente com 1 clique'
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
