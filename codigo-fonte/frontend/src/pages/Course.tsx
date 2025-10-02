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
// Interface para os dados do curso
interface Course {
  id?: number;
  name?: string;
  isDeleted?: boolean;
}

const Course: React.FC = () => {
  // Estados principais
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);

  // Estados da tabela
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Estados do modal
  const [openModal, setOpenModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseName, setCourseName] = useState('');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');

  const dialogTitle = () => {
    return isVisualizing ? 'Visualizar Curso' : editingCourse ? 'Editar Curso' : 'Novo Curso';
  };

  // Estados de loading
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Configuração da API

  const apiInstance = new CoursesApi(apiConfig);

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  // Função para buscar cursos da API
  const fetchCourses = async () => {
    try {
      setLoading(true);

      // Monta o filtro de busca por nome se houver texto
      const filters: Filter[] = search.trim()
        ? [
            {
              propertyName: 'name',
              operation: Op.NUMBER_7, // Contains
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
        setNoDataMessage('Nenhum curso encontrado');
        setCourses([])
        return;
      }

      setNoDataMessage('')
      setCourses(data.items || []);
      setTotalCount(data.totalItems || 0);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      toast.error('Erro ao carregar cursos');
      setCourses([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Definição das colunas da tabela
  const columns: Column<Course>[] = [
    { label: 'ID', field: 'id' },
    { label: 'Nome do Curso', field: 'name' },
  ];

  // Função de pesquisa
  const handleSearch = () => {
    setPage(0);
    fetchCourses();
  };

  // Função para abrir modal de criação
  const handleAdd = () => {
    setEditingCourse(null);
    setCourseName('');
    setOpenModal(true);
  };

  // Função para abrir modal de edição
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setCourseName(course.name ?? '');
    setOpenModal(true);
  };

  // Função para visualizar
  const handleView = async (course: Course) => {
    try {
      const id: number = course.id!;
      const { data } = await apiInstance.getCourseById(id);
      setIsVisualizing(true);
      setCourseName(data.name || '');
      setOpenModal(true);
    } catch (error) {
      console.error('Erro ao visualizar curso:', error);
      toast.error('Erro ao carregar detalhes do curso');
    }
  };

  // Função para deletar
  const handleDelete = async (course: Course) => {
    try {
      const id: number = course.id!;
      await apiInstance.deleteCourse(id);
      toast.success(`Curso "${course.name}" excluído com sucesso!`);
      fetchCourses();
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      toast.error('Erro ao excluir curso');
    }
  };

  // Função para salvar (criar ou editar)
  const handleSave = async () => {
    if (!courseName.trim()) {
      toast.error('O nome do curso é obrigatório!');
      return;
    }

    try {
      setModalLoading(true);

      if (editingCourse) {
        // Editar curso existente
        const editCourseRequest: EditCourseRequest = {
          name: courseName,
        };

        const id: number = editingCourse.id!;

        await apiInstance.editCourse(id, editCourseRequest);
        toast.success('Curso atualizado com sucesso!');
      } else {
        // Criar novo curso
        const createCourseRequest: CreateCourseRequest = {
          name: courseName,
        };

        await apiInstance.createCourse(createCourseRequest);
        toast.success('Curso criado com sucesso!');
      }

      handleCloseModal();
      fetchCourses();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      toast.error('Erro ao salvar curso');
    } finally {
      setModalLoading(false);
    }
  };

  // Função para fechar modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => {
      setEditingCourse(null);
      setIsVisualizing(false);
      setCourseName('');
    }, 300); //espera dialog fechar para resetar os estados
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
            <TitleAndButtons title="Listar Cursos" onAdd={handleAdd} addLabel="Novo Curso" />

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
                  label="Nome do Curso"
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
