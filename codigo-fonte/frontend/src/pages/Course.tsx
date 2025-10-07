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
import SearchIcon from '@mui/icons-material/Search';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
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
  id?: number;
  name?: string;
  isDeleted?: boolean;
}

const Course: React.FC = () => {
  // ==================== ESTADOS REATIVOS ====================
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

  // ==================== COMPUTED/MEMOIZED ====================
  const apiInstance = new CoursesApi(apiConfig);

  const dialogTitle = () => {
    return isVisualizing
      ? 'Visualizar Programa'
      : editingCourse
        ? 'Editar Programa'
        : 'Novo Programa';
  };

  const columns: Column<Course>[] = [
    { label: 'ID', field: 'id' },
    { label: 'Nome do Programa', field: 'name' },
  ];

  // ==================== FUNCTIONS ====================
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const filters: Filter[] = search.trim()
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
      setCourses(data.items || []);
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
      const id: number = course.id!;
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
    try {
      const id: number = course.id!;
      await apiInstance.deleteCourse(id);
      toast.success(`Programa "${course.name}" excluído com sucesso!`);
      fetchCourses();
    } catch (error) {
      console.error('Erro ao excluir programa:', error);
      toast.error('Erro ao excluir programa');
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

        const id: number = editingCourse.id!;

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
      fetchCourses();
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

  // ==================== EFFECTS (onMount/watch) ====================
  useEffect(() => {
    fetchCourses();
  }, [page, rowsPerPage]);

  // ==================== RENDER ====================
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
                  Filtros de Busca
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
                  label="Buscar por nome"
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

            {/* Modal de Criação/Edição */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
              <DialogTitle>{dialogTitle()}</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
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
                    color="secondary"
                    sx={{ backgroundColor: 'gray' }}
                  >
                    Voltar
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleCloseModal} color="secondary" disabled={modalLoading}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      color="primary"
                      variant="contained"
                      disabled={modalLoading}
                      startIcon={modalLoading ? <CircularProgress size={20} /> : null}
                    >
                      {modalLoading ? 'Salvando...' : editingCourse ? 'Atualizar' : 'Criar'}
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

export default Course;
