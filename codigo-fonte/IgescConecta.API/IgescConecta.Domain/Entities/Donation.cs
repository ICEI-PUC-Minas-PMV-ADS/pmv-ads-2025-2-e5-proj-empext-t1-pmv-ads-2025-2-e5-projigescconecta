using IgescConecta.Domain.Shared;
using System.ComponentModel.DataAnnotations.Schema;

namespace IgescConecta.Domain.Entities
{
    public class Donation : BaseEntity
    {
        public decimal Value { get; set; }
        public DateTime DonationDate { get; set; }

        public int? PersonId { get; set; }
        public int? CompanyId { get; set; }

        public int? OscId { get; set; }
        public int? CourseId { get; set; } 
        public int? TeamId { get; set; }

        [ForeignKey("PersonId")]
        public Person? Person { get; set; }

        [ForeignKey("CompanyId")]
        public Company? Company { get; set; }

        [ForeignKey("OscId")]
        public Osc? Osc { get; set; }

        [ForeignKey("CourseId")]
        public Course? Course { get; set; } 

        [ForeignKey("TeamId")]
        public Team? Team { get; set; }
    }
}