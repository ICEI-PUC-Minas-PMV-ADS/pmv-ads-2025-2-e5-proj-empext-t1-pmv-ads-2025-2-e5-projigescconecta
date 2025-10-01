using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;

namespace IgescConecta.API.Features.OriginsBusinessCases.UpdateOriginBusinessCase
{
    public class UpdateOriginBusinessCaseCommand : IRequest<Result<OriginBusinessCase, ValidationFailed>>
    {
        public int OriginBusinessCaseId { get; set; }

        public string Name { get; set; }
    }

    internal sealed class UpdateOriginBusinessCaseCommandHandler : IRequestHandler<UpdateOriginBusinessCaseCommand, Result<OriginBusinessCase, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public UpdateOriginBusinessCaseCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<OriginBusinessCase, ValidationFailed>> Handle(UpdateOriginBusinessCaseCommand request, CancellationToken cancellationToken)
        {
            var originBusinessCase = await _context.OriginBusinessCases.FindAsync(request.OriginBusinessCaseId);

            if (originBusinessCase == null)
            {
                return new ValidationFailed(new[] { "Origin Business Case not Found" });
            }

            originBusinessCase.Name = string.IsNullOrEmpty(request.Name) ? originBusinessCase.Name : request.Name;

            await _context.SaveChangesAsync(cancellationToken);
            return originBusinessCase;
        }
    }
}
