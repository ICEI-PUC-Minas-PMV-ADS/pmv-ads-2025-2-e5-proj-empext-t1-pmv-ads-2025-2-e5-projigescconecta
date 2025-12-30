using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IgescConecta.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectDocuments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContentType",
                table: "ProjectDocuments",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "ProjectDocuments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "FileData",
                table: "ProjectDocuments",
                type: "bytea",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "ProjectDocuments",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "ProjectDocuments",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ProjectProgramId",
                table: "ProjectDocuments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectDocuments_ProjectProgramId",
                table: "ProjectDocuments",
                column: "ProjectProgramId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectDocuments_ProjectPrograms_ProjectProgramId",
                table: "ProjectDocuments",
                column: "ProjectProgramId",
                principalTable: "ProjectPrograms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectDocuments_ProjectPrograms_ProjectProgramId",
                table: "ProjectDocuments");

            migrationBuilder.DropIndex(
                name: "IX_ProjectDocuments_ProjectProgramId",
                table: "ProjectDocuments");

            migrationBuilder.DropColumn(
                name: "ContentType",
                table: "ProjectDocuments");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "ProjectDocuments");

            migrationBuilder.DropColumn(
                name: "FileData",
                table: "ProjectDocuments");

            migrationBuilder.DropColumn(
                name: "FileName",
                table: "ProjectDocuments");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "ProjectDocuments");

            migrationBuilder.DropColumn(
                name: "ProjectProgramId",
                table: "ProjectDocuments");
        }
    }
}
