using IgescConecta.API.Common.Options;
using IgescConecta.API.Data;
using IgescConecta.API.Services;
using IgescConecta.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

namespace IgescConecta.API.Common.Extensions
{
    public static class DependencyInjection
    {
        // === DbContext: Azure SQL (DefaultConnection) ===
        public static IServiceCollection AddDbContextIgesc(this IServiceCollection services, IConfiguration cfg)
        {
            services.AddHttpContextAccessor();

            services.AddDbContext<ApplicationDbContext>(options =>
            {
                var cs = cfg.GetConnectionString("DefaultConnection")
                         ?? throw new InvalidOperationException(
                             "Connection string 'DefaultConnection' não encontrada. " +
                             "Defina em appsettings/ambiente ou nas Connection Strings do App Service.");

                options.UseSqlServer(cs, sql =>
                {
                    // resiliente para nuvem
                    sql.EnableRetryOnFailure(maxRetryCount: 5,
                                             maxRetryDelay: TimeSpan.FromSeconds(10),
                                             errorNumbersToAdd: null);
                    sql.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                });
            });

            services.AddDatabaseDeveloperPageExceptionFilter();
            return services;
        }

        // === Swagger + Bearer JWT ===
        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                // Agrupamento por controller/GroupName
                c.TagActionsBy(api =>
                {
                    if (api.GroupName != null) return new[] { api.GroupName };
                    if (api.ActionDescriptor is ControllerActionDescriptor d) return new[] { d.ControllerName };
                    return new[] { "" };
                });

                c.DocInclusionPredicate((name, api) => true);
                c.SupportNonNullableReferenceTypes();

                // Segurança: Bearer
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Informe: Bearer {seu_token}"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            return services;
        }

        // === Serviços de domínio (Auth/Email) + opções ===
        public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration cfg)
        {
            services.AddScoped<IAuthAuthenticatonService, AuthAuthenticatonService>();

            // Vincula SmtpOptions à seção "Smtp" (host, port, ssl)
            services.Configure<SmtpOptions>(cfg.GetSection("Smtp"));

            // Seleciona o provedor por configuração: Email:Provider = Dev | Smtp
            services.AddScoped<IEmailService>(sp =>
            {
                var provider = cfg["Email:Provider"] ?? "Dev";

                if (provider.Equals("Smtp", StringComparison.OrdinalIgnoreCase))
                {
                    return new SmtpEmailService(
                        sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<SmtpOptions>>(),
                        sp.GetRequiredService<ILogger<SmtpEmailService>>(),
                        cfg
                    );
                }

                // Dev (log/console)
                return new ConsoleEmailService(sp.GetRequiredService<ILogger<ConsoleEmailService>>());
            });

            return services;
        }

        // === Identity Core + Roles + Tokens ===
        public static IServiceCollection AddIdentity(this IServiceCollection services)
        {
            services.AddIdentityCore<User>(op =>
            {
                op.SignIn.RequireConfirmedAccount = false;
                op.User.RequireUniqueEmail = true;

                // (opcional) regras de senha customizadas:
                // op.Password.RequiredLength = 6;
                // op.Password.RequireNonAlphanumeric = false;
                // op.Password.RequireUppercase = true;
                // op.Password.RequireLowercase = true;
                // op.Password.RequireDigit = true;
            })
            .AddRoles<Role>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddSignInManager()
            .AddDefaultTokenProviders()
            .AddApiEndpoints();

            return services;
        }
    }
}
