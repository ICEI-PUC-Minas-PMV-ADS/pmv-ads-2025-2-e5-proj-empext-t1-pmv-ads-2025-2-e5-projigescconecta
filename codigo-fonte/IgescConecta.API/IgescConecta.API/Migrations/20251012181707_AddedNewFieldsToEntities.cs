using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IgescConecta.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedNewFieldsToEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectPrograms_projectThemes_ProjectTypeId",
                table: "ProjectPrograms");

            migrationBuilder.DropPrimaryKey(
                name: "PK_projectThemes",
                table: "projectThemes");

            migrationBuilder.RenameTable(
                name: "projectThemes",
                newName: "ProjectThemes");

            migrationBuilder.AlterColumn<string>(
                name: "OscPrimaryDocumment",
                table: "Oscs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Oscs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Oscs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Neighborhood",
                table: "Oscs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Oscs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SocialMedia",
                table: "Oscs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Oscs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WebUrl",
                table: "Oscs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "OriginBusinessCases",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Beneficiaries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectThemes",
                table: "ProjectThemes",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Empresa",
                columns: table => new
                {
                    CNPJ = table.Column<string>(type: "CHAR(14)", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Endereco = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ativa = table.Column<bool>(type: "bit", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empresa", x => x.CNPJ);
                });

            migrationBuilder.CreateTable(
                name: "Doacao",
                columns: table => new
                {
                    IDDoacao = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Data = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    DoadorPessoaCPF = table.Column<string>(type: "CHAR(11)", maxLength: 11, nullable: true),
                    DoadorEmpresaCNPJ = table.Column<string>(type: "CHAR(14)", maxLength: 14, nullable: true),
                    DestinoTipo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DestinoTurmaId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DestinoOSCCodigo = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Id = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doacao", x => x.IDDoacao);
                    table.CheckConstraint("CHK_Doacao_DestinoExclusivo", "(IIF(DestinoTurmaId IS NULL, 0, 1) + IIF(DestinoOSCCodigo IS NULL, 0, 1)) <= 1");
                    table.CheckConstraint("CHK_Doacao_DoadorExclusivo", "(IIF(DoadorPessoaCPF IS NULL, 0, 1) + IIF(DoadorEmpresaCNPJ IS NULL, 0, 1)) = 1");
                    table.ForeignKey(
                        name: "FK_Doacao_Empresa_DoadorEmpresaCNPJ",
                        column: x => x.DoadorEmpresaCNPJ,
                        principalTable: "Empresa",
                        principalColumn: "CNPJ");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Doacao_DoadorEmpresaCNPJ",
                table: "Doacao",
                column: "DoadorEmpresaCNPJ");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectPrograms_ProjectThemes_ProjectTypeId",
                table: "ProjectPrograms",
                column: "ProjectTypeId",
                principalTable: "ProjectThemes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectPrograms_ProjectThemes_ProjectTypeId",
                table: "ProjectPrograms");

            migrationBuilder.DropTable(
                name: "Doacao");

            migrationBuilder.DropTable(
                name: "Empresa");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectThemes",
                table: "ProjectThemes");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Oscs");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Oscs");

            migrationBuilder.DropColumn(
                name: "Neighborhood",
                table: "Oscs");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Oscs");

            migrationBuilder.DropColumn(
                name: "SocialMedia",
                table: "Oscs");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Oscs");

            migrationBuilder.DropColumn(
                name: "WebUrl",
                table: "Oscs");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "OriginBusinessCases");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Beneficiaries");

            migrationBuilder.RenameTable(
                name: "ProjectThemes",
                newName: "projectThemes");

            migrationBuilder.AlterColumn<string>(
                name: "OscPrimaryDocumment",
                table: "Oscs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_projectThemes",
                table: "projectThemes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectPrograms_projectThemes_ProjectTypeId",
                table: "ProjectPrograms",
                column: "ProjectTypeId",
                principalTable: "projectThemes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
