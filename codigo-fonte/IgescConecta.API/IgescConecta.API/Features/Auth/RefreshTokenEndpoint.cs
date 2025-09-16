using IgescConecta.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace IgescConecta.API.Features.Auth
{
    [Route("/api/auth")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Auth")]
    public class RefreshTokenEndpoint : ControllerBase
    {
        private readonly IAuthAuthenticatonService _auth;

        public RefreshTokenEndpoint(IAuthAuthenticatonService auth)
        {
            _auth = auth;
        }

        [AllowAnonymous]
        [HttpPost ("RefreshToken", Name = "RefreshToken")]
        public async Task<ActionResult> RefreshToken(LoginResponse tokenModel)
        {
            if (tokenModel is null)
            {
                return BadRequest("Requisição do cliente inválida.");
            }

            string? accessToken = tokenModel.AccessToken;
            string? refreshToken = tokenModel.RefreshToken;

            var principal = _auth.GetPrincipalFromExpiredToken(accessToken);

            if(principal == null)
            {
                return BadRequest("Token de acesso ou refresh inválido.");
            }

            var newAccessToken = _auth.CreateToken(principal.Claims.ToList());
            var newRefreshToken = _auth.GenerateRefreshToken();

            tokenModel.RefreshToken = newRefreshToken;
            var expiration = DateTime.UtcNow.AddHours(10);

            return new ObjectResult(new
            {
                accessToken = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
                refreshToken = newRefreshToken,
                expiresIn = expiration
            });
        }
    }

    public class LoginResponse
    {
        public string AccessToken { get; set; }

        public string RefreshToken { get; set; }

        public DateTime ExpiresIn { get; set; }
    }

}
