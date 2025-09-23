using IgescConecta.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class BusinessCase : BaseEntity
    {
        public string Name { get; set; }

        public ICollection<OriginBusinessCase> Origins { get; set; }
    }
}
