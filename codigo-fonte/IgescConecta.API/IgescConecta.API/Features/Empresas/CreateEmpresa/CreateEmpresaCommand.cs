using MediatR;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using IgescConecta.API.Common.Validation;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Empresas.CreateEmpresa
{
    // DTO (Data Transfer Object) (inalterado)
    public class CreateEmpresaCommand : IRequest<Result<string, ValidationFailed>>
    {
        public string CNPJ { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    // Handler (Lógica de Negócio)
    internal sealed class CreateEmpresaCommandHandler : IRequestHandler<CreateEmpresaCommand, Result<string, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateEmpresaCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<string, ValidationFailed>> Handle(CreateEmpresaCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.CNPJ) || request.CNPJ.Length != 14)
            {
                return new ValidationFailed(new[] { "CNPJ inválido ou não fornecido." });
            }
            if (string.IsNullOrEmpty(request.Nome))
            {
                return new ValidationFailed(new[] { "O Nome da empresa é obrigatório." });
            }

            // Validação de existência (PK = CNPJ)
            var empresaExistente = await _context.Empresas.FindAsync(new object[] { request.CNPJ }, cancellationToken);
            if (empresaExistente != null)
            {
                return new ValidationFailed(new[] { $"Empresa com CNPJ {request.CNPJ} já cadastrada." });
            }

            var empresa = new Empresa
            {
                CNPJ = request.CNPJ,
                Nome = request.Nome,
                Endereco = request.Endereco,
                Telefone = request.Telefone,
                Email = request.Email,
                Ativa = true
            };

            _context.Empresas.Add(empresa);
            await _context.SaveChangesAsync(cancellationToken);

            // O operador implícito de sucesso converte o string (CNPJ) para Result<string, ValidationFailed>
            return empresa.CNPJ;
        }
    }
}