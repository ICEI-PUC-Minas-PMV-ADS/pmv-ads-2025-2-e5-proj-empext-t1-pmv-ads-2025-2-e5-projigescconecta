using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Auth.ResetPassword
{
    [Route("/api/auth")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Auth")]
    public class ResetPasswordEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public ResetPasswordEndpoint(IMediator mediator) => _mediator = mediator;

        [AllowAnonymous]
        [HttpPatch("reset-password", Name = "ResetPassword")]
        public async Task<ActionResult<ResetPasswordResponse>> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var result = await _mediator.Send(new ResetPasswordCommand
            {
                UserId = request.UserId,
                Token = request.Token,
                NewPassword = request.NewPassword
            });

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(new ResetPasswordResponse { Message = "Senha redefinida com sucesso." });
        }
    }

    public class ResetPasswordRequest
    {
        public int UserId { get; set; }
        public string Token { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }

    public class ResetPasswordResponse
    {
        public string Message { get; set; } = "";
    }
}
