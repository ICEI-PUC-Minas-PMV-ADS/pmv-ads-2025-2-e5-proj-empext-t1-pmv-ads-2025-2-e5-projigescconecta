using System.Text;
using IgescConecta.API.Common.Validation;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;

namespace IgescConecta.API.Features.Auth.ResetPassword
{
    public class ResetPasswordCommand : IRequest<Result<bool, ValidationFailed>>
    {
        public int UserId { get; set; }
        public string Token { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }

    internal sealed class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Result<bool, ValidationFailed>>
    {
        private readonly UserManager<User> _userManager;

        public ResetPasswordCommandHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<Result<bool, ValidationFailed>> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            // Buscar usuário
            var user = await _userManager.FindByIdAsync(request.UserId.ToString());
            if (user is null)
                return new ValidationFailed(new[] { "Token ou usuário inválido." });

            // Decodificar token URL-safe
            string decodedToken;
            try
            {
                var tokenBytes = WebEncoders.Base64UrlDecode(request.Token);
                decodedToken = Encoding.UTF8.GetString(tokenBytes);
            }
            catch
            {
                return new ValidationFailed(new[] { "Token ou usuário inválido." });
            }

            // Resetar senha
            var result = await _userManager.ResetPasswordAsync(user, decodedToken, request.NewPassword);
            if (!result.Succeeded)
                return new ValidationFailed(result.Errors.Select(e => e.Description).ToArray());

            return true;
        }
    }
}

