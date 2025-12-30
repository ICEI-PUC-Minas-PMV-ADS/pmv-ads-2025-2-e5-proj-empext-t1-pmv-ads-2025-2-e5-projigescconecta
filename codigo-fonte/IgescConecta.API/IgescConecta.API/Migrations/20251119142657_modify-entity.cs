using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IgescConecta.API.Migrations
{
    /// <inheritdoc />
    public partial class modifyentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Entity",
                table: "ReportSorts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Entity",
                table: "ReportFilterQuestions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Entity",
                table: "ReportFields",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Entity",
                table: "ReportSorts");

            migrationBuilder.DropColumn(
                name: "Entity",
                table: "ReportFilterQuestions");

            migrationBuilder.DropColumn(
                name: "Entity",
                table: "ReportFields");
        }
    }
}
