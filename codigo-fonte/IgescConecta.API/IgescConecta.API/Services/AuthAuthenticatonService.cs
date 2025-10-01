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
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Role, role ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var keyStr = _configuration.GetValue<string>("Jwt:JwtSecurityKey")
                        ?? throw new InvalidOperationException("Missing Jwt:JwtSecurityKey");
            var issuer = _configuration.GetValue<string>("Jwt:JwtIssuer")
                        ?? throw new InvalidOperationException("Missing Jwt:JwtIssuer");
            var audience = _configuration.GetValue<string>("Jwt:JwtAudience")
                        ?? throw new InvalidOperationException("Missing Jwt:JwtAudience");
            var minutes = _configuration.GetValue<int?>("Jwt:ExpiryMinutes") ?? 600;

            var creds = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr)),
                SecurityAlgorithms.HmacSha256);

            var expiration = DateTime.UtcNow.AddMinutes(minutes);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expiration,
                signingCredentials: creds
            );

            var refreshToken = GenerateRefreshToken();

            return new UserToken
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
                throw new SecurityTokenArgumentException("Token inválido");

            return principal;
        }

        public JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
            var keyStr = _configuration.GetValue<string>("Jwt:JwtSecurityKey")
                        ?? throw new InvalidOperationException("Missing Jwt:JwtSecurityKey");
            var issuer = _configuration.GetValue<string>("Jwt:JwtIssuer")
                        ?? throw new InvalidOperationException("Missing Jwt:JwtIssuer");
            var audience = _configuration.GetValue<string>("Jwt:JwtAudience")
                        ?? throw new InvalidOperationException("Missing Jwt:JwtAudience");
            var minutes = _configuration.GetValue<int?>("Jwt:ExpiryMinutes") ?? 600;

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));

            return new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                expires: DateTime.UtcNow.AddMinutes(minutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );
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
