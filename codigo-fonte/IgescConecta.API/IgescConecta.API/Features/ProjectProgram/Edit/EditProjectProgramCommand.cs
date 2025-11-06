using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectPrograms.Edit
{
    public class EditProjectProgramRequest
    {
        public string Name { get; set; } = string.Empty;
        public IList<OdsType> OdsTypes { get; set; } = new List<OdsType>();
        public ProjectDecisionType Decision { get; set; }
        public int ProjectThemeId { get; set; }
        public int ProjectTypeId { get; set; }
        public int TeamId { get; set; }
        public int OscId { get; set; }
        public int? ProjectDocumentId { get; set; }
    }

    public class EditProjectProgramResponse
    {
        public int ProjectProgramId { get; set; }
        public EditProjectProgramResponse(int id) => ProjectProgramId = id;
    }

    public class EditProjectProgramCommand
        : IRequest<Result<EditProjectProgramResponse, ValidationFailed>>
    {
        public int ProjectProgramId { get; set; }
        public EditProjectProgramRequest Body { get; set; } = new();
    }

    internal sealed class EditProjectProgramCommandHandler
        : IRequestHandler<EditProjectProgramCommand, Result<EditProjectProgramResponse, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public EditProjectProgramCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<EditProjectProgramResponse, ValidationFailed>> Handle(
            EditProjectProgramCommand request,
            CancellationToken cancellationToken)
        {
            var body = request.Body;

            var entity = await _context.ProjectPrograms
                .FirstOrDefaultAsync(x => x.Id == request.ProjectProgramId, cancellationToken);

            if (entity is null)
                return new ValidationFailed(new[] { "Projeto não encontrado." });

            if (entity.IsDeleted)
                return new ValidationFailed(new[] { "Projeto excluído. Restaure para editar." });

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

            var pairChanged = entity.OscId != body.OscId || entity.TeamId != body.TeamId;
            if (pairChanged)
            {
                var conflict = await _context.ProjectPrograms
                    .AnyAsync(p => !p.IsDeleted
                                   && p.OscId == body.OscId
                                   && p.TeamId == body.TeamId
                                   && p.Id != entity.Id, cancellationToken);
                if (conflict)
                    return new ValidationFailed(new[] { "Já existe um projeto desta OSC nesta Turma." });
            }

            entity.Name = body.Name.Trim();
            entity.OdsTypes = body.OdsTypes.Distinct().ToList();
            entity.Decision = body.Decision;
            entity.ProjectThemeId = body.ProjectThemeId;
            entity.ProjectTypeId = body.ProjectTypeId;
            entity.TeamId = body.TeamId;
            entity.OscId = body.OscId;
            entity.ProjectDocumentId = body.ProjectDocumentId;

            await _context.SaveChangesAsync(cancellationToken);

            return new EditProjectProgramResponse(entity.Id);
        }
    }
}

