using MediatR;
using IgescConecta.API.Data;
using IgescConecta.API.Common.Validation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Donations.ListDonation
{
    // DTO de Saída (o que o usuário final verá)
    public class DoacaoDto
    {
        public Guid IDDoacao { get; set; }
        public decimal Valor { get; set; }
        public DateTime Data { get; set; }
        public string? DoadorPessoaCPF { get; set; }
        public string? DoadorEmpresaCNPJ { get; set; }
        public string? DestinoTipo { get; set; }
        public Guid? DestinoTurmaId { get; set; }
        public string? DestinoOSCCodigo { get; set; }
        // public string? NomeDoador { get; set; } 
    }

    // DTO de Entrada (Query)
    public class ListDonationQuery : IRequest<Result<DoacaoDto, ValidationFailed>>
    {
        public Guid IDDoacao { get; set; }
    }

    // Handler da Consulta
    internal sealed class ListDonationQueryHandler : IRequestHandler<ListDonationQuery, Result<DoacaoDto, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public ListDonationQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<DoacaoDto, ValidationFailed>> Handle(ListDonationQuery request, CancellationToken cancellationToken)
        {
            var doacao = await _context.Doacoes
                .AsNoTracking()
                .SingleOrDefaultAsync(d => d.IDDoacao == request.IDDoacao, cancellationToken);

            if (doacao == null)
            {
                // Retorno de FALHA: Usando a conversão implícita (ValidationFailed)
                return new ValidationFailed(new[] { $"Doação com ID {request.IDDoacao} não encontrada." });
            }

            // Mapeamento para o DTO
            var dto = new DoacaoDto
            {
                IDDoacao = doacao.IDDoacao,
                Valor = doacao.Valor,
                Data = doacao.Data,
                DoadorPessoaCPF = doacao.DoadorPessoaCPF,
                DoadorEmpresaCNPJ = doacao.DoadorEmpresaCNPJ,
                DestinoTipo = doacao.DestinoTipo,
                DestinoTurmaId = doacao.DestinoTurmaId,
                DestinoOSCCodigo = doacao.DestinoOSCCodigo
            };

            // Retorno de SUCESSO CORRIGIDO: 
            return await Task.FromResult((Result<DoacaoDto, ValidationFailed>)dto);
        }
    }
}