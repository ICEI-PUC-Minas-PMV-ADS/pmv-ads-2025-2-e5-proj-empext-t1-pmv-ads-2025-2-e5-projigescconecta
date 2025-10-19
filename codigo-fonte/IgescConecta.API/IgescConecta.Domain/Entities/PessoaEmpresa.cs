using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IgescConecta.Domain.Entities
{
    [Table("PessoaEmpresa")]
    public class PessoaEmpresa
    {
        // Chave Estrangeira 1 (FK) - CPF da Pessoa (Representante)
        [Column(TypeName = "CHAR(11)")]
        [Required]
        public string PessoaCPF { get; set; } = string.Empty;

        // Chave Estrangeira 2 (FK) - CNPJ da Empresa
        [Column(TypeName = "CHAR(14)")]
        [Required]
        public string EmpresaCNPJ { get; set; } = string.Empty;

        // Atributo que complementa a chave composta (Restrição 11 e 13)
        [StringLength(20)]
        [Required]
        public string Papel { get; set; } = string.Empty;

        // Propriedades de navegação:

        // public Pessoa Pessoa { get; set; } = null!; // Depende da classe Pessoa
        public Empresa Empresa { get; set; } = null!;
    }
}