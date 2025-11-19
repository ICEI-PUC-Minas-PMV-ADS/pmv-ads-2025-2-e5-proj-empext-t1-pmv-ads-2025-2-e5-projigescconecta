using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Reporting.Labels;
using IgescConecta.API.Reporting.Operators;
using IgescConecta.API.Reporting.Schema;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Reports.Metadata;

[ApiController]
[ApiAuthorize]
[Route("/api/report/metadata")]
[ApiExplorerSettings(GroupName = "Reports")]
[Authorize(Roles = "Admin,Editor")]
public sealed class ReportMetadataController : ControllerBase
{
    private readonly ISchemaProvider _schema;
    private readonly IJsonLabelsProvider _labels;
    private readonly IOperatorCatalog _ops;

    public ReportMetadataController(ISchemaProvider schema, IJsonLabelsProvider labels, IOperatorCatalog ops)
    {
        _schema = schema;
        _labels = labels;
        _ops = ops;
    }

    [HttpGet("entities")]
    public ActionResult<IEnumerable<MetadataEntityDto>> GetEntities()
    {
        try { return Ok(_schema.GetRootEntities()); }
        catch (Exception ex) { return BadRequest(new { error = ex.Message }); }
    }

    [HttpGet("entities/{root}/fields")]
    public ActionResult<MetadataRootDto> GetFields(string root)
    {
        try { return Ok(_schema.GetFieldsTree(root)); }
        catch (Exception ex) { return BadRequest(new { error = ex.Message }); }
    }

    [HttpGet("operators")]
    public ActionResult<object> GetOperators()
    {
        try { return Ok(_ops.Get().ToDictionary(k => k.Key.ToString(), v => v.Value)); }
        catch (Exception ex) { return BadRequest(new { error = ex.Message }); }
    }

    [HttpGet("enums")]
    public ActionResult<object> GetEnums()
    {
        try { return Ok(_labels.Data.Enums); }
        catch (Exception ex) { return BadRequest(new { error = ex.Message }); }
    }
}

