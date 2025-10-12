using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using IgescConecta.Domain.Shared;

namespace IgescConecta.Domain.Entities
{
    public class Person : BaseEntity
    {
        public string Name { get; set; }

        public string Email { get; set; }

        public string PersonalDocumment { get; set; }

        public string? SecondaryEmail { get; set; }
        public string? PrimaryPhone { get; set; }
        public string? SecondaryPhone { get; set; }
        public string? Education1 { get; set; }
        public string? Education2 { get; set; }
        public string? ProfessionalActivity { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<PersonTeam>? Teams { get; set; }
        public ICollection<PersonOsc>? Oscs { get; set; }
        public ICollection<PersonCompany>? Companies { get; set; }

    }
}
