using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IgescConecta.API.Migrations
{
    /// <inheritdoc />
    public partial class BaselineExisting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Baseline vazio: não cria/renomeia/altera nada no banco.
            // Motivo: já existem objetos criados por outra pessoa/migration manual no DB
            // (ex.: Empresa, Doacao, etc.). Esta migration serve apenas para “alinhar”
            // o histórico do EF com o estado atual do banco.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Intencionalmente vazio pelo mesmo motivo do Up().
        }
    }
}
