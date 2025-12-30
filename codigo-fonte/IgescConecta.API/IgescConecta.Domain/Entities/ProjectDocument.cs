using IgescConecta.Domain.Shared;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IgescConecta.Domain.Entities
{
    public class ProjectDocument : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public byte[] FileData { get; set; } = Array.Empty<byte>();

        [Required]
        [MaxLength(100)]
        public string FileName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string ContentType { get; set; } = "application/pdf";

        public int ProjectProgramId { get; set; }

        [ForeignKey(nameof(ProjectProgramId))]
        public ProjectProgram ProjectProgram { get; set; } = null!;
    }
}
