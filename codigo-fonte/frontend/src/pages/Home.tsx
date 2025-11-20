import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Container,
  CircularProgress, Grid, Typography, Paper,
  alpha, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { toast } from 'react-toastify';
import {
  DashboardApi,
  CoursesApi,
  type CourseViewModel,
  type DashboardViewModel,
} from '@/api';
import { apiConfig } from '@/services/auth';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

dayjs.locale('pt-br');

const HomePage: React.FC = () => {
  const dashboardApi = useMemo(() => new DashboardApi(apiConfig), []);
  const coursesApi = useMemo(() => new CoursesApi(apiConfig), []);

  const [data, setData] = useState<DashboardViewModel | null>(null);
  const [courses, setCourses] = useState<CourseViewModel[]>([]);
  
  const [selectedProgramId, setSelectedProgramId] = useState<number | ''>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, 'year'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await coursesApi.listCourse({ pageNumber: 1, pageSize: 1000 });
      setCourses(response.data.items ?? []);
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao carregar lista de programas.');
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    if (!selectedProgramId) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      const response = await dashboardApi.getDashboardStats(
        selectedProgramId as number,
        startDate?.format('YYYY-MM-DD'),
        endDate?.format('YYYY-MM-DD')
      );
      setData(response.data);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao carregar dados do dashboard.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProgramId, startDate, endDate]);

  const renderChartBox = (title: string, data: any[], chartType: 'vertical-bar' | 'horizontal-bar') => (
    <Grid size={{ xs: 12, md: 6 }}>
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, height: '400px' }}>
        <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600, mb: 2 }}>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'vertical-bar' ? (
            <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ano" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" fill="#8884d8" name="Total" />
            </BarChart>
          ) : (
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nome" type="category" width={150} interval={0} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#82ca9d" name="Total" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Paper>
    </Grid>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Container maxWidth="xl" sx={{ minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        <Paper elevation={0} sx={{ backgroundColor: '#ffffff', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: alpha('#1E4EC4', 0.1) }}>
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#1a1a2e', mb: 3 }}>
              Dashboard
            </Typography>
            
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                mb: 3,
                backgroundColor: alpha('#1E4EC4', 0.02),
                border: '1px solid',
                borderColor: alpha('#1E4EC4', 0.1),
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <FilterListIcon sx={{ color: '#1E4EC4', fontSize: '1.25rem' }} />
                <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '1.1rem' }}>
                  Filtros
                </Typography>
              </Box>
              
              <Grid container spacing={2.5} alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="programa-select-label">Programa</InputLabel>
                    <Select
                      labelId="programa-select-label"
                      label="Programa"
                      value={selectedProgramId}
                      onChange={(e) => setSelectedProgramId(e.target.value as number | '')}
                      disabled={coursesLoading}
                    >
                      <MenuItem value="">
                        <em>Selecione um programa</em>
                      </MenuItem>
                      {courses.map((course) => (
                        <MenuItem key={course.courseId} value={course.courseId!}>
                          {course.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <DatePicker
                    label="Período - Início"
                    value={startDate}
                    onChange={setStartDate}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <DatePicker
                    label="Período - Fim"
                    value={endDate}
                    onChange={setEndDate}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
            )}

            {!loading && !data && (
              <Typography variant="h6" sx={{ textAlign: 'center', p: 5, color: 'text.secondary' }}>
                Por favor, selecione um programa para visualizar os dados.
              </Typography>
            )}

            {!loading && data && (
              <Grid container spacing={3}>
                {renderChartBox("Organizações Sociais", data.organizacoesPorAno ?? [], 'vertical-bar')}
                {renderChartBox("Consultores Sociais", data.consultoresPorAno ?? [], 'vertical-bar')}
                {renderChartBox("Cidades Atendidas", data.cidadesAtendidasPorAno ?? [], 'vertical-bar')}
                {renderChartBox("Causas", data.rankingCausas ?? [], 'horizontal-bar')}
                {renderChartBox("Temas de Projeto", data.rankingTemasProjeto ?? [], 'horizontal-bar')}
              </Grid>
            )}

          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default HomePage;