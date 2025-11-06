using System.ComponentModel.DataAnnotations;

namespace IgescConecta.Domain.Enums
{
    public enum ProjectDecisionType
    {
        [Display(Name = "Iniciado")]
        Started = 0,

        [Display(Name = "Incompleto")]
        Incomplete = 1,

        [Display(Name = "Aprovado")]
        Approved = 2,

        [Display(Name = "Reprovado")]
        Failed = 3
    }
}
