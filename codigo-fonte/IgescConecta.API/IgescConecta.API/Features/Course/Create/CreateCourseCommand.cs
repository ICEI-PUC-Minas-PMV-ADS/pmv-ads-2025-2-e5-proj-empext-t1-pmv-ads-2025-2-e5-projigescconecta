using MediatR;
using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using System;

namespace IgescConecta.API.Features.Courses.CreateCourse
{
    public class CreateCourseCommand : IRequest<Result<int, ValidationFailed>>
    {
        public string Name { get; set; }

        // Adiciona o ID do usuário que está criando o curso
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
                IsActive = true,
                CreatedAt = now,
                CreatedBy = request.CreatedByUserId,
                UpdatedAt = now,
                UpdatedBy = request.CreatedByUserId,
                DeactivatedAt = null,
                DeactivatedBy = null
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync(cancellationToken);

            return course.Id;
        }
    }
}
