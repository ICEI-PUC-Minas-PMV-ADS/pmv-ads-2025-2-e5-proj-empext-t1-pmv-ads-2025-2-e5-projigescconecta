using IgescConecta.Domain.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace IgescConecta.Domain.Entities
{
    public class Team : BaseEntity
    {

        [Required]
        public required string Name { get; set; }
        
        public string? LessonTime { get; set; }

        public DateTime? Start { get; set; }

        public DateTime? Finish { get; set; }

        public ICollection<PersonTeam> PersonTeams { get; set; } = new List<PersonTeam>();
        public ICollection<PersonOsc> PersonOscs { get; set; } = new List<PersonOsc>();

        public ICollection<ProjectProgram> ProjectPrograms { get; set; } = new List<ProjectProgram>();

        [Required]
        public int CourseId { get; set; }

        [ForeignKey("CourseId")]
        public Course Course { get; set; } = null!;

    }
}
