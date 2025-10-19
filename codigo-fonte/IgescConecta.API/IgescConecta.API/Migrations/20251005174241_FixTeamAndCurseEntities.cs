using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IgescConecta.API.Migrations
{
    /// <inheritdoc />
    public partial class FixTeamAndCurseEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Donations_Team_TeamId",
                table: "Donations");

            migrationBuilder.DropForeignKey(
                name: "FK_PersonOscs_Team_TeamId",
                table: "PersonOscs");

            migrationBuilder.DropForeignKey(
                name: "FK_PersonTeams_Team_TeamId",
                table: "PersonTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectPrograms_Team_TeamId",
                table: "ProjectPrograms");

            migrationBuilder.DropForeignKey(
                name: "FK_Team_Courses_CourseId",
                table: "Team");

            migrationBuilder.DropForeignKey(
                name: "FK_Team_ProjectPrograms_ProjectProgramId",
                table: "Team");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Team",
                table: "Team");

            migrationBuilder.RenameTable(
                name: "Team",
                newName: "Teams");

            migrationBuilder.RenameIndex(
                name: "IX_Team_ProjectProgramId",
                table: "Teams",
                newName: "IX_Teams_ProjectProgramId");

            migrationBuilder.RenameIndex(
                name: "IX_Team_CourseId",
                table: "Teams",
                newName: "IX_Teams_CourseId");

            migrationBuilder.AlterColumn<int>(
                name: "UpdatedBy",
                table: "Users",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedBy",
                table: "Users",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Start",
                table: "Teams",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Finish",
                table: "Teams",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<string>(
                name: "LessonTime",
                table: "Teams",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Teams",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Teams",
                table: "Teams",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Donations_Teams_TeamId",
                table: "Donations",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonOscs_Teams_TeamId",
                table: "PersonOscs",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonTeams_Teams_TeamId",
                table: "PersonTeams",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectPrograms_Teams_TeamId",
                table: "ProjectPrograms",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_Courses_CourseId",
                table: "Teams",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_ProjectPrograms_ProjectProgramId",
                table: "Teams",
                column: "ProjectProgramId",
                principalTable: "ProjectPrograms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Donations_Teams_TeamId",
                table: "Donations");

            migrationBuilder.DropForeignKey(
                name: "FK_PersonOscs_Teams_TeamId",
                table: "PersonOscs");

            migrationBuilder.DropForeignKey(
                name: "FK_PersonTeams_Teams_TeamId",
                table: "PersonTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectPrograms_Teams_TeamId",
                table: "ProjectPrograms");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_Courses_CourseId",
                table: "Teams");

            migrationBuilder.DropForeignKey(
                name: "FK_Teams_ProjectPrograms_ProjectProgramId",
                table: "Teams");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Teams",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "LessonTime",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Teams");

            migrationBuilder.RenameTable(
                name: "Teams",
                newName: "Team");

            migrationBuilder.RenameIndex(
                name: "IX_Teams_ProjectProgramId",
                table: "Team",
                newName: "IX_Team_ProjectProgramId");

            migrationBuilder.RenameIndex(
                name: "IX_Teams_CourseId",
                table: "Team",
                newName: "IX_Team_CourseId");

            migrationBuilder.AlterColumn<int>(
                name: "UpdatedBy",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedBy",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Start",
                table: "Team",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Finish",
                table: "Team",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Team",
                table: "Team",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Donations_Team_TeamId",
                table: "Donations",
                column: "TeamId",
                principalTable: "Team",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonOscs_Team_TeamId",
                table: "PersonOscs",
                column: "TeamId",
                principalTable: "Team",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonTeams_Team_TeamId",
                table: "PersonTeams",
                column: "TeamId",
                principalTable: "Team",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectPrograms_Team_TeamId",
                table: "ProjectPrograms",
                column: "TeamId",
                principalTable: "Team",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Team_Courses_CourseId",
                table: "Team",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Team_ProjectPrograms_ProjectProgramId",
                table: "Team",
                column: "ProjectProgramId",
                principalTable: "ProjectPrograms",
                principalColumn: "Id");
        }
    }
}
