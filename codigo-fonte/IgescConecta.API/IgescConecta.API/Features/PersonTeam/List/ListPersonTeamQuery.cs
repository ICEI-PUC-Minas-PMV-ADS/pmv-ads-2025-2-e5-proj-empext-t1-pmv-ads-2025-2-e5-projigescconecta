using IgescConecta.API.Data;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Common.Extensions;
using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonTeams.ListPersonTeam
{
    public class ListPersonTeamQuery : PaginationRequest, IRequest<ListPersonTeamViewModel>
    {
        public ListPersonTeamQuery(int pageNumber, int pageSize, List<Filter> filters)
            : base(pageNumber, pageSize, filters)
        {
        }

        public int? TeamId { get; set; }
    }

    public class PersonTeamDto
    {
        public int Id { get; set; }
        public int PersonId { get; set; }
        public string PersonName { get; set; }
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public List<MemberType> MemberTypes { get; set; } = new List<MemberType>();
    }

    public class ListPersonTeamViewModel : PaginationResponse<PersonTeamDto> { }

    internal sealed class ListPersonTeamQueryHandler : IRequestHandler<ListPersonTeamQuery, ListPersonTeamViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListPersonTeamQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListPersonTeamViewModel> Handle(ListPersonTeamQuery request, CancellationToken cancellationToken)
        {
            var baseQuery = _context.PersonTeams
                .Include(pt => pt.Person)
                .Include(pt => pt.Team)
                .AsNoTracking()
                .AsQueryable();

            var isDeletedFilter = request.Filters?.FirstOrDefault(f => string.Equals(f.PropertyName, "IsDeleted", StringComparison.OrdinalIgnoreCase));
            var hasIsDeletedFilter = isDeletedFilter is not null;
            if (isDeletedFilter is not null && isDeletedFilter.Operation == Op.None)
            {
                isDeletedFilter.Operation = Op.Equals;
            }

            var query = hasIsDeletedFilter ? baseQuery.IgnoreQueryFilters() : baseQuery;

            if (request.TeamId.HasValue)
            {
                query = query.Where(pt => pt.TeamId == request.TeamId.Value);
            }

            var memberTypeFilter = request.Filters?.FirstOrDefault(f => string.Equals(f.PropertyName, "MemberType", StringComparison.OrdinalIgnoreCase));
            if (memberTypeFilter is not null)
            {
                MemberType memberTypeValue;
                var v = memberTypeFilter.Value;
                if (v is System.Text.Json.JsonElement je)
                {
                    if (je.ValueKind == System.Text.Json.JsonValueKind.Number)
                        memberTypeValue = (MemberType)je.GetInt32();
                    else
                        memberTypeValue = (MemberType)Enum.Parse(typeof(MemberType), je.GetString(), true);
                }
                else if (v is int i)
                {
                    memberTypeValue = (MemberType)i;
                }
                else if (v is long l)
                {
                    memberTypeValue = (MemberType)(int)l;
                }
                else if (v is string s)
                {
                    memberTypeValue = (MemberType)Enum.Parse(typeof(MemberType), s, true);
                }
                else
                {
                    memberTypeValue = default;
                }

                query = query.Where(pt => pt.MemberTypes.Contains(memberTypeValue));
                request.Filters.Remove(memberTypeFilter);
            }

            var expr = ExpressionBuilder.GetExpression<PersonTeam>(request.Filters ?? new List<Filter>());
            query = query.Where(expr);

            var totalRecords = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(pt => pt.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(pt => new PersonTeamDto
                {
                    Id = pt.Id,
                    PersonId = pt.PersonId,
                    PersonName = pt.Person.Name,
                    TeamId = pt.TeamId,
                    TeamName = pt.Team.Name,
                    MemberTypes = pt.MemberTypes.ToList()
                })
                .ToListAsync(cancellationToken);

            return new ListPersonTeamViewModel
            {
                Items = items,
                TotalItems = totalRecords
            };
        }
    }
}