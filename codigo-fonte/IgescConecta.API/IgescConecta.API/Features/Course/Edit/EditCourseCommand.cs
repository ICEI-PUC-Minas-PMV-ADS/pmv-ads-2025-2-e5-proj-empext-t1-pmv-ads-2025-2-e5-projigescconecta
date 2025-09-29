using MediatR;
using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace IgescConecta.API.Features.Courses.EditCourse
{
    public class EditCourseCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int CourseId { get; set; }
        public string Name { get; set; }
        public int UpdatedByUserId { get; set; } // Quem está editando
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

            // Busca o curso ativo
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == request.CourseId && c.IsActive, cancellationToken);

            if (course == null)
            {
                return new ValidationFailed(new[] { "Curso não encontrado ou está desativado." });
            }

            // Atualiza os campos
            course.Name = request.Name;
            course.UpdatedAt = DateTime.UtcNow;
            course.UpdatedBy = request.UpdatedByUserId;

            await _context.SaveChangesAsync(cancellationToken);

            return course.Id;
        }
    }
}
