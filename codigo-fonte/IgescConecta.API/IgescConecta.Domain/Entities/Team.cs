using IgescConecta.Domain.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class Team : BaseEntity
    {
        public string? Name { get; set; }
        public string? LessonTime { get; set; }
        public DateTime? Start { get; set; }

        public DateTime? Finish { get; set; }

        public ICollection<PersonTeam> PersonTeams { get; set; } = new List<PersonTeam>();
        public ICollection<PersonOsc> PersonOscs { get; set; } = new List<PersonOsc>();

        public int? ProjectProgramId { get; set; }

        public int? CourseId { get; set; }

        [ForeignKey("ProjectProgramId")]
        public ProjectProgram? ProjectProgram { get; set; }

        [ForeignKey("CourseId")]
        public Course? Course { get; set; }
    }
}
