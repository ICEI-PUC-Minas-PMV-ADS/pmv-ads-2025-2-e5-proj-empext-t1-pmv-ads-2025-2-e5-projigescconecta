import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  SelectChangeEvent,
  Typography,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { toast } from 'react-toastify';
import {
  TeamsApi,
  CreateTeamRequest,
  EditTeamRequest,
  ListTeamRequest,
  Filter,
  Op,
  CoursesApi,
} from './../api';
import { apiConfig } from '../services/auth';
import { alpha } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { Chip, Paper } from '@mui/material';

dayjs.locale('pt-br');

// Interfaces
interface Team {
  id?: number;
  start?: string;
  finish?: string;
  projectProgramId?: number;
  courseId?: number;
  projectProgramName?: string;
  courseName?: string;
  isDeleted?: boolean;
}

interface Program {
  id?: number;
  name?: string;
}

interface Course {
  id?: number;
  name?: string;
}

const Team: React.FC = () => {
  // Estados de filtros
  const [filterProgramId, setFilterProgramId] = useState<number | ''>('');
  const [filterCourseId, setFilterCourseId] = useState<number | ''>('');
  const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null);

  const [teams, setTeams] = useState<Team[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<number | ''>('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');

  // Instâncias da API
  const teamsApi = new TeamsApi(apiConfig);
  const coursesApi = new CoursesApi(apiConfig);

  const dialogTitle = () => {
    return isVisualizing ? 'Visualizar Turma' : editingTeam ? 'Editar Turma' : 'Nova Turma';
  };

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchPrograms();
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeams = async (customFilters?: Filter[]) => {
    try {
      setLoading(true);
      setTeams([]);

      const filters: Filter[] = customFilters ?? [];

      if (!customFilters) {
        if (filterProgramId) {
          filters.push({
            propertyName: 'projectProgramId',
            operation: Op.NUMBER_1,
            value: filterProgramId,
          });
        }

        if (filterCourseId) {
          filters.push({
            propertyName: 'courseId',
            operation: Op.NUMBER_1,
            value: filterCourseId,
          });
        }

        if (filterStartDate) {
          filters.push({
            propertyName: 'start',
            operation: Op.NUMBER_6,
            value: filterStartDate.format('YYYY-MM-DDTHH:mm:ss'),
          });
        }

        if (filterEndDate) {
          filters.push({
            propertyName: 'finish',
            operation: Op.NUMBER_4,
            value: filterEndDate.format('YYYY-MM-DDTHH:mm:ss'),
          });
        }
      }

      const listTeamRequest: ListTeamRequest = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        filters: filters.length > 0 ? filters : undefined,
      };

      const { data } = await teamsApi.listTeam(listTeamRequest);

      if (!data.items || data.items.length === 0) {
        setNoDataMessage('Nenhuma turma encontrada');
        setTeams([]);
        return;
      }
      setTeams(
        (data.items ?? []).map((item) => ({
          ...item,
          start: item.start ? dayjs(item.start).format('DD/MM/YYYY') : '',
          finish: item.finish ? dayjs(item.finish).format('DD/MM/YYYY') : '',
        }))
      );

      setTotalCount(data.totalItems || 0);
      setNoDataMessage('');
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      toast.error('Erro ao carregar turmas');
      setTeams([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      setProgramsLoading(true);
      // TODO: Substituir por chamada real quando ProgramsApi estiver disponível
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockPrograms: Program[] = [
        { id: 101, name: 'Programa de Inovação' },
        { id: 102, name: 'Programa de Tecnologia' },
        { id: 103, name: 'Programa de Liderança' },
        { id: 104, name: 'Programa de Desenvolvimento Pessoal' },
        { id: 105, name: 'Programa de Empreendedorismo' },
      ];
      setPrograms(mockPrograms);
    } catch (error) {
      console.error('Erro ao carregar programas:', error);
      toast.error('Erro ao carregar programas');
      setPrograms([]);
    } finally {
      setProgramsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const { data } = await coursesApi.listCourse({
        pageNumber: 1,
        pageSize: 100,
      });
      setCourses(data.items || []);
      console.log('courses:', data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      toast.error('Erro ao carregar cursos');
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  const columns: Column<Team>[] = [
    { label: 'ID', field: 'id' },
    { label: 'Data Início', field: 'start' },
    { label: 'Data Fim', field: 'finish' },
    { label: 'Programa {mock}', field: 'projectProgramId' },
    { label: 'Curso', field: 'courseName' },
  ];

  const handleSearch = () => {
    setPage(0);
    fetchTeams();
  };

  const handleClearFilters = () => {
    setFilterProgramId('');
    setFilterCourseId('');
    setFilterStartDate(null);
    setFilterEndDate(null);
    setPage(0);
    fetchTeams([]);
  };

  const handleAdd = () => {
    resetForm();
    setOpenModal(true);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setStartDate(team.start ? dayjs(team.start) : null);
    setEndDate(team.finish ? dayjs(team.finish) : null);
    setSelectedProgramId(team.projectProgramId || '');
    setSelectedCourseId(team.courseId || '');
    setOpenModal(true);
  };

  const handleView = async (team: Team) => {
    try {
      const id: number = team.id!;
      const { data } = await teamsApi.getTeamById(id);
      setIsVisualizing(true);
      setStartDate(data.start ? dayjs(data.start) : null);
      setEndDate(data.finish ? dayjs(data.finish) : null);
      setSelectedProgramId(data.projectProgramId || '');
      setSelectedCourseId(data.courseId || '');
      setOpenModal(true);
    } catch (error) {
      console.error('Erro ao visualizar turma:', error);
      toast.error('Erro ao carregar detalhes da turma');
    }
  };

  const handleDelete = async (team: Team) => {
    try {
      const id: number = team.id!;
      await teamsApi.deleteTeam(id);
      toast.success('Turma excluída com sucesso!');
      fetchTeams();
    } catch (error) {
      console.error('Erro ao excluir turma:', error);
      toast.error('Erro ao excluir turma');
    }
  };

  const validateForm = (): boolean => {
    if (!startDate || !endDate || !selectedProgramId || !selectedCourseId) {
      toast.error('Todos os campos são obrigatórios!');
      return false;
    }
    if (endDate.isBefore(startDate)) {
      toast.error('A data de fim deve ser posterior à data de início!');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setModalLoading(true);

      if (editingTeam) {
        const editTeamRequest: EditTeamRequest = {
          start: startDate!.format('YYYY-MM-DD'),
          finish: endDate!.format('YYYY-MM-DD'),
          projectProgramId: selectedProgramId as number,
          courseId: selectedCourseId as number,
        };

        const id: number = editingTeam.id!;
        await teamsApi.editTeam(id, editTeamRequest);
        toast.success('Turma atualizada com sucesso!');
      } else {
        const createTeamRequest: CreateTeamRequest = {
          start: startDate!.format('YYYY-MM-DD'),
          finish: endDate!.format('YYYY-MM-DD'),
          projectProgramId: selectedProgramId as number,
          courseId: selectedCourseId as number,
        };

        await teamsApi.createTeam(createTeamRequest);
        toast.success('Turma criada com sucesso!');
      }

      handleCloseModal();
      fetchTeams();
    } catch (error) {
      console.error('Erro ao salvar turma:', error);
      toast.error('Erro ao salvar turma');
    } finally {
      setModalLoading(false);
    }
  };

  const resetForm = () => {
    setEditingTeam(null);
    setStartDate(null);
    setEndDate(null);
    setSelectedProgramId('');
    setSelectedCourseId('');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => {
      resetForm();
      setIsVisualizing(false);
    }, 300);
  };

  const handleProgramChange = (event: SelectChangeEvent<number | ''>) => {
    setSelectedProgramId(event.target.value as number | '');
  };

  const handleCourseChange = (event: SelectChangeEvent<number | ''>) => {
    setSelectedCourseId(event.target.value as number | '');
  };

  const handleFilterProgramChange = (event: SelectChangeEvent<number | ''>) => {
    setFilterProgramId(event.target.value as number | '');
  };

  const handleFilterCourseChange = (event: SelectChangeEvent<number | ''>) => {
    setFilterCourseId(event.target.value as number | '');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Container
        maxWidth="xl"
        sx={{
          minHeight: '100vh',
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: alpha('#1E4EC4', 0.1),
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <TitleAndButtons title="Listar Turmas" onAdd={handleAdd} addLabel="Nova Turma" />

            {/* Área de Filtros */}
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2.5,
                }}
              >
                <FilterListIcon sx={{ color: '#1E4EC4', fontSize: '1.25rem' }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: '#1a1a2e',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                  }}
                >
                  Filtros de Busca
                </Typography>
                {(filterStartDate || filterEndDate || filterProgramId || filterCourseId) && (
                  <Chip
                    label="Filtros ativos"
                    size="small"
                    sx={{
                      ml: 1,
                      bgcolor: alpha('#1E4EC4', 0.1),
                      color: '#1E4EC4',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                )}
              </Box>

              <Grid container spacing={{ xs: 2, md: 2.5 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <DatePicker
                    label="Data Início"
                    value={filterStartDate}
                    onChange={setFilterStartDate}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            backgroundColor: 'white',
                            '&:hover fieldset': {
                              borderColor: '#1E4EC4',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#1E4EC4',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#1E4EC4',
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <DatePicker
                    label="Data Fim"
                    value={filterEndDate}
                    onChange={setFilterEndDate}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            backgroundColor: 'white',
                            '&:hover fieldset': {
                              borderColor: '#1E4EC4',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#1E4EC4',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#1E4EC4',
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ '&.Mui-focused': { color: '#1E4EC4' } }}>Programa</InputLabel>
                    <Select
                      value={filterProgramId}
                      onChange={handleFilterProgramChange}
                      label="Programa"
                      disabled={programsLoading}
                      sx={{
                        borderRadius: 1.5,
                        backgroundColor: 'white',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1E4EC4',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1E4EC4',
                          borderWidth: 2,
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Todos os programas</em>
                      </MenuItem>
                      {programs.map((program) => (
                        <MenuItem key={program.id} value={program.id}>
                          {program.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ '&.Mui-focused': { color: '#1E4EC4' } }}>Curso</InputLabel>
                    <Select
                      value={filterCourseId}
                      onChange={handleFilterCourseChange}
                      label="Curso"
                      disabled={coursesLoading}
                      sx={{
                        borderRadius: 1.5,
                        backgroundColor: 'white',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1E4EC4',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1E4EC4',
                          borderWidth: 2,
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Todos os cursos</em>
                      </MenuItem>
                      {courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    sx={{ mt: { xs: 0, sm: 0.5 } }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<SearchIcon />}
                      onClick={handleSearch}
                      sx={{
                        bgcolor: '#1E4EC4',
                        color: 'white',
                        fontWeight: 600,
                        px: 4,
                        py: 1,
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        boxShadow: '0 2px 8px rgba(30, 78, 196, 0.25)',
                        '&:hover': {
                          bgcolor: '#1640a8',
                          boxShadow: '0 4px 12px rgba(30, 78, 196, 0.35)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease',
                        flex: { xs: 1, sm: 'initial' },
                      }}
                    >
                      Buscar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ClearIcon />}
                      onClick={handleClearFilters}
                      sx={{
                        borderColor: alpha('#1E4EC4', 0.3),
                        color: '#1E4EC4',
                        fontWeight: 600,
                        px: 4,
                        py: 1,
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        '&:hover': {
                          borderColor: '#1E4EC4',
                          bgcolor: alpha('#1E4EC4', 0.05),
                          borderWidth: 1.5,
                        },
                        transition: 'all 0.2s ease',
                        flex: { xs: 1, sm: 'initial' },
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Área da Tabela */}
            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 200,
                  }}
                >
                  <CircularProgress sx={{ color: '#1E4EC4' }} />
                </Box>
              ) : (
                <Table
                  columns={columns}
                  data={teams}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalCount={totalCount}
                  onPageChange={setPage}
                  onRowsPerPageChange={setRowsPerPage}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  noDataMessage={noDataMessage}
                />
              )}
            </Box>

            {/* Modal Melhorado */}
            <Dialog
              open={openModal}
              onClose={handleCloseModal}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              {/* Título reativo Modal */}
              <DialogTitle
                sx={{
                  bgcolor: alpha('#1E4EC4', 0.03),
                  borderBottom: '1px solid',
                  borderColor: alpha('#1E4EC4', 0.1),
                  py: 2.5,
                  px: 3,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                  {dialogTitle()}
                </Typography>
              </DialogTitle>

              {/* Campos Modal */}
              <DialogContent sx={{ p: 3, mt: 2 }}>
                <Grid container spacing={3}>
                  {/* Data Inicial */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                      label="Data de Início"
                      value={startDate}
                      onChange={setStartDate}
                      format="DD/MM/YYYY"
                      disabled={isVisualizing}
                      maxDate={endDate}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                          sx: {
                            mt: 2,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              '&:hover fieldset': {
                                borderColor: '#1E4EC4',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1E4EC4',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#1E4EC4',
                            },
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Data Final */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                      label="Data de Fim"
                      value={endDate}
                      onChange={setEndDate}
                      format="DD/MM/YYYY"
                      minDate={startDate}
                      disabled={isVisualizing || !startDate}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                          sx: {
                            mt: 2,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5,
                              '&:hover fieldset': {
                                borderColor: '#1E4EC4',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1E4EC4',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#1E4EC4',
                            },
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Programa */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel sx={{ '&.Mui-focused': { color: '#1E4EC4' } }}>
                        Programa
                      </InputLabel>
                      <Select
                        value={selectedProgramId}
                        onChange={handleProgramChange}
                        label="Programa"
                        disabled={programsLoading || isVisualizing}
                        sx={{
                          borderRadius: 1.5,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1E4EC4',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1E4EC4',
                            borderWidth: 2,
                          },
                        }}
                      >
                        {programsLoading ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...
                          </MenuItem>
                        ) : programs.length === 0 ? (
                          <MenuItem disabled>Nenhum programa cadastrado</MenuItem>
                        ) : (
                          programs.map((program) => (
                            <MenuItem key={program.id} value={program.id}>
                              {program.name}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Curso */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel sx={{ '&.Mui-focused': { color: '#1E4EC4' } }}>Curso</InputLabel>
                      <Select
                        value={selectedCourseId}
                        onChange={handleCourseChange}
                        label="Curso"
                        disabled={coursesLoading || isVisualizing}
                        sx={{
                          borderRadius: 1.5,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1E4EC4',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1E4EC4',
                            borderWidth: 2,
                          },
                        }}
                      >
                        {coursesLoading ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...
                          </MenuItem>
                        ) : courses.length === 0 ? (
                          <MenuItem disabled>Nenhum curso cadastrado</MenuItem>
                        ) : (
                          courses.map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                              {course.name}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  px: 3,
                  py: 2.5,
                  bgcolor: alpha('#1E4EC4', 0.02),
                  borderTop: '1px solid',
                  borderColor: alpha('#1E4EC4', 0.1),
                  gap: 1.5,
                }}
              >
                {isVisualizing ? (
                  <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleCloseModal}
                    sx={{
                      bgcolor: '#6b7280',
                      color: 'white',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#4b5563',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Voltar
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleCloseModal}
                      disabled={modalLoading}
                      sx={{
                        color: '#6b7280',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 1.5,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: alpha('#6b7280', 0.1),
                        },
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      variant="contained"
                      disabled={modalLoading}
                      startIcon={modalLoading ? <CircularProgress size={20} /> : null}
                      sx={{
                        bgcolor: '#1E4EC4',
                        color: 'white',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 1.5,
                        textTransform: 'none',
                        boxShadow: '0 2px 8px rgba(30, 78, 196, 0.25)',
                        '&:hover': {
                          bgcolor: '#1640a8',
                          boxShadow: '0 4px 12px rgba(30, 78, 196, 0.35)',
                          transform: 'translateY(-1px)',
                        },
                        '&:disabled': {
                          bgcolor: alpha('#1E4EC4', 0.5),
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {modalLoading ? 'Salvando...' : editingTeam ? 'Atualizar' : 'Criar'}
                    </Button>
                  </>
                )}
              </DialogActions>
            </Dialog>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default Team;
