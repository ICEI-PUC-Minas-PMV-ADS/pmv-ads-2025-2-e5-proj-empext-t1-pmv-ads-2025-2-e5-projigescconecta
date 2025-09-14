using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;

namespace IgescConecta.API.Features.Users.DeleteUser
{
    public class DeleteUserCommand : IRequest<Result<bool, ValidationFailed>>
    {
        public int UserId { get; set; }

        public DeleteUserCommand(int userId)
        {
            UserId = userId;
        }

    }

    internal sealed class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Result<bool, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteUserCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<bool, ValidationFailed>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FindAsync([request.UserId]);
            if (user == null)
            {
                return new ValidationFailed(new[] { "User not found" });
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }

}
