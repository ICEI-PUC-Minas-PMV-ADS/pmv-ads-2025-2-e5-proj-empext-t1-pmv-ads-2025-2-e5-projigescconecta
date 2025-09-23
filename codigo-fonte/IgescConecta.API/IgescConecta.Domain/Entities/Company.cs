using IgescConecta.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class Company : BaseEntity
    {
        public string CompanyName { get; set; }

        public string? CorporateReason { get; set; }

        public string CNPJ { get; set; }
    }
}
