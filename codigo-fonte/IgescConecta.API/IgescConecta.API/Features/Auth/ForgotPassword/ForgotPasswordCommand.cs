using System.Text;
using IgescConecta.API.Common.Options;
using IgescConecta.API.Services;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;

namespace IgescConecta.API.Features.Auth.ForgotPassword
{
    public class ForgotPasswordCommand : IRequest<Unit>
    {
        public string Email { get; set; } = "";
    }

    internal sealed class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, Unit>
    {
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _email;
        private readonly IOptions<FrontendOptions> _frontend;

        public ForgotPasswordCommandHandler(
            UserManager<User> userManager,
            IEmailService email,
            IOptions<FrontendOptions> frontend)
        {
            _userManager = userManager;
            _email = email;
            _frontend = frontend;
        }

        public async Task<Unit> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return Unit.Value;

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user is null)
            {
                // Não revelar existência; apenas retornar
                return Unit.Value;
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var tokenUrlSafe = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var template = _frontend.Value.ResetPasswordUrlTemplate ?? "";
            // Monta a URL substituindo placeholders
            var resetLink = template
                .Replace("{uid}", user.Id.ToString())
                .Replace("{token}", tokenUrlSafe);

            await _email.SendPasswordResetLinkAsync(user.Email!, resetLink);
            return Unit.Value;
        }
    }
}
