using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IgescConecta.API.Migrations
{
    /// <inheritdoc />
    public partial class FixProjectProgramFKs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectPrograms_ProjectThemes_ProjectTypeId",
                table: "ProjectPrograms");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectPrograms_ProjectTypes_ProjectThemeId",
                table: "ProjectPrograms");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectPrograms_ProjectThemes_ProjectThemeId",
                table: "ProjectPrograms",
                column: "ProjectThemeId",
                principalTable: "ProjectThemes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectPrograms_ProjectTypes_ProjectTypeId",
                table: "ProjectPrograms",
                column: "ProjectTypeId",
                principalTable: "ProjectTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectPrograms_ProjectThemes_ProjectThemeId",
                table: "ProjectPrograms");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectPrograms_ProjectTypes_ProjectTypeId",
                table: "ProjectPrograms");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectPrograms_ProjectThemes_ProjectTypeId",
                table: "ProjectPrograms",
                column: "ProjectTypeId",
                principalTable: "ProjectThemes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectPrograms_ProjectTypes_ProjectThemeId",
                table: "ProjectPrograms",
                column: "ProjectThemeId",
                principalTable: "ProjectTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
