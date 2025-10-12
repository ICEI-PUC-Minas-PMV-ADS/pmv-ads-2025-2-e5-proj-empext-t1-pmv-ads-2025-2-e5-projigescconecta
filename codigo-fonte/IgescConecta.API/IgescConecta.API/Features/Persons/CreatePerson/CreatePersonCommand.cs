using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Persons.CreatePerson
{
    public class CreatePersonCommand : IRequest<Result<Person, ValidationFailed>>
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string PersonalDocumment { get; set; }
        public string? SecondaryEmail { get; set; }
        public string? PrimaryPhone { get; set; }
        public string? SecondaryPhone { get; set; }
        public string? Education1 { get; set; }
        public string? Education2 { get; set; }
        public string? ProfessionalActivity { get; set; }
        public bool IsActive { get; set; } = true; 
    }

    internal sealed class CreatePersonCommandHandler
        : IRequestHandler<CreatePersonCommand, Result<Person, ValidationFailed>>
    {
        private readonly ApplicationDbContext _db;

        public CreatePersonCommandHandler(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<Result<Person, ValidationFailed>> Handle(CreatePersonCommand request, CancellationToken ct)
        {
            // Regra básica: doc único
            if (await _db.Persons.AnyAsync(p => p.PersonalDocumment == request.PersonalDocumment, ct))
                return new ValidationFailed(new[] { "CPF Já está sendo usado por outra pessoa." });

            var person = new Person
            {
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
            };

            _db.Persons.Add(person);
            await _db.SaveChangesAsync(ct);
            return person;
        }
    }
}
