using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Courses.DeleteCourse
{
    public class DeleteCourseCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int CourseId { get; set; }
    }

    internal sealed class DeleteCourseCommandHandler : IRequestHandler<DeleteCourseCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteCourseCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(DeleteCourseCommand request, CancellationToken cancellationToken)
        {
            var course = await _context.Courses.FindAsync(request.CourseId);

            if (course == null)
            {
                return new ValidationFailed(new[] { "Curso não encontrado ou já está excluído." });
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync(cancellationToken);

            return course.Id;
        }
    }
}