using IgescConecta.Domain.Shared;
using System;

namespace IgescConecta.Domain.Entities
{
    public class Team : BaseEntity
    {
        public string Name { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Time { get; set; } // horário no formato string (ex: "08:00 - 10:00")

        // Relacionamento com Course
        public int CourseId { get; set; }
        public Course Course { get; set; } // Navegação
    }
}
