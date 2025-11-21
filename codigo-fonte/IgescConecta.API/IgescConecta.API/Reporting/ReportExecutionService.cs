using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Entities.Reporting;
using IgescConecta.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Reporting
{
    public class ReportExecutionService : IReportExecutionService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> _navigationMap;
        private readonly IReadOnlyDictionary<string, string> _entityDbSetMap;

        public ReportExecutionService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
            _navigationMap = LoadNavigationMap();
            _entityDbSetMap = LoadEntityDbSetMap();
        }

        public async Task<ReportExecutionResult> ExecuteAsync(
            int reportId,
            IReadOnlyDictionary<string, string?> filterAnswers,
            CancellationToken cancellationToken = default)
        {
            var report = await _dbContext.Reports
                .Include(r => r.Fields)
                .Include(r => r.Relations)
                .Include(r => r.FilterQuestions)
                .Include(r => r.Sorts)
                .FirstOrDefaultAsync(r => r.Id == reportId, cancellationToken);

            if (report == null)
                throw new InvalidOperationException($"Relatório {reportId} não encontrado.");

            if (report.Status != ReportStatus.Published)
                throw new InvalidOperationException("O relatório precisa estar publicado para execução.");

            var rootQuery = BuildRootQuery(report);
            var rootType = rootQuery.ElementType;

            rootQuery = ApplyFilters(rootQuery, report, rootType, filterAnswers);
            rootQuery = ApplySorting(rootQuery, report, rootType);

            var orderedFields = report.Fields
                .OrderBy(f => f.DisplayOrder)
                .ToList();

            var columns = orderedFields
                .Select(f => new ReportExecutionColumn
                {
                    FieldPath = BuildColumnKey(f),
                    Label = string.IsNullOrWhiteSpace(f.Label) ? BuildColumnKey(f) : f.Label,
                    DataType = f.DataType.ToString()
                })
                .ToList();

            var rows = await ProjectRowsAsync(rootQuery, rootType, report, orderedFields, cancellationToken);

            return new ReportExecutionResult
            {
                ReportName = report.Name,
                RootEntity = report.RootEntity,
                Columns = columns,
                Rows = rows
            };
        }

        private IQueryable BuildRootQuery(Report report)
        {
            if (!_entityDbSetMap.TryGetValue(report.RootEntity, out var dbSetName))
                throw new InvalidOperationException($"DbSet para '{report.RootEntity}' não encontrado em ApplicationDbContext.");

            var dbSetProp = _dbContext.GetType().GetProperty(dbSetName);
            if (dbSetProp == null)
                throw new InvalidOperationException($"Propriedade DbSet '{dbSetName}' não encontrada em ApplicationDbContext.");

            var dbSet = dbSetProp.GetValue(_dbContext);
            if (dbSet == null)
                throw new InvalidOperationException($"DbSet '{dbSetName}' retornou nulo.");

            var query = (IQueryable)dbSet;
            var rootType = dbSetProp.PropertyType.GenericTypeArguments[0];

            query = ApplyIncludes(query, rootType, report);

            return query;
        }

        private IQueryable ApplyIncludes(IQueryable query, Type rootType, Report report)
        {
            var navPaths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var field in report.Fields)
            {
                var path = ResolveNavigationPath(report.RootEntity, field.Entity);
                if (!string.IsNullOrWhiteSpace(path))
                    navPaths.Add(path);
            }

            foreach (var filter in report.FilterQuestions)
            {
                var path = ResolveNavigationPath(report.RootEntity, filter.Entity);
                if (!string.IsNullOrWhiteSpace(path))
                    navPaths.Add(path);
            }

            foreach (var sort in report.Sorts)
            {
                var path = ResolveNavigationPath(report.RootEntity, sort.Entity);
                if (!string.IsNullOrWhiteSpace(path))
                    navPaths.Add(path);
            }

            foreach (var path in navPaths)
            {
                query = EntityFrameworkQueryableExtensions.Include((dynamic)query, path);
            }

            return query;
        }

        private IQueryable ApplyFilters(
            IQueryable query,
            Report report,
            Type rootType,
            IReadOnlyDictionary<string, string?> filterAnswers)
        {
            if (report.FilterQuestions == null || report.FilterQuestions.Count == 0)
                return query;

            var parameter = System.Linq.Expressions.Expression.Parameter(rootType, "e");
            System.Linq.Expressions.Expression? accumulated = null;

            foreach (var question in report.FilterQuestions)
            {
                var key = string.IsNullOrWhiteSpace(question.Entity)
                    ? question.FieldPath
                    : $"{question.Entity}.{question.FieldPath}";

                if (!filterAnswers.TryGetValue(key, out var rawValue) || string.IsNullOrWhiteSpace(rawValue))
                    continue;

                var expr = BuildFilterExpression(parameter, rootType, report, question, rawValue);
                if (expr == null)
                    continue;

                accumulated = accumulated == null
                    ? expr
                    : System.Linq.Expressions.Expression.AndAlso(accumulated, expr);
            }

            if (accumulated == null)
                return query;

            var lambdaType = typeof(Func<,>).MakeGenericType(rootType, typeof(bool));
            var lambda = System.Linq.Expressions.Expression.Lambda(lambdaType, accumulated, parameter);

            var whereMethod = typeof(Queryable)
                .GetMethods(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static)
                .First(m => m.Name == nameof(Queryable.Where) && m.GetParameters().Length == 2)
                .MakeGenericMethod(rootType);

            var filteredQuery = (IQueryable)whereMethod.Invoke(null, new object[] { query, lambda })!;
            return filteredQuery;
        }

        private IQueryable ApplySorting(IQueryable query, Report report, Type rootType)
        {
            if (report.Sorts == null || report.Sorts.Count == 0)
                return query;

            IOrderedQueryable? ordered = null;
            var isFirst = true;

            foreach (var sort in report.Sorts.OrderBy(s => s.Priority))
            {
                var parameter = System.Linq.Expressions.Expression.Parameter(rootType, "e");

                var memberExpression = BuildMemberAccessExpressionForSort(parameter, report, sort, rootType);
                if (memberExpression == null)
                    continue;

                var propertyType = memberExpression.Type;
                var lambdaType = typeof(Func<,>).MakeGenericType(rootType, propertyType);
                var lambda = System.Linq.Expressions.Expression.Lambda(lambdaType, memberExpression, parameter);

                var methodName = isFirst
                    ? (sort.Direction == SortDirection.Asc ? nameof(Queryable.OrderBy) : nameof(Queryable.OrderByDescending))
                    : (sort.Direction == SortDirection.Asc ? nameof(Queryable.ThenBy) : nameof(Queryable.ThenByDescending));

                var method = typeof(Queryable)
                    .GetMethods(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static)
                    .First(m => m.Name == methodName && m.GetParameters().Length == 2)
                    .MakeGenericMethod(rootType, propertyType);

                if (isFirst)
                {
                    ordered = (IOrderedQueryable)method.Invoke(null, new object[] { query, lambda })!;
                    isFirst = false;
                }
                else
                {
                    ordered = (IOrderedQueryable)method.Invoke(null, new object[] { ordered!, lambda })!;
                }
            }

            return ordered ?? query;
        }

        private System.Linq.Expressions.MemberExpression? BuildMemberAccessExpressionForSort(
            System.Linq.Expressions.ParameterExpression parameter,
            Report report,
            ReportSort sort,
            Type rootType)
        {
            if (string.IsNullOrWhiteSpace(sort.Entity) || string.Equals(sort.Entity, report.RootEntity, StringComparison.OrdinalIgnoreCase))
            {
                var prop = rootType.GetProperty(sort.FieldPath);
                if (prop == null)
                    return null;
                return System.Linq.Expressions.Expression.Property(parameter, prop);
            }

            var navPath = ResolveNavigationPath(report.RootEntity, sort.Entity);
            if (string.IsNullOrWhiteSpace(navPath))
            {
                var directProp = rootType.GetProperty(sort.FieldPath);
                if (directProp == null)
                    return null;
                return System.Linq.Expressions.Expression.Property(parameter, directProp);
            }

            System.Linq.Expressions.Expression current = parameter;
            var currentType = rootType;

            var segments = navPath.Split('.', StringSplitOptions.RemoveEmptyEntries);
            foreach (var segment in segments)
            {
                var prop = currentType.GetProperty(segment);
                if (prop == null)
                    return null;

                current = System.Linq.Expressions.Expression.Property(current, prop);
                currentType = prop.PropertyType;

                if (typeof(IEnumerable).IsAssignableFrom(currentType) && currentType != typeof(string))
                {
                    return null;
                }
            }

            var fieldProp = currentType.GetProperty(sort.FieldPath);
            if (fieldProp == null)
                return null;

            return System.Linq.Expressions.Expression.Property(current, fieldProp);
        }

        private System.Linq.Expressions.Expression? BuildFilterExpression(
            System.Linq.Expressions.ParameterExpression parameter,
            Type rootType,
            Report report,
            ReportFilterQuestion question,
            string rawValue)
        {
            var targetEntity = question.Entity;
            var fieldName = question.FieldPath;

            System.Linq.Expressions.Expression current = parameter;
            var currentType = rootType;

            var navPath = ResolveNavigationPath(report.RootEntity, targetEntity);

            if (!string.IsNullOrWhiteSpace(navPath))
            {
                var segments = navPath.Split('.', StringSplitOptions.RemoveEmptyEntries);

                foreach (var segment in segments)
                {
                    var prop = currentType.GetProperty(segment);
                    if (prop == null)
                        return null;

                    current = System.Linq.Expressions.Expression.Property(current, prop);
                    currentType = prop.PropertyType;
                }
            }

            var isCollection = typeof(IEnumerable).IsAssignableFrom(currentType) && currentType != typeof(string);

            if (isCollection)
            {
                var elementType = currentType.IsGenericType
                    ? currentType.GetGenericArguments()[0]
                    : typeof(object);

                var itemParam = System.Linq.Expressions.Expression.Parameter(elementType, "x");
                var fieldProp = elementType.GetProperty(fieldName);
                if (fieldProp == null)
                    return null;

                var left = System.Linq.Expressions.Expression.Property(itemParam, fieldProp);
                var constant = BuildFilterConstantExpression(fieldProp.PropertyType, rawValue, question);
                if (constant == null)
                    return null;

                var comparison = BuildComparisonExpression(left, constant, question.DefaultOperator?.ToString());
                if (comparison == null)
                    return null;

                var anyLambdaType = typeof(Func<,>).MakeGenericType(elementType, typeof(bool));
                var anyLambda = System.Linq.Expressions.Expression.Lambda(anyLambdaType, comparison, itemParam);

                var anyMethod = typeof(Enumerable)
                    .GetMethods(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static)
                    .First(m => m.Name == nameof(Enumerable.Any) && m.GetParameters().Length == 2)
                    .MakeGenericMethod(elementType);

                return System.Linq.Expressions.Expression.Call(anyMethod, current, anyLambda);
            }
            else
            {
                var fieldProp = currentType.GetProperty(fieldName);
                if (fieldProp == null)
                    return null;

                var left = System.Linq.Expressions.Expression.Property(current, fieldProp);
                var constant = BuildFilterConstantExpression(fieldProp.PropertyType, rawValue, question);
                if (constant == null)
                    return null;

                return BuildComparisonExpression(left, constant, question.DefaultOperator?.ToString());
            }
        }

        private static System.Linq.Expressions.Expression? BuildComparisonExpression(
            System.Linq.Expressions.Expression left,
            System.Linq.Expressions.Expression right,
            string? opName)
        {
            var op = (opName ?? "Equal").Trim();

            if (string.Equals(op, "Equal", StringComparison.OrdinalIgnoreCase))
                return System.Linq.Expressions.Expression.Equal(left, right);

            if (string.Equals(op, "NotEqual", StringComparison.OrdinalIgnoreCase))
                return System.Linq.Expressions.Expression.NotEqual(left, right);

            if (string.Equals(op, "GreaterThan", StringComparison.OrdinalIgnoreCase))
                return System.Linq.Expressions.Expression.GreaterThan(left, right);

            if (string.Equals(op, "GreaterOrEqual", StringComparison.OrdinalIgnoreCase))
                return System.Linq.Expressions.Expression.GreaterThanOrEqual(left, right);

            if (string.Equals(op, "LessThan", StringComparison.OrdinalIgnoreCase))
                return System.Linq.Expressions.Expression.LessThan(left, right);

            if (string.Equals(op, "LessOrEqual", StringComparison.OrdinalIgnoreCase))
                return System.Linq.Expressions.Expression.LessThanOrEqual(left, right);

            return System.Linq.Expressions.Expression.Equal(left, right);
        }

        private static System.Linq.Expressions.Expression? BuildFilterConstantExpression(
            Type propertyType,
            string rawValue,
            ReportFilterQuestion question)
        {
            var targetType = Nullable.GetUnderlyingType(propertyType) ?? propertyType;
            object? parsed;

            if (targetType == typeof(DateTime))
            {
                if (!DateTime.TryParse(rawValue, out var dt))
                    return null;

                if (string.Equals(question.DefaultOperator?.ToString(), "LessOrEqual", StringComparison.OrdinalIgnoreCase))
                    dt = dt.Date.AddDays(1);
                else
                    dt = dt.Date;

                parsed = dt;
                return System.Linq.Expressions.Expression.Constant(parsed, propertyType);
            }

            if (targetType == typeof(DateTimeOffset))
            {
                if (!DateTimeOffset.TryParse(rawValue, out var dto))
                    return null;

                if (string.Equals(question.DefaultOperator?.ToString(), "LessOrEqual", StringComparison.OrdinalIgnoreCase))
                    dto = dto.AddDays(1);

                parsed = new DateTimeOffset(dto.Date, dto.Offset);
                return System.Linq.Expressions.Expression.Constant(parsed, propertyType);
            }

            if (targetType == typeof(int))
            {
                if (!int.TryParse(rawValue, out var i))
                    return null;
                parsed = i;
                return System.Linq.Expressions.Expression.Constant(parsed, propertyType);
            }

            if (targetType == typeof(decimal))
            {
                if (!decimal.TryParse(rawValue, out var d))
                    return null;
                parsed = d;
                return System.Linq.Expressions.Expression.Constant(parsed, propertyType);
            }

            if (targetType.IsEnum)
            {
                if (int.TryParse(rawValue, out var enumInt))
                {
                    parsed = Enum.ToObject(targetType, enumInt);
                    return System.Linq.Expressions.Expression.Constant(parsed, propertyType);
                }

                if (Enum.TryParse(targetType, rawValue, true, out var enumValue))
                {
                    parsed = enumValue;
                    return System.Linq.Expressions.Expression.Constant(parsed, propertyType);
                }

                return null;
            }

            parsed = rawValue;
            return System.Linq.Expressions.Expression.Constant(parsed, propertyType);
        }

        private async Task<List<Dictionary<string, object?>>> ProjectRowsAsync(
            IQueryable rootQuery,
            Type rootType,
            Report report,
            IReadOnlyList<ReportField> fields,
            CancellationToken cancellationToken)
        {
            var list = await ToObjectListAsync(rootQuery, cancellationToken);

            var rows = new List<Dictionary<string, object?>>(list.Count);

            foreach (var entity in list)
            {
                var row = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);

                foreach (var field in fields)
                {
                    var key = BuildColumnKey(field);
                    var value = GetFieldValue(entity, report.RootEntity, field);
                    row[key] = FormatValue(field, value);
                }

                rows.Add(row);
            }

            return rows;
        }

        private object? GetFieldValue(object rootEntityInstance, string rootEntityName, ReportField field)
        {
            if (rootEntityInstance == null)
                return null;

            var current = rootEntityInstance;
            var currentType = current.GetType();

            var navPath = ResolveNavigationPath(rootEntityName, field.Entity);

            if (!string.IsNullOrWhiteSpace(navPath))
            {
                var segments = navPath.Split('.', StringSplitOptions.RemoveEmptyEntries);

                foreach (var segment in segments)
                {
                    var prop = currentType.GetProperty(segment);
                    if (prop == null)
                        return null;

                    current = prop.GetValue(current);
                    if (current == null)
                        return null;

                    currentType = prop.PropertyType;
                }
            }

            if (current is IEnumerable enumerable && current is not string)
            {
                var list = new List<object?>();

                foreach (var item in enumerable)
                {
                    if (item == null)
                    {
                        list.Add(null);
                        continue;
                    }

                    var itemType = item.GetType();
                    var prop = itemType.GetProperty(field.FieldPath);
                    if (prop == null)
                    {
                        list.Add(null);
                        continue;
                    }

                    list.Add(prop.GetValue(item));
                }

                return list;
            }
            else
            {
                var fieldProp = currentType.GetProperty(field.FieldPath);
                if (fieldProp == null)
                    return null;

                return fieldProp.GetValue(current);
            }
        }

        private object? FormatValue(ReportField field, object? value)
        {
            if (value == null)
                return null;

            if (field.FieldPath is "CreatedAt" or "UpdatedAt")
            {
                if (value is DateTime dt1)
                    return dt1.ToString("dd/MM/yyyy");
                if (value is DateTimeOffset dto1)
                    return dto1.ToString("dd/MM/yyyy");
            }

            if (field.FieldPath is "CreatedBy" or "UpdatedBy")
            {
                int? id = null;

                if (value is int i)
                    id = i;

                if (id.HasValue)
                {
                    var name = _dbContext.Users
                        .AsNoTracking()
                        .Where(u => u.Id == id.Value)
                        .Select(u => u.Name)
                        .FirstOrDefault();

                    return name ?? id.Value.ToString();
                }

                return null;
            }

            if (value is string s)
                return s;

            if (value is IEnumerable enumerable && value is not string)
            {
                var list = new List<object?>();

                foreach (var item in enumerable)
                {
                    list.Add(FormatSimpleValue(item));
                }

                return list;
            }

            return FormatSimpleValue(value);
        }

        private static object? FormatSimpleValue(object? value)
        {
            if (value == null)
                return null;

            if (value is DateTime dt)
                return dt.ToString("dd/MM/yyyy");

            if (value is DateTimeOffset dto)
                return dto.ToString("dd/MM/yyyy");

            var type = value.GetType();

            if (type.IsEnum)
                return GetEnumDisplayName((Enum)value);

            return value;
        }

        private static string GetEnumDisplayName(Enum value)
        {
            var type = value.GetType();
            var member = type.GetMember(value.ToString()).FirstOrDefault();
            if (member != null)
            {
                var displayAttr = member.GetCustomAttribute<System.ComponentModel.DataAnnotations.DisplayAttribute>();
                if (displayAttr != null && !string.IsNullOrWhiteSpace(displayAttr.Name))
                    return displayAttr.Name;
            }
            return value.ToString();
        }

        private static IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> LoadNavigationMap()
        {
            var baseDir = AppContext.BaseDirectory;
            var filePath = Path.Combine(baseDir, "Reporting", "NavigationMap.json");

            if (!File.Exists(filePath))
                return new Dictionary<string, IReadOnlyDictionary<string, string>>(StringComparer.OrdinalIgnoreCase);

            var json = File.ReadAllText(filePath);

            var data = JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, string>>>(json);

            if (data == null)
                return new Dictionary<string, IReadOnlyDictionary<string, string>>(StringComparer.OrdinalIgnoreCase);

            return data.ToDictionary(
                kvp => kvp.Key,
                kvp => (IReadOnlyDictionary<string, string>)new Dictionary<string, string>(kvp.Value, StringComparer.OrdinalIgnoreCase),
                StringComparer.OrdinalIgnoreCase);
        }

        private static IReadOnlyDictionary<string, string> LoadEntityDbSetMap()
        {
            var baseDir = AppContext.BaseDirectory;
            var filePath = Path.Combine(baseDir, "Reporting", "EntityDbSetMap.json");

            if (!File.Exists(filePath))
                return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            var json = File.ReadAllText(filePath);
            var data = JsonSerializer.Deserialize<Dictionary<string, string>>(json);

            if (data == null)
                return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            return new Dictionary<string, string>(data, StringComparer.OrdinalIgnoreCase);
        }

        private static async Task<List<object>> ToObjectListAsync(IQueryable query, CancellationToken cancellationToken)
        {
            var elementType = query.ElementType;

            var toListAsyncMethod = typeof(EntityFrameworkQueryableExtensions)
                .GetMethods(BindingFlags.Public | BindingFlags.Static)
                .First(m => m.Name == nameof(EntityFrameworkQueryableExtensions.ToListAsync)
                            && m.GetParameters().Length == 2);

            var genericMethod = toListAsyncMethod.MakeGenericMethod(elementType);

            var task = (Task)genericMethod.Invoke(null, new object[] { query, cancellationToken })!;
            await task.ConfigureAwait(false);

            var resultProperty = task.GetType().GetProperty("Result");
            var list = (IEnumerable)resultProperty!.GetValue(task)!;

            var result = new List<object>();

            foreach (var item in list)
                result.Add(item);

            return result;
        }

        private string? ResolveNavigationPath(string rootEntity, string? targetEntity)
        {
            if (string.IsNullOrWhiteSpace(targetEntity))
                return null;

            if (string.Equals(rootEntity, targetEntity, StringComparison.OrdinalIgnoreCase))
                return null;

            if (_navigationMap.TryGetValue(rootEntity, out var targets) &&
                targets.TryGetValue(targetEntity, out var navPath))
                return navPath;

            return targetEntity;
        }

        private static string BuildColumnKey(ReportField field)
        {
            if (string.IsNullOrWhiteSpace(field.Entity))
                return field.FieldPath;

            return $"{field.Entity}.{field.FieldPath}";
        }
    }

    public class ReportExecutionResult
    {
        public string ReportName { get; set; } = string.Empty;
        public string RootEntity { get; set; } = string.Empty;
        public IReadOnlyList<ReportExecutionColumn> Columns { get; set; } = Array.Empty<ReportExecutionColumn>();
        public IReadOnlyList<Dictionary<string, object?>> Rows { get; set; } = Array.Empty<Dictionary<string, object?>>();
    }

    public class ReportExecutionColumn
    {
        public string FieldPath { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string DataType { get; set; } = string.Empty;
    }
}

