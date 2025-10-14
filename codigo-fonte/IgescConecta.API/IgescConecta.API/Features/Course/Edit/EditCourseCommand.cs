using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Courses.EditCourse
{
    public class EditCourseCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int CourseId { get; set; }
        public string Name { get; set; }
    }

    internal sealed class EditCourseCommandHandler : IRequestHandler<EditCourseCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public EditCourseCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(EditCourseCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return new ValidationFailed(new[] { "O nome do curso é obrigatório." });
            }

            var course = await _context.Courses
                .Where(c => c.Id == request.CourseId)
                .FirstOrDefaultAsync(cancellationToken);

            if (course == null)
            {
                return new ValidationFailed(new[] { "Curso não encontrado." });
            }

            course.Name = request.Name;

            await _context.SaveChangesAsync(cancellationToken);

            return course.Id;
        }
    }
}