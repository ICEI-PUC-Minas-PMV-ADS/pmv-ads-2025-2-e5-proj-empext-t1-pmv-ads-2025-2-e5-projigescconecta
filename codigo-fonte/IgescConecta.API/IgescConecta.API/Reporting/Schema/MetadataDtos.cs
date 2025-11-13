// DTOs de metadados

using IgescConecta.Domain.Enums;

namespace IgescConecta.API.Reporting.Schema;

public sealed class MetadataEntityDto
{
    public string Name { get; set; } = "";
    public string Label { get; set; } = "";
}

public sealed class MetadataFieldDto
{
    public string Path { get; set; } = "";
    public string Label { get; set; } = "";
    public FieldDataType DataType { get; set; }
    public bool IsArray { get; set; }
    public string[] AllowedOperators { get; set; } = Array.Empty<string>();
}

public sealed class MetadataRelationDto
{
    public string Path { get; set; } = "";
    public string Label { get; set; } = "";
    public bool IsCollection { get; set; }
    public List<MetadataFieldDto> Fields { get; set; } = new();
    public List<MetadataRelationDto> Relations { get; set; } = new();
}

public sealed class MetadataRootDto
{
    public string Root { get; set; } = "";
    public string Label { get; set; } = "";
    public List<MetadataFieldDto> Fields { get; set; } = new();
    public List<MetadataRelationDto> Relations { get; set; } = new();
}

