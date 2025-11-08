using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Dashboard
{
    public class DashboardViewModel
    {
        public List<ChartDataByYear> OrganizacoesPorAno { get; set; } = new List<ChartDataByYear>();
        public List<ChartDataByYear> ConsultoresPorAno { get; set; } = new List<ChartDataByYear>();
        public List<ChartDataByYear> CidadesAtendidasPorAno { get; set; } = new List<ChartDataByYear>();
        public List<ChartDataByString> RankingCausas { get; set; } = new List<ChartDataByString>();
        public List<ChartDataByString> RankingTemasProjeto { get; set; } = new List<ChartDataByString>();
        public List<string> MapaCidades { get; set; } = new List<string>();
    }

    public class ChartDataByYear
    {
        public int Ano { get; set; }
        public int Quantidade { get; set; }
    }

    public class ChartDataByString
    {
        public string Nome { get; set; }
        public int Quantidade { get; set; }
    }

    public class DashboardQuery : IRequest<DashboardViewModel>
    {
        public int CourseId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    internal sealed class DashboardQueryHandler : IRequestHandler<DashboardQuery, DashboardViewModel>
    {
        private readonly ApplicationDbContext _context;

        public DashboardQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardViewModel> Handle(DashboardQuery request, CancellationToken cancellationToken)
        {
            var viewModel = new DashboardViewModel();

            var teamsQuery = _context.Teams
                .AsNoTracking()
                .Where(t => t.CourseId == request.CourseId &&
                             t.Start.HasValue &&
                             t.Start.Value.Date >= request.StartDate.Date &&
                             t.Start.Value.Date <= request.EndDate.Date);

            var personTeamsQuery = _context.PersonTeams
                .AsNoTracking()
                .Include(pt => pt.Team)
                .Where(pt => pt.Team.CourseId == request.CourseId &&
                             pt.Team.Start.HasValue &&
                             pt.Team.Start.Value.Date >= request.StartDate.Date &&
                             pt.Team.Start.Value.Date <= request.EndDate.Date);

            viewModel.ConsultoresPorAno = await personTeamsQuery
                .Where(pt => pt.MemberTypes.Contains(MemberType.Consultant))
                .GroupBy(pt => pt.Team.Start.Value.Year)
                .Select(g => new ChartDataByYear
                {
                    Ano = g.Key,
                    Quantidade = g.Select(pt => pt.PersonId).Distinct().Count()
                })
                .OrderBy(x => x.Ano)
                .ToListAsync(cancellationToken);

            var oscsAtendidasIds = await personTeamsQuery
                .Where(pt => pt.OscId != null)
                .Select(pt => pt.OscId.Value)
                .Distinct()
                .ToListAsync(cancellationToken);

            var oscsAtendidas = await _context.Oscs
                .AsNoTracking()
                .Where(o => oscsAtendidasIds.Contains(o.Id))
                .Include(o => o.OriginsBusinessCases)
                    .ThenInclude(obc => obc.BusinessCase)
                .ToListAsync(cancellationToken);

            var oscsComAno = await personTeamsQuery
                .Where(pt => pt.OscId != null)
                .Select(pt => new { pt.OscId, Ano = pt.Team.Start.Value.Year })
                .Distinct()
                .ToListAsync(cancellationToken);

            viewModel.OrganizacoesPorAno = oscsComAno
                .GroupBy(x => x.Ano)
                .Select(g => new ChartDataByYear
                {
                    Ano = g.Key,
                    Quantidade = g.Select(x => x.OscId).Distinct().Count()
                })
                .OrderBy(x => x.Ano)
                .ToList();

            viewModel.CidadesAtendidasPorAno = (from osc in oscsAtendidas
                                                join oscAno in oscsComAno on osc.Id equals oscAno.OscId
                                                select new { osc.City, oscAno.Ano })
                .GroupBy(x => x.Ano)
                .Select(g => new ChartDataByYear
                {
                    Ano = g.Key,
                    Quantidade = g.Select(x => x.City).Distinct().Count()
                })
                .OrderBy(x => x.Ano)
                .ToList();

            viewModel.RankingCausas = oscsAtendidas
                .SelectMany(o => o.OriginsBusinessCases)
                .Where(obc => obc.BusinessCase != null)
                .GroupBy(obc => obc.BusinessCase.Name)
                .Select(g => new ChartDataByString
                {
                    Nome = g.Key,
                    Quantidade = g.Count()
                })
                .OrderByDescending(x => x.Quantidade)
                .Take(10)
                .ToList();

            viewModel.RankingTemasProjeto = await _context.ProjectPrograms
                .AsNoTracking()
                .Where(pp => teamsQuery.Any(t => t.Id == pp.TeamId))
                .Include(pp => pp.ProjectTheme)
                .Where(pp => pp.ProjectTheme != null)
                .GroupBy(pp => pp.ProjectTheme.Name)
                .Select(g => new ChartDataByString
                {
                    Nome = g.Key,
                    Quantidade = g.Count()
                })
                .OrderByDescending(x => x.Quantidade)
                .Take(10)
                .ToListAsync(cancellationToken);

            viewModel.MapaCidades = oscsAtendidas
                .Select(o => o.City)
                .Distinct()
                .ToList();

            return viewModel;
        }
    }
}