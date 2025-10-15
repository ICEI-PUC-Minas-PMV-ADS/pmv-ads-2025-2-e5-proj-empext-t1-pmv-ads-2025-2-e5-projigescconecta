import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  alpha,
  Typography,
  Chip,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
} from './../api';
import { apiConfig } from '../services/auth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface Course {
  courseId?: number;
  name?: string;
  teamsCount?: number;
  isDeleted?: boolean;
}

const Course: React.FC = () => {
  /* ------------------------------ Variáveis ------------------------------ */

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

  const apiInstance = new CoursesApi(apiConfig);

  const dialogTitle = () => {
    return isVisualizing
      ? 'Visualizar Programa'
      : editingCourse
        ? 'Editar Programa'
        : 'Adicionar Programa';
  };

  const columns: Column<Course>[] = [
    { label: 'Id', field: 'courseId' },
    { label: 'Nome do Programa', field: 'name' },
    { label: 'Número de turmas', field: 'teamsCount', align: 'center' },
  ];

  /* --------------------------------- Funções -------------------------------- */

  const fetchCourses = async (noFilter?) => {
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
      };

      const { data } = await apiInstance.listCourse(listCourseRequest);

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
    fetchCourses([]);
  };

  const handleSearch = () => {
    setPage(0);
    fetchCourses();
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
      const { data } = await apiInstance.getCourseById(id);
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
      await apiInstance.deleteCourse(id);
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
    if (!courseName.trim()) {
      toast.error('O nome do programa é obrigatório!');
      return;
    }

    try {
      setModalLoading(true);

      if (editingCourse) {
        const editCourseRequest: EditCourseRequest = {
          name: courseName,
        };

        const id: number = editingCourse.courseId!;

        await apiInstance.editCourse(id, editCourseRequest);
        toast.success('Programa atualizado com sucesso!');
      } else {
        const createCourseRequest: CreateCourseRequest = {
          name: courseName,
        };

        await apiInstance.createCourse(createCourseRequest);
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

  useEffect(() => {
    fetchCourses();
  }, [page, rowsPerPage]);

  return (
    /* -------------------------------- Template -------------------------------- */
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
          <TitleAndButtons title="Listar Programas" onAdd={handleAdd} addLabel="Novo Programa" />

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

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
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

      {/* --------------------------------- Modais --------------------------------- */}

      {/* ------------------------- Criação/Edição ------------------------ */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
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
        <DialogContent sx={{ p: 3, mt: 1 }}>
          <TextField
            autoFocus={!isVisualizing}
            margin="dense"
            label="Nome do Programa"
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
            slotProps={{
              input: {
                readOnly: isVisualizing,
              },
            }}
            sx={isVisualizing ? { pointerEvents: 'none' } : {}}
          />
        </DialogContent>
        <DialogActions>
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
          )}
        </DialogActions>
      </Dialog>

      {/* -------------------- Confirmação de Exclusão -------------------- */}
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
    </LocalizationProvider>
  );
};

export default Course;
