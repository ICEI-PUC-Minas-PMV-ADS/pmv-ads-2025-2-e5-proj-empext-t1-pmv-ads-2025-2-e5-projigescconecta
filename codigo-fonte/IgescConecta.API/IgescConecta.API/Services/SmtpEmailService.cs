using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using IgescConecta.API.Common.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace IgescConecta.API.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly IOptions<SmtpOptions> _smtpOpt;
        private readonly ILogger<SmtpEmailService> _logger;
        private readonly IConfiguration _cfg; // para ler Smtp:User/Password de variável de ambiente

        public SmtpEmailService(
            IOptions<SmtpOptions> smtpOpt,
            ILogger<SmtpEmailService> logger,
            IConfiguration cfg)
        {
            _smtpOpt = smtpOpt;
            _logger = logger;
            _cfg = cfg;
        }

        public async Task SendPasswordResetLinkAsync(string toEmail, string resetLink)
        {
            var o = _smtpOpt.Value;

            // Lê segredos de ambiente (IIS/Windows), não do appsettings.json
            var user = _cfg["Smtp:User"] ?? _cfg["Smtp__User"];
            var pass = _cfg["Smtp:Password"] ?? _cfg["Smtp__Password"];

            using var client = new SmtpClient(o.Host, o.Port)
            {
                EnableSsl = o.UseSsl,
                Credentials = (string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(pass))
                    ? CredentialCache.DefaultNetworkCredentials
                    : new NetworkCredential(user, pass)
            };

            var fromName = _cfg["Email:FromName"] ?? "IGESC Conecta";
            var fromEmail = _cfg["Email:FromEmail"] ?? "no-reply@igesc.org";
            var subject = "IGESC Conecta – Redefinição de senha";

            // Paleta IGESC
            const string AzulClaro = "#1E4EC4";
            const string AzulEscuro = "#264197";
            const string VerdeAcao = "#21AD53";
            const string CinzaClaro = "#F6F6F7";
            const string CinzaEscuro = "#656D77";

            // Corpo texto (fallback)
            var plainText = $@"Olá,

Recebemos uma solicitação para redefinir sua senha no IGESC Conecta.
Para continuar, acesse o link abaixo (ou copie e cole no navegador):

{resetLink}

Se você não fez essa solicitação, pode ignorar este e-mail.

Atenciosamente,
Equipe IGESC Conecta";

            // Logo via CID (Content-ID)
            var logoCid = "logo_igesc";

            // HTML com identidade visual
            var html = $@"<!doctype html>
<html lang=""pt-BR"">
<head>
  <meta charset=""utf-8"">
  <meta name=""viewport"" content=""width=device-width,initial-scale=1"">
  <title>{subject}</title>
</head>
<body style=""margin:0;padding:0;background:{CinzaClaro};font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;"">
  <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background:{AzulEscuro};"">
    <tr>
      <td align=""center"" style=""padding:20px 12px;"">
        <img src=""cid:{logoCid}"" alt=""Instituto GESC"" width=""96"" height=""96"" style=""display:block;border:0;outline:none;text-decoration:none;border-radius:12px;"" />
      </td>
    </tr>
  </table>

  <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"">
    <tr>
      <td align=""center"" style=""padding:24px;"">
        <table role=""presentation"" cellpadding=""0"" cellspacing=""0"" style=""max-width:640px;width:100%;background:#FFFFFF;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,.06);"">
          <tr>
            <td style=""padding:28px 28px 6px 28px;"">
              <h1 style=""margin:0 0 8px 0;font-size:20px;line-height:28px;color:#111827;"">Redefinição de senha</h1>
              <p style=""margin:0;color:{CinzaEscuro};font-size:14px;line-height:22px;"">
                Recebemos uma solicitação para redefinir sua senha no IGESC Conecta.
              </p>
            </td>
          </tr>
          <tr>
            <td style=""padding:12px 28px 20px 28px;"">
              <p style=""margin:0 0 16px 0;color:{CinzaEscuro};font-size:14px;line-height:22px;"">
                Para continuar, clique no botão abaixo:
              </p>
              <p style=""margin:0 0 24px 0;"">
                <a href=""{resetLink}"" target=""_blank""
                   style=""display:inline-block;background:{VerdeAcao};color:#FFFFFF;text-decoration:none;
                          padding:12px 18px;border-radius:10px;font-weight:600;font-size:14px;"">
                  Redefinir senha
                </a>
              </p>
              <p style=""margin:0 0 8px 0;color:{CinzaEscuro};font-size:12px;line-height:18px;"">
                Se o botão não funcionar, copie e cole este link no navegador:
              </p>
              <p style=""margin:0 0 24px 0;color:{AzulClaro};font-size:12px;line-height:18px;word-break:break-all;"">
                {resetLink}
              </p>
              <p style=""margin:0;color:{CinzaEscuro};font-size:12px;line-height:18px;"">
                Se você não fez essa solicitação, pode ignorar este e-mail.
              </p>
            </td>
          </tr>
          <tr>
            <td style=""padding:18px 28px 26px 28px;border-top:1px solid {CinzaClaro};color:{CinzaEscuro};font-size:12px;"">
              Atenciosamente,<br/>Equipe IGESC Conecta
            </td>
          </tr>
        </table>
        <p style=""margin:12px 0 0 0;color:{CinzaEscuro};font-size:11px;"">
          Este é um e-mail automático, por favor não responda.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>";

            // Monta a mensagem com HTML + texto
            using var msg = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = subject,
                SubjectEncoding = Encoding.UTF8,
                BodyEncoding = Encoding.UTF8,
                HeadersEncoding = Encoding.UTF8,
                IsBodyHtml = true
            };
            msg.To.Add(toEmail);

            // Alternate views (text/plain + text/html)
            msg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(plainText, Encoding.UTF8, "text/plain"));

            var htmlView = AlternateView.CreateAlternateViewFromString(html, Encoding.UTF8, MediaTypeNames.Text.Html);

            // Anexa a logo como LinkedResource (CID)
            var logoPathCfg = _cfg["Email:LogoPath"]; // wwwroot/email/logo-igesc.png
            string? logoPath = null;
            if (!string.IsNullOrWhiteSpace(logoPathCfg))
            {
                logoPath = Path.IsPathRooted(logoPathCfg)
                    ? logoPathCfg
                    : Path.Combine(AppContext.BaseDirectory, logoPathCfg);
            }

            // (Opcional) log para diagnosticar caminho e existência
            _logger.LogInformation("Email logo path resolvido: {Path} (existe? {Exists})",
                logoPath, !string.IsNullOrWhiteSpace(logoPath) && File.Exists(logoPath));


            if (!string.IsNullOrWhiteSpace(logoPath) && File.Exists(logoPath))
            {
                var logo = new LinkedResource(logoPath, "image/png")
                {
                    ContentId = logoCid,
                    TransferEncoding = TransferEncoding.Base64,
                };
                htmlView.LinkedResources.Add(logo);
            }

            msg.AlternateViews.Add(htmlView);


            try
            {
                await client.SendMailAsync(msg);
                _logger.LogInformation("E-mail de redefinição enviado para {Email}", toEmail);
            }
            catch (SmtpException ex)
            {
                _logger.LogError(ex, "Falha ao enviar e-mail de redefinição para {Email}", toEmail);
                throw;
            }
        }
    }
}
