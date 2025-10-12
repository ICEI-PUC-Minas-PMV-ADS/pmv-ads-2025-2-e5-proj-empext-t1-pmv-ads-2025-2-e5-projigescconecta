using MediatR;
using IgescConecta.API.Data;
using IgescConecta.API.Common.Validation;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks; // Necessário para Task.FromResult

namespace IgescConecta.API.Features.Empresas.ListEmpresa
{
    // DTO de Saída (Mantido com todos os campos necessários para a API)
    public class EmpresaDto
    {
        public string CNPJ { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool Ativa { get; set; }
    }

    // DTO de Entrada (Query)
    public class ListEmpresaQuery : IRequest<Result<EmpresaDto, ValidationFailed>>
    {
        public string CNPJ { get; set; } = string.Empty;
    }

    // Handler da Consulta (Lógica de Leitura)
    internal sealed class ListEmpresaQueryHandler : IRequestHandler<ListEmpresaQuery, Result<EmpresaDto, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public ListEmpresaQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<EmpresaDto, ValidationFailed>> Handle(ListEmpresaQuery request, CancellationToken cancellationToken)
        {
            var empresa = await _context.Empresas
              .AsNoTracking()
              .SingleOrDefaultAsync(e => e.CNPJ == request.CNPJ, cancellationToken);

            if (empresa == null)
            {
                // RETORNO DE FALHA: Usando Task.FromResult com conversão explícita
                return await Task.FromResult((Result<EmpresaDto, ValidationFailed>)new ValidationFailed(new[] {
          $"Empresa com CNPJ {request.CNPJ} não encontrada ou inativa."
        }));
            }

            // Mapeamento para o DTO
            var dto = new EmpresaDto
            {
                CNPJ = empresa.CNPJ,
                Nome = empresa.Nome,
                Endereco = empresa.Endereco,
                Telefone = empresa.Telefone,
                Email = empresa.Email,
                Ativa = empresa.Ativa
            };

            // RETORNO DE SUCESSO: Usando Task.FromResult com conversão explícita
            return await Task.FromResult((Result<EmpresaDto, ValidationFailed>)dto);
        }
    }
}