using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace IgescConecta.API.Common.Extensions
{
    public class ApiAuthorize : AuthorizeAttribute
    {
        public ApiAuthorize()
        {
            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme; 
        }
    }
}

