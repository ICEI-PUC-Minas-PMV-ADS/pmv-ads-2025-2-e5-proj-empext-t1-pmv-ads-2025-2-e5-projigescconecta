using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Users.ListUser
{
    [ApiAuthorize]
    [Route("/api/users")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Users")]
    public class ListUserEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListUserEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("ListUser", Name = "ListUser")]
        public async Task<ActionResult<ListUserViewModel>> ListUser(ListUserRequest request)
        {
            var result = await _mediator.Send(new ListUserQuery(request.PageNumber, request.PageSize, request.Filters));
            return Ok(result);
        }
    }

    public class ListUserRequest
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public List<Filter> Filters { get; set; } = new();
    }
}
