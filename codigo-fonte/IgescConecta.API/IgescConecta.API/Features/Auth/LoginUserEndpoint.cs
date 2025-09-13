using Microsoft.AspNetCore.Mvc;
using IgescConecta.API.Services;
using Microsoft.AspNetCore.Identity;
using IgescConecta.Domain.Entities;

namespace IgescConecta.API.Features.Auth
{
    [Route("/api/auth")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Auth")]
    public class LoginUserEndpoint : ControllerBase
    {
        private readonly IAuthAuthenticatonService _auth;
        private readonly UserManager<User> _userManager;
        public LoginUserEndpoint(IAuthAuthenticatonService auth, UserManager<User> userManager)
        {
            _auth = auth;
            _userManager = userManager;
        }

        [HttpPost("Login", Name = "Login")]
        public async Task<ActionResult<UserToken>> LoginUser(UserLogin model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if(user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return await _auth.BuildToken(user);
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                return BadRequest(ModelState);
            }
        }
    }
}
