using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;

namespace IgescConecta.API.Features.OriginsBusinessCases.CreateOriginBusinessCase
{
    public class CreateOriginBusinessCaseCommand : IRequest<Result<int, ValidationFailed>>
    {
        public string Name { get; set; }

        public string Notes { get; set; }

        public int BusinessCaseId { get; set; }
    }

    internal sealed class CreateOriginBusinessCaseCommandHandler : IRequestHandler<CreateOriginBusinessCaseCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateOriginBusinessCaseCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(CreateOriginBusinessCaseCommand request, CancellationToken cancellationToken)
        {
            var originBusinessCase = new OriginBusinessCase
            {
                Name = request.Name,
                Notes = request.Notes,
                BusinessCaseId = request.BusinessCaseId
            };

            await _context.OriginBusinessCases.AddAsync(originBusinessCase);
            await _context.SaveChangesAsync(cancellationToken);
            return originBusinessCase.Id;
        }
    }
}
