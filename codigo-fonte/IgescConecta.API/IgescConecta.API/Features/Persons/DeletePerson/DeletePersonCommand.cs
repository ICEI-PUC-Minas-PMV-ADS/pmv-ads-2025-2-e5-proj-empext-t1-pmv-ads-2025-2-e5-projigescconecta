using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Persons.DeletePerson
{
    public class DeletePersonCommand : IRequest<Result<bool, ValidationFailed>>
    {
        public int PersonId { get; }
        public DeletePersonCommand(int personId) => PersonId = personId;
    }

    internal sealed class DeletePersonCommandHandler : IRequestHandler<DeletePersonCommand, Result<bool, ValidationFailed>>
    {
        private readonly ApplicationDbContext _ctx;
        public DeletePersonCommandHandler(ApplicationDbContext ctx) => _ctx = ctx;

        public async Task<Result<bool, ValidationFailed>> Handle(DeletePersonCommand r, CancellationToken ct)
        {
            var p = await _ctx.Persons.FirstOrDefaultAsync(x => x.Id == r.PersonId, ct);
            if (p is null) return new ValidationFailed("Person not found");

            // Soft delete: o DbContext intercepta State=Deleted e seta IsDeleted=true
            _ctx.Persons.Remove(p);
            await _ctx.SaveChangesAsync(ct);
            return true;
        }
    }
}

