using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CityexamappLLL.Migrations
{
    /// <inheritdoc />
    public partial class AddRouteQuestionLocationPhoto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LocationPhotoUrl",
                table: "RouteQuestions",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MarkerX",
                table: "RouteQuestions",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "MarkerY",
                table: "RouteQuestions",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationPhotoUrl",
                table: "RouteQuestions");

            migrationBuilder.DropColumn(
                name: "MarkerX",
                table: "RouteQuestions");

            migrationBuilder.DropColumn(
                name: "MarkerY",
                table: "RouteQuestions");
        }
    }
}
