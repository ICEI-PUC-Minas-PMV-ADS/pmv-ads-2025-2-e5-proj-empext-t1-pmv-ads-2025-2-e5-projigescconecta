// Catálogo de operadores

using IgescConecta.Domain.Enums;

namespace IgescConecta.API.Reporting.Operators;

public interface IOperatorCatalog
{
    IReadOnlyDictionary<FieldDataType, string[]> Get();
}

public sealed class OperatorCatalog : IOperatorCatalog
{
    private static readonly string[] Str = ["Equals", "NotEquals", "Contains", "StartsWith", "EndsWith", "IsNull", "IsNotNull", "IsEmpty", "IsNotEmpty"];
    private static readonly string[] Num = ["Equals", "NotEquals", "GreaterThan", "GreaterThanOrEquals", "LessThan", "LessThanOrEquals", "Between", "IsNull", "IsNotNull"];
    private static readonly string[] Dat = ["Equals", "Before", "After", "Between", "IsNull", "IsNotNull"];
    private static readonly string[] Enm = ["Equals", "In", "NotEquals"];
    private static readonly string[] Boo = ["Equals", "IsNull", "IsNotNull"];
    private static readonly string[] Gid = ["Equals", "IsNull", "IsNotNull"];

    private static readonly IReadOnlyDictionary<FieldDataType, string[]> Map =
        new Dictionary<FieldDataType, string[]>
        {
            [FieldDataType.String] = Str,
            [FieldDataType.Int] = Num,
            [FieldDataType.Long] = Num,
            [FieldDataType.Decimal] = Num,
            [FieldDataType.Date] = Dat,
            [FieldDataType.DateTime] = Dat,
            [FieldDataType.Enum] = Enm,
            [FieldDataType.Bool] = Boo,
            [FieldDataType.Guid] = Gid
        };

    public IReadOnlyDictionary<FieldDataType, string[]> Get() => Map;
}
