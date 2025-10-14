using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;

namespace IgescConecta.API.Features.Courses.CreateCourse
{
    public class CreateCourseCommand : IRequest<Result<int, ValidationFailed>>
    {
        public string Name { get; set; }
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

            var course = new Course
            {
                Name = request.Name,
            };

            await _context.Courses.AddAsync(course, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return course.Id;
        }
    }
}