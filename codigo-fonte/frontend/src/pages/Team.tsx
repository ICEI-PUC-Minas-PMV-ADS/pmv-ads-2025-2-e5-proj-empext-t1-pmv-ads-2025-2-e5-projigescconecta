import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Button,
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
import { useNavigate } from 'react-router-dom';
import {
  TeamsApi,
  CreateTeamRequest,
  EditTeamRequest,
  ListTeamRequest,
  Filter,
  Op,
  CoursesApi,
  EventType,
  ModalityType,
  ProjectProgramsApi,
  ProjectProgramListItemViewModel,
} from './../api';
import { apiConfig } from '../services/auth';
import DialogPadronized from '@/components/DialogPadronized';
import { UploadCsvModal } from '@/components/UploadCsvModal';

dayjs.locale('pt-br');
interface Team {
  teamId?: number;
  name: string;
  lessonTime?: string | null;
  start?: string | null;
  finish?: string | null;
  projectPrograms?: number;
  projectProgramsIds?: number[] | null;
  courseId?: number | null;
  projectProgramName?: string | null;
  courseName?: string | null;
  personTeamsCount?: number;
  isDeleted?: boolean;
  year?: number | null;
  semester?: string | null;
  modalityType?: ModalityType | number | null;
  eventType?: EventType | number | null;
}

interface Course {
  courseId?: number;
  name?: string | null;
}

interface TeamCsvRow {
  name: string;
  lessonTime?: string;
  start?: string;
  finish?: string;
  courseId?: number;
}

const Team: React.FC = () => {
  const [filterProjectProgramId, setFilterProjectProgramId] = useState<number | ''>('');
  const [filterCourseId, setFilterCourseId] = useState<number | ''>('');
  const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null);
  const [filterModalityType, setFilterModalityType] = useState<number | ''>('');
  const [filterEventType, setFilterEventType] = useState<number | ''>('');
  const [filterTotalParticipants, setFilterTotalParticipants] = useState<number | ''>('');
  const [filterIsDeleted, setFilterIsDeleted] = useState<boolean | ''>(false);

  const [teams, setTeams] = useState<Team[]>([]);
  const [programs, setPrograms] = useState<ProjectProgramListItemViewModel[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);

  const navigate = useNavigate();

  const [teamName, setTeamName] = useState('');
  const [lessonTime, setLessonTime] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | undefined>(undefined);
  const [endDate, setEndDate] = useState<Dayjs | undefined>(undefined);
  const [selectedProgramIds, setSelectedProgramIds] = useState<number[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');
  const [semester, setSemester] = useState<string>('');
  const [selectedModalityType, setSelectedModalityType] = useState<number | ''>('');
  const [selectedEventType, setSelectedEventType] = useState<number | ''>('');

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

  const [isUploadOpen, setUploadOpen] = useState(false);
  const teamsApi = new TeamsApi(apiConfig);
  const coursesApi = new CoursesApi(apiConfig);
  const projectsApi = new ProjectProgramsApi(apiConfig);

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
        // Filtro por programa: usar propertyName 'ProjectProgramId' + Op.NUMBER_1 (Equals). O backend intercepta esse filtro.
        if (filterProjectProgramId) {
          filters.push({
            propertyName: 'ProjectProgramId',
            operation: Op.NUMBER_1,
            value: filterProjectProgramId,
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

        if (filterModalityType) {
          filters.push({
            propertyName: 'modalityType',
            operation: Op.NUMBER_1,
            // Persistência/consulta: backend espera o nome do enum
            value: ModalityKeyByNumber[filterModalityType as number],
          });
        }

        if (filterEventType) {
          filters.push({
            propertyName: 'eventType',
            operation: Op.NUMBER_1,
            // Persistência/consulta: backend espera o nome do enum
            value: EventKeyByNumber[filterEventType as number],
          });
        }

        if (filterTotalParticipants !== '' && filterTotalParticipants != null) {
          filters.push({
            propertyName: 'PersonTeams.Count',
            operation: Op.NUMBER_1,
            value: filterTotalParticipants,
          });
        }

        if (filterIsDeleted !== '') {
          filters.push({
            propertyName: 'IsDeleted',
            operation: Op.NUMBER_1,
            value: filterIsDeleted as boolean,
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

  const fetchPrograms = async () => {
    try {
      setProgramsLoading(true);
      const { data } = await projectsApi.listProjectProgram({
        pageNumber: 1,
        pageSize: 100,
      });
      setPrograms(data.items || []);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      toast.error('Erro ao carregar projetos');
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
    } catch (error) {
      console.error('Erro ao carregar programas:', error);
      toast.error('Erro ao carregar programas');
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Enums: filtro usa o nome (string); persistência usa número
  const ModalityKeyByNumber: Record<number, 'InPerson' | 'Hybrid' | 'EAD'> = {
    1: 'InPerson',
    2: 'Hybrid',
    3: 'EAD',
  };
  const EventKeyByNumber: Record<number, 'Open' | 'Sponsored'> = {
    1: 'Open',
    2: 'Sponsored',
  };
  const ModalityNumberByKey: Record<string, number> = {
    InPerson: 1,
    Hybrid: 2,
    EAD: 3,
  };
  const EventNumberByKey: Record<string, number> = {
    Open: 1,
    Sponsored: 2,
  };

  const modalityLabel = (value: number | string | null | undefined): string => {
    if (typeof value === 'string') {
      switch (value) {
        case 'InPerson':
          return 'Presencial';
        case 'Hybrid':
          return 'Híbrido';
        case 'EAD':
          return 'EAD';
        default:
          return '';
      }
    }
    switch (value) {
      case 1:
        return 'Presencial';
      case 2:
        return 'Híbrido';
      case 3:
        return 'EAD';
      default:
        return '';
    }
  };

  const eventLabel = (value: number | string | null | undefined): string => {
    if (typeof value === 'string') {
      switch (value) {
        case 'Open':
          return 'Aberto';
        case 'Sponsored':
          return 'Patrocinado';
        default:
          return '';
      }
    }
    switch (value) {
      case 1:
        return 'Aberto';
      case 2:
        return 'Patrocinado';
      default:
        return '';
    }
  };

  

  const columns: Column<Team>[] = [
    { label: 'ID', field: 'teamId', align: 'center' },
    { label: 'Nome', field: 'name', align: 'center' },
    { label: 'Programa', field: 'courseName', align: 'center' },

    {
      label: 'Modalidade',
      field: 'modalityType',
      align: 'center',
      render: (v) => modalityLabel(v as number | string),
    },
    {
      label: 'Tipo de Evento',
      field: 'eventType',
      align: 'center',
      render: (v) => eventLabel(v as number | string),
    },
    {
      label: 'Período',
      field: 'start',
      align: 'center',
      render: (_, row) =>
        row.start && row.finish ? `${row.start} até ${row.finish}` : row.start || row.finish || '-',
    },

    { label: 'Total de Projetos', field: 'projectPrograms', align: 'center' },
    { label: 'Total de Integrantes', field: 'personTeamsCount', align: 'center' },
  ];

  const handleSearch = () => {
    setPage(0);
    fetchTeams();
  };

  const handleClearFilters = () => {
    setFilterProjectProgramId('');
    setFilterCourseId('');
    setFilterStartDate(null);
    setFilterEndDate(null);
    setFilterModalityType('');
    setFilterEventType('');
    setFilterTotalParticipants('');
    setFilterIsDeleted(false);
    setPage(0);
    fetchTeams([]);
  };

  const handleAdd = () => {
    resetForm();
    setOpenModal(true);
  };

  const handleEdit = async (team: Team) => {
    try {
      const id: number = team.teamId!;
      const { data } = await teamsApi.getTeamById(id);
      setEditingTeam({ teamId: id } as Team);
      setTeamName(data.name || '');
      setLessonTime(data.lessonTime || '');
      setStartDate(data.start ? dayjs(data.start) : undefined);
      setEndDate(data.finish ? dayjs(data.finish) : undefined);
      setSelectedCourseId(data.courseId || '');
      setYear(typeof data.year === 'number' ? data.year : '');
      setSemester(data.semester || '');
      // Modalidade/Event podem vir como número ou nome; normalizar para número no estado
      if (typeof data.modalityType === 'string') {
        setSelectedModalityType(ModalityNumberByKey[data.modalityType] ?? '');
      } else {
        setSelectedModalityType((data.modalityType as number) ?? '');
      }
      if (typeof data.eventType === 'string') {
        setSelectedEventType(EventNumberByKey[data.eventType] ?? '');
      } else {
        setSelectedEventType((data.eventType as number) ?? '');
      }
      // Backward compatibility: API may return 'projectProgramsIds' or 'projectProgramIds'
      const projectIds = (data as any).projectProgramsIds ?? (data as any).projectProgramIds ?? [];
      setSelectedProgramIds(projectIds || []);
      setOpenModal(true);
    } catch (error) {
      console.error('Erro ao carregar turma para edição:', error);
      toast.error('Erro ao carregar detalhes da turma para edição');
    }
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
      setYear(typeof data.year === 'number' ? data.year : '');
      setSemester(data.semester || '');
      // Normalizar para número no estado (suporta retorno string ou número da API)
      if (typeof data.modalityType === 'string') {
        setSelectedModalityType(ModalityNumberByKey[data.modalityType] ?? '');
      } else {
        setSelectedModalityType((data.modalityType as number) ?? '');
      }
      if (typeof data.eventType === 'string') {
        setSelectedEventType(EventNumberByKey[data.eventType] ?? '');
      } else {
        setSelectedEventType((data.eventType as number) ?? '');
      }

      // Backward compatibility: API may return 'projectProgramsIds' or 'projectProgramIds'
      const projectIds = (data as any).projectProgramsIds ?? (data as any).projectProgramIds ?? [];
      setSelectedProgramIds(projectIds || []);

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
    if (!year && year !== 0) {
      toast.error('O ano é obrigatório!');
      return false;
    }
    if (typeof year === 'number' && year <= 0) {
      toast.error('O ano deve ser maior que 0!');
      return false;
    }
    if (!semester.trim()) {
      toast.error('O semestre é obrigatório!');
      return false;
    }
    if (!selectedModalityType) {
      toast.error('A modalidade é obrigatória!');
      return false;
    }
    if (!selectedEventType) {
      toast.error('O tipo de evento é obrigatório!');
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
          year: (year as number) ?? null,
          semester: semester || null,
          // Persistência: backend espera o número do enum
          modalityType: selectedModalityType as unknown as ModalityType,
          eventType: selectedEventType as unknown as EventType,
          // Programas vinculados (N:N). Edit usa 'projectProgramIds'.
          projectProgramIds: selectedProgramIds.length > 0 ? selectedProgramIds : null,
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
          year: year as number,
          semester: semester,
          // Persistência: backend espera o número do enum
          modalityType: selectedModalityType as unknown as ModalityType,
          eventType: selectedEventType as unknown as EventType,
          courseId: selectedCourseId as number,
          // Programas vinculados (N:N). Create usa 'projectProgramsIds' (compatibilidade).
          projectProgramsIds: selectedProgramIds.length > 0 ? selectedProgramIds : undefined,
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
    setYear('');
    setSemester('');
    setSelectedModalityType('');
    setSelectedEventType('');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => {
      resetForm();
      setIsVisualizing(false);
    }, 300);
  };

  const handleProgramChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as unknown;
    if (Array.isArray(value)) {
      setSelectedProgramIds(value.map((v) => Number(v)));
    } else if (typeof value === 'string') {
      const parts = (value as string).split(',').filter((v) => v !== '');
      setSelectedProgramIds(parts.map((v) => Number(v)));
    } else {
      setSelectedProgramIds([]);
    }
  };

  const handleCourseChange = (event: SelectChangeEvent<number | ''>) => {
    setSelectedCourseId(event.target.value as number | '');
  };

  const handleFilterCourseChange = (event: SelectChangeEvent<number | ''>) => {
    setFilterCourseId(event.target.value as number | '');
  };

  function handlePersonTeam(row: Team): void {
    if (row.teamId) {
      navigate(`/team/${row.teamId}/persons-team`);
    } else {
      toast.error('ID da turma não encontrado');
    }
  }

  /* -------------------------------- Funções CSV -------------------------------- */

  const formatFieldName = (field: string): string => {
    const mapping: { [key: string]: string } = {
      name: 'Nome',
      lessonTime: 'Horário da Aula',
      start: 'Data de Início',
      finish: 'Data de Fim',
      courseId: 'Programa',
    };
    return mapping[field] || field;
  };

  const validateTeamForm = (team: any): string | null => {
    const requiredFields = ['name'];

    for (const field of requiredFields) {
      if (!team[field] || team[field].toString().trim() === '') {
        const message = `O campo "${formatFieldName(field)}" é obrigatório!`;
        toast.error(message);
        return message;
      }
    }

    return null;
  };

  const handleUploadTeam = () => {
    setUploadOpen(true);
  };

  const apiCreate = (data: TeamCsvRow) => {
    const startDateParsed = data.start ? dayjs(data.start) : null;
    const derivedYear = startDateParsed?.year() ?? dayjs().year();
    const derivedSemester = startDateParsed ? (startDateParsed.month() <= 5 ? '1' : '2') : '1';

    const parsedCourseId = Number(data.courseId);
    if (!parsedCourseId || Number.isNaN(parsedCourseId)) {
      return Promise.reject(
        new Error('O campo "Programa" (courseId) é obrigatório e deve ser numérico.')
      );
    }

    const defaultModality: ModalityType = ModalityType.NUMBER_1;
    const defaultEvent: EventType = EventType.NUMBER_1;

    return teamsApi.createTeam({
      name: data.name,
      lessonTime: data.lessonTime ?? null,
      start: data.start ?? null,
      finish: data.finish ?? null,
      year: derivedYear,
      semester: derivedSemester,
      modalityType: defaultModality,
      eventType: defaultEvent,
      courseId: parsedCourseId,
    });
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
            <TitleAndButtons
              title="Listar Turmas"
              onAdd={handleAdd}
              addLabel="Nova Turma"
              onImportCsv={handleUploadTeam}
              importLabel="Importar Turma"
            />

            {/* Filtros e ações de busca */}
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
                {(filterStartDate ||
                  filterEndDate ||
                  filterProjectProgramId ||
                  filterCourseId ||
                  filterModalityType ||
                  filterEventType ||
                  (filterTotalParticipants !== '' && filterTotalParticipants != null) ||
                  filterIsDeleted !== '') && (
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
                {/* Total de Participantes */}
                <TextField
                  label="Total de Participantes"
                  variant="outlined"
                  value={filterTotalParticipants}
                  type="number"
                  size="small"
                  onChange={(e) => {
                    const v = e.target.value;
                    setFilterTotalParticipants(v === '' ? '' : parseInt(v, 10));
                  }}
                />
                {/* Projeto/Programa (filtrar por ProjectProgramId) */}
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel>Projeto</InputLabel>
                  <Select
                    value={filterProjectProgramId === '' ? '' : Number(filterProjectProgramId)}
                    onChange={(e) => {
                      const v = e.target.value as string | number;
                      if (v === '') {
                        setFilterProjectProgramId('');
                      } else {
                        setFilterProjectProgramId(Number(v));
                      }
                    }}
                    label="Projeto/Programa"
                    disabled={programsLoading}
                  >
                    <MenuItem value="">
                      <em>Todos</em>
                    </MenuItem>
                    {programs.map((program) => (
                      <MenuItem
                        key={program.projectProgramId as number}
                        value={program.projectProgramId as number}
                      >
                        {program.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                {/* Filtro por programa (Course) */}
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

                {/* Ativo / Inativo */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterIsDeleted === '' ? '' : filterIsDeleted ? 'true' : 'false'}
                    onChange={(e) => {
                      const v = e.target.value as string;
                      setFilterIsDeleted(v === '' ? '' : v === 'true');
                    }}
                    label="Status"
                  >
                    <MenuItem value={'false'}>Ativo</MenuItem>
                    <MenuItem value={'true'}>Inativo</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Modalidade</InputLabel>
                  <Select
                    value={filterModalityType === '' ? '' : String(filterModalityType)}
                    onChange={(e) => {
                      const v = e.target.value as string;
                      setFilterModalityType(v === '' ? '' : parseInt(v, 10));
                    }}
                    label="Modalidade"
                  >
                    <MenuItem value="">
                      <em>Todas as modalidades</em>
                    </MenuItem>
                    <MenuItem value="1">Presencial</MenuItem>
                    <MenuItem value="2">Híbrido</MenuItem>
                    <MenuItem value="3">EAD</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Tipo de Evento</InputLabel>
                  <Select
                    value={filterEventType === '' ? '' : String(filterEventType)}
                    onChange={(e) => {
                      const v = e.target.value as string;
                      setFilterEventType(v === '' ? '' : parseInt(v, 10));
                    }}
                    label="Tipo de Evento"
                  >
                    <MenuItem value="">
                      <em>Todos os tipos</em>
                    </MenuItem>
                    <MenuItem value="1">Aberto</MenuItem>
                    <MenuItem value="2">Patrocinado</MenuItem>
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
                onTeam={handlePersonTeam}
              />
            )}
          </Box>
        </Paper>
      </Container>
      {/* Modal de criação/edição de turma */}
      <DialogPadronized
        open={openModal}
        onClose={handleCloseModal}
        title={dialogTitle()}
        maxWidth="md"
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

            {/* Ano e Semestre */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                margin="dense"
                label="Ano *"
                type="number"
                fullWidth
                variant="outlined"
                value={year}
                onChange={(e) => {
                  const value = e.target.value;
                  setYear(value === '' ? '' : parseInt(value, 10));
                }}
                slotProps={{
                  input: {
                    readOnly: isVisualizing,
                  },
                }}
                sx={isVisualizing ? { pointerEvents: 'none' } : {}}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel>Semestre *</InputLabel>
                <Select
                  value={semester}
                  label="Semestre *"
                  onChange={(e) => setSemester(e.target.value as string)}
                  disabled={isVisualizing}
                >
                  <MenuItem value={''} disabled>
                    <em>Selecione</em>
                  </MenuItem>
                  <MenuItem value={'1'}>1º semestre</MenuItem>
                  <MenuItem value={'2'}>2º semestre</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Modalidade e Tipo de Evento */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel>Modalidade *</InputLabel>
                <Select
                  value={selectedModalityType}
                  onChange={(e) => setSelectedModalityType(Number(e.target.value))}
                  label="Modalidade *"
                  disabled={isVisualizing}
                >
                  <MenuItem value={''} disabled>
                    <em>Selecione</em>
                  </MenuItem>
                  <MenuItem value={1}>Presencial</MenuItem>
                  <MenuItem value={2}>Híbrido</MenuItem>
                  <MenuItem value={3}>EAD</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel>Tipo de Evento *</InputLabel>
                <Select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(Number(e.target.value))}
                  label="Tipo de Evento *"
                  disabled={isVisualizing}
                >
                  <MenuItem value={''} disabled>
                    <em>Selecione</em>
                  </MenuItem>
                  <MenuItem value={1}>Aberto</MenuItem>
                  <MenuItem value={2}>Patrocinado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel>Selecione os projetos</InputLabel>
                <Select
                  multiple
                  value={selectedProgramIds as unknown as number[]}
                  onChange={handleProgramChange}
                  label="Selecione os projetos"
                  disabled={programsLoading || isVisualizing}
                  renderValue={(selected) => {
                    const ids = selected as number[];
                    const names = programs
                      .filter((p) => ids.includes(p.projectProgramId as number))
                      .map((p) => p.name)
                      .filter(Boolean) as string[];
                    return (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {names.length > 0 ? (
                          names.map((name, idx) => (
                            <Chip key={`${name}-${idx}`} label={name} size="small" />
                          ))
                        ) : (
                          <Typography variant="body2">Nenhum projeto selecionado</Typography>
                        )}
                      </Box>
                    );
                  }}
                  slotProps={{
                    input: {
                      readOnly: isVisualizing,
                    },
                  }}
                  sx={isVisualizing ? { pointerEvents: 'none' } : {}}
                >
                  {programsLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...
                    </MenuItem>
                  ) : programs.length === 0 ? (
                    <MenuItem disabled>Nenhum projeto cadastrado</MenuItem>
                  ) : (
                    programs.map((program) => (
                      <MenuItem
                        key={program.projectProgramId as number}
                        value={program.projectProgramId as number}
                      >
                        {program.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

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

      {/* Upload CSV Modal */}
      {isUploadOpen && (
        <UploadCsvModal<TeamCsvRow>
          title="Importar Turma"
          onClose={() => setUploadOpen(false)}
          apiCreate={apiCreate}
          expectedHeaders={['name', 'lessonTime', 'start', 'finish', 'courseId']}
          validateFields={validateTeamForm}
          onFinish={() => fetchTeams([])}
        />
      )}
    </LocalizationProvider>
  );
};

export default Team;
