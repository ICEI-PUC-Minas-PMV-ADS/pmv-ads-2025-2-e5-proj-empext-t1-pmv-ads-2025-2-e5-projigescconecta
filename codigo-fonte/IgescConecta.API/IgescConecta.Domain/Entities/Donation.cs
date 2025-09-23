using IgescConecta.Domain.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class Donation : BaseEntity
    {
        public DateTime DonationDate { get; set; }

        public decimal Value { get; set; }

        public int? PersonId { get; set; }

        public int? CompanyId { get; set; }

        public int? OscId { get; set; }

        public int? TeamId { get; set; }

        [ForeignKey("OscId")]
        public Osc? Osc { get; set; }

        [ForeignKey("PersonId")]
        public Person? Person { get; set; }

        [ForeignKey("CompanyId")]
        public Company? Company { get; set; }

        [ForeignKey("TeamId")]
        public Team? Team { get; set; }
    }
}
