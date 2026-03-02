import React, { useEffect, useMemo, useState } from 'react';
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
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Stack,
  Avatar,
  Divider,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import AccessTime from '@mui/icons-material/AccessTime';
import Table, { Column } from '@/components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { toast } from 'react-toastify';

import {
  PersonsApi,
  ListPersonRequest as ListPersonRequest,
  CreatePersonRequest as CreatePersonRequest,
  UpdatePersonRequest as UpdatePersonRequest,
  UsersApi,
} from '@/api';
import { apiConfig } from '@/services/auth';
import DialogPadronized from '@/components/DialogPadronized';
import { UploadCsvModal } from '@/components/UploadCsvModal';
import { PatternFormat } from 'react-number-format';
import { mask } from 'remask';
import dayjs, { Dayjs } from 'dayjs';

dayjs.locale('pt-br');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digits = (s: string) => (s || '').replace(/\D/g, '');

function isValidCPF(cpfRaw: string) {
  const cpf = digits(cpfRaw);
  if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const calc = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i++) total += parseInt(base[i], 10) * (factor - i);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calc(cpf.substring(0, 9), 10);
  const d2 = calc(cpf.substring(0, 10), 11);
  return d1 === parseInt(cpf[9], 10) && d2 === parseInt(cpf[10], 10);
}

function extractApiErrors(err: any): string[] {
  const messages: string[] = [];
  const data = err?.response?.data;

  if (!data) return ['Erro ao comunicar com o servidor.'];

  if (Array.isArray(data.errors)) {
    data.errors.forEach((m: any) => messages.push(String(m)));
  }

  if (
    !messages.length &&
    data.errors &&
    typeof data.errors === 'object' &&
    !Array.isArray(data.errors)
  ) {
    Object.values<any>(data.errors).forEach((arr) => {
      if (Array.isArray(arr)) arr.forEach((m) => messages.push(String(m)));
      else messages.push(String(arr));
    });
  }

  if (!messages.length && typeof data.error === 'string') messages.push(data.error);
  if (!messages.length && typeof data.message === 'string') messages.push(data.message);
  if (!messages.length && typeof data.detail === 'string') messages.push(data.detail);

  if (!messages.length && typeof data.title === 'string') messages.push(data.title);

  if (!messages.length && typeof data === 'string') messages.push(data);

  return messages.length ? messages : ['Ocorreu um erro.'];
}

interface PersonRow {
  personId?: number;
  name?: string;
  email?: string;
  personalDocumment?: string;
  primaryPhone?: string | null;
  isDeleted?: boolean;
}

const PersonPage: React.FC = () => {
  const api = useMemo(() => new PersonsApi(apiConfig), []);
  const userApi = useMemo(() => new UsersApi(apiConfig), []);

  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<PersonRow[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [education1, setEducation1] = useState('');
  const [education2, setEducation2] = useState('');
  const [professionalActivity, setProfessionalActivity] = useState('');

  // CSV import state
  const [isUploadOpen, setUploadOpen] = useState(false);

  // Status filter
  const [statusFilter, setStatusFilter] = useState<undefined | 'Inactive' | 'all'>(undefined);
  const [userUpdatedName, setUserUpdatedName] = useState<string | null>(null);
  const [auditDate, setAuditDate] = useState<Dayjs | undefined>(undefined);

  const nameError = !!name && !(name.trim().split(/\s+/).length >= 2);
  const cpfError = !!cpf && !isValidCPF(cpf);
  const emailError = !!email && !emailRegex.test(email.trim());
  const secEmailError = !!secondaryEmail && !emailRegex.test(secondaryEmail.trim());
  const phoneError = !!primaryPhone && digits(primaryPhone).length < 10; // aceita 10/11
  const secPhoneError =
    !!secondaryPhone && digits(secondaryPhone).length > 0 && digits(secondaryPhone).length < 10;

  const dialogTitle = () => {
    return isVisualizing ? 'Visualizar Pessoa' : editingId ? 'Editar Pessoa' : 'Nova Pessoa';
  };

  const formatPhoneMask = (phone: string) =>
    mask(phone ?? '', ['(99) 9999-9999', '(99) 99999-9999']);

  const columns: Column<PersonRow>[] = [
    { label: 'Id', field: 'personId', align: 'center' },
    { label: 'Nome', field: 'name', align: 'center' },
    { label: 'CPF', field: 'personalDocumment', align: 'center' },
    { label: 'E-mail', field: 'email', align: 'center' },
    {
      label: 'Telefone',
      field: 'primaryPhone',
      align: 'center',
      render: (value) => formatPhoneMask(value as string),
    },
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

  const fetchPeople = async (statusFilterParam?: string) => {
    try {
      setLoading(true);
      const req: ListPersonRequest = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        filters: search.trim()
          ? [
              {
                propertyName: 'name',
                operation: 7,
                value: search.trim(),
              } as any,
            ]
          : [],
        statusFilter: statusFilterParam,
      };
      const { data } = await api.listPerson(req);
      const items = (data as any)?.items || [];
      setRows(
        items.map((it: any) => ({
          personId: it.personId,
          name: it.name,
          email: it.email,
          personalDocumment: it.personalDocumment,
          primaryPhone: it.primaryPhone,
          isDeleted: it.isDeleted,
        }))
      );
      setTotalCount((data as any)?.totalItems ?? items.length);
      setNoDataMessage(items.length ? '' : 'Nenhuma pessoa encontrada');
    } catch (e) {
      toast.error('Erro ao carregar pessoas.');
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setIsVisualizing(false);
    setName('');
    setCpf('');
    setEmail('');
    setSecondaryEmail('');
    setPrimaryPhone('');
    setSecondaryPhone('');
    setEducation1('');
    setEducation2('');
    setProfessionalActivity('');
    setOpenModal(true);
  };

  // ----------------------------- CSV Import -----------------------------
  interface PersonCsvRow {
    name: string;
    personalDocumment: string; // CPF
    email: string;
    secondaryEmail?: string;
    primaryPhone: string;
    secondaryPhone?: string;
    education1?: string;
    education2?: string;
    professionalActivity?: string;
  }

  const PERSON_CSV_HEADERS: (keyof PersonCsvRow)[] = [
    'name',
    'personalDocumment',
    'email',
    'secondaryEmail',
    'primaryPhone',
    'secondaryPhone',
    'education1',
    'education2',
    'professionalActivity',
  ];

  const headerTranslations: Record<string, string> = {
    name: 'Nome completo*',
    personalDocumment: 'CPF*',
    email: 'E-mail*',
    secondaryEmail: 'Segundo e-mail',
    primaryPhone: 'Telefone principal*',
    secondaryPhone: 'Segundo telefone',
    education1: 'Formação',
    education2: 'Formação 2',
    professionalActivity: 'Atuação Profissional',
  };

  const handleUploadPerson = () => {
    setUploadOpen(true);
  };

  const validatePersonCsvForm = (p: PersonCsvRow): string | null => {
    const nm = (p.name || '').trim();
    const cpfVal = digits(p.personalDocumment || '');
    const mail = (p.email || '').trim();
    const secMail = (p.secondaryEmail || '').trim();
    const phone = digits(p.primaryPhone || '');
    const secPhone = digits(p.secondaryPhone || '');

    if (!nm) return 'O campo "Nome completo" é obrigatório!';
    if (nm.split(/\s+/).length < 2) return 'Nome inválido: informe nome e sobrenome.';
    if (!cpfVal) return 'O campo "CPF" é obrigatório!';
    if (!isValidCPF(cpfVal)) return 'CPF inválido.';
    if (!mail) return 'O campo "E-mail" é obrigatório!';
    if (!emailRegex.test(mail)) return 'E-mail inválido.';
    if (!phone) return 'O campo "Telefone principal" é obrigatório!';
    if (phone.length < 10)
      return 'Telefone principal inválido: informe DDD + número (10 ou 11 dígitos).';

    if (secMail && !emailRegex.test(secMail)) return 'Segundo e-mail inválido.';
    if (secPhone && secPhone.length > 0 && secPhone.length < 10)
      return 'Segundo telefone inválido: informe DDD + número (10 ou 11 dígitos) ou deixe vazio.';

    return null;
  };

  const apiCreate = (data: PersonCsvRow) => {
    const body: CreatePersonRequest = {
      name: (data.name || '').trim(),
      email: (data.email || '').trim(),
      personalDocumment: digits(data.personalDocumment || ''),
      secondaryEmail: (data.secondaryEmail || '').trim() || null,
      primaryPhone: digits(data.primaryPhone || ''),
      secondaryPhone: digits(data.secondaryPhone || '') || null,
      education1: (data.education1 || '').trim() || null,
      education2: (data.education2 || '').trim() || null,
      professionalActivity: (data.professionalActivity || '').trim() || null,
      isActive: true,
    } as CreatePersonRequest;

    return api.createPerson(body);
  };

  const handleView = async (p: PersonRow) => {
    try {
      const id = p.personId!;
      const { data } = await api.getPerson(id);
      const d: any = data;
      setEditingId(id);
      setIsVisualizing(true);
      setName(d.name ?? '');
      setCpf(d.personalDocumment ?? '');
      setEmail(d.email ?? '');
      setSecondaryEmail(d.secondaryEmail ?? '');
      setPrimaryPhone(d.primaryPhone ?? '');
      setSecondaryPhone(d.secondaryPhone ?? '');
      setEducation1(d.education1 ?? '');
      setEducation2(d.education2 ?? '');
      setProfessionalActivity(d.professionalActivity ?? '');

      if (d.updatedBy) {
        try {
          const userResp = await userApi.getUserById(d.updatedBy);
          setUserUpdatedName(userResp.data.name || 'Desconhecido');
        } catch {
          setUserUpdatedName('Desconhecido');
        }
      } else {
        setUserUpdatedName(null);
      }

      if (d.updatedAt) {
        setAuditDate(dayjs(d.updatedAt));
      } else {
        setAuditDate(undefined);
      }

      setOpenModal(true);
    } catch {
      toast.error('Erro ao carregar detalhes.');
    }
  };

  const handleEdit = async (p: PersonRow) => {
    try {
      const id = p.personId!;
      const { data } = await api.getPerson(id);
      const d: any = data;
      setEditingId(id);
      setIsVisualizing(false);
      setName(d.name ?? '');
      setCpf(d.personalDocumment ?? '');
      setEmail(d.email ?? '');
      setSecondaryEmail(d.secondaryEmail ?? '');
      setPrimaryPhone(d.primaryPhone ?? '');
      setSecondaryPhone(d.secondaryPhone ?? '');
      setEducation1(d.education1 ?? '');
      setEducation2(d.education2 ?? '');
      setProfessionalActivity(d.professionalActivity ?? '');
      setUserUpdatedName(null);
      setAuditDate(undefined);
      setOpenModal(true);
    } catch {
      toast.error('Erro ao carregar detalhes para edição.');
    }
  };

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    person: null as PersonRow | null,
    loading: false,
  });

  const handleDelete = (p: PersonRow) =>
    setConfirmDialog({ open: true, person: p, loading: false });

  const handleConfirmDelete = async () => {
    if (!confirmDialog.person?.personId) return;
    try {
      setConfirmDialog((s) => ({ ...s, loading: true }));
      await api.deletePerson(confirmDialog.person.personId);
      toast.success('Pessoa excluída com sucesso!');
      setConfirmDialog({ open: false, person: null, loading: false });
      fetchPeople();
    } catch (err) {
      extractApiErrors(err).forEach((m) => toast.error(m));
      setConfirmDialog((s) => ({ ...s, loading: false }));
    }
  };

  const handleCloseConfirmDialog = () =>
    setConfirmDialog({ open: false, person: null, loading: false });

  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast.error('O nome completo é obrigatório!');
      return false;
    }
    if (name.trim().split(/\s+/).length < 2) {
      toast.error('Nome inválido: informe nome e sobrenome!');
      return false;
    }
    if (!cpf.trim()) {
      toast.error('O CPF é obrigatório!');
      return false;
    }
    if (!isValidCPF(cpf)) {
      toast.error('CPF inválido!');
      return false;
    }
    if (!email.trim()) {
      toast.error('O e-mail é obrigatório!');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      toast.error('E-mail inválido!');
      return false;
    }
    if (!primaryPhone.trim()) {
      toast.error('O telefone principal é obrigatório!');
      return false;
    }
    if (digits(primaryPhone).length < 10) {
      toast.error('Telefone principal inválido: informe DDD + número (10 ou 11 dígitos)!');
      return false;
    }
    if (secondaryEmail && !emailRegex.test(secondaryEmail.trim())) {
      toast.error('Segundo e-mail inválido!');
      return false;
    }
    if (secondaryPhone && digits(secondaryPhone).length > 0 && digits(secondaryPhone).length < 10) {
      toast.error(
        'Segundo telefone inválido: informe DDD + número (10 ou 11 dígitos) ou deixe vazio!'
      );
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payloadBase = {
      name: name.trim(),
      email: email.trim(),
      personalDocumment: digits(cpf),
      secondaryEmail: secondaryEmail.trim() || null,
      primaryPhone: digits(primaryPhone) || null,
      secondaryPhone: digits(secondaryPhone) || null,
      education1: education1.trim() || null,
      education2: education2.trim() || null,
      professionalActivity: professionalActivity.trim() || null,
      isActive: true,
    };

    try {
      setModalLoading(true);

      if (editingId) {
        const body: UpdatePersonRequest = payloadBase as UpdatePersonRequest;
        await api.updatePerson(editingId, body);
        toast.success('Pessoa atualizada com sucesso!');
      } else {
        const body: CreatePersonRequest = payloadBase as CreatePersonRequest;
        await api.createPerson(body);
        toast.success('Pessoa criada com sucesso!');
      }

      handleCloseModal();
      fetchPeople();
    } catch (err) {
      extractApiErrors(err).forEach((m) => toast.error(m));
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => {
      setEditingId(null);
      setIsVisualizing(false);
      setUserUpdatedName(null);
      setAuditDate(undefined);
    }, 150);
  };

  const handleSearch = () => {
    setPage(0);
    fetchPeople(statusFilter);
  };
  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter(undefined);
    setUserUpdatedName(null);
    setAuditDate(undefined);
    setPage(0);
    fetchPeople(undefined);
  };

  useEffect(() => {
    fetchPeople(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  return (
    <Container
      maxWidth="xl"
      sx={{ minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}
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
          <TitleAndButtons
            title="Listar Pessoas"
            onAdd={openCreate}
            addLabel="Nova Pessoa"
            onImportCsv={handleUploadPerson}
            importLabel="Importar Pessoa"
          />

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
              {(search || statusFilter) && (
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
                label="Nome"
                variant="outlined"
                value={search}
                size="small"
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
              />
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center" sx={{ mb: 2 }}>
              <FormGroup row>
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
            </Stack>

            <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
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
              <Table<PersonRow>
                columns={columns}
                data={rows}
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

          {/* Modal */}

          <DialogPadronized
            open={openModal}
            onClose={handleCloseModal}
            maxWidth="md"
            title={dialogTitle()}
            content={
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    autoFocus={!isVisualizing}
                    margin="dense"
                    label="Nome completo*"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameError}
                    slotProps={{
                      input: {
                        readOnly: isVisualizing,
                      },
                    }}
                    sx={isVisualizing ? { pointerEvents: 'none' } : {}}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <PatternFormat
                    customInput={TextField}
                    margin="dense"
                    label="CPF*"
                    format="###.###.###-##"
                    mask="_"
                    fullWidth
                    variant="outlined"
                    value={cpf}
                    onChange={(e) => setCpf(digits(e.target.value))}
                    error={cpfError}
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
                    label="E-mail*"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
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
                    label="Segundo e-mail"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={secondaryEmail}
                    onChange={(e) => setSecondaryEmail(e.target.value)}
                    error={secEmailError}
                    slotProps={{
                      input: {
                        readOnly: isVisualizing,
                      },
                    }}
                    sx={isVisualizing ? { pointerEvents: 'none' } : {}}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <PatternFormat
                    customInput={TextField}
                    margin="dense"
                    label="Telefone principal*"
                    format="(##) #####-####"
                    mask="_"
                    fullWidth
                    variant="outlined"
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(digits(e.target.value))}
                    error={phoneError}
                    slotProps={{
                      input: {
                        readOnly: isVisualizing,
                      },
                    }}
                    sx={isVisualizing ? { pointerEvents: 'none' } : {}}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <PatternFormat
                    customInput={TextField}
                    margin="dense"
                    label="Telefone secundário"
                    format="(##) #####-####"
                    mask="_"
                    fullWidth
                    variant="outlined"
                    value={secondaryPhone}
                    onChange={(e) => setSecondaryPhone(digits(e.target.value))}
                    error={secPhoneError}
                    slotProps={{
                      input: {
                        readOnly: isVisualizing,
                      },
                    }}
                    sx={isVisualizing ? { pointerEvents: 'none' } : {}}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    margin="dense"
                    label="Formação"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={education1}
                    onChange={(e) => setEducation1(e.target.value)}
                    slotProps={{
                      input: {
                        readOnly: isVisualizing,
                      },
                    }}
                    sx={isVisualizing ? { pointerEvents: 'none' } : {}}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    margin="dense"
                    label="Formação 2"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={education2}
                    onChange={(e) => setEducation2(e.target.value)}
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
                    label="Atuação Profissional"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={professionalActivity}
                    onChange={(e) => setProfessionalActivity(e.target.value)}
                    slotProps={{
                      input: {
                        readOnly: isVisualizing,
                      },
                    }}
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

          <ConfirmDialog
            open={confirmDialog.open}
            title="Excluir Pessoa"
            message="Tem certeza que deseja excluir a pessoa"
            highlightText={confirmDialog.person?.name}
            confirmLabel="Excluir"
            cancelLabel="Cancelar"
            onClose={handleCloseConfirmDialog}
            onConfirm={handleConfirmDelete}
            loading={confirmDialog.loading}
            danger
          />

          {/* Upload CSV Modal */}
          {isUploadOpen && (
            <UploadCsvModal<PersonCsvRow>
              title="Importar Pessoa"
              onClose={() => setUploadOpen(false)}
              apiCreate={apiCreate}
              expectedHeaders={PERSON_CSV_HEADERS}
              headerTranslations={headerTranslations}
              validateFields={validatePersonCsvForm}
              onFinish={() => fetchPeople()}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PersonPage;
