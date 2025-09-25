using IgescConecta.API.Common.Options;
using IgescConecta.API.Data;
using IgescConecta.API.Services;
using IgescConecta.Domain.Entities;
using Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;

namespace IgescConecta.API.Common.Extensions
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDbContextIgesc(this IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("IgescConecta"));
            services.AddDatabaseDeveloperPageExceptionFilter();
            return services;
        }


        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                //c.SwaggerDoc("v1", new OpenApiInfo { Title = "IgescConecta.API", Version = "v1" });

                c.TagActionsBy(api =>
                {
                    if (api.GroupName != null) return new[] { api.GroupName };
                    if (api.ActionDescriptor is ControllerActionDescriptor d) return new[] { d.ControllerName };
                    return new[] { "" };
                });

                c.DocInclusionPredicate((name, api) => true);
                c.SupportNonNullableReferenceTypes();

                // ---- Segurança: Bearer JWT ----
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

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthAuthenticatonService, AuthAuthenticatonService>();

            // Seleciona o provedor por configuração: Email:Provider = Dev | Smtp
            services.AddScoped<IEmailService>(sp =>
            {
                var cfg = sp.GetRequiredService<IConfiguration>();
                var provider = cfg["Email:Provider"] ?? "Dev";

                if (provider.Equals("Smtp", StringComparison.OrdinalIgnoreCase))
                    return new SmtpEmailService(
                        sp.GetRequiredService<IOptions<SmtpOptions>>(),
                        sp.GetRequiredService<ILogger<SmtpEmailService>>(),
                        cfg
                    );

                // Dev (console/log via ConsoleEmailService)
                return new ConsoleEmailService(sp.GetRequiredService<ILogger<ConsoleEmailService>>());
            });

            return services;
        }



        public static IServiceCollection AddIdentity(this IServiceCollection services)
        {
            services.AddIdentityCore<User>(op =>
            {
                op.SignIn.RequireConfirmedAccount = false;
                op.User.RequireUniqueEmail = true;
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