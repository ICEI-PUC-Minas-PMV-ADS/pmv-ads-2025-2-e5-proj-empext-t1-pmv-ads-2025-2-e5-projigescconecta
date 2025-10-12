using MediatR;
using IgescConecta.API.Data;
using IgescConecta.API.Common.Validation;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Empresas.InativarEmpresa
{
    // DTO (Data Transfer Object) (inalterado)
    public class InativarEmpresaCommand : IRequest<Result<string, ValidationFailed>>
    {
        public string CNPJ { get; set; } = string.Empty;
    }

    // Handler (Lógica de Negócio)
    internal sealed class InativarEmpresaCommandHandler : IRequestHandler<InativarEmpresaCommand, Result<string, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public InativarEmpresaCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<string, ValidationFailed>> Handle(InativarEmpresaCommand request, CancellationToken cancellationToken)
        {
            var empresa = await _context.Empresas
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(e => e.CNPJ == request.CNPJ, cancellationToken);

            if (empresa == null)
            {
                // Retorno de FALHA: Usando a conversão implícita
                return new ValidationFailed(new[] { $"Empresa com CNPJ {request.CNPJ} não encontrada." });
            }

            if (empresa.Ativa == false)
            {
                // Retorno de FALHA: Usando a conversão implícita
                return new ValidationFailed(new[] { $"Empresa com CNPJ {request.CNPJ} já está inativa." });
            }

            // Ação de Soft Delete
            empresa.Ativa = false;

            await _context.SaveChangesAsync(cancellationToken);

            // Retorno de SUCESSO CORRIGIDO:
            // Usamos o operador implícito para converter o string (CNPJ) para Result<string, ValidationFailed>
            return request.CNPJ;
        }
    }
}