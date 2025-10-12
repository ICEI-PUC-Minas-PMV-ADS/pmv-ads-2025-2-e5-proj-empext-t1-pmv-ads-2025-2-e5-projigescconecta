import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  alpha,
  CircularProgress,
  Grid,
} from '@mui/material';
import TitleAndButtons from '@/components/TitleAndButtons';
import Table, { Column } from '@/components/Table';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  UsersApi,
  type CreateUserRequest,
  type UpdateUserRequest,
  type ListUserRequest,
  type Filter,
  Op,
} from '@/api';
import { apiConfig } from '@/services/auth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface UserRow {
  userId?: number;
  name?: string;
  email?: string;
  role?: 'Admin' | 'Editor' | 'Viewer';
  phoneNumber?: string;
  isActive?: boolean;
}

const DEFAULT_PASSWORD = '123@Mudar';

const roleLabelToApi: Record<string, 'Admin' | 'Editor' | 'Viewer'> = {
  Administrador: 'Admin',
  Editor: 'Editor',
  Leitor: 'Viewer',
};

const roleApiToLabel: Record<'Admin' | 'Editor' | 'Viewer', string> = {
  Admin: 'Administrador',
  Editor: 'Editor',
  Viewer: 'Leitor',
};

const onlyDigits = (s: string) => s.replace(/\D/g, '');

function handleApiError(err: any, defaultMsg: string) {
  const status = err?.response?.status;
  if (status === 403) {
    toast.error('Usuário não tem permissão para essa função');
  } else if (status === 401) {
    toast.error('Sessão expirada ou inválida. Faça login novamente.');
  } else if (!status) {
    toast.error('Falha de conexão com o servidor.');
  } else {
    toast.error(defaultMsg);
  }
  // eslint-disable-next-line no-console
  console.error(defaultMsg, err);
}

const UserPage: React.FC = () => {
  const api = useMemo(() => new UsersApi(apiConfig), []);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');

  const [search, setSearch] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRoleLabel, setFormRoleLabel] = useState<'Administrador' | 'Editor' | 'Leitor'>('Leitor');
  const [modalLoading, setModalLoading] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; user: UserRow | null; loading: boolean }>({
    open: false,
    user: null,
    loading: false,
  });

  const columns: Column<UserRow>[] = [
    { label: 'ID', field: 'userId' },
    { label: 'Nome', field: 'name' },
    { label: 'Email', field: 'email' },
    { label: 'Tipo', field: 'role', align: 'center' },
    { label: 'Telefone', field: 'phoneNumber' },
  ];

  const fetchUsers = async (noFilter?: boolean) => {
    try {
      setLoading(true);

      let filters: Filter[] = [];
      if (!noFilter && search.trim()) {
        filters = [
          {
            propertyName: 'name',
            operation: Op.NUMBER_7,
            value: search.trim(),
          },
        ];
      }

      const req: ListUserRequest = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        filters,
      };

      const { data } = await api.listUser(req);
      const items = data.items ?? [];

      if (items.length === 0) {
        setNoDataMessage('Nenhum usuário encontrado');
        setUsers([]);
        setTotalCount(0);
        return;
      }

      const mapped = items.map((u) => ({
        ...u,
        role: u.role ? (u.role as 'Admin' | 'Editor' | 'Viewer') : undefined,
      }));

      setUsers(mapped);
      setTotalCount(data.totalItems || 0);
      setNoDataMessage('');
    } catch (err) {
      handleApiError(err, 'Erro ao carregar usuários');
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setPage(0);
    fetchUsers(true);
  };

  const handleSearch = () => {
    setPage(0);
    fetchUsers();
  };

  const openCreate = () => {
    setEditingUser(null);
    setIsViewing(false);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormRoleLabel('Leitor');
    setOpenModal(true);
  };

  const openEdit = async (row: UserRow) => {
    try {
      setModalLoading(true);
      setIsViewing(false);

      const id = row.userId!;
      const { data } = await api.getUserById(id);

      setEditingUser(data);
      setFormName(data.name ?? '');
      setFormEmail(data.email ?? '');
      setFormPhone(data.phoneNumber ?? '');
      setFormRoleLabel(
        roleApiToLabel[(data.role as 'Admin' | 'Editor' | 'Viewer') ?? 'Viewer'] as 'Administrador' | 'Editor' | 'Leitor',
      );

      setOpenModal(true);
    } catch (err) {
      handleApiError(err, 'Erro ao carregar usuário');
    } finally {
      setModalLoading(false);
    }
  };

  const openView = async (row: UserRow) => {
    try {
      setModalLoading(true);
      setIsViewing(true);

      const id = row.userId!;
      const { data } = await api.getUserById(id);

      setEditingUser(data);
      setFormName(data.name ?? '');
      setFormEmail(data.email ?? '');
      setFormPhone(data.phoneNumber ?? '');
      setFormRoleLabel(
        roleApiToLabel[(data.role as 'Admin' | 'Editor' | 'Viewer') ?? 'Viewer'] as 'Administrador' | 'Editor' | 'Leitor',
      );

      setOpenModal(true);
    } catch (err) {
      handleApiError(err, 'Erro ao visualizar usuário');
      setIsViewing(false);
    } finally {
      setModalLoading(false);
    }
  };

  const openDelete = (row: UserRow) => {
    setConfirmDelete({ open: true, user: row, loading: false });
  };

  const closeModal = () => {
    setOpenModal(false);
    setTimeout(() => {
      setIsViewing(false);
      setEditingUser(null);
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormRoleLabel('Leitor');
    }, 300);
  };

  const validateForm = (): boolean => {
    if (!formName.trim() || !formEmail.trim() || !formPhone.trim() || !formRoleLabel) {
      toast.error('Todos os campos são obrigatórios.');
      return false;
    }

    const nameParts = formName.trim().split(/\s+/);
    if (nameParts.length < 2) {
      toast.error('Informe nome e sobrenome.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail.trim())) {
      toast.error('Informe um e-mail válido.');
      return false;
    }

    const digits = onlyDigits(formPhone);
    if (digits.length < 11) {
      toast.error('Informe um telefone válido com DDD (11 dígitos).');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setModalLoading(true);

      const roleApi = roleLabelToApi[formRoleLabel];

      if (editingUser) {
        const req: UpdateUserRequest = {
          userId: editingUser.userId!,
          name: formName.trim(),
          email: formEmail.trim(),
          phoneNumber: onlyDigits(formPhone),
          role: roleApi,
          isActive: true,
        };
        await api.updateUser(editingUser.userId!, req);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        const req: CreateUserRequest = {
          name: formName.trim(),
          email: formEmail.trim(),
          phoneNumber: onlyDigits(formPhone),
          role: roleApi,
          password: DEFAULT_PASSWORD,
        };
        await api.createUser(req);
        toast.success('Usuário criado com sucesso!');
      }

      closeModal();
      fetchUsers();
    } catch (err) {
      handleApiError(err, 'Erro ao salvar usuário');
    } finally {
      setModalLoading(false);
    }
  };

  const confirmRemove = async () => {
    if (!confirmDelete.user?.userId) return;

    try {
      setConfirmDelete((prev) => ({ ...prev, loading: true }));
      await api.deleteUser(confirmDelete.user.userId);
      toast.success('Usuário excluído com sucesso!');
      setConfirmDelete({ open: false, user: null, loading: false });
      fetchUsers();
    } catch (err) {
      handleApiError(err, 'Erro ao excluir usuário');
      setConfirmDelete((prev) => ({ ...prev, loading: false }));
    }
  };

  const dialogTitle = () => (isViewing ? 'Visualizar Usuário' : editingUser ? 'Editar Usuário' : 'Adicionar Usuário');

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

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
            <TitleAndButtons title="Lista de Usuários" onAdd={openCreate} addLabel="Novo Usuário" />

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
                <SearchIcon sx={{ color: '#1E4EC4', fontSize: '1.25rem' }} />
                <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '1.1rem' }}>
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
                  label="Nome do usuário"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                  onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
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
                    '&:hover': { bgcolor: '#1640a8' },
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
                    '&:hover': { borderColor: '#1E4EC4', bgcolor: alpha('#1E4EC4', 0.05) },
                  }}
                >
                  Limpar Filtros
                </Button>
              </Box>
            </Paper>

            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <CircularProgress sx={{ color: '#1E4EC4' }} />
                </Box>
              ) : (
                <Table<UserRow>
                  columns={columns}
                  data={users.map((u) => ({
                    ...u,
                    role: u.role ? (roleApiToLabel[u.role] as any) : undefined,
                  }))}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalCount={totalCount}
                  onPageChange={setPage}
                  onRowsPerPageChange={setRowsPerPage}
                  onView={openView}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  noDataMessage={noDataMessage}
                />
              )}
            </Box>

            <Dialog
              open={openModal}
              onClose={closeModal}
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

              <DialogContent sx={{ p: 3 }}>
                {modalLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: '#1E4EC4' }} />
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Nome"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{ readOnly: isViewing }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="E-mail"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{ readOnly: isViewing }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Telefone"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{ readOnly: isViewing }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="role-label">Tipo</InputLabel>
                        <Select
                          labelId="role-label"
                          label="Tipo"
                          value={formRoleLabel}
                          onChange={(e) => setFormRoleLabel(e.target.value as 'Administrador' | 'Editor' | 'Leitor')}
                          disabled={isViewing}
                        >
                          <MenuItem value="Administrador">Administrador</MenuItem>
                          <MenuItem value="Editor">Editor</MenuItem>
                          <MenuItem value="Leitor">Leitor</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
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
                {isViewing ? (
                  <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={closeModal}
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
                      onClick={closeModal}
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

            <ConfirmDialog
              open={confirmDelete.open}
              title="Excluir Usuário"
              message="Tem certeza que deseja excluir o usuário?"
              highlightText={confirmDelete.user?.name}
              confirmLabel="Excluir"
              cancelLabel="Cancelar"
              onClose={() => setConfirmDelete({ open: false, user: null, loading: false })}
              onConfirm={confirmRemove}
              loading={confirmDelete.loading}
              danger
            />
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default UserPage;
