using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using CityexamappLLL.Data;
using CityexamappLLL.Models;
using CityexamappLLL.DTOs.Auth;
using CityexamappLLL.DTOs.Users;

namespace CityexamappLLL.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwt;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, JwtService jwt, IConfiguration config)
    {
        _db = db;
        _jwt = jwt;
        _config = config;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            return null;

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone ?? "",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            AuthProvider = "local",
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new AuthResponseDto(_jwt.GenerateToken(user), ToDto(user));
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.AuthProvider == "local");

        if (user == null) return null;
        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) return null;

        return new AuthResponseDto(_jwt.GenerateToken(user), ToDto(user));
    }

    public async Task<AuthResponseDto?> GoogleLoginAsync(string idToken)
    {
        GoogleJsonWebSignature.Payload payload;
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _config["Authentication:Google:ClientId"] }
            };
            payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
        }
        catch
        {
            return null;
        }

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.GoogleId == payload.Subject);

        if (user == null)
        {
            user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == payload.Email);

            if (user != null)
            {
                user.GoogleId = payload.Subject;
                user.ProfileImageUrl = payload.Picture;
                user.AuthProvider = "google";
            }
            else
            {
                user = new User
                {
                    Name = payload.Name,
                    Email = payload.Email,
                    GoogleId = payload.Subject,
                    ProfileImageUrl = payload.Picture,
                    AuthProvider = "google",
                };
                _db.Users.Add(user);
            }

            await _db.SaveChangesAsync();
        }

        return new AuthResponseDto(_jwt.GenerateToken(user), ToDto(user));
    }

    public async Task<AuthResponseDto?> GetMeAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return null;
        return new AuthResponseDto(_jwt.GenerateToken(user), ToDto(user));
    }

    private static UserDto ToDto(User u) =>
        new(u.Id, u.Name, u.Email, u.Phone, u.IsPremium, u.AuthProvider, u.ProfileImageUrl);
}
