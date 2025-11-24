// Models do JSON

using System.Text.Json.Serialization;

namespace IgescConecta.API.Reporting.Labels;

public sealed class EnumLabel
{
    [JsonPropertyName("label")] public string Label { get; set; } = "";
    [JsonPropertyName("values")] public Dictionary<string, string> Values { get; set; } = new();
}

public sealed class LabelsDictionary
{
    [JsonPropertyName("version")] public int Version { get; set; } = 1;
    [JsonPropertyName("culture")] public string Culture { get; set; } = "pt-BR";
    [JsonPropertyName("entities")] public Dictionary<string, string> Entities { get; set; } = new();
    [JsonPropertyName("relations")] public Dictionary<string, string> Relations { get; set; } = new();
    [JsonPropertyName("fields")] public Dictionary<string, string> Fields { get; set; } = new();
    [JsonPropertyName("baseFields")] public Dictionary<string, string> BaseFields { get; set; } = new();
    [JsonPropertyName("enums")] public Dictionary<string, EnumLabel> Enums { get; set; } = new();
    [JsonPropertyName("blockedPaths")] public List<string> BlockedPaths { get; set; } = new();
}
