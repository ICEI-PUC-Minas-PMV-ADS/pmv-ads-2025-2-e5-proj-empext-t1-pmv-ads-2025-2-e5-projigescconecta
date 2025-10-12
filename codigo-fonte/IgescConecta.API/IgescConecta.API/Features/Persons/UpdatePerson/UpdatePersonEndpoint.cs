using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Persons.UpdatePerson
{
    [Route("api/persons")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Persons")]
    public class UpdatePersonEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public UpdatePersonEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{personId}", Name = "UpdatePerson")]
        public async Task<ActionResult<PersonResponse>> UpdatePerson(
            int personId,
            [FromBody] UpdatePersonRequest request)
        {
            var result = await _mediator.Send(new UpdatePersonCommand
            {
                PersonId = personId, 
                Name = request.Name,
                Email = request.Email,
                PersonalDocumment = request.PersonalDocumment,
                SecondaryEmail = request.SecondaryEmail,
                PrimaryPhone = request.PrimaryPhone,
                SecondaryPhone = request.SecondaryPhone,
                Education1 = request.Education1,
                Education2 = request.Education2,
                ProfessionalActivity = request.ProfessionalActivity,
                IsActive = request.IsActive 
            });

            if (result.IsFailure)
                return BadRequest(result.Error);

            var p = result.Value;
            var resp = new PersonResponse
            {
                PersonId = p.Id,
                Name = p.Name,
                Email = p.Email,
                PersonalDocumment = p.PersonalDocumment,
                SecondaryEmail = p.SecondaryEmail,
                PrimaryPhone = p.PrimaryPhone,
                SecondaryPhone = p.SecondaryPhone,
                Education1 = p.Education1,
                Education2 = p.Education2,
                ProfessionalActivity = p.ProfessionalActivity,
                IsActive = p.IsActive
            };

            return Ok(resp);
        }
    }

    public class UpdatePersonRequest
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? PersonalDocumment { get; set; }
        public string? SecondaryEmail { get; set; }
        public string? PrimaryPhone { get; set; }
        public string? SecondaryPhone { get; set; }
        public string? Education1 { get; set; }
        public string? Education2 { get; set; }
        public string? ProfessionalActivity { get; set; }
        public bool? IsActive { get; set; } 
    }

    public class PersonResponse
    {
        public int PersonId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PersonalDocumment { get; set; }
        public string? SecondaryEmail { get; set; }
        public string? PrimaryPhone { get; set; }
        public string? SecondaryPhone { get; set; }
        public string? Education1 { get; set; }
        public string? Education2 { get; set; }
        public string? ProfessionalActivity { get; set; }
        public bool IsActive { get; set; }
    }
}
