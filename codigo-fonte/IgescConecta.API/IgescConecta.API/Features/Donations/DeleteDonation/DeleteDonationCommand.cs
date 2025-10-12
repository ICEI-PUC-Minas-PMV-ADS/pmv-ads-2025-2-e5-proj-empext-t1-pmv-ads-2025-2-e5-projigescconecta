using MediatR;
using IgescConecta.API.Data;
using IgescConecta.API.Common.Validation;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Donations.DeleteDonation
{
    // DTO de Entrada (Command)
    public class DeleteDonationCommand : IRequest<Result<Guid, ValidationFailed>>
    {
        public Guid IDDoacao { get; set; }
    }

    // Handler (Lógica de Negócio)
    internal sealed class DeleteDonationCommandHandler : IRequestHandler<DeleteDonationCommand, Result<Guid, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteDonationCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Guid, ValidationFailed>> Handle(DeleteDonationCommand request, CancellationToken cancellationToken)
        {
            // 1. Busca pela Doação
            var doacao = await _context.Doacoes
                .SingleOrDefaultAsync(d => d.IDDoacao == request.IDDoacao, cancellationToken);

            if (doacao == null)
            {
                return new ValidationFailed(new[] { $"Doação com ID {request.IDDoacao} não encontrada." });
            }

            // 2. Remoção Física (Hard Delete)
            _context.Doacoes.Remove(doacao);

            // 3. Persistência
            await _context.SaveChangesAsync(cancellationToken);

            // 4. Retorno de Sucesso
            return request.IDDoacao;
        }
    }
}