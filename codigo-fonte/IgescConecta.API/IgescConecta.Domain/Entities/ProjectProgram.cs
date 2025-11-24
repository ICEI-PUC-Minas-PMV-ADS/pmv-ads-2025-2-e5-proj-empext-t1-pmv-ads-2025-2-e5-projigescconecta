using IgescConecta.Domain.Enums;
using IgescConecta.Domain.Shared;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

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
        public int? ProjectDocumentId { get; set; }

        [ForeignKey(nameof(ProjectThemeId))]
        public ProjectTheme ProjectTheme { get; set; }

        [ForeignKey(nameof(ProjectTypeId))]
        public ProjectType ProjectType { get; set; }

        [ForeignKey(nameof(TeamId))]
        public Team Team { get; set; }

        [ForeignKey(nameof(OscId))]
        public Osc Osc { get; set; }

        //Relação abaixo está errada e será descontinuada... Por enquanto manter ela sem informação
        [ForeignKey(nameof(ProjectDocumentId))]
        public ProjectDocument? ProjectDocument { get; set; }
    }
}
