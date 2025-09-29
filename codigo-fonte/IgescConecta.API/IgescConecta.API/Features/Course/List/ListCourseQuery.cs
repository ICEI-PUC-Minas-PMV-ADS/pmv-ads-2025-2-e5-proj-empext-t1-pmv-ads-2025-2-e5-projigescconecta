using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using IgescConecta.API.Data;

namespace IgescConecta.API.Features.Courses.ListCourse
{
    public class ListCourseViewModel : PaginationResponse<CourseViewModel>
    {
    }

    public class CourseViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }

    public class ListCourseQuery : PaginationRequest, IRequest<ListCourseViewModel>
    {
        public ListCourseQuery(int pageNumber, int pageSize, List<Filter> filters)
            : base(pageNumber, pageSize, filters)
        {
        }
    }

    internal sealed class ListCourseQueryHandler : IRequestHandler<ListCourseQuery, ListCourseViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListCourseQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListCourseViewModel> Handle(ListCourseQuery request, CancellationToken cancellationToken)
        {
            // Cria a query base
            var query = _context.Courses.AsQueryable();

            // Aplica os filtros dinamicamente usando ExpressionBuilder
            if (request.Filters != null && request.Filters.Any())
            {
                var expr = ExpressionBuilder.GetExpression<Course>(request.Filters);
                query = query.Where(expr);
            }

            // Conta o total de registros já filtrados
            var totalRecords = await query.CountAsync(cancellationToken);

            // Aplica paginação
            var result = await query
                .OrderByDescending(x => x.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // Mapeia para ViewModel
            var courses = result.Select(x => new CourseViewModel
            {
                Id = x.Id,
                Name = x.Name,
                IsActive = x.IsActive
            }).ToList();

            return new ListCourseViewModel
            {
                Items = courses,
                TotalItems = totalRecords
            };
        }
    }
}
