using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace IgescConecta.API.Features.ProjectPrograms.ListProjectPrograms
{
    public class ListProjectProgramViewModel : PaginationResponse<ProjectProgramListItemViewModel>
    {
    }

    public class ProjectProgramListItemViewModel
    {
        public int ProjectProgramId { get; set; }
        public string? Name { get; set; }
        public ProjectDecisionType Decision { get; set; }
        public bool IsDeleted { get; set; }

        public int ProjectThemeId { get; set; }
        public string? ProjectThemeName { get; set; }

        public int ProjectTypeId { get; set; }
        public string? ProjectTypeName { get; set; }

        public int TeamId { get; set; }
        public string? TeamName { get; set; }

        public int OscId { get; set; }
        public string? OscName { get; set; }
        public string? OscCnpj { get; set; }

        public IList<OdsType> OdsTypes { get; set; } = new List<OdsType>();
    }

    public class ListProjectProgramQuery : PaginationRequest, IRequest<ListProjectProgramViewModel>
    {
        public string? StatusFilter { get; set; }

        public ListProjectProgramQuery(int pageNumber, int pageSize, List<Filter> filters, string? statusFilter)
            : base(pageNumber, pageSize, filters)
        {
            StatusFilter = statusFilter;
        }
    }

    internal sealed class ListProjectProgramQueryHandler : IRequestHandler<ListProjectProgramQuery, ListProjectProgramViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListProjectProgramQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListProjectProgramViewModel> Handle(ListProjectProgramQuery request, CancellationToken cancellationToken)
        {
            var filters = (request.Filters ?? new List<Filter>()).ToList();
            var query = _context.ProjectPrograms
                .AsNoTracking()
                .Include(p => p.ProjectTheme)
                .Include(p => p.ProjectType)
                .Include(p => p.Team)
                .Include(p => p.Osc)
                .AsQueryable();
            
            // 1) ODS (aceita OdsTypes / OdsNumber / OdsName)
            var odsFilters = filters.Where(f =>
                string.Equals(f.PropertyName, "OdsTypes", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(f.PropertyName, "OdsNumber", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(f.PropertyName, "OdsName", StringComparison.OrdinalIgnoreCase)
            ).ToList();

            foreach (var f in odsFilters)
            {
                var valStr = GetStringValue(f.Value);
                if (string.IsNullOrWhiteSpace(valStr))
                    continue;

                OdsType? ods = null;

                if (int.TryParse(valStr, out var n) && n >= 1 && n <= 17)
                {
                    ods = (OdsType)n;
                }
                else
                {
                    try
                    {
                        var resolved = valStr.GetValueFromName(typeof(OdsType));
                        if (resolved is OdsType enumVal)
                            ods = enumVal;
                    }
                    catch { /* ignora */ }
                }

                if (ods.HasValue)
                {
                    query = query.Where(p => p.OdsTypes.Contains(ods.Value));
                }
            }
            if (odsFilters.Count > 0)
            {
                foreach (var f in odsFilters) filters.Remove(f);
            }

            // 2) Decision (converter display/name -> enum e forçar Equals)
            var decisionFilter = filters.FirstOrDefault(f =>
                string.Equals(f.PropertyName, "Decision", StringComparison.OrdinalIgnoreCase));
            if (decisionFilter != null)
            {
                var str = GetStringValue(decisionFilter.Value);
                if (!string.IsNullOrWhiteSpace(str))
                {
                    try
                    {
                        var resolved = str.GetValueFromName(typeof(ProjectDecisionType));
                        decisionFilter.Value = resolved;
                        decisionFilter.Operation = Op.Equals;
                    }
                    catch { /* deixa como veio se não resolver */ }
                }
            }

            // 3) IsDeleted (normalizar para bool e Equals)
            var isDeletedFilter = filters.FirstOrDefault(f =>
                string.Equals(f.PropertyName, "IsDeleted", StringComparison.OrdinalIgnoreCase));
            if (isDeletedFilter != null)
            {
                var str = GetStringValue(isDeletedFilter.Value);
                if (bool.TryParse(str, out var b))
                {
                    isDeletedFilter.Value = b;
                    isDeletedFilter.Operation = Op.Equals;
                }
            }

            var expr = ExpressionBuilder.GetExpression<ProjectProgram>(filters);
            query = query.Where(expr);

            if (!string.IsNullOrEmpty(request.StatusFilter))
            {
                if (request.StatusFilter.Equals("Inactive", StringComparison.OrdinalIgnoreCase))
                {
                    query = query
                        .IgnoreQueryFilters()
                        .Where(p => p.IsDeleted);
                }
                else
                {
                    query = query.IgnoreQueryFilters();
                }
            }
            else
            {
                query = query.IgnoreQueryFilters().Where(p => !p.IsDeleted);
            }

            var result = await query
                .Select(p => new ProjectProgramListItemViewModel
                {
                    ProjectProgramId = p.Id,
                    Name = p.Name,
                    Decision = p.Decision,
                    IsDeleted = p.IsDeleted,
                    ProjectThemeId = p.ProjectThemeId,
                    ProjectThemeName = p.ProjectTheme != null ? p.ProjectTheme.Name : "",
                    ProjectTypeId = p.ProjectTypeId,
                    ProjectTypeName = p.ProjectType != null ? p.ProjectType.Name : "",
                    TeamId = p.TeamId,
                    TeamName = p.Team != null ? p.Team.Name : "",
                    OscId = p.OscId,
                    OscName = p.Osc != null ? p.Osc.Name : "",
                    OscCnpj = p.Osc != null ? p.Osc.OscPrimaryDocumment : "",
                    OdsTypes = p.OdsTypes
                })
                .OrderBy(p => p.Name)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await query.CountAsync(cancellationToken);

            return new ListProjectProgramViewModel
            {
                Items = result,
                TotalItems = totalRecords
            };
        }

        private static string GetStringValue(object value)
        {
            if (value is null) return string.Empty;

            if (value is JsonElement je)
            {
                return je.ValueKind switch
                {
                    JsonValueKind.String => je.GetString() ?? string.Empty,
                    JsonValueKind.Number => je.GetRawText(),
                    JsonValueKind.True => "true",
                    JsonValueKind.False => "false",
                    _ => je.GetRawText()
                };
            }

            return value.ToString() ?? string.Empty;
        }
    }
}
