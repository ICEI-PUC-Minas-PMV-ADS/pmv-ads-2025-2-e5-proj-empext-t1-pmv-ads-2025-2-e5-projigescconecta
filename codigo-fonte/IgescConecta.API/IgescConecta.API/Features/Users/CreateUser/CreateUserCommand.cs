using MediatR; // Biblioteca para o padrão Mediator (CQRS)
using IgescConecta.API.Common.Validation; // Contém classes para validação e retorno de erros
using Microsoft.AspNetCore.Identity; // Identity framework do ASP.Net para gerenciar usuários e roles
using IgescConecta.Domain.Entities; // Entidade User do domínio
using Microsoft.VisualBasic; // (Não é usado diretamente aqui, pode ser removido)

namespace IgescConecta.API.Features.Users.CreateUser
{
    // Define o comando de criação de usuário, que será enviado via Mediator
    // IRequest<Result<int, ValidationFailed>> indica que o comando retorna um Result
    // com int em caso de sucesso (ID do usuário) ou ValidationFailed em caso de erro
    public class CreateUserCommand : IRequest<Result<int, ValidationFailed>>
    {
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; } // Role do usuário (ex: ADMIN, USER)
    }

    // Handler responsável por tratar o CreateUserCommand
    // Ele implementa IRequestHandler<Comando, ResultadoEsperado>
    internal sealed class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Result<int, ValidationFailed>>
    {
        private readonly UserManager<User> _userManager; // Identity UserManager para gerenciar usuários

        public CreateUserCommandHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        // Método que será chamado pelo Mediator quando o comando for enviado
        public async Task<Result<int, ValidationFailed>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            // Cria uma instância do usuário com os dados enviados no comando
            var user = new User
            {
                UserName = request.Email, // Identity usa UserName para login
                Email = request.Email,
                Name = request.Name,
                PhoneNumber = request.PhoneNumber,
                IsActive = true // Define o usuário como ativo
            };

            // Cria o usuário no banco e define a senha
            var result = await _userManager.CreateAsync(user, request.Password);

            if (result.Succeeded)
            {
                // Se a criação deu certo, adiciona o usuário ao role informado
                await _userManager.AddToRoleAsync(user, request.Role.ToUpper());

                // Retorna o ID do usuário como sucesso
                return user.Id;
            }

            // Se houve erro, retorna um objeto de validação com todas as mensagens
            return new ValidationFailed(result.Errors.Select(e => e.Description).ToArray());
        }
    }
}
