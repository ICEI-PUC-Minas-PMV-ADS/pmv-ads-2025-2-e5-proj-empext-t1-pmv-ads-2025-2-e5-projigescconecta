using IgescConecta.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace IgescConecta.API.Services
{
    public interface IAuthAuthenticatonService
    {
        Task<UserToken> BuildToken(User user);
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token);
        JwtSecurityToken CreateToken(List<Claim> authClaims);
        string GenerateRefreshToken();
    }
}
