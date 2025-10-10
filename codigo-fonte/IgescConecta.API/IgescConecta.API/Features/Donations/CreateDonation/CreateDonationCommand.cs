using MediatR;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using IgescConecta.API.Common.Validation;
using System.Linq;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Donations.CreateDonation
{
    // DTO (Data Transfer Object) (inalterado)
    public class CreateDonationCommand : IRequest<Result<Guid, ValidationFailed>>
    {
        public decimal Valor { get; set; }
        public DateTime Data { get; set; }
        public string? DoadorPessoaCPF { get; set; }
        public string? DoadorEmpresaCNPJ { get; set; }
        public string? DestinoTipo { get; set; }
        public Guid? DestinoTurmaId { get; set; }
        public string? DestinoOSCCodigo { get; set; }
    }

    // Handler (Lógica de Negócio e Validação)
    internal sealed class CreateDonationCommandHandler : IRequestHandler<CreateDonationCommand, Result<Guid, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateDonationCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Guid, ValidationFailed>> Handle(CreateDonationCommand request, CancellationToken cancellationToken)
        {
            // ... (Validações de exclusividade e valor - inalteradas) ...

            // Validação 1: Doador Exclusivo (Exatamente 1: Pessoa OU Empresa)
            var doadorCount = new[]
      {
        request.DoadorPessoaCPF,
        request.DoadorEmpresaCNPJ
      }
      .Count(id => !string.IsNullOrEmpty(id));

            if (doadorCount != 1)
            {
                return new ValidationFailed(new[] { "A doação deve ser feita por EXATAMENTE uma Pessoa (CPF) ou uma Empresa (CNPJ)." });
            }

            // Validação 2: Destino Exclusivo (No Máximo 1: Turma OU OSC OU Nenhum)
            var destinoCount = 0;
            if (request.DestinoTurmaId.HasValue && request.DestinoTurmaId != Guid.Empty) destinoCount++;
            if (!string.IsNullOrEmpty(request.DestinoOSCCodigo)) destinoCount++;

            if (destinoCount > 1)
            {
                return new ValidationFailed(new[] { "O destino da doação deve ser APENAS uma Turma ou APENAS uma OSC." });
            }

            // Validação 3: Valor
            if (request.Valor <= 0)
            {
                return new ValidationFailed(new[] { "O valor da doação deve ser maior que zero." });
            }

            // Validação 4: Destino Tipo (Se destino existir, o tipo deve ser "OSC" ou "TURMA")
            if (destinoCount == 1)
            {
                if (string.IsNullOrEmpty(request.DestinoTipo) || !new[] { "OSC", "TURMA" }.Any(t => t.Equals(request.DestinoTipo, StringComparison.OrdinalIgnoreCase)))
                {
                    return new ValidationFailed(new[] { "O DestinoTipo deve ser 'OSC' ou 'TURMA' se um destino for fornecido." });
                }
            }

            // 3. Mapeamento e Persistência
            var novaDoacao = new Doacao
            {
                IDDoacao = Guid.NewGuid(),
                Valor = request.Valor,
                Data = request.Data,
                DoadorPessoaCPF = request.DoadorPessoaCPF,
                DoadorEmpresaCNPJ = request.DoadorEmpresaCNPJ,
                DestinoTipo = request.DestinoTipo,
                DestinoTurmaId = request.DestinoTurmaId,
                DestinoOSCCodigo = request.DestinoOSCCodigo,
            };

            _context.Doacoes.Add(novaDoacao);
            await _context.SaveChangesAsync(cancellationToken);

            // 4. Retorno de SUCESSO CORRIGIDO:
            // Usamos o operador implícito para converter Guid para Result<Guid, ValidationFailed>
            return novaDoacao.IDDoacao;
        }
    }
}