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
� � // DTO (Data Transfer Object) (inalterado)
� � public class CreateDonationCommand : IRequest<Result<Guid, ValidationFailed>>
    {
        public decimal Valor { get; set; }
        public DateTime Data { get; set; }
        public string? DoadorPessoaCPF { get; set; }
        public string? DoadorEmpresaCNPJ { get; set; }
        public string? DestinoTipo { get; set; }
        public Guid? DestinoTurmaId { get; set; }
        public string? DestinoOSCCodigo { get; set; }
    }

� � // Handler (L�gica de Neg�cio e Valida��o)
� � internal sealed class CreateDonationCommandHandler : IRequestHandler<CreateDonationCommand, Result<Guid, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateDonationCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Guid, ValidationFailed>> Handle(CreateDonationCommand request, CancellationToken cancellationToken)
        {
            // ... (Valida��es de exclusividade e valor - inalteradas) ...

            // Valida��o 1: Doador Exclusivo (Exatamente 1: Pessoa OU Empresa)
            var doadorCount = new[]
      {
        request.DoadorPessoaCPF,
        request.DoadorEmpresaCNPJ
      }
      .Count(id => !string.IsNullOrEmpty(id));

            if (doadorCount != 1)
            {
                return new ValidationFailed(new[] { "A doa��o deve ser feita por EXATAMENTE uma Pessoa (CPF) ou uma Empresa (CNPJ)." });
            }

� � � � � � // Valida��o 2: Destino Exclusivo (No M�ximo 1: Turma OU OSC OU Nenhum)
� � � � � � var destinoCount = 0;
            if (request.DestinoTurmaId.HasValue && request.DestinoTurmaId != Guid.Empty) destinoCount++;
            if (!string.IsNullOrEmpty(request.DestinoOSCCodigo)) destinoCount++;

            if (destinoCount > 1)
            {
                return new ValidationFailed(new[] { "O destino da doa��o deve ser APENAS uma Turma ou APENAS uma OSC." });
            }

� � � � � � // Valida��o 3: Valor
� � � � � � if (request.Valor <= 0)
            {
                return new ValidationFailed(new[] { "O valor da doa��o deve ser maior que zero." });
            }

� � � � � � // Valida��o 4: Destino Tipo (Se destino existir, o tipo deve ser "OSC" ou "TURMA")
� � � � � � if (destinoCount == 1)
            {
                if (string.IsNullOrEmpty(request.DestinoTipo) || !new[] { "OSC", "TURMA" }.Any(t => t.Equals(request.DestinoTipo, StringComparison.OrdinalIgnoreCase)))
                {
                    return new ValidationFailed(new[] { "O DestinoTipo deve ser 'OSC' ou 'TURMA' se um destino for fornecido." });
                }
            }

� � � � � � // 3. Mapeamento e Persist�ncia
� � � � � � var novaDoacao = new Doacao
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

� � � � � � // 4. Retorno de SUCESSO CORRIGIDO:
� � � � � � // Usamos o operador impl�cito para converter Guid para Result<Guid, ValidationFailed>
� � � � � � return novaDoacao.IDDoacao;
        }
    }
}