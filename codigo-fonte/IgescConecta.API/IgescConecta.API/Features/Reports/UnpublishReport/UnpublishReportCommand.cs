using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Reports.UnpublishReport
{
    public class UnpublishReportCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int Id { get; set; }
    }

    internal sealed class UnpublishReportCommandHandler
        : IRequestHandler<UnpublishReportCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public UnpublishReportCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(UnpublishReportCommand request, CancellationToken ct)
        {
            var e = await _context.Reports.FirstOrDefaultAsync(r => r.Id == request.Id, ct);
            if (e is null) throw new ArgumentException("Relatório não encontrado.");

            e.Status = ReportStatus.Draft;

            await _context.SaveChangesAsync(ct);
            return e.Id;
        }
    }
}

