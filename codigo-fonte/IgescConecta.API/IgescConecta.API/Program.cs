using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Options;
using IgescConecta.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContextIgesc();
builder.Services.AddIdentity();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddServices();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(AppDomain.CurrentDomain.GetAssemblies()));
builder.Services.AddSingleton(_ => TimeProvider.System);
builder.Services.AddDataProtection();

var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtIssuer = jwtSection.GetValue<string>("JwtIssuer")
                   ?? throw new InvalidOperationException("Missing config: Jwt:JwtIssuer");
var jwtAudience = jwtSection.GetValue<string>("JwtAudience")
                   ?? throw new InvalidOperationException("Missing config: Jwt:JwtAudience");
var jwtKeyString = jwtSection.GetValue<string>("JwtSecurityKey")
                   ?? throw new InvalidOperationException("Missing config: Jwt:JwtSecurityKey");
var jwtKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKeyString));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = jwtKey,
            ClockSkew = TimeSpan.Zero
        };

    });

builder.Services.Configure<FrontendOptions>(builder.Configuration.GetSection("Frontend"));
builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection("Smtp"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", p =>
        p.WithOrigins(
            "http://localhost:3000",
            "http://localhost:5173"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
     // .AllowCredentials() // só se usarmos cookies/autenticação baseada em cookie
    );
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.SeedDatabase(app.Environment.IsDevelopment());

app.Run();
