using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IgescConecta.API.Migrations
{
    /// <inheritdoc />
    public partial class TeamFixProblemas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectPrograms_ProjectDocuments_ProjectDocumentId",
                table: "ProjectPrograms");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_ProjectPrograms_ProjectProgramId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_ProjectProgramId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "ProjectProgramId",
                table: "Teams");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Teams",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ProjectDocumentId",
                table: "ProjectPrograms",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectPrograms_ProjectDocuments_ProjectDocumentId",
                table: "ProjectPrograms",
                column: "ProjectDocumentId",
                principalTable: "ProjectDocuments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectPrograms_ProjectDocuments_ProjectDocumentId",
                table: "ProjectPrograms");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Teams",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "ProjectProgramId",
                table: "Teams",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ProjectDocumentId",
                table: "ProjectPrograms",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Teams_ProjectProgramId",
                table: "Teams",
                column: "ProjectProgramId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectPrograms_ProjectDocuments_ProjectDocumentId",
                table: "ProjectPrograms",
                column: "ProjectDocumentId",
                principalTable: "ProjectDocuments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_ProjectPrograms_ProjectProgramId",
                table: "Teams",
                column: "ProjectProgramId",
                principalTable: "ProjectPrograms",
                principalColumn: "Id");
        }
    }
}
