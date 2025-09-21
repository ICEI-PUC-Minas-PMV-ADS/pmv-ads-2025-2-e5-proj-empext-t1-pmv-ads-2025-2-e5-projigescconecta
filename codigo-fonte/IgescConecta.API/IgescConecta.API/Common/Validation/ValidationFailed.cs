namespace IgescConecta.API.Common.Validation
{
    public class ValidationFailed
    {
        public string[] Errors { get; set; }

        public ValidationFailed() { }

        public ValidationFailed(string error) => Errors = [error];
        public ValidationFailed(string[] errors) => Errors = errors;
    }
}
