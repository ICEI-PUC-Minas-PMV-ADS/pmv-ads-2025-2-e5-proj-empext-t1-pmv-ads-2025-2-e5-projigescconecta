using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IgescConecta.Domain.Shared
{
    public class BaseEntity
    {
        public int Id { get; set; }

        public int CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }

        public int UpdatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;

        public int? DeactivatedBy { get; set; } // quem desativou, null se ainda ativo
        public DateTime? DeactivatedAt { get; set; } // quando foi desativado
    }
}
