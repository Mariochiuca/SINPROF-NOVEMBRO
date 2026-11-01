<?php
/**
 * SINPROF - SINDICATO NACIONAL DE PROFESSORES (ANGOLA)
 * Entrada Principal para execução no ambiente XAMPP (Apache + MySQL + PHP 8.x)
 * Local no computador: C:\xampp\htdocs\sinprof\index.php
 * Acesso no Navegador: http://localhost/sinprof/
 */

require_once __DIR__ . '/config.php';

// 1. Testa a conexão com o banco de dados MySQL do XAMPP
$pdo = obterConexao();

// 2. Se o build de produção (dist/index.html) estiver presente, carrega a interface completa
$distIndex = __DIR__ . '/dist/index.html';

if (file_exists($distIndex)) {
    $html = file_get_contents($distIndex);

    // Ajusta os caminhos dos assets para funcionarem perfeitamente no subdiretório /sinprof/ do XAMPP
    $html = str_replace('href="./assets/', 'href="dist/assets/', $html);
    $html = str_replace('src="./assets/', 'src="dist/assets/', $html);
    $html = str_replace('"/assets/aistudio/', '"public/assets/aistudio/', $html);

    // Injeta script de inicialização do XAMPP para conexão com a API PHP
    $scriptXampp = '
    <script>
      window.SINPROF_XAMPP_CONFIG = {
        ativo: true,
        apiUrl: "api.php",
        bancoConectado: ' . ($pdo ? 'true' : 'false') . ',
        ambiente: "XAMPP PHP 8.x & MySQL Local"
      };
      console.log("[SINPROF] A correr no ambiente XAMPP (Apache + PHP 8.x + MySQL)");
    </script>
    ';

    $html = str_replace('</body>', $scriptXampp . '</body>', $html);

    echo $html;
    exit;
}

// 3. Fallback visual caso os ficheiros dist ainda não tenham sido compilados
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SINPROF - Sistema de Gestão Sindical (XAMPP)</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
            color: #ffffff;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            box-sizing: border-box;
        }
        .card {
            background: #ffffff;
            color: #0f172a;
            max-width: 600px;
            width: 100%;
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            text-align: center;
        }
        h1 { font-size: 24px; margin-top: 15px; color: #0284c7; }
        .badge {
            display: inline-block;
            background: #fef08a;
            color: #854d0e;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
        }
        .btn {
            display: inline-block;
            background: #0284c7;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: bold;
            text-decoration: none;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="card">
        <span class="badge">Ambiente XAMPP Pronto</span>
        <h1>SINPROF ANGOLA</h1>
        <p>Sistema Integrado de Gestão do Sindicato Nacional de Professores</p>
        <p style="color: #64748b; font-size: 13px;">
            Conexão MySQL: <?php echo $pdo ? '<strong style="color: #16a34a;">Conectado à base sinprof_db ✓</strong>' : '<strong style="color: #dc2626;">Inicie o MySQL no XAMPP Control Panel</strong>'; ?>
        </p>
        <a href="api.php?action=status" class="btn" target="_blank">Testar Estado da API PHP</a>
    </div>
</body>
</html>
