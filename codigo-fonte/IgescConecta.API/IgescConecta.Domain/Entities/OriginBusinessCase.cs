using IgescConecta.Domain.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class OriginBusinessCase : BaseEntity
    {
        public string Name { get; set; }

        public int BusinessCaseId { get; set; }

        [ForeignKey("BusinessCaseId")]
        public BusinessCase BusinessCase { get; set; }
    }
}
