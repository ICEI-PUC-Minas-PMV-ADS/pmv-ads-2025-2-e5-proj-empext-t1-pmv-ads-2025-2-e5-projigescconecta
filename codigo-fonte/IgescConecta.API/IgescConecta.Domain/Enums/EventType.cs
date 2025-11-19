using System.ComponentModel.DataAnnotations;

namespace IgescConecta.Domain.Enums
{
    public enum EventType
    {
        [Display(Name = "Aberto")]
        Open = 1,

        [Display(Name = "Patrocinado")]
        Sponsored = 2,
    }
}
