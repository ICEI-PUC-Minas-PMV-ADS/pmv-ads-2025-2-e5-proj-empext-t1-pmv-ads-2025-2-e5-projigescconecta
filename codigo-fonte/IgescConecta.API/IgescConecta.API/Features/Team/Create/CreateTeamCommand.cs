// CreateTeamCommand.cs
using MediatR;
using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;

namespace IgescConecta.API.Features.Teams.CreateTeam
{
    public class CreateTeamCommand : IRequest<Result<Team, ValidationFailed>>
    {
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Time { get; set; }
        public int CourseId { get; set; }
        public int CreatedByUserId { get; set; }
    }

    internal sealed class CreateTeamCommandHandler : IRequestHandler<CreateTeamCommand, Result<Team, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateTeamCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Team, ValidationFailed>> Handle(CreateTeamCommand request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(request.Name))
                errors.Add("O nome da turma é obrigatório.");

            if (request.StartDate >= request.EndDate)
                errors.Add("A data de início deve ser anterior à data de término.");

            /* var courseExists = await _context.Courses.AnyAsync(c => c.Id == request.CourseId && c.IsActive, cancellationToken);
            if (!courseExists)
                errors.Add("O curso informado não existe."); */

            if (errors.Any())
                return new ValidationFailed(string.Join("; ", errors));

            var now = DateTime.UtcNow;

            var team = new Team
            {
                Name = request.Name,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Time = request.Time,
                CourseId = request.CourseId,
                IsActive = true,
                CreatedAt = now,
                CreatedBy = request.CreatedByUserId,
                UpdatedAt = now,
                UpdatedBy = request.CreatedByUserId,
                DeactivatedAt = null,
                DeactivatedBy = null
            };

            _context.Teams.Add(team);
            await _context.SaveChangesAsync(cancellationToken);

            return team;
        }
    }
}
