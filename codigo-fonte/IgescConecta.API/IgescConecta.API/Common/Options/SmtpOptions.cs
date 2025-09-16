namespace IgescConecta.API.Common.Options
{
    public class SmtpOptions
    {
        public string Host { get; set; } = "";
        public int Port { get; set; } = 25;
        public bool UseSsl { get; set; } = false;
        // Segredos via variáveis de ambiente (IIS), não mapeados aqui por segurança:
        // User / Password
    }
}
