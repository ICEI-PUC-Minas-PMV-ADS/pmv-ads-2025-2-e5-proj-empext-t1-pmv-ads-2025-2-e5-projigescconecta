using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IgescConecta.API.Migrations
{
 
    public partial class AddPersonExtraFieldsOnly : Migration
    {
       
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>("PrimaryPhone", "Persons", type: "nvarchar(max)", nullable: true);
            migrationBuilder.AddColumn<string>("SecondaryPhone", "Persons", type: "nvarchar(max)", nullable: true);
            migrationBuilder.AddColumn<string>("SecondaryEmail", "Persons", type: "nvarchar(max)", nullable: true);
            migrationBuilder.AddColumn<string>("Education1", "Persons", type: "nvarchar(max)", nullable: true);
            migrationBuilder.AddColumn<string>("Education2", "Persons", type: "nvarchar(max)", nullable: true);
            migrationBuilder.AddColumn<string>("ProfessionalActivity", "Persons", type: "nvarchar(max)", nullable: true);
        }

     
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn("PrimaryPhone", "Persons");
            migrationBuilder.DropColumn("SecondaryPhone", "Persons");
            migrationBuilder.DropColumn("SecondaryEmail", "Persons");
            migrationBuilder.DropColumn("Education1", "Persons");
            migrationBuilder.DropColumn("Education2", "Persons");
            migrationBuilder.DropColumn("ProfessionalActivity", "Persons");
        }
    }
}
