using IgescConecta.Domain.Primitives;
using IgescConecta.Domain.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class Osc : BaseEntity
    {
        public string Name { get; set; }

        public string Objective { get; set; }

        public string CorporateName { get; set; }

        public string Address { get; set; }

        public string ZipCode { get; set; }

        public string? OscPrimaryDocumment { get; set; }

        public ICollection<OriginBusinessCase>? OriginsBusinessCases { get; set; }

        public ICollection<Beneficiary>? Beneficiaries { get; set; }

        public ICollection<ProjectProgram>? Projects { get; set; }
    }
}
