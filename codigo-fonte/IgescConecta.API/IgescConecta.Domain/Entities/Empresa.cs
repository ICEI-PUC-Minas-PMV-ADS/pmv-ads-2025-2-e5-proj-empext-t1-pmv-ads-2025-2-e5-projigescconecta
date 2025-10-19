// Arquivo: IgescConecta.Domain/Entities/Empresa.cs 
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
        // Chave de Negócio (CNPJ - Deve ser único)
        [Key]
        [Column(TypeName = "CHAR(14)")]
        public string CNPJ { get; set; } = string.Empty;

        // CAMPOS DO CLIENTE:
        [Required]
        [StringLength(120)]
        public string Nome { get; set; } = string.Empty; 

        [Required]
        [StringLength(120)]
        public string RazaoSocial { get; set; } = string.Empty;

        public string AreaAtuacao { get; set; } = string.Empty;
        public string CEP { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Bairro { get; set; } = string.Empty;
        public string Cidade { get; set; } = string.Empty;
        public string UF { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Site { get; set; } = string.Empty;
        public string RedesSociais { get; set; } = string.Empty;

        public bool Ativa { get; set; } = true;

        public ICollection<Doacao> DoacoesRealizadas { get; set; } = new List<Doacao>();
    }
}