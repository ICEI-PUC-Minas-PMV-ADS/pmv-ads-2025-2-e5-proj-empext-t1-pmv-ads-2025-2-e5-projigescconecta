// Provider do JSON

using System.Text.Json;
using Microsoft.Extensions.Options;

namespace IgescConecta.API.Reporting.Labels;

public interface IJsonLabelsProvider
{
    LabelsDictionary Data { get; }
    bool IsBlocked(string fullPath);
    string? TryEntity(string entity);
    string? TryRelation(string path);
    string? TryField(string path);
    EnumLabel? TryEnum(string enumName);
    IReadOnlyDictionary<string, string> BaseFields { get; }
}

public sealed class JsonLabelsOptions
{
    public string FileRelativePath { get; set; } = "Reporting/labels.pt-BR.json";
}

public sealed class JsonLabelsProvider : IJsonLabelsProvider
{
    public LabelsDictionary Data { get; }
    public IReadOnlyDictionary<string, string> BaseFields => Data.BaseFields;

    public JsonLabelsProvider(IWebHostEnvironment env, IOptions<JsonLabelsOptions> opt)
    {
        var path = Path.Combine(env.ContentRootPath, opt.Value.FileRelativePath);
        if (!File.Exists(path)) throw new FileNotFoundException($"Labels JSON não encontrado: {path}");

        var json = File.ReadAllText(path);
        var data = JsonSerializer.Deserialize<LabelsDictionary>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            ReadCommentHandling = JsonCommentHandling.Skip,
            AllowTrailingCommas = true
        });

        Data = data ?? throw new InvalidOperationException("Falha ao desserializar labels JSON.");
    }

    public bool IsBlocked(string fullPath) => Data.BlockedPaths.Any(b => string.Equals(b, fullPath, StringComparison.Ordinal));
    public string? TryEntity(string entity) => Data.Entities.TryGetValue(entity, out var v) ? v : null;
    public string? TryRelation(string path) => Data.Relations.TryGetValue(path, out var v) ? v : null;
    public string? TryField(string path) => Data.Fields.TryGetValue(path, out var v) ? v : null;
    public EnumLabel? TryEnum(string enumName) => Data.Enums.TryGetValue(enumName, out var v) ? v : null;
}

