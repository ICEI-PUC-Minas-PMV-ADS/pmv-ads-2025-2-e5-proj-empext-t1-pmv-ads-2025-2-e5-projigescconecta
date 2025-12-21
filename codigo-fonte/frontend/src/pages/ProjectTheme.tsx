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
  FormControlLabel,
  Switch,
  Grid,
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
  ProjectThemesApi,
  CreateProjectThemeRequest,
  EditProjectThemeRequest,
  ListProjectThemeRequest,
  Filter,
  Op,
  UsersApi,
} from './../api';
import { apiConfig } from '../services/auth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DialogPadronized from '@/components/DialogPadronized';
import dayjs, { Dayjs } from 'dayjs';

interface ProjectThemeRow {
  projectThemeId?: number;
  name?: string;
  isDeleted?: boolean;
}

const ProjectTheme: React.FC = () => {
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<ProjectThemeRow[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [editingRow, setEditingRow] = useState<ProjectThemeRow | null>(null);
  const [nameField, setNameField] = useState('');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [onlyDeleted, setOnlyDeleted] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    row: null as ProjectThemeRow | null,
    loading: false,
    mode: 'delete' as 'delete' | 'restore',
  });

  const [userUpdatedName, setUserUpdatedName] = useState<string | null>(null);
  const [auditDate, setAuditDate] = useState<Dayjs | undefined>(undefined);

  const api = new ProjectThemesApi(apiConfig);
  const userApi = new UsersApi(apiConfig);

  const dialogTitle = () => {
    return isVisualizing
      ? 'Visualizar Tema do Projeto'
      : editingRow
        ? 'Editar Tema do Projeto'
        : 'Adicionar Tema do Projeto';
  };

  const columns: Column<ProjectThemeRow>[] = [
    { label: 'Id', field: 'projectThemeId' },
    { label: 'Nome do Tema do Projeto', field: 'name' },
    {
      label: 'Status',
      field: 'isDeleted',
      align: 'center',
      render: (value) => (
        <Chip
          label={value ? 'Inativo' : 'Ativo'}
          size="small"
          color={value ? 'error' : 'success'}
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
  ];

  const buildFilters = (): Filter[] => {
    if (!search.trim()) return [];
    return [
      {
        propertyName: 'name',
        operation: Op.NUMBER_7, // contains
        value: search,
      },
    ];
  };

  const fetchList = async (noFilter?: boolean) => {
    try {
      setLoading(true);

      const filters = noFilter ? [] : buildFilters();

      const statusFilter: string | undefined = onlyDeleted
        ? 'Inactive'
        : includeDeleted
          ? 'all'
          : undefined;

      const body: ListProjectThemeRequest = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        filters,
        statusFilter,
      };

      const { data } = await api.listProjectTheme(body);
      console.log('Dados recebidos:', data);

      if (!data.items || data.items.length === 0) {
        setNoDataMessage('Nenhum Tema do Projeto encontrado');
        setRows([]);
        setTotalCount(0);
        return;
      }

      setNoDataMessage('');
      setRows((data.items as ProjectThemeRow[]) || []);
      setTotalCount(data.totalItems || 0);
    } catch (error) {
      console.error('Erro ao carregar Temas do Projeto:', error);
      toast.error('Erro ao carregar Temas do Projeto');
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

  const handleEdit = (row: ProjectThemeRow) => {
    if (row.isDeleted) {
      toast.info('Não é possível editar um Tema do Projeto excluído. Restaure-o primeiro.');
      return;
    }
    setEditingRow(row);
    setNameField(row.name ?? '');
    setOpenModal(true);
  };

  const handleView = async (row: ProjectThemeRow) => {
    try {
      const id: number = row.projectThemeId!;
      const { data } = await api.getProjectThemeById(id);

      const userId = data.updatedBy;
      const date = data.updatedAt || data.createdAt;

      if (userId) {
        const { data: userData } = await userApi.getUserById(userId);
        setUserUpdatedName(userData.name || null);
      } else {
        setUserUpdatedName(null);
      }

      setAuditDate(date ? dayjs(date) : undefined);

      setIsVisualizing(true);
      setNameField(data.name || '');
      setOpenModal(true);
    } catch (error) {
      console.error('Erro ao visualizar Tema do Projeto:', error);
      toast.error('Erro ao carregar detalhes');
    }
  };

  const openDelete = (row: ProjectThemeRow) => {
    setConfirmDialog({
      open: true,
      row,
      loading: false,
      mode: 'delete',
    });
  };

  const openRestore = (row: ProjectThemeRow) => {
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
      const id: number = confirmDialog.row.projectThemeId!;

      if (confirmDialog.mode === 'delete') {
        await api.deleteProjectTheme(id);
        toast.success(`Tema do Projeto "${confirmDialog.row.name}" excluído com sucesso!`);
      } else {
        await api.restoreProjectTheme(id);
        toast.success(`Tema do Projeto "${confirmDialog.row.name}" restaurado com sucesso!`);
      }

      handleCloseConfirmDialog();
      fetchList(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(', ') ||
        (confirmDialog.mode === 'delete'
          ? 'Erro ao excluir Tema do Projeto'
          : 'Erro ao restaurar Tema do Projeto');

      toast.error(message);
      console.error('Erro na ação:', error);
      setConfirmDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSave = async () => {
    if (!nameField.trim()) {
      toast.error('O nome do Tema do Projeto é obrigatório!');
      return;
    }

    try {
      setModalLoading(true);

      if (editingRow) {
        const payload: EditProjectThemeRequest = { name: nameField };
        await api.editProjectTheme(editingRow.projectThemeId!, payload);
        toast.success('Tema do Projeto atualizado com sucesso!');
      } else {
        const payload: CreateProjectThemeRequest = { name: nameField };
        await api.createProjectTheme(payload);
        toast.success('Tema do Projeto criado com sucesso!');
      }

      handleCloseModal();
      fetchList(true);
    } catch (error) {
      console.error('Erro ao salvar Tema do Projeto:', error);
      toast.error('Erro ao salvar Tema do Projeto');
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
      setUserUpdatedName(null);
      setAuditDate(undefined);
    }, 300);
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <TitleAndButtons
            title="Listar Temas do Projeto"
            onAdd={handleAdd}
            addLabel="Novo Tema do Projeto"
          />

          {/* Filtros */}
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
              <Typography
                variant="h6"
                sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '1.1rem' }}
              >
                Filtro de Busca
              </Typography>
              {(search || includeDeleted || onlyDeleted) && (
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
                label="Nome do Tema do Projeto"
                variant="outlined"
                value={search}
                size="small"
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
            </Box>
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              alignItems="center"
              sx={{ marginTop: 2 }}
            >
              <FormControlLabel
                control={
                  <Switch checked={includeDeleted} onChange={(_, v) => setIncludeDeleted(v)} />
                }
                label="Incluir excluídos"
              />
              <FormControlLabel
                control={
                  <Switch checked={onlyDeleted} onChange={(_, v) => handleOnlyDeletedToggle(v)} />
                }
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
              <Table<ProjectThemeRow>
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

      {/* Modal */}
      <DialogPadronized
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        title={dialogTitle()}
        content={
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                autoFocus={!isVisualizing}
                margin="dense"
                label="Nome do Tema do Projeto"
                type="text"
                fullWidth
                variant="outlined"
                value={nameField}
                onChange={(e) => setNameField(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
                slotProps={{ input: { readOnly: isVisualizing } }}
                sx={isVisualizing ? { pointerEvents: 'none' } : {}}
              />
            </Grid>

            {isVisualizing && (
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ mt: 4 }} />

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

      {/* Confirmação de Exclusão / Restauração */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={
          confirmDialog.mode === 'delete' ? 'Excluir Tema do Projeto' : 'Restaurar Tema do Projeto'
        }
        message={
          confirmDialog.mode === 'delete'
            ? 'Tem certeza que deseja excluir o Tema do Projeto'
            : 'Tem certeza que deseja restaurar o Tema do Projeto'
        }
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

export default ProjectTheme;
