using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Auth.ForgotPassword
{
    [Route("/api/auth")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Auth")]
    public class ForgotPasswordEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public ForgotPasswordEndpoint(IMediator mediator) => _mediator = mediator;

        [AllowAnonymous]
        [HttpPost("forgot-password", Name = "ForgotPassword")]
        public async Task<ActionResult<ForgotPasswordResponse>> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            await _mediator.Send(new ForgotPasswordCommand { Email = request.Email });
            return Ok(new ForgotPasswordResponse
            {
                Message = "Se existir uma conta para este e-mail, enviaremos um link de redefinição."
            });
        }
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = "";
    }

    public class ForgotPasswordResponse
    {
        public string Message { get; set; } = "";
    }
}
