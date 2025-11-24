using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IgescConecta.API.Migrations
{
    /// <inheritdoc />
    public partial class PersonTeam_RefToPersonOsc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PersonTeams_Oscs_OscId",
                table: "PersonTeams");

            migrationBuilder.RenameColumn(
                name: "OscId",
                table: "PersonTeams",
                newName: "PersonOscId");

            migrationBuilder.RenameIndex(
                name: "IX_PersonTeams_OscId",
                table: "PersonTeams",
                newName: "IX_PersonTeams_PersonOscId");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonTeams_PersonOscs_PersonOscId",
                table: "PersonTeams",
                column: "PersonOscId",
                principalTable: "PersonOscs",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PersonTeams_PersonOscs_PersonOscId",
                table: "PersonTeams");

            migrationBuilder.RenameColumn(
                name: "PersonOscId",
                table: "PersonTeams",
                newName: "OscId");

            migrationBuilder.RenameIndex(
                name: "IX_PersonTeams_PersonOscId",
                table: "PersonTeams",
                newName: "IX_PersonTeams_OscId");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonTeams_Oscs_OscId",
                table: "PersonTeams",
                column: "OscId",
                principalTable: "Oscs",
                principalColumn: "Id");
        }
    }
}
