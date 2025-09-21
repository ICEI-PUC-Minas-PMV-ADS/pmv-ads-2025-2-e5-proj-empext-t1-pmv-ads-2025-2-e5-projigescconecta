namespace IgescConecta.API.Common.Query
{
    public class PaginationResponse<T>
    {
        public int TotalItems { get; set; }

        public IEnumerable<T> Items { get; set; }
    }
}
