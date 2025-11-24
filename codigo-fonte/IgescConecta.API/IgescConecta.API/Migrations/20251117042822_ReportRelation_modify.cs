using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IgescConecta.API.Migrations
{
    /// <inheritdoc />
    public partial class ReportRelation_modify : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Alias",
                table: "ReportRelations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Entity",
                table: "ReportRelations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FromEntity",
                table: "ReportRelations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "JoinType",
                table: "ReportRelations",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Alias",
                table: "ReportRelations");

            migrationBuilder.DropColumn(
                name: "Entity",
                table: "ReportRelations");

            migrationBuilder.DropColumn(
                name: "FromEntity",
                table: "ReportRelations");

            migrationBuilder.DropColumn(
                name: "JoinType",
                table: "ReportRelations");
        }
    }
}
