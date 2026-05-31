using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CityexamappLLL.Migrations
{
    /// <inheritdoc />
    public partial class AddRouteQuestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RouteQuestions",
                columns: table => new
                {
                    Id               = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CityId           = table.Column<int>(type: "INTEGER", nullable: false),
                    RouteId          = table.Column<int>(type: "INTEGER", nullable: false),
                    Scenario         = table.Column<string>(type: "TEXT", nullable: false),
                    Question         = table.Column<string>(type: "TEXT", nullable: false),
                    AnswerA          = table.Column<string>(type: "TEXT", nullable: false),
                    AnswerB          = table.Column<string>(type: "TEXT", nullable: false),
                    AnswerC          = table.Column<string>(type: "TEXT", nullable: false),
                    CorrectAnswer    = table.Column<string>(type: "TEXT", nullable: false),
                    Explanation      = table.Column<string>(type: "TEXT", nullable: false),
                    LocationPhotoUrl = table.Column<string>(type: "TEXT", nullable: true),
                    MarkerX          = table.Column<double>(type: "REAL", nullable: false, defaultValue: 50.0),
                    MarkerY          = table.Column<double>(type: "REAL", nullable: false, defaultValue: 50.0),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteQuestions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RouteSigns",
                columns: table => new
                {
                    Id       = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CityId   = table.Column<int>(type: "INTEGER", nullable: false),
                    RouteId  = table.Column<int>(type: "INTEGER", nullable: false),
                    Name     = table.Column<string>(type: "TEXT", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: true),
                    Order    = table.Column<int>(type: "INTEGER", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteSigns", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "RouteQuestions");
            migrationBuilder.DropTable(name: "RouteSigns");
        }
    }
}
