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
        public int CourseId { get; set; }
        public string? Name { get; set; }
        public int TeamsCount { get; set; }
    }

    public class GetCourseByIdViewModel
    {
        public int CourseId { get; set; }
        public string? Name { get; set; }
        public bool IsDeleted { get; set; }
        public int? TeamsCount { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }

        public List<TeamViewModel> Teams { get; set; } = new List<TeamViewModel>();
    }

    public class TeamViewModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? LessonTime { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? Finish { get; set; }
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
            var expr = ExpressionBuilder.GetExpression<Course>(request.Filters);

            var query = _context.Courses.AsQueryable();

            var result = await query
                .Where(expr)
                .Select(c => new CourseViewModel
                {
                    CourseId = c.Id,
                    Name = c.Name,
                    TeamsCount = c.Teams.Count
                })
                .OrderBy(x => x.CourseId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await _context.Courses.CountAsync(expr, cancellationToken);

            return new ListCourseViewModel
            {
                Items = result,
                TotalItems = totalRecords,
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
                .Where(c => c.Id == request.Id)
                .Select(c => new GetCourseByIdViewModel
                {
                    CourseId = c.Id,
                    Name = c.Name,
                    IsDeleted = c.IsDeleted,
                    CreatedBy = c.CreatedBy,
                    CreatedAt = c.CreatedAt,
                    UpdatedBy = c.UpdatedBy,
                    UpdatedAt = c.UpdatedAt,
                    TeamsCount = c.Teams.Count(),
                    Teams = c.Teams.Select(t => new TeamViewModel
                    {
                        Id = t.Id,
                        Name = t.Name,
                        LessonTime = t.LessonTime,
                        Start = t.Start,
                        Finish = t.Finish
                    }).ToList()
                })
                .FirstOrDefaultAsync(cancellationToken);

            return course;
        }
    }
}