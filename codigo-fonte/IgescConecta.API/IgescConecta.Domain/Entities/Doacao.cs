using IgescConecta.Domain.Shared;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IgescConecta.Domain.Entities
{
    [Table("Doacao")]
    public class Doacao : BaseEntity // Mantive BaseEntity por consistência
    {
        [Key]
        public Guid IDDoacao { get; set; } // PK da Doação

        [Required]
        public DateTime Data { get; set; }

        [Column(TypeName = "decimal(10,2)")] // Ajuste para o tipo do diagrama (DECIMAL(10,2))
        [Required]
        public decimal Valor { get; set; }

        // --- Doador (Pessoa OU Empresa) ---
        [StringLength(11)]
        [Column(TypeName = "CHAR(11)")]
        public string? DoadorPessoaCPF { get; set; } // FK opcional para Pessoa
        // public Pessoa? DoadorPessoa { get; set; } // Propriedade de navegação

        [StringLength(14)]
        [Column(TypeName = "CHAR(14)")]
        public string? DoadorEmpresaCNPJ { get; set; } // FK opcional para Empresa
        public Empresa? DoadorEmpresa { get; set; } // Propriedade de navegação

        // --- Destino (Turma OU OSC OU Nenhum) ---
        [StringLength(20)]
        public string? DestinoTipo { get; set; } // Campo para ajudar na exclusividade (ex: 'OSC', 'TURMA')

        // FK opcional para Turma. Usando Guid se a Turma.cs usar Guid, ou string se usar VARCHAR(20)
        public Guid? DestinoTurmaId { get; set; }
        // public Turma? DestinoTurma { get; set; } // Propriedade de navegação

        [StringLength(10)]
        public string? DestinoOSCCodigo { get; set; } // FK opcional para OSC
        // public OSC? DestinoOSC { get; set; } // Propriedade de navegação
    }
}
