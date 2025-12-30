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

        AddFieldsForType(rootClr, rootEntityName, null, root.Fields, opsMap);

        var pathTypes = new HashSet<Type> { rootClr };
        var relations = BuildRelationsRecursive(rootClr, rootEntityName, null, opsMap, pathTypes);
        root.Relations.AddRange(relations);

        return root;
    }

    private void AddFieldsForType(
        Type clrType,
        string entityKey,
        string? pathPrefixFromRoot,
        IList<MetadataFieldDto> dest,
        IReadOnlyDictionary<FieldDataType, string[]> opsMap)
    {
        foreach (var kv in _labels.Data.Fields.Where(f => f.Key.StartsWith(entityKey + ".", StringComparison.Ordinal)))
        {
            var fullFieldPath = kv.Key;
            if (_labels.IsBlocked(fullFieldPath)) continue;

            var (propType, isArray) = ResolvePathType(clrType, fullFieldPath, true, entityKey);
            if (propType == null) continue;

            var dataType = isArray ? FieldDataType.Enum : FieldDataTypeMapper.Map(propType);
            var allowed = opsMap.TryGetValue(dataType, out var a) ? a : Array.Empty<string>();

            var relativeFromEntity = fullFieldPath[(entityKey.Length + 1)..];
            var pathFromRoot = string.IsNullOrEmpty(pathPrefixFromRoot)
                ? relativeFromEntity
                : $"{pathPrefixFromRoot}.{relativeFromEntity}";

            if (dest.Any(f => string.Equals(f.Path, pathFromRoot, StringComparison.Ordinal))) continue;

            dest.Add(new MetadataFieldDto
            {
                Path = pathFromRoot,
                Label = kv.Value,
                DataType = dataType,
                IsArray = isArray,
                AllowedOperators = allowed
            });
        }

        AddBaseFieldsForType(clrType, pathPrefixFromRoot, dest, opsMap);
    }

    private void AddBaseFieldsForType(
        Type clrType,
        string? pathPrefixFromRoot,
        IList<MetadataFieldDto> dest,
        IReadOnlyDictionary<FieldDataType, string[]> opsMap)
    {
        foreach (var bf in _labels.BaseFields)
        {
            var pi = clrType.GetProperty(bf.Key, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (pi == null) continue;

            var dataType = FieldDataTypeMapper.Map(pi.PropertyType);
            var allowed = opsMap.TryGetValue(dataType, out var a) ? a : Array.Empty<string>();

            var relativeName = bf.Key;
            var pathFromRoot = string.IsNullOrEmpty(pathPrefixFromRoot)
                ? relativeName
                : $"{pathPrefixFromRoot}.{relativeName}";

            if (dest.Any(f => string.Equals(f.Path, pathFromRoot, StringComparison.Ordinal))) continue;

            dest.Add(new MetadataFieldDto
            {
                Path = pathFromRoot,
                Label = bf.Value,
                DataType = dataType,
                IsArray = false,
                AllowedOperators = allowed
            });
        }
    }

    private List<MetadataRelationDto> BuildRelationsRecursive(
        Type currentClr,
        string currentEntityKey,
        string? currentPathFromRoot,
        IReadOnlyDictionary<FieldDataType, string[]> opsMap,
        HashSet<Type> pathTypes)
    {
        var list = new List<MetadataRelationDto>();

        var relsForCurrent = _labels.Data.Relations
            .Where(r => r.Key.StartsWith(currentEntityKey + ".", StringComparison.Ordinal))
            .ToList();

        var groups = relsForCurrent
            .GroupBy(r =>
            {
                var withoutEntity = r.Key[(currentEntityKey.Length + 1)..];
                return withoutEntity.Split('.')[0];
            });

        foreach (var g in groups)
        {
            var relName = g.Key;
            var pi = currentClr.GetProperty(relName, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (pi == null) continue;

            var isCollection = FieldDataTypeMapper.IsEnumerableButNotString(pi.PropertyType);
            var navType = isCollection ? FieldDataTypeMapper.TryGetItemType(pi.PropertyType) : pi.PropertyType;
            if (navType == null) continue;

            if (pathTypes.Contains(navType)) continue;

            var targetEntityKey = navType.Name;
            if (!_entityTypes.ContainsKey(targetEntityKey)) continue;

            var pathFromRoot = string.IsNullOrEmpty(currentPathFromRoot)
                ? relName
                : $"{currentPathFromRoot}.{relName}";

            var label = _labels.TryRelation($"{currentEntityKey}.{relName}") ?? relName;

            var dto = new MetadataRelationDto
            {
                Path = pathFromRoot,
                Entity = targetEntityKey,
                Label = label,
                IsCollection = isCollection
            };

            AddFieldsForType(navType, targetEntityKey, pathFromRoot, dto.Fields, opsMap);

            var childTypes = new HashSet<Type>(pathTypes) { navType };
            var children = BuildRelationsRecursive(navType, targetEntityKey, pathFromRoot, opsMap, childTypes);
            if (children.Count > 0)
                dto.Relations.AddRange(children);

            list.Add(dto);
        }

        return list;
    }

    private static (Type? propType, bool isArray) ResolvePathType(
        Type start,
        string fullPath,
        bool expectField,
        string? basePrefix = null)
    {
        var parts = fullPath.Split('.');
        var idx = 1;
        if (basePrefix != null)
            idx = basePrefix.Split('.').Length;

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
