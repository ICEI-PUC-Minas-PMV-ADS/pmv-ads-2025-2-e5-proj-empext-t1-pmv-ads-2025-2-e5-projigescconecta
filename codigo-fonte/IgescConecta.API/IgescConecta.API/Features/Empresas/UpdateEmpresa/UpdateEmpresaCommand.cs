using MediatR;
using IgescConecta.API.Data;
using IgescConecta.API.Common.Validation;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Empresas.UpdateEmpresa
{
    // DTO (Data Transfer Object) (inalterado)
    public class UpdateEmpresaCommand : IRequest<Result<string, ValidationFailed>>
    {
        public string CNPJ { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    // Handler (L�gica de Neg�cio)
    internal sealed class UpdateEmpresaCommandHandler : IRequestHandler<UpdateEmpresaCommand, Result<string, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public UpdateEmpresaCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<string, ValidationFailed>> Handle(UpdateEmpresaCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.CNPJ) || request.CNPJ.Length != 14)
            {
                return new ValidationFailed(new[] { "CNPJ inv�lido ou n�o fornecido." });
            }

            var empresa = await _context.Empresas
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(e => e.CNPJ == request.CNPJ, cancellationToken);

            if (empresa == null)
            {
                return new ValidationFailed(new[] { $"Empresa com CNPJ {request.CNPJ} n�o encontrada." });
            }

            if (string.IsNullOrEmpty(request.Nome))
            {
                return new ValidationFailed(new[] { "O Nome da empresa � obrigat�rio." });
            }

            // Aplica��o das mudan�as
            empresa.Nome = request.Nome;
            empresa.Endereco = request.Endereco;
            empresa.Telefone = request.Telefone;
            empresa.Email = request.Email;

            await _context.SaveChangesAsync(cancellationToken);


            return empresa.CNPJ;
        }
    }
}