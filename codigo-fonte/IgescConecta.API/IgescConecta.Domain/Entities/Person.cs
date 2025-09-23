using IgescConecta.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class Person : BaseEntity
    {
        public string Name { get; set; }

        public string Email { get; set; }

        public string PersonalDocumment { get; set; }

        public ICollection<PersonTeam>? Teams { get; set; }

        public ICollection<PersonOsc>? Oscs { get; set; }

        public ICollection<PersonCompany>? Companies { get; set; }
    }
}
