using MediatR;
using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Courses.DeleteCourse
{
    public class DeleteCourseCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int CourseId { get; set; }
        public int DeactivatedByUserId { get; set; }
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
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == request.CourseId && c.IsActive, cancellationToken);

            if (course == null)
            {
                return new ValidationFailed(new[] { "Curso não encontrado ou já está desativado." });
            }

            // Soft delete
            course.IsActive = false;
            course.DeactivatedAt = DateTime.UtcNow;
            course.DeactivatedBy = request.DeactivatedByUserId;
            course.UpdatedAt = DateTime.UtcNow;
            course.UpdatedBy = request.DeactivatedByUserId;

            await _context.SaveChangesAsync(cancellationToken);

            return course.Id;
        }
    }
}
