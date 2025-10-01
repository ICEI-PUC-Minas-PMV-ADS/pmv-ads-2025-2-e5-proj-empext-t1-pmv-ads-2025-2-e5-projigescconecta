// EditTeamCommand.cs
using MediatR;
using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace IgescConecta.API.Features.Teams.EditTeam
{
    public class EditTeamCommand : IRequest<Result<Team, ValidationFailed>>
    {
        public int TeamId { get; set; }
        public string? Name { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Time { get; set; }
        public int? CourseId { get; set; }
        public int UpdatedByUserId { get; set; }
    }

    internal sealed class EditTeamCommandHandler : IRequestHandler<EditTeamCommand, Result<Team, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public EditTeamCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Team, ValidationFailed>> Handle(EditTeamCommand request, CancellationToken cancellationToken)
        {
            var team = await _context.Teams.FirstOrDefaultAsync(t => t.Id == request.TeamId && t.IsActive, cancellationToken);
            if (team == null)
                return new ValidationFailed("Turma não encontrada ou está desativada.");

            var errors = new List<string>();

            // Validações básicas
            if (request.StartDate.HasValue && request.EndDate.HasValue && request.StartDate >= request.EndDate)
                errors.Add("A data de início deve ser anterior à data de término.");

            if (request.CourseId.HasValue)
            {
                var courseExists = await _context.Courses.AnyAsync(c => c.Id == request.CourseId.Value && c.IsActive, cancellationToken);
                if (!courseExists)
                    errors.Add("O curso informado não existe.");
            }

            if (errors.Count > 0)
                return new ValidationFailed(string.Join("; ", errors));

            // Atualiza somente os campos enviados
            if (!string.IsNullOrWhiteSpace(request.Name))
                team.Name = request.Name;

            if (request.StartDate.HasValue)
                team.StartDate = request.StartDate.Value;

            if (request.EndDate.HasValue)
                team.EndDate = request.EndDate.Value;

            if (!string.IsNullOrWhiteSpace(request.Time))
                team.Time = request.Time;

            if (request.CourseId.HasValue)
                team.CourseId = request.CourseId.Value;

            team.UpdatedAt = DateTime.UtcNow;
            team.UpdatedBy = request.UpdatedByUserId;

            await _context.SaveChangesAsync(cancellationToken);

            return team;
        }
    }
}
