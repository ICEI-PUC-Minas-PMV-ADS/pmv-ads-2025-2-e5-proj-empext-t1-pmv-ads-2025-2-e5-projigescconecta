using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace IgescConecta.API.Services
{
    // Implementação simples: registra no log o link de redefinição
    public class ConsoleEmailService : IEmailService
    {
        private readonly ILogger<ConsoleEmailService> _logger;
        public ConsoleEmailService(ILogger<ConsoleEmailService> logger) => _logger = logger;

        public Task SendPasswordResetLinkAsync(string toEmail, string resetLink)
        {
            _logger.LogInformation("Link de redefinição de senha para {Email}: {Link}", toEmail, resetLink);
            return Task.CompletedTask;
        }
    }
}

