using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IgescConecta.API.Migrations
{
    /// <inheritdoc />
    public partial class Team_SingleEnum_For_Modality_And_Event : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventTypes",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "ModalityTypes",
                table: "Teams");

            migrationBuilder.AddColumn<int>(
                name: "EventType",
                table: "Teams",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ModalityType",
                table: "Teams",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventType",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "ModalityType",
                table: "Teams");

            migrationBuilder.AddColumn<int[]>(
                name: "EventTypes",
                table: "Teams",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);

            migrationBuilder.AddColumn<int[]>(
                name: "ModalityTypes",
                table: "Teams",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);
        }
    }
}
