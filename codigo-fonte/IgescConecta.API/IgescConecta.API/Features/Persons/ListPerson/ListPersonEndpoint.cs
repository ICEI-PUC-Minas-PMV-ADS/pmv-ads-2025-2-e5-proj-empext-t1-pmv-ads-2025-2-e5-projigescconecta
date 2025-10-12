using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Users.ListUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Persons.ListPerson
{

    [ApiAuthorize]
    [Route("/api/persons")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Persons")]
    public class ListPersonEndpoint : ControllerBase
    {

        private readonly IMediator _mediator;

        public ListPersonEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("ListPerson", Name = "ListPerson")]
        public async Task<ActionResult<ListPersonViewModel>> ListPerson(ListPersonRequest request)
        {
            var result = await _mediator.Send(new ListPersonQuery(request.PageNumber, request.PageSize, request.Filters));
            return Ok(result);
        }



    }

    public class ListPersonRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public List<Filter> Filters { get; set; } = new();
    }
}
