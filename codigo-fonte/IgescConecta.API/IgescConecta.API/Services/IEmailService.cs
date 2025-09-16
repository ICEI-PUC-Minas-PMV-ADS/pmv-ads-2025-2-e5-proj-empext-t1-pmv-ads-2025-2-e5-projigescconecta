using System.Threading.Tasks;

namespace IgescConecta.API.Services
{
    public interface IEmailService
    {
        Task SendPasswordResetLinkAsync(string toEmail, string resetLink);
    }
}

