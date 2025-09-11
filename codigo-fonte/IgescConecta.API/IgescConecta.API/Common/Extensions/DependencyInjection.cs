using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using Microsoft.EntityFrameworkCore.Query;
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
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "IgescConecta.API", Version = "v1" });

                c.TagActionsBy(api =>
                {
                    if (api.GroupName != null)
                    {
                        return new[] { api.GroupName };
                    }
                    if (api.ActionDescriptor is ControllerActionDescriptor controllerActionDescriptor)
                    {
                        return new[] { controllerActionDescriptor.ControllerName };
                    }
                    return new[] { "" };
                });

                c.DocInclusionPredicate((name, api) => true);
                c.SupportNonNullableReferenceTypes();
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

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            // serviços personalizados aqui
            return services;
        }
    }
}