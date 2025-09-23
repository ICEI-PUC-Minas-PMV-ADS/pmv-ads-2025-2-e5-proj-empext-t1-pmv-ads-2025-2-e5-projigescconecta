using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Enums
{
    public enum MemberType
    {
        [Display(Name = "Participante")]
        Student,
        [Display(Name = "Professor")]
        Professor,
        [Display(Name = "Coordenador")]
        Coordinator,
        [Display(Name = "Consultor Social")]
        Consultant,
        [Display(Name = "Mentor")]
        TeamLeader,
        [Display(Name = "Coordenador Geral")]
        ProgramCoordinator,
        [Display(Name = "Palestrante")]
        Speaker,
        [Display(Name = "Apoio Técnico")]
        TechSupport
    }
}
