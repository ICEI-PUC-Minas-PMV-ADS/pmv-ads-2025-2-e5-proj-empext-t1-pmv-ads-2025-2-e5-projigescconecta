using IgescConecta.Domain.Shared;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class User : IdentityUser<int>
    {
        public string Name { get; set; }

        public bool IsActive { get; set; }
    }
}
