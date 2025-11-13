// Gerador do esquema (lendo o JSON + refletindo tipos reais)

using System.Reflection;
using IgescConecta.API.Reporting.Labels;
using IgescConecta.API.Reporting.Operators;
using IgescConecta.Domain.Enums;
using IgescConecta.Domain.Shared;

namespace IgescConecta.API.Reporting.Schema;

public interface ISchemaProvider
{
    IEnumerable<MetadataEntityDto> GetRootEntities();
    MetadataRootDto GetFieldsTree(string rootEntityName);
}

public sealed class SchemaProvider : ISchemaProvider
{
    private readonly IJsonLabelsProvider _labels;
    private readonly IOperatorCatalog _ops;
    private readonly Dictionary<string, Type> _entityTypes;

    public SchemaProvider(IJsonLabelsProvider labels, IOperatorCatalog ops, IEnumerable<Type> entityClrTypes)
    {
        _labels = labels;
        _ops = ops;
        _entityTypes = entityClrTypes.ToDictionary(t => t.Name, t => t, StringComparer.Ordinal);
    }

    public IEnumerable<MetadataEntityDto> GetRootEntities()
    {
        foreach (var kv in _labels.Data.Entities)
        {
            if (_entityTypes.ContainsKey(kv.Key))
                yield return new MetadataEntityDto { Name = kv.Key, Label = kv.Value };
        }
    }

    public MetadataRootDto GetFieldsTree(string rootEntityName)
    {
        if (!_entityTypes.TryGetValue(rootEntityName, out var rootClr))
            throw new InvalidOperationException($"Entidade não encontrada: {rootEntityName}");

        var root = new MetadataRootDto
        {
            Root = rootEntityName,
            Label = _labels.TryEntity(rootEntityName) ?? rootEntityName
        };

        var opsMap = _ops.Get();

        foreach (var kv in _labels.Data.Fields.Where(f => f.Key.StartsWith(rootEntityName + ".", StringComparison.Ordinal)))
        {
            var path = kv.Key;
            if (_labels.IsBlocked(path)) continue;
            var (propType, isArray) = ResolvePathType(rootClr, path, true);
            if (propType == null) continue;

            var dt = isArray ? FieldDataType.Enum : FieldDataTypeMapper.Map(propType);
            var allowed = opsMap.TryGetValue(dt, out var a) ? a : Array.Empty<string>();

            root.Fields.Add(new MetadataFieldDto
            {
                Path = path[(rootEntityName + ".").Length..],
                Label = kv.Value,
                DataType = dt,
                IsArray = isArray,
                AllowedOperators = allowed
            });
        }

        InjectBaseFields(root, rootClr, opsMap);

        var relRoots = _labels.Data.Relations
            .Where(r => r.Key.StartsWith(rootEntityName + ".", StringComparison.Ordinal))
            .OrderBy(r => r.Key)
            .ToList();

        var relTree = BuildRelations(rootClr, rootEntityName, relRoots, opsMap);
        root.Relations.AddRange(relTree);

        return root;
    }

    private void InjectBaseFields(MetadataRootDto root, Type rootClr, IReadOnlyDictionary<FieldDataType, string[]> opsMap)
    {
        foreach (var bf in _labels.BaseFields)
        {
            var pi = rootClr.GetProperty(bf.Key, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (pi == null) continue;

            var dt = FieldDataTypeMapper.Map(pi.PropertyType);
            var allowed = opsMap.TryGetValue(dt, out var a) ? a : Array.Empty<string>();

            if (root.Fields.Any(f => string.Equals(f.Path, bf.Key, StringComparison.Ordinal))) continue;

            root.Fields.Add(new MetadataFieldDto
            {
                Path = bf.Key,
                Label = bf.Value,
                DataType = dt,
                IsArray = false,
                AllowedOperators = allowed
            });
        }
    }

    private List<MetadataRelationDto> BuildRelations(Type currentClr, string prefixEntity, List<KeyValuePair<string, string>> rels, IReadOnlyDictionary<FieldDataType, string[]> opsMap)
    {
        var list = new List<MetadataRelationDto>();
        var groups = rels.GroupBy(r => r.Key.Split('.', 2)[1].Split('.')[0]);

        foreach (var g in groups)
        {
            var relName = g.Key;
            var fullPath = $"{prefixEntity}.{relName}";
            if (_labels.IsBlocked(fullPath)) continue;

            var pi = currentClr.GetProperty(relName, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (pi == null) continue;

            var isCollection = FieldDataTypeMapper.IsEnumerableButNotString(pi.PropertyType);
            var targetType = isCollection ? FieldDataTypeMapper.TryGetItemType(pi.PropertyType) : pi.PropertyType;
            if (targetType == null) continue;

            var dto = new MetadataRelationDto
            {
                Path = fullPath.Split('.', 2)[1],
                Label = _labels.TryRelation(fullPath) ?? relName,
                IsCollection = isCollection
            };

            foreach (var f in _labels.Data.Fields.Where(f => f.Key.StartsWith(fullPath + ".", StringComparison.Ordinal)))
            {
                if (_labels.IsBlocked(f.Key)) continue;

                var (ft, isArr) = ResolvePathType(targetType, f.Key, true, fullPath);
                if (ft == null) continue;

                var dt = isArr ? FieldDataType.Enum : FieldDataTypeMapper.Map(ft);
                var allowed = opsMap.TryGetValue(dt, out var a) ? a : Array.Empty<string>();

                dto.Fields.Add(new MetadataFieldDto
                {
                    Path = f.Key.Split('.', 2)[1],
                    Label = f.Value,
                    DataType = dt,
                    IsArray = isArr,
                    AllowedOperators = allowed
                });
            }

            var children = g.Where(x => x.Key != fullPath && x.Key.StartsWith(fullPath + ".", StringComparison.Ordinal)).ToList();
            if (children.Count > 0)
                dto.Relations.AddRange(BuildRelations(targetType, fullPath, children, opsMap));

            list.Add(dto);
        }

        return list;
    }

    private static (Type? propType, bool isArray) ResolvePathType(Type start, string fullPath, bool expectField, string? basePrefix = null)
    {
        var parts = fullPath.Split('.');
        var idx = 1;
        if (basePrefix != null) idx = basePrefix.Split('.').Length;

        var current = start;
        var isArray = false;

        for (; idx < parts.Length; idx++)
        {
            var name = parts[idx];
            var pi = current.GetProperty(name, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (pi == null) return (null, false);

            var t = pi.PropertyType;
            if (FieldDataTypeMapper.IsEnumerableButNotString(t))
            {
                isArray = true;
                var item = FieldDataTypeMapper.TryGetItemType(t);
                if (item == null) return (null, false);
                current = item;
            }
            else
            {
                current = Nullable.GetUnderlyingType(t) ?? t;
            }
        }

        return (current, isArray && expectField);
    }
}

