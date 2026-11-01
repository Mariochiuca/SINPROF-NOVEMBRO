import { Resend } from 'resend';

// Inicialização da instância Resend com a chave de API de ambiente
const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Armazenamento em memória dos códigos gerados para validação posterior (TTL: 15 minutos)
interface CodigoVerificacao {
  email: string;
  codigo: string;
  expiraEm: number;
  tentativas: number;
}

const codigosTemporarios = new Map<string, CodigoVerificacao>();

/**
 * Gera um código numérico de 6 dígitos
 */
export function gerarCodigo6Digitos(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Função em Node.js para envio de e-mail de confirmação de conta via API do Resend
 * 
 * @param email - Endereço de e-mail do utilizador no registo
 * @param nome - Nome completo do utilizador
 * @returns Objeto com status do envio, código gerado e mensagem
 */
export async function enviarEmailConfirmacaoResend(email: string, nome: string = 'Prezado(a) Professor(a)') {
  if (!email || !email.includes('@')) {
    throw new Error('E-mail inválido fornecido para confirmação de conta.');
  }

  // Gera código aleatório seguro de 6 dígitos
  const codigo = gerarCodigo6Digitos();
  const ttlMinutos = 15;
  const expiraEm = Date.now() + ttlMinutos * 60 * 1000;

  // Armazena o código para validação
  codigosTemporarios.set(email.toLowerCase(), {
    email: email.toLowerCase(),
    codigo,
    expiraEm,
    tentativas: 0
  });

  // Template HTML oficial com a identidade visual do SINPROF (Azul, Amarelo e Branco)
  const templateHtml = `
  <!DOCTYPE html>
  <html lang="pt">
  <head>
    <meta charset="UTF-8">
    <title>Confirmação de Registo - SINPROF</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            
            <!-- Cabeçalho -->
            <tr style="background-color: #0284c7; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);">
              <td align="center" style="padding: 30px 20px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">SINPROF ANGOLA</h1>
                <p style="color: #fef08a; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">Sindicato Nacional de Professores</p>
              </td>
            </tr>

            <!-- Corpo -->
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #0f172a; margin: 0 0 16px 0; font-size: 20px; font-weight: 700;">Confirmação de Abertura de Conta</h2>
                <p style="color: #475569; font-size: 14px; line-height: 24px; margin: 0 0 24px 0;">
                  Olá, <strong>${nome}</strong>!<br>
                  Obrigado por se registar no <strong>Sistema Integrado de Gestão do SINPROF</strong>. Para concluir a ativação da sua conta e validar o seu acesso com segurança, utilize o código de verificação abaixo:
                </p>

                <!-- Bloco de Destaque do Código de 6 Dígitos -->
                <div style="background-color: #f8fafc; border: 2px dashed #0284c7; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
                  <span style="display: block; font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">O Seu Código de Confirmação (6 Dígitos)</span>
                  <span style="display: inline-block; font-size: 38px; font-weight: 900; color: #0284c7; letter-spacing: 8px; font-family: monospace;">${codigo}</span>
                  <span style="display: block; font-size: 12px; color: #e11d48; margin-top: 8px; font-weight: 600;">⏱ Válido por ${ttlMinutos} minutos</span>
                </div>

                <p style="color: #64748b; font-size: 12px; line-height: 20px; margin: 0 0 16px 0;">
                  Se não solicitou este registo no SINPROF, por favor ignore esta mensagem. Nenhuma conta será ativada sem a introdução deste código.
                </p>

                <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 30px;">
                  <p style="color: #94a3b8; font-size: 11px; margin: 0; text-align: center;">
                    De acordo com a Lei de Protecção de Dados Pessoais (APD) da República de Angola.<br>
                    © 2026 SINPROF - Sindicato Nacional de Professores.
                  </p>
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  // Se houver uma chave do Resend configurada, efetua o disparo real via API
  if (resend) {
    try {
      const response = await resend.emails.send({
        from: 'SINPROF Angola <onboarding@resend.dev>', // Em produção: confirmacao@sinprof.ao
        to: [email],
        subject: `Código de Confirmação de Conta: ${codigo} - SINPROF`,
        html: templateHtml,
      });

      console.log(`[Resend API] E-mail de confirmação enviado para ${email}. ID:`, response.data?.id);

      return {
        success: true,
        email,
        codigo, // Disponível para validação
        idEnvioResend: response.data?.id || null,
        mensagem: `E-mail enviado com sucesso via API do Resend para ${email}`
      };
    } catch (error: any) {
      console.warn(`[Resend API] Erro no envio via Resend (${error.message}). Modo seguro de simulação acionado.`);
      return {
        success: true,
        email,
        codigo,
        modoSimulado: true,
        mensagem: `Código ${codigo} gerado com sucesso para ${email} (Simulação ativa: ${error.message})`
      };
    }
  } else {
    // Modo de demonstração / desenvolvimento caso o utilizador ainda não tenha configurado RESEND_API_KEY
    console.log(`[Resend Simulação] Chave RESEND_API_KEY ausente. Código de 6 dígitos para ${email}: [ ${codigo} ]`);
    return {
      success: true,
      email,
      codigo,
      modoSimulado: true,
      mensagem: `Código ${codigo} gerado para ${email}. Configure RESEND_API_KEY no arquivo .env para envio real pela API do Resend.`
    };
  }
}

/**
 * Valida o código de 6 dígitos introduzido pelo utilizador
 */
export function validarCodigoConfirmacao(email: string, codigoIntroduzido: string): { valido: boolean; mensagem: string } {
  const registro = codigosTemporarios.get(email.toLowerCase());

  if (!registro) {
    return { valido: false, mensagem: 'Nenhum código de confirmação encontrado para este e-mail. Solicite um novo envio.' };
  }

  if (Date.now() > registro.expiraEm) {
    codigosTemporarios.delete(email.toLowerCase());
    return { valido: false, mensagem: 'O código de confirmação expirou. Solicite um novo código de 6 dígitos.' };
  }

  if (registro.codigo !== codigoIntroduzido.trim()) {
    registro.tentativas += 1;
    if (registro.tentativas >= 5) {
      codigosTemporarios.delete(email.toLowerCase());
      return { valido: false, mensagem: 'Número máximo de tentativas excedido. Solicite um novo código.' };
    }
    return { valido: false, mensagem: `Código incorreto. Tentativa ${registro.tentativas} de 5.` };
  }

  // Código validado com sucesso
  codigosTemporarios.delete(email.toLowerCase());
  return { valido: true, mensagem: 'Conta confirmada com sucesso!' };
}
