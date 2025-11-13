using System.Reflection;
using IgescConecta.API.Reporting.Labels;
using IgescConecta.API.Reporting.Operators;
using IgescConecta.API.Reporting.Schema;
using IgescConecta.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace IgescConecta.API.Common.Extensions;

public static class ServiceCollectionExtensionsReporting
{
    public static IServiceCollection AddReportingMetadata(this IServiceCollection services, Action<JsonLabelsOptions>? configure = null)
    {
        if (configure != null) services.Configure(configure);
        else services.Configure<JsonLabelsOptions>(o => o.FileRelativePath = "Reporting/labels.pt-BR.json");

        services.AddSingleton<IJsonLabelsProvider, JsonLabelsProvider>();
        services.AddSingleton<IOperatorCatalog, OperatorCatalog>();

        var domainAsm = typeof(Team).Assembly;
        var entityTypes = domainAsm.GetTypes()
            .Where(t => t.IsClass && t.Namespace != null && t.Namespace.Contains("IgescConecta.Domain.Entities"))
            .ToArray();

        services.AddSingleton<ISchemaProvider>(sp =>
            new SchemaProvider(sp.GetRequiredService<IJsonLabelsProvider>(),
                               sp.GetRequiredService<IOperatorCatalog>(),
                               entityTypes));

        return services;
    }
}

