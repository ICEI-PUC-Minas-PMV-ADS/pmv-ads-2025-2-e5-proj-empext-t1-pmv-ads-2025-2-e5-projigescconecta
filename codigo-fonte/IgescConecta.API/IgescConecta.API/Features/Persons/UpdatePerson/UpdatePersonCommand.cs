using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Persons.UpdatePerson
{
    public class UpdatePersonCommand : IRequest<Result<Person, ValidationFailed>>
    {
        public int PersonId { get; set; }      
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

    internal sealed class UpdatePersonCommandHandler
        : IRequestHandler<UpdatePersonCommand, Result<Person, ValidationFailed>>
    {
        private readonly ApplicationDbContext _db;

        public UpdatePersonCommandHandler(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<Result<Person, ValidationFailed>> Handle(UpdatePersonCommand request, CancellationToken ct)
        {
          
            var person = await _db.Persons
                .FirstOrDefaultAsync(p => p.Id == request.PersonId, ct);

            if (person == null)
                return new ValidationFailed(new[] { "Pessoa não encontrada" });

            if (!string.IsNullOrWhiteSpace(request.PersonalDocumment) &&
                !string.Equals(request.PersonalDocumment, person.PersonalDocumment, StringComparison.OrdinalIgnoreCase))
            {
                var exists = await _db.Persons
                    .AnyAsync(p => p.PersonalDocumment == request.PersonalDocumment && p.Id != person.Id, ct);
                if (exists)
                    return new ValidationFailed(new[] { "CPF Sendo usado por outra pessoa." });

                person.PersonalDocumment = request.PersonalDocumment;
            }

            person.Name = string.IsNullOrWhiteSpace(request.Name) ? person.Name : request.Name;
            person.Email = string.IsNullOrWhiteSpace(request.Email) ? person.Email : request.Email;
            person.SecondaryEmail = request.SecondaryEmail ?? person.SecondaryEmail;
            person.PrimaryPhone = request.PrimaryPhone ?? person.PrimaryPhone;
            person.SecondaryPhone = request.SecondaryPhone ?? person.SecondaryPhone;
            person.Education1 = request.Education1 ?? person.Education1;
            person.Education2 = request.Education2 ?? person.Education2;
            person.ProfessionalActivity = request.ProfessionalActivity ?? person.ProfessionalActivity;

            if (request.IsActive.HasValue)
                person.IsActive = request.IsActive.Value;

            await _db.SaveChangesAsync(ct);
            return person;
        }
    }
}
