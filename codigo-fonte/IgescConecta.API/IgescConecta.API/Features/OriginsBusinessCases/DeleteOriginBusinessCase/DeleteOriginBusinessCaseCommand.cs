using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;

namespace IgescConecta.API.Features.OriginsBusinessCases.DeleteOriginBusinessCase
{
    public class DeleteOriginBusinessCaseCommand : IRequest<Result<bool, ValidationFailed>>
    {
        public int OriginBusinessCaseId { get; set; }

        public DeleteOriginBusinessCaseCommand(int originBusinessCaseId)
        {
            OriginBusinessCaseId = originBusinessCaseId;
        }
    }

    internal sealed class DeleteOriginBusinessCaseCommandHandler : IRequestHandler<DeleteOriginBusinessCaseCommand, Result<bool, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteOriginBusinessCaseCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<bool, ValidationFailed>> Handle(DeleteOriginBusinessCaseCommand request, CancellationToken cancellationToken)
        {
            var originBusinessCase = await _context.OriginBusinessCases.FindAsync(request.OriginBusinessCaseId);

            if (originBusinessCase == null)
            {
                return new ValidationFailed(new[] { "Origin Business Cases not found." });
            }

            _context.OriginBusinessCases.Remove(originBusinessCase);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
