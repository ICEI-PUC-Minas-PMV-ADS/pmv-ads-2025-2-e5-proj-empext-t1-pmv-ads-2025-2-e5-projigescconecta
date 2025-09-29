using IgescConecta.API.Common.Extensions; // Contém extensões/utilitários do projeto
using MediatR; // Biblioteca para implementar o padrão Mediator (similar a CQRS)
using Microsoft.AspNetCore.Mvc; // Classes para criar endpoints HTTP (Controllers)

namespace IgescConecta.API.Features.Users.CreateUser
{
    // [ApiAuthorize] -> Custom attribute que exige autenticação/autorização para acessar esse endpoint
    [ApiAuthorize]

    // Define a rota base para os endpoints deste controller
    [Route("/api/users")]

    // Indica que este é um controller para APIs, habilitando comportamentos de API automáticos
    [ApiController]

    // Agrupa este endpoint na documentação Swagger sob "Users"
    [ApiExplorerSettings(GroupName = "Users")]
    public class CreateUserEndPoint : ControllerBase
    {
        private readonly IMediator _mediator; // Mediator para enviar comandos/querys (padrão CQRS)

        // Construtor recebe IMediator via injeção de dependência
        public CreateUserEndPoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        // Define que este método responde a requisições POST em /api/users/CreateUser
        [HttpPost("CreateUser", Name = "CreateUser")]
        public async Task<ActionResult<CreateUserResponse>> CreateUser([FromBody] CreateUserRequest request)
        {
            // Cria um comando CreateUserCommand com os dados da requisição
            var result = await _mediator.Send(new CreateUserCommand
            {
                Name = request.Name,
                Password = request.Password,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Role = request.Role
            });

            // Se o comando foi bem-sucedido, retorna 200 OK com o Id do usuário
            // Caso contrário, retorna 400 BadRequest com o erro
            return result.IsSuccess
                ? Ok(new CreateUserResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    // Modelo que representa a requisição enviada pelo cliente
    public class CreateUserRequest
    {
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
    }

    // Modelo que representa a resposta enviada pelo servidor
    public class CreateUserResponse
    {
        public int UserId { get; set; }

        public CreateUserResponse(int userId)
        {
            UserId = userId;
        }
    }
}
