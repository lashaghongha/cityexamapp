using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CityexamappLLL.Migrations
{
    /// <inheritdoc />
    public partial class AddCityIdToMap : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CityId",
                table: "Maps",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CityId",
                table: "Maps");
        }
    }
}
