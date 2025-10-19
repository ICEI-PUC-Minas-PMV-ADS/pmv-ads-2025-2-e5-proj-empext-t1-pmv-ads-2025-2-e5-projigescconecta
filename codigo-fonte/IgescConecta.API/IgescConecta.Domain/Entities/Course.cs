using IgescConecta.Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class Course : BaseEntity
    {
        public string? Name { get; set; }
        public ICollection<Team> Teams { get; set; } = new List<Team>();

    }
}
