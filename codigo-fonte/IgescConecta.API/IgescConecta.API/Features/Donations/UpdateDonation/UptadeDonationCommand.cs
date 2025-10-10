using MediatR;
using IgescConecta.API.Data;
using IgescConecta.API.Common.Validation;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace IgescConecta.API.Features.Donations.UpdateDonation
{
    // DTO de Entrada (Command)
    public class UptadeDonationCommand : IRequest<Result<Guid, ValidationFailed>>
    {
        public Guid IDDoacao { get; set; }
        public decimal Valor { get; set; }
        public DateTime Data { get; set; }

        // Doador n�o deve ser alterado, apenas o valor/data/destino

        public string? DestinoTipo { get; set; } // "OSC", "TURMA"
        public Guid? DestinoTurmaId { get; set; }
        public string? DestinoOSCCodigo { get; set; }
    }

    // Handler (L�gica de Neg�cio e Valida��o)
    internal sealed class UptadeDonationCommandHandler : IRequestHandler<UptadeDonationCommand, Result<Guid, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public UptadeDonationCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Guid, ValidationFailed>> Handle(UptadeDonationCommand request, CancellationToken cancellationToken)
        {
            // 1. Busca pela Doa��o
            var doacao = await _context.Doacoes
                .SingleOrDefaultAsync(d => d.IDDoacao == request.IDDoacao, cancellationToken);

            if (doacao == null)
            {
                return new ValidationFailed(new[] { $"Doa��o com ID {request.IDDoacao} n�o encontrada." });
            }

            // 2. Valida��o do Novo Destino (Exclusividade: No M�ximo 1)
            var destinoCount = 0;
            if (request.DestinoTurmaId.HasValue && request.DestinoTurmaId != Guid.Empty) destinoCount++;
            if (!string.IsNullOrEmpty(request.DestinoOSCCodigo)) destinoCount++;

            if (destinoCount > 1)
            {
                return new ValidationFailed(new[] { "O destino da doa��o deve ser APENAS uma Turma ou APENAS uma OSC." });
            }

            // 3. Aplica��o das mudan�as
            if (request.Valor <= 0)
            {
                return new ValidationFailed(new[] { "O valor da doa��o deve ser maior que zero." });
            }

            doacao.Valor = request.Valor;
            doacao.Data = request.Data;

            // Atualiza os campos de destino (mantendo a consist�ncia do EF Core)
            doacao.DestinoTurmaId = request.DestinoTurmaId;
            doacao.DestinoOSCCodigo = request.DestinoOSCCodigo;
            doacao.DestinoTipo = request.DestinoTipo;

            // TODO: Atualizar campos de auditoria (AlteradoEm, AlteradoPor)

            // 4. Persist�ncia
            await _context.SaveChangesAsync(cancellationToken);

            // 5. RETORNO DE SUCESSO CORRIGIDO:
            // O operador impl�cito de sucesso converte o 'doacao.IDDoacao' (Guid) para Result<Guid, ValidationFailed>
            return doacao.IDDoacao;
        }
    }
}