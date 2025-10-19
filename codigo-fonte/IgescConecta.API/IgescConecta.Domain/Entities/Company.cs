using IgescConecta.Domain.Shared;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace IgescConecta.Domain.Entities
{
    public class Company : BaseEntity 
    {
        [Required]
        [StringLength(120)]
        public string CompanyName { get; set; } = string.Empty; 

        [StringLength(120)]
        public string? CorporateReason { get; set; } 

        [Required]
        [StringLength(14)]
        public string CNPJ { get; set; } = string.Empty; 


        [StringLength(100)]
        public string? FieldOfActivity { get; set; } 

        [StringLength(8)]
        public string? ZipCode { get; set; }

        [StringLength(200)]
        public string? Address { get; set; }

        [StringLength(100)]
        public string? Neighborhood { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(2)]
        public string? State { get; set; }

        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [StringLength(255)]
        public string? Website { get; set; }

        [StringLength(255)]
        public string? SocialMedia { get; set; }

        public bool IsActive { get; set; } = true;


        public ICollection<Donation> Donations { get; set; } = new List<Donation>();
    }
}