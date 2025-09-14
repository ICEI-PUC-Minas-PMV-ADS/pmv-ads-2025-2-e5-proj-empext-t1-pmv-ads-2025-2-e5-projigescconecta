using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace IgescConecta.API.Common.Extensions
{
    public class ApiAuthorize : AuthorizeAttribute
    {
        public ApiAuthorize()
        {
            AuthenticationSchemes = IdentityConstants.BearerScheme;
        }
    }
}
