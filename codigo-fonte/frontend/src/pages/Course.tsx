// ----------------------------- Imports -----------------------------
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  CircularProgress,
  Paper,
  alpha,
  Typography,
  Chip,
  FormGroup,
  FormControlLabel,
  Switch,
  Stack,
  Divider,
  Avatar,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import AccessTime from '@mui/icons-material/AccessTime';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '../components/ConfirmDelete';
import { toast } from 'react-toastify';

import {
  CoursesApi,
  CreateCourseRequest,
  EditCourseRequest,
  ListCourseRequest,
  Filter,
  Op,
  UsersApi,
} from './../api';
import { apiConfig } from '../services/auth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import DialogPadronized from '@/components/DialogPadronized';
import { UploadCsvModal } from '@/components/UploadCsvModal';

// ----------------------------- Tipos/Interfaces -----------------------------
dayjs.locale('pt-br');

interface Course {
  courseId?: number;
  name?: string;
  teamsCount?: number;
  isDeleted?: boolean;
}

interface CourseCsvRow {
  name: string;
}

// ----------------------------- Constantes/Funções fora do componente -----------------------------
const headerTranslations = {
  name: 'Nome do Programa',
};

const columns: Column<Course>[] = [
  { label: 'Id', field: 'courseId' },
  { label: 'Nome do Programa', field: 'name' },
  { label: 'Número de turmas', field: 'teamsCount', align: 'center' },
  {
    label: 'Status',
    field: 'isDeleted',
    align: 'center',
    render: (value) => (value ? 'Inativo' : 'Ativo'),
  },
];

const formatFieldName = (field: string): string => {
  const mapping: Record<string, string> = {
    name: 'Nome',
  };
  return mapping[field] || field;
};

const validateCourseForm = (course: { [k: string]: any }): string | null => {
  const requiredFields = ['name'];

  for (const field of requiredFields) {
    if (!course[field] || course[field].toString().trim() === '') {
      const message = `O campo "${formatFieldName(field)}" é obrigatório!`;
      toast.error(message);
      return message;
    }
  }

  return null;
};

// ----------------------------- Component -----------------------------
const Course: React.FC = () => {
  // ----------------------------- Estados (useState) -----------------------------
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseName, setCourseName] = useState('');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    course: null as Course | null,
    loading: false,
  });
  const [statusFilter, setStatusFilter] = useState<undefined | 'Inactive' | 'all'>(undefined);
  const [userUpdatedName, setUserUpdatedName] = useState<string | null>(null);
  const [auditDate, setAuditDate] = useState<Dayjs | undefined>(undefined);

  const [isUploadOpen, setUploadOpen] = useState(false);

  // ----------------------------- Refs (useRef) -----------------------------

  // ----------------------------- Instâncias de API (dentro do componente) -----------------------------
  const courseApi = new CoursesApi(apiConfig);
  const userApi = new UsersApi(apiConfig);

  // ----------------------------- Effects (useEffect) -----------------------------
  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  // ----------------------------- Funções internas -----------------------------
  const dialogTitle = () => {
    return isVisualizing
      ? 'Visualizar Programa'
      : editingCourse
        ? 'Editar Programa'
        : 'Novo Programa';
  };

  const fetchCourses = async (noFilter?: any, statusFilterParam?: string) => {
    try {
      setLoading(true);

      let filters: Filter[] = [];

      if (noFilter) filters = [];
      else
        filters = search.trim()
          ? [
              {
                propertyName: 'name',
                operation: Op.NUMBER_7,
                value: search,
              },
            ]
          : [];

      const listCourseRequest: ListCourseRequest = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        filters: filters,
        statusFilter: statusFilterParam,
      };

      const { data } = await courseApi.listCourse(listCourseRequest);

      if (data.items?.length === 0) {
        setNoDataMessage('Nenhum programa encontrado');
        setCourses([]);
        return;
      }

      setNoDataMessage('');
      setCourses((data.items as Course[]) || []);
      setTotalCount(data.totalItems || 0);
    } catch (error) {
      console.error('Erro ao carregar programas:', error);
      toast.error('Erro ao carregar programas');
      setCourses([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setPage(0);
    setSearch('');
    setStatusFilter(undefined);
    fetchCourses([]);
  };

  const handleSearch = () => {
    setPage(0);
    fetchCourses(false, statusFilter);
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setCourseName('');
    setOpenModal(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setCourseName(course.name ?? '');
    setOpenModal(true);
  };

  const handleView = async (course: Course) => {
    try {
      const id: number = course.courseId!;
      const { data } = await courseApi.getCourseById(id);

      const userId = data.updatedBy || data.createdBy;
      const date = data.updatedAt || data.createdAt;

      const { data: userData } = await userApi.getUserById(userId!);

      setUserUpdatedName(userData.name || null);
      setAuditDate(date ? dayjs(date) : undefined);
      setIsVisualizing(true);
      setCourseName(data.name || '');
      setOpenModal(true);
    } catch (error) {
      console.error('Erro ao visualizar programa:', error);
      toast.error('Erro ao carregar detalhes do programa');
    }
  };

  const handleDelete = async (course: Course) => {
    setConfirmDialog({
      open: true,
      course: course,
      loading: false,
    });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      course: null,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.course) return;

    try {
      setConfirmDialog((prev) => ({ ...prev, loading: true }));
      const id: number = confirmDialog.course.courseId!;
      await courseApi.deleteCourse(id);
      toast.success(`Programa "${confirmDialog.course.name}" excluído com sucesso!`);
      handleCloseConfirmDialog();
      fetchCourses([]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(', ') ||
        'Erro ao excluir programa';

      toast.error(message);

      console.error('Erro ao excluir programa:', error);
      setConfirmDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSave = async () => {
    if (validateCourseForm({ name: courseName }) !== null) return;

    console.log('Salvando curso:', { courseName });

    try {
      setModalLoading(true);
      console.log('Modal loading set to true');
      if (editingCourse) {
        const editCourseRequest: EditCourseRequest = {
          name: courseName,
        };
        console.log('Edit request:', editCourseRequest);
        const id: number = editingCourse.courseId!;

        await courseApi.editCourse(id, editCourseRequest);
        toast.success('Programa atualizado com sucesso!');
      } else {
        const createCourseRequest: CreateCourseRequest = {
          name: courseName,
        };

        await courseApi.createCourse(createCourseRequest);
        console.log('Create request:', createCourseRequest);
        toast.success('Programa criado com sucesso!');
      }

      handleCloseModal();
      fetchCourses([]);
    } catch (error) {
      console.error('Erro ao salvar programa:', error);
      toast.error('Erro ao salvar programa');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => {
      setEditingCourse(null);
      setIsVisualizing(false);
      setCourseName('');
    }, 300);
  };

  // CSV related functions
  const handleUploadCourse = () => {
    setUploadOpen(true);
  };

  const apiCreate = (data: CourseCsvRow) =>
    courseApi.createCourse({
      name: data.name,
    });

  // ----------------------------- return JSX -----------------------------
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
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Title */}
          <TitleAndButtons
            title="Listar Programas"
            onAdd={handleAdd}
            addLabel="Novo Programa"
            onImportCsv={handleUploadCourse}
            importLabel="Importar Programa"
          />

          {/* Filters */}
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
              {search && (
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

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <TextField
                label="Nome do Programa"
                variant="outlined"
                value={search}
                size="small"
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
              <FormGroup row sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={statusFilter === 'Inactive'}
                      onChange={() =>
                        setStatusFilter((prev) => (prev === 'Inactive' ? undefined : 'Inactive'))
                      }
                    />
                  }
                  label="Somente Inativos"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={statusFilter === 'all'}
                      onChange={() =>
                        setStatusFilter((prev) => (prev === 'all' ? undefined : 'all'))
                      }
                    />
                  }
                  label="Incluir Inativos"
                />
              </FormGroup>

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
            </Stack>
          </Paper>

          {/* Table */}
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
                <CircularProgress />
              </Box>
            ) : (
              <Table<Course>
                columns={columns}
                data={courses}
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

      {/* Modals */}
      <DialogPadronized
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        title={dialogTitle()}
        content={
          isVisualizing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                margin="dense"
                label="Nome do Programa"
                type="text"
                fullWidth
                variant="outlined"
                value={courseName}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                sx={{ pointerEvents: 'none' }}
              />

              <Divider sx={{ mt: 2 }} />

              <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                    {userUpdatedName?.[0] || '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Atualizado por
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {userUpdatedName || '—'}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccessTime fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Atualizado em
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {auditDate ? auditDate.format('DD/MM/YYYY HH:mm') : '—'}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="Nome do Programa*"
              type="text"
              fullWidth
              variant="outlined"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          )
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

      <ConfirmDialog
        open={confirmDialog.open}
        title="Excluir Programa"
        message="Tem certeza que deseja excluir o programa"
        highlightText={confirmDialog.course?.name}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        loading={confirmDialog.loading}
        danger={true}
      />

      {isUploadOpen && (
        <UploadCsvModal<CourseCsvRow>
          title="Importar Programa"
          onClose={() => setUploadOpen(false)}
          apiCreate={apiCreate}
          expectedHeaders={['name']}
          headerTranslations={headerTranslations}
          validateFields={validateCourseForm}
          onFinish={() => fetchCourses([])}
        />
      )}
    </LocalizationProvider>
  );
};

export default Course;
