using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Courses.ListCourse
{
    public class ListCourseViewModel : PaginationResponse<CourseViewModel>
    {
    }

    public class CourseViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public bool IsDeleted { get; set; }
    }

    public class GetCourseByIdViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class GetCourseByIdQuery : IRequest<GetCourseByIdViewModel>
    {
        public int Id { get; }

        public GetCourseByIdQuery(int id)
        {
            Id = id;
        }
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
            var query = _context.Courses.AsQueryable();

            query = query.Where(c => c.IsDeleted == false);

            if (request.Filters != null && request.Filters.Any())
            {
                var expr = ExpressionBuilder.GetExpression<Course>(request.Filters);
                query = query.Where(expr);
            }

            var totalRecords = await query.CountAsync(cancellationToken);

            var result = await query
                .OrderByDescending(x => x.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var courses = result.Select(x => new CourseViewModel
            {
                Id = x.Id,
                Name = x.Name,
                IsDeleted = x.IsDeleted
            }).ToList();

            return new ListCourseViewModel
            {
                Items = courses,
                TotalItems = totalRecords
            };
        }
    }

    internal sealed class GetCourseByIdQueryHandler : IRequestHandler<GetCourseByIdQuery, GetCourseByIdViewModel>
    {
        private readonly ApplicationDbContext _context;

        public GetCourseByIdQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GetCourseByIdViewModel> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
        {
            var course = await _context.Courses
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (course == null || course.IsDeleted)
            {
                return null;
            }

            return new GetCourseByIdViewModel
            {
                Id = course.Id,
                Name = course.Name,
                IsDeleted = course.IsDeleted,
                CreatedBy = course.CreatedBy,
                CreatedAt = course.CreatedAt,
                UpdatedBy = course.UpdatedBy,
                UpdatedAt = course.UpdatedAt
            };
        }
    }
}