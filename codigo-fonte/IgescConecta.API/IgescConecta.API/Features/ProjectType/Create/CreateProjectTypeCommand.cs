using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;

namespace IgescConecta.API.Features.ProjectTypes.CreateProjectType
{
    public class CreateProjectTypeCommand : IRequest<Result<int, ValidationFailed>>
    {
        public string Name { get; set; }
    }

    internal sealed class CreateProjectTypeCommandHandler
        : IRequestHandler<CreateProjectTypeCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateProjectTypeCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(
            CreateProjectTypeCommand request,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return new ValidationFailed(new[] { "O nome do Tipo de Projeto é obrigatório." });

            var entity = new ProjectType
            {
                Name = request.Name.Trim()
            };

            await _context.ProjectTypes.AddAsync(entity, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
