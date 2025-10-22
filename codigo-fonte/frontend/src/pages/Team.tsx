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
  Chip,
  Paper,
  alpha,
  TextField,
  Autocomplete,
  Divider,
  Stack,
  Checkbox,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '../components/ConfirmDelete';
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
import DialogPadronized from '@/components/DialogPadronized';

dayjs.locale('pt-br');

// Interfaces
interface Team {
  teamId?: number;
  name: string;
  lessonTime?: string | null;
  start?: string | null;
  finish?: string | null;
  projectProgramsIds?: number[] | null;
  courseId?: number | null;
  projectProgramName?: string | null;
  courseName?: string | null;
  personTeamsCount?: number;
  isDeleted?: boolean;
}

interface Program {
  id?: number;
  name?: string;
}

interface Course {
  courseId?: number;
  name?: string | null;
}

interface Person {
  id?: number;
  name?: string;
}

const Team: React.FC = () => {
  /* ------------------------------ Variáveis ------------------------------ */

  const [filterName, setFilterName] = useState<string | ''>('');
  const [filterProgramId, setFilterProgramId] = useState<number | ''>('');
  const [filterCourseId, setFilterCourseId] = useState<number | ''>('');
  const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null);

  const [teams, setTeams] = useState<Team[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);

  const [teamName, setTeamName] = useState('');
  const [lessonTime, setLessonTime] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | undefined>(undefined);
  const [endDate, setEndDate] = useState<Dayjs | undefined>(undefined);
  const [selectedProgramIds, setSelectedProgramIds] = useState<number[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
  const [selectedPersonIds, setSelectedPersonIds] = useState<number[]>([]);
  const [personsResults, setPersonsResults] = useState<Person[]>([]);
  const [personsLoading, setPersonsLoading] = useState(false);
  const [inputPersonValue, setInputPersonValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    team: null as Team | null,
    loading: false,
  });

  // Instâncias da API
  const teamsApi = new TeamsApi(apiConfig);
  const coursesApi = new CoursesApi(apiConfig);

  const dialogTitle = () => {
    return isVisualizing ? 'Visualizar Turma' : editingTeam ? 'Editar Turma' : 'Nova Turma';
  };

  /* --------------------------------- Funções -------------------------------- */

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchPrograms();
    fetchCourses();
    fetchPersons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeams = async (customFilters?: Filter[]) => {
    try {
      setLoading(true);
      setTeams([]);

      const filters: Filter[] = customFilters ?? [];

      if (!customFilters) {
        if (filterName) {
          filters.push({
            propertyName: 'name',
            operation: Op.NUMBER_7,
            value: filterName,
          });
        }

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
        setTotalCount(0);
        return;
      }

      const teams = (data.items ?? []).map((item) => ({
        ...item,
        start: item.start ? dayjs(item.start).format('DD/MM/YYYY') : '',
        finish: item.finish ? dayjs(item.finish).format('DD/MM/YYYY') : '',
      }));

      setTeams(teams as Team[]);

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

  /* Em mock */
  const fetchPrograms = async () => {
    try {
      setProgramsLoading(true);
      // TODO: Substituir por chamada real quando ProjectProgramsApi estiver disponível
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockPrograms: Program[] = [
        // { id: 101, name: 'Projeto de Inovação' },
        // { id: 102, name: 'Projeto de Tecnologia' },
        // { id: 103, name: 'Projeto de Liderança' },
        // { id: 104, name: 'Projeto de Desenvolvimento Pessoal' },
        // { id: 105, name: 'Projeto de Empreendedorismo' },
      ];
      setPrograms(mockPrograms);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      toast.error('Erro ao carregar projetos');
      setPrograms([]);
    } finally {
      setProgramsLoading(false);
    }
  };

  const fetchPersons = async () => {
    try {
      setPersonsLoading(true);
      // TODO: Substituir por chamada real quando PersonsApi estiver disponível
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockPersons: Person[] = [
        { id: 1, name: 'João Silva' },
        { id: 2, name: 'Maria Santos' },
        { id: 3, name: 'Pedro Oliveira' },
      ];
      setPersons(mockPersons);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
      toast.error('Erro ao carregar pessoas');
      setPersons([]);
    } finally {
      setPersonsLoading(false);
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
    } catch (error) {
      console.error('Erro ao carregar programas:', error);
      toast.error('Erro ao carregar programas');
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  const columns: Column<Team>[] = [
    /* { label: 'ID', field: 'teamId' }, */
    { label: 'Nome', field: 'name' },
    { label: 'Data Início', field: 'start' },
    { label: 'Data Fim', field: 'finish' },
    { label: 'Projeto', field: 'projectProgramName' },
    { label: 'Programa', field: 'courseName' },
    { label: 'Total de Participantes', field: 'personTeamsCount', align: 'center' },
  ];

  const handleSearch = () => {
    setPage(0);
    fetchTeams();
  };

  const handleClearFilters = () => {
    setFilterName('');
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
    setTeamName(team.name);
    setLessonTime(team.lessonTime || '');
    setStartDate(team.start ? dayjs(team.start, 'DD/MM/YYYY') : undefined);
    setEndDate(team.finish ? dayjs(team.finish, 'DD/MM/YYYY') : undefined);
    setSelectedProgramIds(team.projectProgramsIds || []);
    setSelectedCourseId(team.courseId || '');
    setSelectedPersonIds([]); // Será carregado no getTeamById
    setOpenModal(true);
  };

  const handleView = async (team: Team) => {
    try {
      const id: number = team.teamId!;
      const { data } = await teamsApi.getTeamById(id);
      setIsVisualizing(true);
      setTeamName(data.name || '');
      setLessonTime(data.lessonTime || '');
      setStartDate(data.start ? dayjs(data.start) : undefined);
      setEndDate(data.finish ? dayjs(data.finish) : undefined);
      setSelectedCourseId(data.courseId || '');

      // TODO: Quando a API retornar personTeamsIds, usar:
      // setSelectedPersonIds(data.personTeamsIds || []);
      setSelectedPersonIds([]); // Por enquanto vazio

      // TODO: Quando a API retornar projectProgramsIds, usar:
      // setSelectedProgramIds(data.projectProgramsIds || []);
      setSelectedProgramIds([]);

      setOpenModal(true);
    } catch (error) {
      console.error('Erro ao visualizar turma:', error);
      toast.error('Erro ao carregar detalhes da turma');
    }
  };

  const handleDelete = async (team: Team) => {
    setConfirmDialog({
      open: true,
      team: team,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.team) return;

    try {
      setConfirmDialog((prev) => ({ ...prev, loading: true }));
      const id: number = confirmDialog.team.teamId!;
      await teamsApi.deleteTeam(id);
      toast.success(`Turma "${confirmDialog.team.name}" excluída com sucesso!`);
      handleCloseConfirmDialog();
      fetchTeams();
    } catch (error) {
      console.error('Erro ao excluir turma:', error);
      toast.error('Erro ao excluir turma');
      setConfirmDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      team: null,
      loading: false,
    });
  };

  const validateForm = (): boolean => {
    if (!teamName.trim()) {
      toast.error('O nome da turma é obrigatório!');
      return false;
    }
    if (!selectedCourseId) {
      toast.error('Deve ser informado um programa!');
      return false;
    }
    if (endDate && endDate.isBefore(startDate)) {
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
          name: teamName,
          lessonTime: lessonTime || undefined,
          start: startDate ? startDate.format('YYYY-MM-DD') : undefined,
          finish: endDate ? endDate.format('YYYY-MM-DD') : undefined,
          courseId: selectedCourseId as number,
          // Implementação do CRUD para ProjectProgram como lista
          projectProgramIds: selectedProgramIds.length > 0 ? selectedProgramIds : null,
          personTeamsIds: selectedPersonIds.length > 0 ? selectedPersonIds : null,
        };

        const id: number = editingTeam.teamId!;
        await teamsApi.editTeam(id, editTeamRequest);
        toast.success('Turma atualizada com sucesso!');
      } else {
        const createTeamRequest: CreateTeamRequest = {
          name: teamName,
          lessonTime: lessonTime || undefined,
          start: startDate ? startDate.format('YYYY-MM-DD') : undefined,
          finish: endDate ? endDate.format('YYYY-MM-DD') : undefined,
          courseId: selectedCourseId as number,
          // Implementação do CRUD para ProjectProgram como lista
          projectProgramsIds: selectedProgramIds.length > 0 ? selectedProgramIds : undefined,
          personTeamsIds: selectedPersonIds.length > 0 ? selectedPersonIds : undefined,
        };

        await teamsApi.createTeam(createTeamRequest);
        toast.success('Turma criada com sucesso!');
      }

      handleCloseModal();
      fetchTeams([]);
    } catch (error) {
      console.error('Erro ao salvar turma:', error);
      toast.error('Erro ao salvar turma');
    } finally {
      setModalLoading(false);
    }
  };

  const resetForm = () => {
    setEditingTeam(null);
    setTeamName('');
    setLessonTime('');
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedProgramIds([]);
    setSelectedCourseId('');
    setSelectedPersonIds([]);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => {
      resetForm();
      setIsVisualizing(false);
    }, 300);
  };

  const handleProgramChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setSelectedProgramIds(typeof value === 'string' ? [] : value);
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

  const handlePersonChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setSelectedPersonIds(typeof value === 'string' ? [] : value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Container
        maxWidth="xl"
        sx={{
          minHeight: '100vh',
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 },
          maxWidth: '100%',
          overflowX: 'hidden',
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
          <Box sx={{ p: { xs: 2, sm: 3, md: 4, flex: 1 } }}>
            <TitleAndButtons title="Listar Turmas" onAdd={handleAdd} addLabel="Nova Turma" />

            {/* Campo de pesquisa + botão */}
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
                  Filtro de Busca
                </Typography>
                {(filterName ||
                  filterStartDate ||
                  filterEndDate ||
                  filterProgramId ||
                  filterCourseId) && (
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

              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                  label="Nome da Turma"
                  variant="outlined"
                  value={filterName}
                  size="small"
                  onChange={(e) => setFilterName(e.target.value)}
                />
                <DatePicker
                  label="Data Início"
                  value={filterStartDate}
                  onChange={setFilterStartDate}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: {
                        minWidth: 160,
                      },
                    },
                  }}
                />
                <DatePicker
                  label="Data Fim"
                  value={filterEndDate}
                  onChange={setFilterEndDate}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: {
                        minWidth: 160,
                      },
                    },
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Projeto</InputLabel>
                  <Select
                    value={filterProgramId}
                    onChange={handleFilterProgramChange}
                    label="Projeto"
                    disabled={programsLoading}
                  >
                    <MenuItem value="">
                      <em>Todos os projetos</em>
                    </MenuItem>
                    {programs.map((program) => (
                      <MenuItem key={program.id} value={program.id}>
                        {program.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Programa</InputLabel>
                  <Select
                    value={filterCourseId}
                    onChange={handleFilterCourseChange}
                    label="Programa"
                    disabled={coursesLoading}
                  >
                    <MenuItem value="">
                      <em>Todos os programas</em>
                    </MenuItem>
                    {courses.map((course) => (
                      <MenuItem key={course.courseId} value={course.courseId}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box
                sx={{
                  mt: 2.5,
                  gap: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  sx={{
                    bgcolor: '#1E4EC4',
                    color: 'white',
                    fontWeight: 600,
                    px: 3,
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
                  }}
                >
                  Limpar Filtros
                </Button>
              </Box>
            </Paper>

            {/* Tabela */}
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Table<Team>
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
        </Paper>
      </Container>
      {/* --------------------------------- Modais --------------------------------- */}
      <DialogPadronized
        open={openModal}
        onClose={handleCloseModal}
        title={dialogTitle()}
        content={
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                autoFocus={!isVisualizing}
                margin="dense"
                label="Nome da Turma*"
                type="text"
                fullWidth
                variant="outlined"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                slotProps={{
                  input: {
                    readOnly: isVisualizing,
                  },
                }}
                sx={isVisualizing ? { pointerEvents: 'none' } : {}}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                margin="dense"
                label="Horário de Aula"
                type="text"
                fullWidth
                variant="outlined"
                value={lessonTime}
                onChange={(e) => setLessonTime(e.target.value)}
                placeholder="Ex: 19:00 - 22:00"
                slotProps={{
                  input: {
                    readOnly: isVisualizing,
                  },
                }}
                sx={isVisualizing ? { pointerEvents: 'none' } : {}}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker
                label="Data de Início"
                value={startDate}
                onChange={(value) => setStartDate(value || undefined)}
                format="DD/MM/YYYY"
                disabled={isVisualizing}
                maxDate={endDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    margin: 'dense',
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker
                label="Data de Fim"
                value={endDate}
                onChange={(value) => setEndDate(value || undefined)}
                format="DD/MM/YYYY"
                minDate={startDate}
                disabled={isVisualizing || !startDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    margin: 'dense',
                  },
                }}
              />
            </Grid>

            {/* <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel>Projeto</InputLabel>
                <Select
                  value={selectedProgramId}
                  onChange={handleProgramChange}
                  label="Projeto"
                  disabled={programsLoading || isVisualizing}
                >
                  <MenuItem value="">
                    <em>Nenhum projeto</em>
                  </MenuItem>
                  {programsLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...
                    </MenuItem>
                  ) : (
                    programs.map((program) => (
                      <MenuItem key={program.id} value={program.id}>
                        {program.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid> */}

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel>Programa *</InputLabel>
                <Select
                  value={selectedCourseId}
                  onChange={handleCourseChange}
                  label="Programa *"
                  disabled={coursesLoading || isVisualizing}
                >
                  {coursesLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...
                    </MenuItem>
                  ) : courses.length === 0 ? (
                    <MenuItem disabled>Nenhum programa cadastrado</MenuItem>
                  ) : (
                    courses.map((course) => (
                      <MenuItem key={course.courseId} value={course.courseId}>
                        {course.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Cadastro de Participantes comentado */}
            {/* 
            <Grid size={{ xs: 12 }}>
              <Box mt={3}>
                <Typography variant="subtitle1">
                  <strong>Participantes</strong>
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Autocomplete
                  multiple
                  options={persons}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.name || ''}
                  value={persons.filter((p) => selectedPersonIds.includes(p.id))}
                  onChange={(_, values) => {
                    setSelectedPersonIds(values.map((v) => v.id));
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox checked={selected} sx={{ mr: 1 }} />
                      {option.name}
                    </li>
                  )}
                  renderTags={() => null}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Selecionar participantes..." size="small" />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  fullWidth
                  disabled={personsLoading || isVisualizing}
                />

                {selectedPersonIds.length > 0 ? (
                  <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                    {persons
                      .filter((p) => selectedPersonIds.includes(p.id))
                      .map((p) => (
                        <Chip
                          key={p.id}
                          label={p.name}
                          color="primary"
                          variant="outlined"
                          onDelete={() => {
                            setSelectedPersonIds(selectedPersonIds.filter((id) => id !== p.id));
                          }}
                        />
                      ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary" mt={1}>
                    Nenhum aluno.
                  </Typography>
                )}
              </Box>
            </Grid>
            */}

            {isVisualizing && (
              <Grid size={{ xs: 12 }}>
                <Box mt={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e', mb: 1 }}>
                    Participantes
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha('#1E4EC4', 0.02) }}>
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                      }}
                    >
                      Nenhum participante cadastrado nesta turma.
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
            )}
          </Grid>
        }
        actions={
          isVisualizing ? (
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
                '&:hover': { bgcolor: '#4b5563', transform: 'translateY(-1px)' },
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
                  '&:hover': { bgcolor: alpha('#6b7280', 0.1) },
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
                  '&:disabled': { bgcolor: alpha('#1E4EC4', 0.5) },
                  transition: 'all 0.2s ease',
                }}
              >
                Salvar
              </Button>
            </>
          )
        }
      />

      {/* -------------------- Confirmação de Exclusão -------------------- */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="Excluir Turma"
        message="Tem certeza que deseja excluir a turma"
        highlightText={confirmDialog.team?.name || undefined}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        loading={confirmDialog.loading}
        danger={true}
      />
    </LocalizationProvider>
  );
};

export default Team;
