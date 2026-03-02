using IgescConecta.API.Data;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectPrograms.GetById
{
    public class GetProjectProgramByIdViewModel
    {
        public int ProjectProgramId { get; set; }
        public string Name { get; set; } = string.Empty;
        public IList<OdsType> OdsTypes { get; set; } = new List<OdsType>();
        public ProjectDecisionType Decision { get; set; }
        public int ProjectThemeId { get; set; }
        public string ProjectThemeName { get; set; } = string.Empty;
        public int ProjectTypeId { get; set; }
        public string ProjectTypeName { get; set; } = string.Empty;
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public int OscId { get; set; }
        public string OscName { get; set; } = string.Empty;
        public string OscCnpj { get; set; } = string.Empty;
        public int? ProjectDocumentId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class GetProjectProgramByIdQuery : IRequest<GetProjectProgramByIdViewModel?>
    {
        public int ProjectProgramId { get; set; }
        public GetProjectProgramByIdQuery(int projectProgramId) => ProjectProgramId = projectProgramId;
    }

    internal sealed class GetProjectProgramByIdQueryHandler : IRequestHandler<GetProjectProgramByIdQuery, GetProjectProgramByIdViewModel?>
    {
        private readonly ApplicationDbContext _context;

        public GetProjectProgramByIdQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GetProjectProgramByIdViewModel?> Handle(GetProjectProgramByIdQuery request, CancellationToken cancellationToken)
        {
            var p = await _context.ProjectPrograms
                .AsNoTracking()
                .IgnoreQueryFilters()
                .Include(x => x.ProjectTheme)
                .Include(x => x.ProjectType)
                .Include(x => x.Team)
                .Include(x => x.Osc)
                .FirstOrDefaultAsync(x => x.Id == request.ProjectProgramId, cancellationToken);

            if (p == null) return null;

            return new GetProjectProgramByIdViewModel
            {
                ProjectProgramId = p.Id,
                Name = p.Name,
                OdsTypes = p.OdsTypes,
                Decision = p.Decision,
                ProjectThemeId = p.ProjectThemeId,
                ProjectThemeName = p.ProjectTheme != null ? p.ProjectTheme.Name : string.Empty,
                ProjectTypeId = p.ProjectTypeId,
                ProjectTypeName = p.ProjectType != null ? p.ProjectType.Name : string.Empty,
                TeamId = p.TeamId,
                TeamName = p.Team != null ? p.Team.Name : string.Empty,
                OscId = p.OscId,
                OscName = p.Osc != null ? p.Osc.Name : string.Empty,
                OscCnpj = p.Osc != null ? p.Osc.OscPrimaryDocumment : string.Empty,
                ProjectDocumentId = p.ProjectDocumentId,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                UpdatedBy = p.UpdatedBy,

                IsDeleted = p.IsDeleted
            };
        }
    }
}
