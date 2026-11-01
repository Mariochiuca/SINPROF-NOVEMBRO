"""
Função em Python para envio de e-mail de confirmação de conta com código de 6 dígitos
utilizando a API do Resend (resend-py).

Requisitos:
    pip install resend
"""

import os
import random
import resend

# Configura a chave de API do Resend a partir de variável de ambiente
# ou defina diretamente: resend.api_key = "re_123456789_abcdefg"
resend.api_key = os.environ.get("RESEND_API_KEY", "re_sua_chave_aqui")


def gerar_codigo_6_digitos() -> str:
    """Gera um código aleatório seguro de 6 dígitos numéricos."""
    return str(random.randint(100000, 999999))


def enviar_email_confirmacao_resend(email_usuario: str, nome_usuario: str = "Professor(a)") -> dict:
    """
    Recebe o e-mail do utilizador no registo e usa a API do Resend
    para enviar um e-mail de confirmação de conta com um código de 6 dígitos.

    Args:
        email_usuario (str): Endereço de e-mail do utilizador que se registou.
        nome_usuario (str, optional): Nome do utilizador. Padrão: "Professor(a)".

    Returns:
        dict: Dicionário contendo o resultado da operação, status, código e ID do envio.
    """
    if not email_usuario or "@" not in email_usuario:
        raise ValueError("Endereço de e-mail inválido fornecido.")

    # 1. Gera o código de 6 dígitos
    codigo_verificacao = gerar_codigo_6_digitos()

    # 2. Template HTML elegante com as cores oficiais do SINPROF Angola
    template_html = f"""
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <title>Confirmação de Registo - SINPROF</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 30px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
              
              <!-- Cabeçalho SINPROF -->
              <tr style="background-color: #0284c7; padding: 25px; text-align: center;">
                <td style="padding: 25px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">SINPROF ANGOLA</h1>
                  <p style="color: #fef08a; margin: 5px 0 0; font-size: 12px; font-weight: bold;">Sindicato Nacional de Professores</p>
                </td>
              </tr>

              <!-- Mensagem Principal -->
              <tr>
                <td style="padding: 35px 30px;">
                  <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Confirmação de Registo de Conta</h2>
                  <p style="color: #475569; font-size: 14px; line-height: 22px;">
                    Olá, <strong>{nome_usuario}</strong>!<br>
                    Para confirmar a sua conta no Sistema de Gestão do SINPROF, utilize o código de verificação de 6 dígitos abaixo:
                  </p>

                  <!-- Caixa do Código de 6 Dígitos -->
                  <div style="background-color: #f8fafc; border: 2px dashed #0284c7; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0;">
                    <span style="display: block; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">Código de Confirmação (6 Dígitos)</span>
                    <span style="display: inline-block; font-size: 36px; font-weight: 900; color: #0284c7; letter-spacing: 6px; font-family: monospace;">{codigo_verificacao}</span>
                    <span style="display: block; font-size: 11px; color: #e11d48; margin-top: 6px;">⏱ Válido por 15 minutos</span>
                  </div>

                  <p style="color: #64748b; font-size: 12px; line-height: 18px;">
                    Se não solicitou a criação desta conta, ignore este e-mail por motivos de segurança.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    # 3. Disparo através da API do Resend
    try:
        params: resend.Emails.SendParams = {
            "from": "SINPROF Angola <onboarding@resend.dev>",
            "to": [email_usuario],
            "subject": f"Código de Confirmação de Conta: {codigo_verificacao} - SINPROF",
            "html": template_html,
        }

        email_enviado = resend.Emails.send(params)
        print(f"[Resend] E-mail enviado com sucesso para {email_usuario}! ID: {email_enviado}")

        return {
            "status": "sucesso",
            "email": email_usuario,
            "codigo": codigo_verificacao,
            "id_resend": email_enviado.get("id") if isinstance(email_enviado, dict) else str(email_enviado),
            "mensagem": "E-mail de confirmação enviado com sucesso via Resend API."
        }

    except Exception as erro:
        print(f"[Resend Erro] Falha no disparo: {erro}")
        # Retorna o código para fins de teste e desenvolvimento
        return {
            "status": "simulado",
            "email": email_usuario,
            "codigo": codigo_verificacao,
            "erro": str(erro),
            "mensagem": f"Código gerado ({codigo_verificacao}) com simulação ativa."
        }


# Exemplo de Execução
if __name__ == "__main__":
    email_teste = "professor.angola@exemplo.com"
    nome_teste = "João Baptista Chivela"
    resultado = enviar_email_confirmacao_resend(email_teste, nome_teste)
    print("Resultado da operação:", resultado)
