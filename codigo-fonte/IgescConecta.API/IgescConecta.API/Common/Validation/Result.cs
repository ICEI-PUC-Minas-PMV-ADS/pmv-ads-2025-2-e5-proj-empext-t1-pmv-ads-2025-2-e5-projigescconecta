namespace IgescConecta.API.Common.Validation
{
    public readonly struct Result<TValue, TError>
    {
        public TValue Value { get; }

        public TError Error { get; }

        public bool IsSuccess { get; }

        public bool IsFailure => !IsSuccess;

        public Result(TValue value)
        {
            Value = value;
            Error = default!;
            IsSuccess = true;
        }

        public Result(TError error)
        {
            Value = default!;
            Error = error;
            IsSuccess = false;
        }

        public static implicit operator Result<TValue, TError>(TValue value) => new Result<TValue, TError>(value);
        public static implicit operator Result<TValue, TError>(TError error) => new Result<TValue, TError>(error);
    }
}
