using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Persons.GetPerson
{
    [Route("/api/persons")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Persons")]
    [Authorize(Roles = "Admin,Editor")]
    public class GetPersonEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public GetPersonEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpGet("{personId:int}", Name = "GetPerson")]
        public async Task<ActionResult<PersonViewModel>> Get(int personId)
        {
            var vm = await _mediator.Send(new GetPersonQuery(personId));
            return vm is null ? NotFound() : Ok(vm);
        }
    }

    public class PersonViewModel
    {
        public int PersonId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PersonalDocumment { get; set; }
        public string? PrimaryPhone { get; set; }
        public string? SecondaryPhone { get; set; }
        public string? SecondaryEmail { get; set; }
        public string? Education1 { get; set; }
        public string? Education2 { get; set; }
        public string? ProfessionalActivity { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
