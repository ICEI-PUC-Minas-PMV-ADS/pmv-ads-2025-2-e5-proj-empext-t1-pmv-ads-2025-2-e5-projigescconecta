using IgescConecta.Domain.Enums;
using IgescConecta.Domain.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Entities
{
    public class ProjectProgram : BaseEntity
    {
        public string Name { get; set; }

        public IList<OdsType> OdsTypes { get; set; } = new List<OdsType>();

        public ProjectDecisionType Decision { get; set; }

        public int ProjectThemeId { get; set; }

        public int ProjectTypeId { get; set; }

        public int TeamId { get; set; }

        public int OscId { get; set; }

        public int ProjectDocumentId { get; set; }

        [ForeignKey("ProjectTypeId")]
        public ProjectTheme ProjectTheme { get; set; }

        [ForeignKey("ProjectThemeId")]
        public ProjectType ProjectType { get; set; }

        [ForeignKey("TeamId")]
        public Team Team { get; set; }

        [ForeignKey("OscId")]
        public Osc Osc { get; set; }

        [ForeignKey("ProjectDocumentId")]
        public ProjectDocument ProjectDocument { get; set; }

    }
}
