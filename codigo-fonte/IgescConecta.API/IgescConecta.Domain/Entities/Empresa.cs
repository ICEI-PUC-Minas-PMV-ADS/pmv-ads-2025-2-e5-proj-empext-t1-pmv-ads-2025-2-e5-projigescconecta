using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using IgescConecta.Domain.Shared;

namespace IgescConecta.Domain.Entities
{
    [Table("Empresa")]
    public class Empresa : BaseEntity
    {
        [Key]
        [Column(TypeName = "CHAR(14)")]
        public string CNPJ { get; set; } = string.Empty;

        [Required]
        [StringLength(120)]
        public string Nome { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Estado ativo/inativo (Soft Delete)
        public bool Ativa { get; set; } = true;

        // Propriedade de navegação para as Doações (Relacionamento 1:N)
        public ICollection<Doacao> DoacoesRealizadas { get; set; } = new List<Doacao>();
    }
}