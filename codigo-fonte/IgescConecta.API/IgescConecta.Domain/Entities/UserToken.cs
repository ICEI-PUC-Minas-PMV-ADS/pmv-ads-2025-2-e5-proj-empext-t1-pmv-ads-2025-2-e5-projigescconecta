using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class UserToken
    {
        public string AccessToken { get; set; }

        public DateTime ExpiresIn { get; set; }

        public string RefresfToken { get; set; }
    }
}
