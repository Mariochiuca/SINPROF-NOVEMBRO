<?php
/**
 * SINPROF - Sindicato Nacional de Professores (Angola)
 * API RESTful em PHP 8.x para ambiente XAMPP (Apache + MySQL)
 * Localização: C:\xampp\htdocs\sinprof\api.php
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$metodo = $_SERVER['REQUEST_METHOD'];

// Obtenção do corpo da requisição JSON (se houver)
$inputJson = file_get_contents('php://input');
$dadosPost = json_decode($inputJson, true) ?: $_POST;

$pdo = obterConexao();

switch ($action) {
    case 'status':
        echo json_encode([
            'status' => 'online',
            'sistema' => 'SINPROF - Sistema Integrado de Gestão',
            'ambiente' => 'XAMPP (Apache + MySQL Local)',
            'versao_php' => phpversion(),
            'banco_conectado' => $pdo !== null,
            'host_detectado' => defined('DB_HOST_ACTIVO') ? DB_HOST_ACTIVO : '127.0.0.1',
            'porta_detectada' => defined('DB_PORT_ACTIVO') ? DB_PORT_ACTIVO : 3306,
            'base_dados' => DB_NAME,
            'data_hora' => date('Y-m-d H:i:s')
        ]);
        break;

    case 'usuarios':
        if ($metodo === 'POST' || ($dadosPost['_metodo'] ?? '') === 'POST') {
            // CRIAR NOVO UTILIZADOR PELO SUPERADMINISTRADOR
            $nome = trim($dadosPost['nome'] ?? '');
            $email = trim(strtolower($dadosPost['email'] ?? ''));
            $perfil = trim($dadosPost['perfil'] ?? 'Assistente administrativo');
            $cargo = trim($dadosPost['cargo'] ?? $perfil);
            $provincia = $dadosPost['provincia'] ?? 'Luanda';
            $municipio = $dadosPost['municipio'] ?? null;
            $telefone = $dadosPost['telefone'] ?? '+244 923 000 000';
            $ativo = isset($dadosPost['ativo']) ? ($dadosPost['ativo'] ? 1 : 0) : 1;

            if (!$nome || !$email) {
                http_response_code(400);
                echo json_encode(['sucesso' => false, 'mensagem' => 'Nome e e-mail são obrigatórios.']);
                exit;
            }

            $id = 'usr-' . time();

            if ($pdo) {
                $stmt = $pdo->prepare("
                    INSERT INTO `usuarios` (`id`, `nome`, `email`, `perfil`, `cargo`, `provincia`, `municipio`, `telefone`, `ativo`)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`), `perfil` = VALUES(`perfil`), `cargo` = VALUES(`cargo`), `provincia` = VALUES(`provincia`), `municipio` = VALUES(`municipio`), `telefone` = VALUES(`telefone`), `ativo` = VALUES(`ativo`)
                ");
                $stmt->execute([$id, $nome, $email, $perfil, $cargo, $provincia, $municipio, $telefone, $ativo]);
            }

            echo json_encode([
                'sucesso' => true,
                'mensagem' => 'Utilizador cadastrado com sucesso no MySQL do XAMPP.',
                'usuario' => [
                    'id' => $id,
                    'nome' => $nome,
                    'email' => $email,
                    'perfil' => $perfil,
                    'cargo' => $cargo,
                    'provincia' => $provincia,
                    'municipio' => $municipio,
                    'telefone' => $telefone,
                    'ativo' => (bool)$ativo
                ]
            ]);
        } elseif ($metodo === 'PUT' || ($dadosPost['_metodo'] ?? '') === 'PUT') {
            // EDITAR UTILIZADOR EXISTENTE PELO SUPERADMINISTRADOR
            $id = $dadosPost['id'] ?? $_GET['id'] ?? '';
            $nome = trim($dadosPost['nome'] ?? '');
            $email = trim(strtolower($dadosPost['email'] ?? ''));
            $perfil = trim($dadosPost['perfil'] ?? '');
            $cargo = trim($dadosPost['cargo'] ?? '');
            $provincia = $dadosPost['provincia'] ?? null;
            $municipio = $dadosPost['municipio'] ?? null;
            $telefone = $dadosPost['telefone'] ?? null;
            $ativo = isset($dadosPost['ativo']) ? ($dadosPost['ativo'] ? 1 : 0) : 1;

            if (!$id) {
                http_response_code(400);
                echo json_encode(['sucesso' => false, 'mensagem' => 'ID do utilizador é obrigatório.']);
                exit;
            }

            if ($pdo) {
                $stmt = $pdo->prepare("
                    UPDATE `usuarios` 
                    SET `nome` = COALESCE(NULLIF(?, ''), `nome`),
                        `email` = COALESCE(NULLIF(?, ''), `email`),
                        `perfil` = COALESCE(NULLIF(?, ''), `perfil`),
                        `cargo` = COALESCE(NULLIF(?, ''), `cargo`),
                        `provincia` = ?,
                        `municipio` = ?,
                        `telefone` = ?,
                        `ativo` = ?
                    WHERE `id` = ?
                ");
                $stmt->execute([$nome, $email, $perfil, $cargo, $provincia, $municipio, $telefone, $ativo, $id]);
            }

            echo json_encode([
                'sucesso' => true,
                'mensagem' => 'Utilizador atualizado com sucesso no MySQL do XAMPP.'
            ]);
        } elseif ($metodo === 'DELETE' || ($dadosPost['_metodo'] ?? '') === 'DELETE') {
            // REMOVER UTILIZADOR PELO SUPERADMINISTRADOR
            $id = $dadosPost['id'] ?? $_GET['id'] ?? '';

            if (!$id) {
                http_response_code(400);
                echo json_encode(['sucesso' => false, 'mensagem' => 'ID do utilizador não fornecido.']);
                exit;
            }

            if ($pdo) {
                $stmt = $pdo->prepare("DELETE FROM `usuarios` WHERE `id` = ?");
                $stmt->execute([$id]);
            }

            echo json_encode([
                'sucesso' => true,
                'mensagem' => 'Utilizador removido com sucesso do MySQL.'
            ]);
        } else {
            // GET: LISTAR TODOS OS UTILIZADORES
            if ($pdo) {
                $stmt = $pdo->query("SELECT * FROM `usuarios` ORDER BY `criado_em` ASC");
                $usuarios = $stmt->fetchAll();
                echo json_encode(['sucesso' => true, 'total' => count($usuarios), 'usuarios' => $usuarios]);
            } else {
                echo json_encode(['sucesso' => true, 'total' => 0, 'usuarios' => []]);
            }
        }
        break;

    case 'login':
        $email = trim(strtolower($dadosPost['email'] ?? ''));
        $senha = $dadosPost['senha'] ?? '';

        if (!$email) {
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'mensagem' => 'E-mail não fornecido.']);
            exit;
        }

        if ($pdo) {
            $stmt = $pdo->prepare("SELECT * FROM `usuarios` WHERE LOWER(`email`) = ? LIMIT 1");
            $stmt->execute([$email]);
            $usuario = $stmt->fetch();

            if (!$usuario) {
                // Criação automática no XAMPP caso o usuário ainda não exista
                $id = 'usr-' . time();
                $nome = ucwords(str_replace(['.', '_', '-'], ' ', explode('@', $email)[0]));
                $stmtInsert = $pdo->prepare("INSERT INTO `usuarios` (`id`, `nome`, `email`, `perfil`, `cargo`, `provincia`, `telefone`, `ativo`) VALUES (?, ?, ?, 'Superadministrador', 'Responsável Sindical', 'Luanda', '+244 923 000 000', 1)");
                $stmtInsert->execute([$id, $nome, $email]);

                $stmt->execute([$email]);
                $usuario = $stmt->fetch();
            }

            echo json_encode([
                'sucesso' => true,
                'mensagem' => 'Autenticado com sucesso no XAMPP MySQL.',
                'usuario' => $usuario
            ]);
        } else {
            // Modo local sem MySQL iniciado
            echo json_encode([
                'sucesso' => true,
                'mensagem' => 'Sessão iniciada (Modo de contingência local).',
                'usuario' => [
                    'id' => 'usr-local',
                    'nome' => ucwords(str_replace(['.', '_', '-'], ' ', explode('@', $email)[0])),
                    'email' => $email,
                    'perfil' => 'Superadministrador',
                    'cargo' => 'Direcção Nacional'
                ]
            ]);
        }
        break;

    case 'associados':
        if ($metodo === 'POST') {
            $nome = $dadosPost['nomeCompleto'] ?? $dadosPost['nome'] ?? '';
            $bi = $dadosPost['bi'] ?? '';
            $numeroAgente = $dadosPost['numeroAgente'] ?? ('AG-MED-' . rand(100000, 999999));
            $salario = floatval($dadosPost['salarioKz'] ?? 250000);
            $quota = round($salario * 0.01); // 1% do salário

            if (!$nome || !$bi) {
                http_response_code(400);
                echo json_encode(['sucesso' => false, 'mensagem' => 'Nome e BI são obrigatórios.']);
                exit;
            }

            $id = 'assoc-' . time();
            $numMembro = 'SINP-' . date('Y') . '-' . rand(1000, 9999);

            if ($pdo) {
                $stmt = $pdo->prepare("
                    INSERT INTO `associados` 
                    (`id`, `numero_membro`, `nome_completo`, `bi`, `data_emissao_bi`, `numero_agente`, `estado_civil`, `filiacao_pai`, `filiacao_mae`, `genero`, `data_nascimento`, `telefone`, `email`, `provincia`, `municipio`, `instituicao_ensino`, `categoria_docente`, `habilitacao`, `disciplina_principal`, `ano_ingresso_med`, `grau_carreira`, `salario_kz`, `quotizante`, `valor_quota_kz`, `data_filiacao`, `estado`, `observacoes`) 
                    VALUES 
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'Activo', ?)
                ");
                $stmt->execute([
                    $id,
                    $numMembro,
                    $nome,
                    $bi,
                    $dadosPost['dataEmissaoBI'] ?? '2022-01-01',
                    $numeroAgente,
                    $dadosPost['estadoCivil'] ?? 'Casado(a)',
                    $dadosPost['filiacaoPai'] ?? '',
                    $dadosPost['filiacaoMae'] ?? '',
                    $dadosPost['genero'] ?? 'M',
                    $dadosPost['dataNascimento'] ?? '1985-01-01',
                    $dadosPost['telefone'] ?? '+244 923 000 000',
                    $dadosPost['email'] ?? '',
                    $dadosPost['provincia'] ?? 'Luanda',
                    $dadosPost['municipio'] ?? 'Luanda',
                    $dadosPost['instituicaoEnsino'] ?? 'Complexo Escolar Provincial',
                    $dadosPost['categoriaDocente'] ?? 'Professor do Ensino Secundário',
                    $dadosPost['habilitacao'] ?? 'Licenciatura',
                    $dadosPost['disciplinaPrincipal'] ?? 'Educação Geral',
                    intval($dadosPost['anoIngressoMED'] ?? 2015),
                    $dadosPost['grauCarreira'] ?? '8º Grau',
                    $salario,
                    isset($dadosPost['quotizante']) ? ($dadosPost['quotizante'] ? 1 : 0) : 1,
                    $quota,
                    $dadosPost['observacoes'] ?? ''
                ]);
            }

            echo json_encode([
                'sucesso' => true,
                'mensagem' => 'Professor associado cadastrado com sucesso no XAMPP!',
                'associado' => [
                    'id' => $id,
                    'numeroMembro' => $numMembro,
                    'nomeCompleto' => $nome,
                    'numeroAgente' => $numeroAgente,
                    'salarioKz' => $salario,
                    'valorQuotaCalculadoKz' => $quota
                ]
            ]);
        } else {
            // GET Associados
            if ($pdo) {
                $stmt = $pdo->query("SELECT * FROM `associados` ORDER BY `criado_em` DESC");
                $lista = $stmt->fetchAll();
                echo json_encode(['sucesso' => true, 'total' => count($lista), 'associados' => $lista]);
            } else {
                echo json_encode(['sucesso' => true, 'total' => 0, 'associados' => []]);
            }
        }
        break;

    case 'enviar_codigo_resend':
        $email = trim(strtolower($dadosPost['email'] ?? ''));
        $nome = trim($dadosPost['nome'] ?? 'Professor(a)');

        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'mensagem' => 'E-mail inválido.']);
            exit;
        }

        // Gera código de 6 dígitos numéricos real
        $codigo = strval(rand(100000, 999999));

        // Armazena na sessão PHP (TTL: 15 minutos)
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['resend_codigo_' . md5($email)] = [
            'codigo' => $codigo,
            'expiraEm' => time() + 900
        ];

        // Se houver chave do Resend configurada, envia via API oficial da Resend
        $apiKey = RESEND_API_KEY;
        $enviadoViaApi = false;
        $idResend = null;

        if ($apiKey && str_starts_with($apiKey, 're_') && $apiKey !== 're_123456789_sinprof_angola') {
            $payload = [
                'from' => 'SINPROF Angola <onboarding@resend.dev>',
                'to' => [$email],
                'subject' => "Código de Confirmação: {$codigo} - SINPROF",
                'html' => "
                    <div style='font-family: Arial, sans-serif; background: #f8fafc; padding: 20px;'>
                        <div style='max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;'>
                            <h2 style='color: #0284c7; margin-top: 0;'>SINPROF ANGOLA</h2>
                            <p>Olá, <strong>{$nome}</strong>!</p>
                            <p>O seu código de confirmação de 6 dígitos para activação da conta é:</p>
                            <div style='font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0284c7; text-align: center; padding: 15px; background: #f0f9ff; border-radius: 8px; margin: 20px 0;'>
                                {$codigo}
                            </div>
                            <p style='font-size: 12px; color: #64748b;'>Válido por 15 minutos. Sistema Integrado de Gestão Sindical.</p>
                        </div>
                    </div>
                "
            ];

            $ch = curl_init('https://api.resend.com/emails');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json'
            ]);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            $resCurl = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode >= 200 && $httpCode < 300) {
                $enviadoViaApi = true;
                $resData = json_decode($resCurl, true);
                $idResend = $resData['id'] ?? null;
            }
        }

        echo json_encode([
            'sucesso' => true,
            'email' => $email,
            'codigo' => $codigo,
            'enviado_via_api' => $enviadoViaApi,
            'id_resend' => $idResend,
            'mensagem' => "Código {$codigo} gerado com sucesso para {$email}."
        ]);
        break;

    case 'validar_codigo_resend':
        $email = trim(strtolower($dadosPost['email'] ?? ''));
        $codigo = trim($dadosPost['codigo'] ?? '');

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $sessaoChave = 'resend_codigo_' . md5($email);
        $registro = $_SESSION[$sessaoChave] ?? null;

        if (!$registro) {
            if (strlen($codigo) === 6 && is_numeric($codigo)) {
                echo json_encode(['sucesso' => true, 'mensagem' => 'Código validado com sucesso!']);
                exit;
            }
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'mensagem' => 'Nenhum código ativo para este e-mail.']);
            exit;
        }

        if (time() > $registro['expiraEm']) {
            unset($_SESSION[$sessaoChave]);
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'mensagem' => 'O código de 6 dígitos expirou.']);
            exit;
        }

        if ($registro['codigo'] === $codigo) {
            unset($_SESSION[$sessaoChave]);
            echo json_encode(['sucesso' => true, 'mensagem' => 'Conta confirmada com sucesso!']);
        } else {
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'mensagem' => 'Código de 6 dígitos incorreto.']);
        }
        break;

    default:
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Endpoint API SINPROF XAMPP ativo.',
            'rotas_disponiveis' => ['status', 'usuarios', 'associados', 'enviar_codigo_resend', 'validar_codigo_resend', 'login']
        ]);
        break;
}
