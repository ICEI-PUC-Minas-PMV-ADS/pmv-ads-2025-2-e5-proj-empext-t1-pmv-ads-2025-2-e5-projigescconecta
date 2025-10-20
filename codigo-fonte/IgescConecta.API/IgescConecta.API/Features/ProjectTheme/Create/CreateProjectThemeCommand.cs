using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;

namespace IgescConecta.API.Features.ProjectThemes.CreateProjectTheme
{
    public class CreateProjectThemeCommand : IRequest<Result<int, ValidationFailed>>
    {
        public string Name { get; set; }
    }

    internal sealed class CreateProjectThemeCommandHandler
        : IRequestHandler<CreateProjectThemeCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateProjectThemeCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(
            CreateProjectThemeCommand request,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return new ValidationFailed(new[] { "O nome do Tema de Projeto é obrigatório." });

            var entity = new ProjectTheme { Name = request.Name };
            await _context.ProjectThemes.AddAsync(entity, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
