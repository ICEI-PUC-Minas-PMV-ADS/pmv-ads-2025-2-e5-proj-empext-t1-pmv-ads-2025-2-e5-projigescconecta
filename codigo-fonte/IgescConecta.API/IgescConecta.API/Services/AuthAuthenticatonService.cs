using IgescConecta.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace IgescConecta.API.Services
{
    public class AuthAuthenticatonService : IAuthAuthenticatonService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public AuthAuthenticatonService(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<UserToken> BuildToken(User user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, $"{role}"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:JwtSecurityKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            //Mudar para 10 minutos depois
            var expiration = DateTime.UtcNow.AddHours(10);

            JwtSecurityToken token = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: expiration,
                signingCredentials: creds);

            var refreshToken = GenerateRefreshToken();

            return new UserToken()
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                RefresfToken = refreshToken,
                ExpiresIn = expiration
            };
        }

        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:JwtSecurityKey"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            if(securityToken is not JwtSecurityToken jwtSecurityToken ||
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenArgumentException("invalid token");

            return principal;
        }

        public JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
            var authSingingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:JwtSecurityKey"]));
            _ = int.TryParse(_configuration["Jwt: JwtExpireyInMinutes"], out int tokenValidityInMinutes);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:JwtIssuer"],
                audience: _configuration["Jwt:JwtAudience"],
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSingingKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
