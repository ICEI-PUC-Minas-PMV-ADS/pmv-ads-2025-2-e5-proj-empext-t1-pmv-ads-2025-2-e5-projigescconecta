using IgescConecta.API.Common.Extensions;

namespace IgescConecta.API.Common.Query
{
    public class PaginationRequest
    {
        public PaginationRequest(int pageNumber, int pageSize, List<Filter> filters)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            Filters = filters;
        }

        public int PageNumber { get; set; } = 0;

        public int PageSize { get; set; } = 10;

        public List<Filter> Filters { get; set; }
    }
}
