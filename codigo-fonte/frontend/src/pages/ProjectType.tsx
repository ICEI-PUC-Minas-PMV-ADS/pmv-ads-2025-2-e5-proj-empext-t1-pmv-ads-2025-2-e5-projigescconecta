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
  FormControlLabel,
  Switch,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '../components/ConfirmDelete';
import { toast } from 'react-toastify';

import {
  ProjectTypesApi,
  CreateProjectTypeRequest,
  EditProjectTypeRequest,
  ListProjectTypeRequest,
  Filter,
  Op,
} from './../api';
import { apiConfig } from '../services/auth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DialogPadronized from '@/components/DialogPadronized';

interface ProjectTypeRow {
  projectTypeId?: number;
  name?: string;
  isDeleted?: boolean;
}

const ProjectType: React.FC = () => {

  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<ProjectTypeRow[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [editingRow, setEditingRow] = useState<ProjectTypeRow | null>(null);
  const [nameField, setNameField] = useState('');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [onlyDeleted, setOnlyDeleted] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    row: null as ProjectTypeRow | null,
    loading: false,
    mode: 'delete' as 'delete' | 'restore',
  });

  const api = new ProjectTypesApi(apiConfig);

  const dialogTitle = () => {
    return isVisualizing
      ? 'Visualizar Tipo do Projeto'
      : editingRow
        ? 'Editar Tipo do Projeto'
        : 'Adicionar Tipo do Projeto';
  };

  const columns: Column<ProjectTypeRow>[] = [
    { label: 'Id', field: 'projectTypeId' },
    { label: 'Nome do Tipo do Projeto', field: 'name' },
  ];

  const buildFilters = (): Filter[] => {
    if (!search.trim()) return [];
    return [
      {
        propertyName: 'name',
        operation: Op.NUMBER_7,
        value: search,
      },
    ];
  };

  const fetchList = async (noFilter?: boolean) => {
    try {
      setLoading(true);

      const filters = noFilter ? [] : buildFilters();

      const body: ListProjectTypeRequest = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        filters,
        includeDeleted,
        onlyDeleted,
      };

      const { data } = await api.listProjectType(body);

      if (!data.items || data.items.length === 0) {
        setNoDataMessage('Nenhum Tipo do Projeto encontrado');
        setRows([]);
        setTotalCount(0);
        return;
      }

      setNoDataMessage('');
      setRows((data.items as ProjectTypeRow[]) || []);
      setTotalCount(data.totalItems || 0);
    } catch (error) {
      console.error('Erro ao carregar Tipos do Projeto:', error);
      toast.error('Erro ao carregar Tipos do Projeto');
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setPage(0);
    setSearch('');
    setIncludeDeleted(false);
    setOnlyDeleted(false);
    fetchList(true);
  };

  const handleSearch = () => {
    setPage(0);
    fetchList();
  };

  const handleAdd = () => {
    setEditingRow(null);
    setNameField('');
    setOpenModal(true);
  };

  const handleEdit = (row: ProjectTypeRow) => {
    if (row.isDeleted) {
      toast.info('Não é possível editar um Tipo do Projeto excluído. Restaure-o primeiro.');
      return;
    }
    setEditingRow(row);
    setNameField(row.name ?? '');
    setOpenModal(true);
  };

  const handleView = async (row: ProjectTypeRow) => {
    try {
      const id: number = row.projectTypeId!;
      const { data } = await api.getProjectTypeById(id);
      setIsVisualizing(true);
      setNameField(data.name || '');
      setOpenModal(true);
    } catch (error) {
      console.error('Erro ao visualizar Tipo do Projeto:', error);
      toast.error('Erro ao carregar detalhes');
    }
  };

  const openDelete = (row: ProjectTypeRow) => {
    setConfirmDialog({
      open: true,
      row,
      loading: false,
      mode: 'delete',
    });
  };

  const openRestore = (row: ProjectTypeRow) => {
    setConfirmDialog({
      open: true,
      row,
      loading: false,
      mode: 'restore',
    });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      row: null,
      loading: false,
      mode: 'delete',
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.row) return;

    try {
      setConfirmDialog((prev) => ({ ...prev, loading: true }));
      const id: number = confirmDialog.row.projectTypeId!;

      if (confirmDialog.mode === 'delete') {
        await api.deleteProjectType(id);
        toast.success(`Tipo do Projeto "${confirmDialog.row.name}" excluído com sucesso!`);
      } else {
        await api.restoreProjectType(id);
        toast.success(`Tipo do Projeto "${confirmDialog.row.name}" restaurado com sucesso!`);
      }

      handleCloseConfirmDialog();
      fetchList(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(', ') ||
        (confirmDialog.mode === 'delete'
          ? 'Erro ao excluir Tipo do Projeto'
          : 'Erro ao restaurar Tipo do Projeto');

      toast.error(message);
      console.error('Erro na ação:', error);
      setConfirmDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSave = async () => {
    if (!nameField.trim()) {
      toast.error('O nome do Tipo do Projeto é obrigatório!');
      return;
    }

    try {
      setModalLoading(true);

      if (editingRow) {
        const payload: EditProjectTypeRequest = { name: nameField };
        await api.editProjectType(editingRow.projectTypeId!, payload);
        toast.success('Tipo do Projeto atualizado com sucesso!');
      } else {
        const payload: CreateProjectTypeRequest = { name: nameField };
        await api.createProjectType(payload);
        toast.success('Tipo do Projeto criado com sucesso!');
      }

      handleCloseModal();
      fetchList(true);
    } catch (error) {
      console.error('Erro ao salvar Tipo do Projeto:', error);
      toast.error('Erro ao salvar Tipo do Projeto');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => {
      setEditingRow(null);
      setIsVisualizing(false);
      setNameField('');
    }, 300);
  };

  useEffect(() => {
    fetchList();
  }, [page, rowsPerPage, includeDeleted, onlyDeleted]);

  const handleOnlyDeletedToggle = (value: boolean) => {
    setOnlyDeleted(value);
    if (value) setIncludeDeleted(true);
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
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <TitleAndButtons title="Listar Tipos do Projeto" onAdd={handleAdd} addLabel="Novo Tipo do Projeto" />

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
                Filtro de Busca
              </Typography>
              {(search || includeDeleted || onlyDeleted) && (
                <Chip
                  label="Filtros ativos"
                  size="small"
                  sx={{ ml: 1, bgcolor: alpha('#1E4EC4', 0.1), color: '#1E4EC4', fontWeight: 600, fontSize: '0.75rem' }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                label="Nome do Tipo do Projeto"
                variant="outlined"
                value={search}
                size="small"
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={(e) => { if (e.key === 'Enter') handleSearch(); }}
              />
              <FormControlLabel
                control={<Switch checked={includeDeleted} onChange={(_, v) => setIncludeDeleted(v)} />}
                label="Incluir excluídos"
              />
              <FormControlLabel
                control={<Switch checked={onlyDeleted} onChange={(_, v) => handleOnlyDeletedToggle(v)} />}
                label="Somente excluídos"
              />
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{
                  bgcolor: '#1E4EC4',
                  color: 'white',
                  fontWeight: 600,
                  px: 3, py: 1, borderRadius: 1.5, textTransform: 'none', fontSize: '0.95rem',
                  boxShadow: '0 2px 8px rgba(30, 78, 196, 0.25)',
                  '&:hover': { bgcolor: '#1640a8', boxShadow: '0 4px 12px rgba(30, 78, 196, 0.35)', transform: 'translateY(-1px)' },
                  transition: 'all 0.2s ease',
                }}
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                sx={{
                  borderColor: alpha('#1E4EC4', 0.3), color: '#1E4EC4', fontWeight: 600,
                  px: 4, py: 1, borderRadius: 1.5, textTransform: 'none', fontSize: '0.95rem',
                  '&:hover': { borderColor: '#1E4EC4', bgcolor: alpha('#1E4EC4', 0.05), borderWidth: 1.5 },
                  transition: 'all 0.2s ease',
                }}
              >
                Limpar Filtros
              </Button>
            </Box>
          </Paper>

          <Box sx={{ flexGrow: 1 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table<ProjectTypeRow>
                columns={columns}
                data={rows}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={openDelete}
                onRestore={openRestore} 
                noDataMessage={noDataMessage}
              />
            )}
          </Box>
        </Paper>
      </Container>

      <DialogPadronized
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        title={dialogTitle()}
        content={
          <TextField
            autoFocus={!isVisualizing}
            margin="dense"
            label="Nome do Tipo do Projeto"
            type="text"
            fullWidth
            variant="outlined"
            value={nameField}
            onChange={(e) => setNameField(e.target.value)}
            onKeyUp={(e) => { if (e.key === 'Enter') handleSave(); }}
            slotProps={{ input: { readOnly: isVisualizing } }}
            sx={isVisualizing ? { pointerEvents: 'none' } : {}}
          />
        }
        actions={
          isVisualizing ? (
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleCloseModal}
              sx={{ bgcolor: '#6b7280', color: 'white', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5, textTransform: 'none',
                '&:hover': { bgcolor: '#4b5563', transform: 'translateY(-1px)' }, transition: 'all 0.2s ease' }}
            >
              Voltar
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseModal} disabled={modalLoading} sx={{ color: '#6b7280', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5, textTransform: 'none',
                '&:hover': { bgcolor: alpha('#6b7280', 0.1) } }}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={modalLoading}
                startIcon={modalLoading ? <CircularProgress size={20} /> : null}
                sx={{ bgcolor: '#1E4EC4', color: 'white', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5, textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(30, 78, 196, 0.25)',
                  '&:hover': { bgcolor: '#1640a8', boxShadow: '0 4px 12px rgba(30, 78, 196, 0.35)', transform: 'translateY(-1px)' },
                  '&:disabled': { bgcolor: alpha('#1E4EC4', 0.5) }, transition: 'all 0.2s ease' }}
              >
                Salvar
              </Button>
            </>
          )
        }
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.mode === 'delete' ? 'Excluir Tipo do Projeto' : 'Restaurar Tipo do Projeto'}
        message={confirmDialog.mode === 'delete'
          ? 'Tem certeza que deseja excluir o Tipo do Projeto'
          : 'Tem certeza que deseja restaurar o Tipo do Projeto'}
        highlightText={confirmDialog.row?.name}
        confirmLabel={confirmDialog.mode === 'delete' ? 'Excluir' : 'Restaurar'}
        cancelLabel="Cancelar"
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmAction}
        loading={confirmDialog.loading}
        danger={confirmDialog.mode === 'delete'}
      />
    </LocalizationProvider>
  );
};

export default ProjectType;