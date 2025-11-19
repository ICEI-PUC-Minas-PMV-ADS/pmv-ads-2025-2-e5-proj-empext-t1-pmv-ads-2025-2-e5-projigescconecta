using IgescConecta.Domain.Enums;
using IgescConecta.Domain.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class PersonTeam : BaseEntity
    {
        [Required]
        [MinLength(1)]
        public IList<MemberType> MemberTypes { get; set; } = new List<MemberType>();

        [Required]
        public required int PersonId { get; set; }

        [Required]
        public required int TeamId { get; set; }

        public int? PersonOscId { get; set; }

        [ForeignKey("PersonId")]
        public Person Person { get; set; } = null!;

        [ForeignKey("TeamId")]
        public Team Team { get; set; } = null!;

        [ForeignKey("PersonOscId")]
        public PersonOsc? PersonOsc { get; set; }
    }
}
