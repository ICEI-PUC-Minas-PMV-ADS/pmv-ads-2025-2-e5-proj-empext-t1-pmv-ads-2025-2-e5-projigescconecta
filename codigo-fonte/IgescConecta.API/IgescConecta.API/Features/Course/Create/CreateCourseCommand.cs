using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;

namespace IgescConecta.API.Features.Courses.CreateCourse
{
    public class CreateCourseCommand : IRequest<Result<int, ValidationFailed>>
    {
        public string Name { get; set; }

        public int CreatedByUserId { get; set; }
    }

    internal sealed class CreateCourseCommandHandler : IRequestHandler<CreateCourseCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateCourseCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(CreateCourseCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return new ValidationFailed(new[] { "O nome do curso é obrigatório." });
            }

            var now = DateTime.UtcNow;

            var course = new Course
            {
                Name = request.Name,

                CreatedAt = now,
                CreatedBy = request.CreatedByUserId,
                UpdatedAt = now,
                UpdatedBy = request.CreatedByUserId,
                IsDeleted = false
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync(cancellationToken);

            return course.Id;
        }
    }
}