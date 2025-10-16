using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IgescConecta.API.Migrations
{
    public partial class AddProjectProgramToDonation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectProgramId",
                table: "Donations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Donations_ProjectProgramId",
                table: "Donations",
                column: "ProjectProgramId");

            migrationBuilder.AddForeignKey(
                name: "FK_Donations_ProjectPrograms_ProjectProgramId",
                table: "Donations",
                column: "ProjectProgramId",
                principalTable: "ProjectPrograms",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Donations_ProjectPrograms_ProjectProgramId",
                table: "Donations");

            migrationBuilder.DropIndex(
                name: "IX_Donations_ProjectProgramId",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "ProjectProgramId",
                table: "Donations");
        }
    }
}
