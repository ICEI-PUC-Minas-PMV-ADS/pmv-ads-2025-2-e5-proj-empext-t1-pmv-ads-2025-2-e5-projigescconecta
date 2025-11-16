// Mapeador de tipos

using IgescConecta.Domain.Enums;

namespace IgescConecta.API.Reporting.Schema;

public static class FieldDataTypeMapper
{
    public static FieldDataType Map(Type t)
    {
        t = Nullable.GetUnderlyingType(t) ?? t;

        if (t == typeof(string)) return FieldDataType.String;
        if (t == typeof(bool)) return FieldDataType.Bool;
        if (t == typeof(int)) return FieldDataType.Int;
        if (t == typeof(long)) return FieldDataType.Long;
        if (t == typeof(decimal) || t == typeof(double) || t == typeof(float)) return FieldDataType.Decimal;
        if (t == typeof(DateOnly)) return FieldDataType.Date;
        if (t == typeof(DateTime)) return FieldDataType.DateTime;
        if (t.IsEnum) return FieldDataType.Enum;
        if (t == typeof(Guid)) return FieldDataType.Guid;

        return FieldDataType.String;
    }

    public static bool IsEnumerableButNotString(Type t)
    {
        if (t == typeof(string)) return false;
        return typeof(System.Collections.IEnumerable).IsAssignableFrom(t);
    }

    public static Type? TryGetItemType(Type enumerable)
    {
        if (enumerable.IsArray) return enumerable.GetElementType();
        var ienum = enumerable.GetInterfaces().Concat(new[] { enumerable })
            .FirstOrDefault(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IEnumerable<>));
        return ienum?.GetGenericArguments()[0];
    }
}
