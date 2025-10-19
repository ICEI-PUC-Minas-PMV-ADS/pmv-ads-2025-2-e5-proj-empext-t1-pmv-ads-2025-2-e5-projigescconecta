import React, { useEffect, useMemo, useState } from 'react';
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
import SearchIcon from '@mui/icons-material/Search';
import Table, { Column } from '@/components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { toast } from 'react-toastify';
import axios from 'axios';

import {
  PersonsApi,
  IgescConectaAPIFeaturesPersonsListPersonListPersonRequest as ListPersonRequest,
  IgescConectaAPIFeaturesPersonsCreatePersonCreatePersonRequest as CreatePersonRequest,
  IgescConectaAPIFeaturesPersonsUpdatePersonUpdatePersonRequest as UpdatePersonRequest,
} from '@/api';
import { apiConfig } from '@/services/auth';
import DialogPadronized from '@/components/DialogPadronized';

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
  isActive?: boolean;
}

const PersonPage: React.FC = () => {
  const api = useMemo(() => new PersonsApi(apiConfig), []);

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

  const nameError = !!name && !(name.trim().split(/\s+/).length >= 2);
  const cpfError = !!cpf && !isValidCPF(cpf);
  const emailError = !!email && !emailRegex.test(email.trim());
  const secEmailError = !!secondaryEmail && !emailRegex.test(secondaryEmail.trim());
  const phoneError = !!primaryPhone && digits(primaryPhone).length < 10; // aceita 10/11
  const secPhoneError =
    !!secondaryPhone && digits(secondaryPhone).length > 0 && digits(secondaryPhone).length < 10;

  const dialogTitle = () => {
    return isVisualizing ? 'Visualizar Pessoa' : editingId ? 'Editar Pessoa' : 'Adicionar Pessoa';
  };
  const formValid =
    name.trim().length > 0 &&
    !nameError &&
    cpf.trim().length > 0 &&
    !cpfError &&
    email.trim().length > 0 &&
    !emailError &&
    primaryPhone.trim().length > 0 &&
    !phoneError &&
    !secEmailError &&
    !secPhoneError;

  const columns: Column<PersonRow>[] = [
    { label: 'Id', field: 'personId', width: 80 },
    { label: 'Nome', field: 'name' },
    { label: 'CPF', field: 'personalDocumment', width: 140 },
    { label: 'E-mail', field: 'email' },
    { label: 'Telefone', field: 'primaryPhone', width: 140 },
    {
      label: 'Status',
      field: 'isActive',
      align: 'center',
      render: (p) => (
        <Chip
          size="small"
          label={p.isActive ? 'Ativo' : 'Inativo'}
          color={p.isActive ? 'success' : 'default'}
          variant="outlined"
        />
      ),
      width: 120,
    },
  ];

  const fetchPeople = async () => {
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
      };
      const { data } = await api.listPerson({
        igescConectaAPIFeaturesPersonsListPersonListPersonRequest: req,
      });
      const items = (data as any)?.items || [];
      setRows(
        items.map((it: any) => ({
          personId: it.personId,
          name: it.name,
          email: it.email,
          personalDocumment: it.personalDocumment,
          primaryPhone: it.primaryPhone,
          isActive: it.isActive,
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

  const handleSave = async () => {
    if (!formValid) {
      toast.error('Dados inválidos. Verifique os campos.');
      return;
    }

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
    }, 150);
  };

  const handleSearch = () => {
    setPage(0);
    fetchPeople();
  };
  const handleClearFilters = () => {
    setSearch('');
    setPage(0);
    fetchPeople();
  };

  useEffect(() => {
    fetchPeople();
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
          <TitleAndButtons title="Listar Pessoas" onAdd={openCreate} addLabel="Nova Pessoa" />

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
                label="Nome"
                variant="outlined"
                value={search}
                size="small"
                onChange={(e) => setSearch(e.target.value)}
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
                }}
              >
                Limpar Filtros
              </Button>
            </Box>
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
              <Box
                sx={{
                  mt: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                  gap: 1,
                }}
              >
                <TextField
                  label="Nome completo"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={nameError}
                  helperText={nameError ? 'Informe nome e sobrenome.' : ' '}
                  slotProps={{ input: { readOnly: isVisualizing } }}
                />
                <TextField
                  label="CPF (apenas números)"
                  fullWidth
                  value={cpf}
                  onChange={(e) => setCpf(digits(e.target.value))}
                  error={cpfError}
                  helperText={cpfError ? 'CPF inválido.' : ' '}
                  inputProps={{ inputMode: 'numeric' }}
                  slotProps={{ input: { readOnly: isVisualizing } }}
                />
                <TextField
                  label="E-mail"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  helperText={emailError ? 'E-mail inválido.' : ' '}
                  slotProps={{ input: { readOnly: isVisualizing } }}
                />

                <TextField
                  label="Segundo e-mail (opcional)"
                  fullWidth
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  error={secEmailError}
                  helperText={secEmailError ? 'E-mail inválido.' : ' '}
                  slotProps={{ input: { readOnly: isVisualizing } }}
                />
                <TextField
                  label="Telefone principal (apenas números)"
                  fullWidth
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(digits(e.target.value))}
                  error={phoneError}
                  helperText={phoneError ? 'Informe DDD + número (10 ou 11 dígitos).' : ' '}
                  inputProps={{ inputMode: 'numeric' }}
                  slotProps={{ input: { readOnly: isVisualizing } }}
                />
                <TextField
                  label="Segundo telefone (opcional)"
                  fullWidth
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(digits(e.target.value))}
                  error={secPhoneError}
                  helperText={
                    secPhoneError ? 'Informe DDD + número (10 ou 11 dígitos) ou deixe vazio.' : ' '
                  }
                  inputProps={{ inputMode: 'numeric' }}
                  slotProps={{ input: { readOnly: isVisualizing } }}
                />

                <TextField
                  label="Formação (opcional)"
                  fullWidth
                  value={education1}
                  onChange={(e) => setEducation1(e.target.value)}
                  slotProps={{ input: { readOnly: isVisualizing } }}
                />
                <TextField
                  label="Formação 2 (opcional)"
                  fullWidth
                  value={education2}
                  onChange={(e) => setEducation2(e.target.value)}
                  slotProps={{ input: { readOnly: isVisualizing } }}
                />
                <TextField
                  label="Atuação Profissional (opcional)"
                  fullWidth
                  value={professionalActivity}
                  onChange={(e) => setProfessionalActivity(e.target.value)}
                  slotProps={{ input: { readOnly: isVisualizing } }}
                />
              </Box>
            }
            actions={
              isVisualizing ? (
                <Button
                  variant="contained"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleCloseModal}
                  sx={{ bgcolor: '#6b7280', '&:hover': { bgcolor: '#4b5563' } }}
                >
                  Voltar
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleCloseModal}
                    disabled={modalLoading}
                    sx={{ color: '#6b7280' }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={modalLoading || !formValid}
                    startIcon={modalLoading ? <CircularProgress size={20} /> : null}
                    sx={{ bgcolor: '#1E4EC4', '&:disabled': { bgcolor: alpha('#1E4EC4', 0.5) } }}
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
        </Box>
      </Paper>
    </Container>
  );
};

export default PersonPage;
