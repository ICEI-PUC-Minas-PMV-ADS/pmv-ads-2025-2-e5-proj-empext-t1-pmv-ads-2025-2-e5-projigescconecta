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
    public class PersonOsc : BaseEntity
    {
        public int PersonId { get; set; }

        public int OscId { get; set; }

        [ForeignKey("PersonId")]
        public Person Person { get; set; }

        [ForeignKey("OscId")]
        public Osc Osc { get; set; }
    }
}
