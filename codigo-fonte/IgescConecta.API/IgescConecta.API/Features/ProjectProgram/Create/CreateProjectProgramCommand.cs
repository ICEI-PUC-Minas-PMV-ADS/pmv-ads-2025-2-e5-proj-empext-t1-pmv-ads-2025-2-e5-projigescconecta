using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectPrograms.Create
{
    public class CreateProjectProgramRequest
    {
        public string Name { get; set; } = string.Empty;
        public IList<OdsType> OdsTypes { get; set; } = new List<OdsType>();
        public ProjectDecisionType? Decision { get; set; }
        public int ProjectThemeId { get; set; }
        public int ProjectTypeId { get; set; }
        public int TeamId { get; set; }
        public int OscId { get; set; }
        public int? ProjectDocumentId { get; set; }
    }

    public class CreateProjectProgramResponse
    {
        public int ProjectProgramId { get; set; }
        public CreateProjectProgramResponse(int id) => ProjectProgramId = id;
    }

    public class CreateProjectProgramCommand
        : IRequest<Result<CreateProjectProgramResponse, ValidationFailed>>
    {
        public CreateProjectProgramRequest Body { get; set; } = new();
    }

    internal sealed class CreateProjectProgramCommandHandler
        : IRequestHandler<CreateProjectProgramCommand, Result<CreateProjectProgramResponse, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateProjectProgramCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<CreateProjectProgramResponse, ValidationFailed>> Handle(
            CreateProjectProgramCommand request,
            CancellationToken cancellationToken)
        {
            var body = request.Body;

            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(body.Name))
                errors.Add("O nome do projeto é obrigatório.");

            if (body.OdsTypes is null || body.OdsTypes.Count == 0)
                errors.Add("Selecione ao menos uma ODS.");

            if (body.ProjectThemeId <= 0)
                errors.Add("Tema do Projeto inválido.");

            if (body.ProjectTypeId <= 0)
                errors.Add("Tipo do Projeto inválido.");

            if (body.TeamId <= 0)
                errors.Add("Turma inválida.");

            if (body.OscId <= 0)
                errors.Add("OSC inválida.");

            if (errors.Count > 0)
                return new ValidationFailed(errors.ToArray());

            var themeExists = await _context.ProjectThemes
                .AnyAsync(x => x.Id == body.ProjectThemeId && !x.IsDeleted, cancellationToken);
            if (!themeExists) return new ValidationFailed(new[] { "Tema do Projeto não encontrado." });

            var typeExists = await _context.ProjectTypes
                .AnyAsync(x => x.Id == body.ProjectTypeId && !x.IsDeleted, cancellationToken);
            if (!typeExists) return new ValidationFailed(new[] { "Tipo do Projeto não encontrado." });

            var teamExists = await _context.Teams
                .AnyAsync(x => x.Id == body.TeamId && !x.IsDeleted, cancellationToken);
            if (!teamExists) return new ValidationFailed(new[] { "Turma não encontrada." });

            var oscExists = await _context.Oscs
                .AnyAsync(x => x.Id == body.OscId && !x.IsDeleted, cancellationToken);
            if (!oscExists) return new ValidationFailed(new[] { "OSC não encontrada." });

            var alreadyExistsActive = await _context.ProjectPrograms
                .AnyAsync(p => !p.IsDeleted
                               && p.OscId == body.OscId
                               && p.TeamId == body.TeamId, cancellationToken);
            if (alreadyExistsActive)
                return new ValidationFailed(new[] { "Já existe um projeto desta OSC nesta Turma." });

            var entity = new ProjectProgram
            {
                Name = body.Name.Trim(),
                OdsTypes = body.OdsTypes.Distinct().ToList(),
                Decision = body.Decision ?? ProjectDecisionType.Started,
                ProjectThemeId = body.ProjectThemeId,
                ProjectTypeId = body.ProjectTypeId,
                TeamId = body.TeamId,
                OscId = body.OscId,
                ProjectDocumentId = body.ProjectDocumentId,
                IsDeleted = false
            };

            _context.ProjectPrograms.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return new CreateProjectProgramResponse(entity.Id);
        }
    }
}
