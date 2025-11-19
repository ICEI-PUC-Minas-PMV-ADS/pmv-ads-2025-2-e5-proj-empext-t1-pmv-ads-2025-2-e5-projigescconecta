using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Reports.DeleteReport
{
    public class DeleteReportCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int Id { get; set; }
    }

    internal sealed class DeleteReportCommandHandler
        : IRequestHandler<DeleteReportCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteReportCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(DeleteReportCommand request, CancellationToken ct)
        {
            var entity = await _context.Reports
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == request.Id, ct);

            if (entity is null)
                throw new ArgumentException("Relatório não encontrado.");

            _context.Reports.Remove(new Domain.Entities.Reporting.Report { Id = request.Id });
            await _context.SaveChangesAsync(ct);

            return request.Id;
        }
    }
}

