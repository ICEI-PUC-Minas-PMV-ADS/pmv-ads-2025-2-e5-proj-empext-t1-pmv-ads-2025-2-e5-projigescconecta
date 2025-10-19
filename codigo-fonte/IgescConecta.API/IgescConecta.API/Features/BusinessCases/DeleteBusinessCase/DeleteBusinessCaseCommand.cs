using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.BusinessCases.DeleteBusinessCase
{
    public class DeleteBusinessCaseCommand : IRequest<Result<bool, ValidationFailed>>
    {
        public int BusinessCaseId { get; set; }
        public DeleteBusinessCaseCommand(int businessCaseId)
        {
            BusinessCaseId = businessCaseId;
        }
    }

    internal sealed class DeleteBusinessCaseCommandHandler : IRequestHandler<DeleteBusinessCaseCommand, Result<bool, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteBusinessCaseCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<bool, ValidationFailed>> Handle(DeleteBusinessCaseCommand request, CancellationToken cancellationToken)
        {
            var businessCase = await _context.BusinessCases.FindAsync(request.BusinessCaseId);

            if (businessCase == null)
            {
                return new ValidationFailed(new[] { "Business Case não encontrado." });
            }

            var hasRelatedOrigins = await _context.OriginBusinessCases
                .AnyAsync(obc => obc.BusinessCaseId == businessCase.Id && !obc.IsDeleted, cancellationToken);

            if (hasRelatedOrigins)
            {
                return new ValidationFailed(new[] { "Não é possível deletar o Grupo de Causas pois existem Causas relacionadas." });
            }

            _context.BusinessCases.Remove(businessCase);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
