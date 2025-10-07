using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Reflection;

namespace IgescConecta.API.Common.Extensions
{
    public enum Op
    {
        None,
        Equals,
        NotEquals,
        LessThan,
        LessThanOrEquals,
        GreaterThan,
        GreaterThanOrEquals,
        Contains,
        StartsWith,
        EndsWith,
        DoesNotContain,
        IsNull,
        IsEmpty,
        IsNotNull,
        IsNotEmpty,
        Clear
    }

    public class Filter
    {
        public string PropertyName { get; set; }
        public Op Operation { get; set; }
        public object Value { get; set; }
    }

    public static class ExpressionBuilder
    {

        private static MethodInfo containsMethod = typeof(string).GetMethod("Contains", new Type[] { typeof(string) });
        private static MethodInfo startsWithMethod = typeof(string).GetMethod("StartsWith", new Type[] { typeof(string) });
        private static MethodInfo endsWithMethod = typeof(string).GetMethod("EndsWith", new Type[] { typeof(string) });

        public static Expression<Func<T, bool>> GetExpression<T>(IList<Filter> filters)
        {
            Expression exp = null;

            ParameterExpression param = Expression.Parameter(typeof(T), "t");
            if (filters.Count == 0)
            {
                exp = Expression.Equal(Expression.Constant(1), Expression.Constant(1));
                return Expression.Lambda<Func<T, bool>>(exp, param);
            }


            if (filters.Count == 1)
                exp = GetExpression<T>(param, filters[0]);
            else if (filters.Count == 2)
                exp = GetExpression<T>(param, filters[0], filters[1]);
            else
            {
                while (filters.Count > 0)
                {
                    var f1 = filters[0];
                    var f2 = filters[1];

                    if (exp == null)
                        exp = GetExpression<T>(param, filters[0], filters[1]);
                    else
                        exp = Expression.AndAlso(exp, GetExpression<T>(param, filters[0], filters[1]));

                    filters.Remove(f1);
                    filters.Remove(f2);

                    if (filters.Count == 1)
                    {
                        exp = Expression.AndAlso(exp, GetExpression<T>(param, filters[0]));
                        filters.RemoveAt(0);
                    }
                }
            }


            return Expression.Lambda<Func<T, bool>>(exp, param);
        }

        private static MemberExpression GetNestedPropertyExpression(Expression param, string propertyName)
        {
            string[] parts = propertyName.Split('.');
            Expression body = param;
            foreach (var part in parts)
            {
                body = Expression.PropertyOrField(body, part);
            }
            return (MemberExpression)body;
        }

        private static Expression GetExpression<T>(ParameterExpression param, Filter filter)
        {
            MemberExpression member = GetNestedPropertyExpression(param, filter.PropertyName);
            var value = filter.Value;

            // Caso a propriedade seja enum, converte o valor para enum
            if (member.Type.IsEnum)
            {
                value = value.ToString().GetValueFromName(member.Type);
            }

            object convertedValue;
            var targetType = member.Type.GetUnderlyingType();

            // Tratamento especial para JsonElement (quando o valor vem do JSON)
            if (value is System.Text.Json.JsonElement je)
            {
                switch (je.ValueKind)
                {
                    case System.Text.Json.JsonValueKind.String:
                        if (targetType == typeof(DateTime))
                            convertedValue = DateTime.Parse(je.GetString());
                        else
                            convertedValue = je.GetString();
                        break;
                    case System.Text.Json.JsonValueKind.Number:
                        if (targetType == typeof(int))
                            convertedValue = je.GetInt32();
                        else if (targetType == typeof(long))
                            convertedValue = je.GetInt64();
                        else if (targetType == typeof(double))
                            convertedValue = je.GetDouble();
                        else
                            convertedValue = je.GetDecimal();
                        break;
                    case System.Text.Json.JsonValueKind.True:
                        convertedValue = true;
                        break;
                    case System.Text.Json.JsonValueKind.False:
                        convertedValue = false;
                        break;
                    case System.Text.Json.JsonValueKind.Null:
                        convertedValue = null;
                        break;
                    default:
                        convertedValue = je.GetRawText();
                        break;
                }
            }
            else if (targetType == typeof(string))
            {
                convertedValue = value?.ToString();
            }
            else if (targetType == typeof(DateTime) && value is string str)
            {
                convertedValue = DateTime.Parse(str);
            }
            else
            {
                convertedValue = Convert.ChangeType(value, targetType);
            }

            ConstantExpression constant = Expression.Constant(convertedValue, targetType);
            var convertedMember = Expression.Convert(member, targetType);

            return filter.Operation switch
            {
                Op.Equals => Expression.Equal(convertedMember, constant),
                Op.NotEquals => Expression.NotEqual(convertedMember, constant),
                Op.GreaterThan => Expression.GreaterThan(convertedMember, constant),
                Op.GreaterThanOrEquals => Expression.GreaterThanOrEqual(convertedMember, constant),
                Op.LessThan => Expression.LessThan(convertedMember, constant),
                Op.LessThanOrEquals => Expression.LessThanOrEqual(convertedMember, constant),
                Op.Contains => Expression.Call(convertedMember, containsMethod, constant),
                Op.StartsWith => Expression.Call(convertedMember, startsWithMethod, constant),
                Op.EndsWith => Expression.Call(convertedMember, endsWithMethod, constant),
                Op.IsNull => Expression.Equal(convertedMember, Expression.Constant(null, targetType)),
                _ => null,
            };
        }

        private static BinaryExpression GetExpression<T>(ParameterExpression param, Filter filter1, Filter filter2)
        {
            Expression bin1 = GetExpression<T>(param, filter1);
            Expression bin2 = GetExpression<T>(param, filter2);

            return Expression.AndAlso(bin1, bin2);
        }

        public static Type GetUnderlyingType(this Type type)
        {
            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
                return Nullable.GetUnderlyingType(type);
            return type;
        }

        public static bool IsNullableType(this Type type)
        {
            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
                return true;
            return false;
        }

        public static object GetValueFromName(this string name, Type type)
        {

            foreach (var field in type.GetFields())
            {
                if (Attribute.GetCustomAttribute(field, typeof(DisplayAttribute)) is DisplayAttribute attribute)
                {
                    if (attribute.Name == name)
                    {
                        return field.GetValue(null);
                    }
                }

                if (field.Name == name)
                {
                    return field.GetValue(null);
                }
            }

            throw new ArgumentOutOfRangeException(nameof(name));
        }
    }
}
