using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.BusinessCases.UpdateBusinessCase
{
    public class UpdateBusinessCaseCommand : IRequest<Result<BusinessCase, ValidationFailed>>
    {
        public int BusinessCaseId { get; set; }

        public string? Name { get; set; }
    }

    internal sealed class UpdateBusinessCaseCommandHandler : IRequestHandler<UpdateBusinessCaseCommand, Result<BusinessCase, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public UpdateBusinessCaseCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<BusinessCase, ValidationFailed>> Handle(UpdateBusinessCaseCommand request, CancellationToken cancellationToken)
        {
            var businessCase = await _context.BusinessCases.FindAsync(request.BusinessCaseId);

            if (businessCase == null)
                return new ValidationFailed(new[] { "Business Case not Found" });
            
            businessCase.Name = string.IsNullOrEmpty(request.Name) ? businessCase.Name : request.Name;

            await _context.SaveChangesAsync(cancellationToken);
            return businessCase;
        }
    }
}
