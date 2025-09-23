using IgescConecta.Domain.Enums;
using IgescConecta.Domain.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class PersonTeam : BaseEntity
    {
        public ICollection<MemberType> MemberTypes { get; set; }

        public int PersonId { get; set; }

        public int TeamId { get; set; }

        public int? OscId { get; set; }

        [ForeignKey("PersonId")]
        public Person Person { get; set; }

        [ForeignKey("TeamId")]
        public Team Team { get; set; }

        [ForeignKey("OscId")]
        public Osc? Osc { get; set; }
    }
}
