using System.ComponentModel.DataAnnotations;

namespace IgescConecta.Domain.Enums
{
    public enum ModalityType
    {
        [Display(Name = "Presencial")]
        InPerson = 1,

        [Display(Name = "Híbrido")]
        Hybrid = 2,

        [Display(Name = "EAD")]
        EAD = 3,
    }
}