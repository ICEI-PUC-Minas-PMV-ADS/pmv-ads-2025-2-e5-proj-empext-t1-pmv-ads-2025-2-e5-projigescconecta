import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Divider,
  TextField,
  Paper,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import Table, { Column } from '@/components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { toast } from 'react-toastify';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { apiConfig } from '@/services/auth';
import {
  DonationApi,
  PersonsApi,
  CompanyApi,
  OscsApi,
  CoursesApi,
  TeamsApi,
  type CreateDonationCommand,
  type UpdateDonationCommand,
  type DonationViewModel,
  type PersonListItemViewModel,
  type CompanyViewModel,
  type OscViewModel,
  type CourseViewModel,
  type ListTeamItemViewModel,
  type Filter,
  Op,
} from '@/api';
import DialogPadronized from '@/components/DialogPadronized';

dayjs.locale('pt-br');

interface DonationFullDetails {
  id?: number;
  value?: number;
  donationDate?: string;
  personId?: number | null;
  companyId?: number | null;
  oscId?: number | null;
  courseId?: number | null;
  teamId?: number | null;
}

const columns: Column<any>[] = [
  { label: 'ID', field: 'id' },
  { label: 'Valor', field: 'value' },
  { label: 'Data', field: 'donationDate' },
  { label: 'Doador', field: 'doadorNome' },
  { label: 'Destino', field: 'destinoNome' },
];

type DoadorType = 'Pessoa' | 'Empresa';
type DestinoType = 'OSC' | 'Team' | 'Nenhum';

const DonationPage: React.FC = () => {
  const donationApi = useMemo(() => new DonationApi(apiConfig), []);
  const peopleApi = useMemo(() => new PersonsApi(apiConfig), []);
  const companiesApi = useMemo(() => new CompanyApi(apiConfig), []);
  const oscsApi = useMemo(() => new OscsApi(apiConfig), []);
  const coursesApi = useMemo(() => new CoursesApi(apiConfig), []);
  const teamsApi = useMemo(() => new TeamsApi(apiConfig), []);

  const [donations, setDonations] = useState<any[]>([]);
  const [editingData, setEditingData] = useState<Partial<DonationFullDetails> | null>(null);

  const [filterDoador, setFilterDoador] = useState('');
  const [filterDestino, setFilterDestino] = useState('');
  const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null);

  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState<DonationViewModel | null>(null);
  const [uiDoadorTipo, setUiDoadorTipo] = useState<DoadorType>('Pessoa');
  const [uiDestinoTipo, setUiDestinoTipo] = useState<DestinoType>('Nenhum');

  const [people, setPeople] = useState<PersonListItemViewModel[]>([]);
  const [companies, setCompanies] = useState<CompanyViewModel[]>([]);
  const [oscs, setOscs] = useState<OscViewModel[]>([]);
  const [courses, setCourses] = useState<CourseViewModel[]>([]);
  const [teams, setTeams] = useState<ListTeamItemViewModel[]>([]);

  const isCreating = editingData ? !('id' in editingData) : false;
  const dialogTitle = isVisualizing
    ? 'Visualizar Doação'
    : isCreating
    ? 'Nova Doação'
    : 'Editar Doação';

  const fetchDropdownData = async () => {
    try {
      const requestParams = { pageNumber: 1, pageSize: 1000 };
      const [peopleRes, companiesRes, oscsRes, coursesRes, teamsRes] = await Promise.all([
        peopleApi.listPerson(requestParams),
        companiesApi.apiCompaniesSearchPost(requestParams),
        oscsApi.listOsc(requestParams),
        coursesApi.listCourse(requestParams),
        teamsApi.listTeam(requestParams),
      ]);
      setPeople(peopleRes.data.items ?? []);
      setCompanies(companiesRes.data.items ?? []);
      setOscs(oscsRes.data.items ?? []);
      setCourses(coursesRes.data.items ?? []);
      setTeams(teamsRes.data.items ?? []);
    } catch (error) {
      toast.error('Erro ao carregar dados para os formulários.');
    }
  };

  useEffect(() => {
    fetchDropdownData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDonations = async (filtersToUse: Filter[]) => {
    try {
      setLoading(true);
      const response = await donationApi.apiDonationsSearchPost({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        filters: filtersToUse.length > 0 ? filtersToUse : undefined,
      });

      const items = response.data.items ?? [];
      const formattedItems = items.map((d) => ({
        ...d,
        donationDate: d.donationDate ? dayjs(d.donationDate).format('DD/MM/YYYY') : '',
        value: `R$ ${Number(d.value).toFixed(2).replace('.', ',')}`,
      }));

      console.log('Fetched donations:', formattedItems);
      setDonations(formattedItems);
      setTotalCount(response.data.totalItems ?? 0);
    } catch (error) {
      toast.error('Erro ao buscar doações.');
    } finally {
      setLoading(false);
    }
  };

  const buildFilters = (forceClear = false) => {
    const localFilters: Filter[] = [];

    if (forceClear) {
      return localFilters;
    }

    if (filterDoador) {
      localFilters.push({
        propertyName: 'DoadorNome',
        operation: Op.NUMBER_7,
        value: filterDoador,
      });
    }
    if (filterDestino) {
      localFilters.push({
        propertyName: 'DestinoNome',
        operation: Op.NUMBER_7,
        value: filterDestino,
      });
    }
    if (filterStartDate) {
      localFilters.push({
        propertyName: 'DonationDate',
        operation: Op.NUMBER_6,
        value: filterStartDate.format('YYYY-MM-DD'),
      });
    }
    if (filterEndDate) {
      localFilters.push({
        propertyName: 'DonationDate',
        operation: Op.NUMBER_4,
        value: filterEndDate.format('YYYY-MM-DD'),
      });
    }

    return localFilters;
  };

  useEffect(() => {
    const filters = buildFilters();
    fetchDonations(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    const filters = buildFilters();
    fetchDonations(filters);
  };

  const handleClearFilters = () => {
    setFilterDoador('');
    setFilterDestino('');
    setFilterStartDate(null);
    setFilterEndDate(null);

    if (page !== 0) setPage(0);
    const filters = buildFilters(true);
    fetchDonations(filters);
  };

  const handleAdd = () => {
    setEditingData({ value: 0, donationDate: dayjs().format('YYYY-MM-DD') });
    setUiDoadorTipo('Pessoa');
    setUiDestinoTipo('Nenhum');
    setIsVisualizing(false);
    setOpenModal(true);
  };

  const handleEdit = async (donation: DonationViewModel) => {
    if (!donation.id) return;
    try {
      setModalLoading(true);
      const response = (await donationApi.getDonationById(donation.id)) as any;
      const data = response.data as DonationFullDetails;
      setEditingData({ ...data, donationDate: dayjs(data.donationDate).format('YYYY-MM-DD') });
      setUiDoadorTipo(data.personId ? 'Pessoa' : 'Empresa');
      setUiDestinoTipo(data.oscId ? 'OSC' : data.teamId ? 'Team' : 'Nenhum');
      setIsVisualizing(false);
      setOpenModal(true);
    } catch (error) {
      toast.error('Erro ao carregar dados da doação.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleView = async (donation: DonationViewModel) => {
    if (!donation.id) return;
    try {
      setModalLoading(true);
      const response = (await donationApi.getDonationById(donation.id)) as any;
      const data = response.data as DonationFullDetails;
      setEditingData({ ...data, donationDate: dayjs(data.donationDate).format('YYYY-MM-DD') });
      setUiDoadorTipo(data.personId ? 'Pessoa' : 'Empresa');
      setUiDestinoTipo(data.oscId ? 'OSC' : data.teamId ? 'Team' : 'Nenhum');
      setIsVisualizing(true);
      setOpenModal(true);
    } catch (error) {
      toast.error('Erro ao carregar detalhes da doação.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = (donation: DonationViewModel) => {
    setDonationToDelete(donation);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!donationToDelete?.id) return;
    try {
      setModalLoading(true);
      await donationApi.apiDonationsIdDelete(donationToDelete.id);
      toast.success('Doação excluída com sucesso!');
      handleSearch();
    } catch (error) {
      toast.error('Erro ao excluir doação.');
    } finally {
      setModalLoading(false);
      setOpenDeleteModal(false);
      setDonationToDelete(null);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    let finalValue: string | number | null = value;
    if (name === 'value') {
      finalValue = value === '' ? null : Number(value);
    }

    setEditingData((prev) => (prev ? { ...prev, [name]: finalValue } : null));
  };

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const { name, value } = event.target;
    const finalValue = value === '' || value === null ? null : Number(value);
    setEditingData((prev) => (prev ? { ...prev, [name]: finalValue } : null));
  };

  const handleDoadorTipoChange = (event: SelectChangeEvent<DoadorType>) => {
    const newType = event.target.value as DoadorType;
    setUiDoadorTipo(newType);
    setEditingData((prev) => (prev ? { ...prev, personId: null, companyId: null } : null));
  };

  const handleDestinoTipoChange = (event: SelectChangeEvent<DestinoType>) => {
    const newType = event.target.value as DestinoType;
    setUiDestinoTipo(newType);
    setEditingData((prev) =>
      prev ? { ...prev, oscId: null, courseId: null, teamId: null } : null
    );
  };

  const handleSave = async () => {
    const data = editingData;
    if (!data) return;
    if (!data.value || data.value <= 0) {
      toast.error('O valor da doação deve ser positivo.');
      return;
    }
    if (!data.personId && !data.companyId) {
      toast.error('Um doador (Pessoa ou Empresa) deve ser selecionado.');
      return;
    }

    const payload = {
      Value: Number(data.value),
      DonationDate: data.donationDate,
      PersonId: data.personId || undefined,
      CompanyId: data.companyId || undefined,
      OscId: data.oscId || undefined,
      CourseId: data.courseId || undefined,
      TeamId: data.teamId || undefined,
    };

    try {
      setModalLoading(true);
      if (isCreating) {
        await donationApi.apiDonationsPost(payload as CreateDonationCommand);
        toast.success('Doação criada com sucesso!');
      } else {
        await donationApi.apiDonationsIdPut(data.id!, payload as UpdateDonationCommand);
        toast.success('Doação atualizada com sucesso!');
      }
      handleCloseModal();
      handleSearch();
    } catch (error: any) {
      toast.error(error?.response?.data?.title || 'Erro ao salvar doação.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingData(null);
    setIsVisualizing(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
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
            <TitleAndButtons title="Lista de Doações" onAdd={handleAdd} addLabel="Nova Doação" />
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
              </Box>

              <Grid container spacing={2.5} alignItems="center">
                {/* <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    label="Nome do Doador"
                    value={filterDoador}
                    onChange={(e) => setFilterDoador(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    label="Nome do Destino"
                    value={filterDestino}
                    onChange={(e) => setFilterDestino(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    fullWidth
                    size="small"
                  />
                </Grid> */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <DatePicker
                    label="Data Início"
                    value={filterStartDate}
                    onChange={setFilterStartDate}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <DatePicker
                    label="Data Fim"
                    value={filterEndDate}
                    onChange={setFilterEndDate}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Grid>
                <Grid
                  size={{ xs: 12 }}
                  sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1.5, mt: 1 }}
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
                    }}
                  >
                    Buscar
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                    sx={{
                      color: '#1E4EC4',
                      borderColor: alpha('#1E4EC4', 0.3),
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      '&:hover': {
                        borderColor: '#1E4EC4',
                        bgcolor: alpha('#1E4EC4', 0.05),
                        borderWidth: 1.5,
                      },
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ mt: 3 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table
                  columns={columns}
                  data={donations}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalCount={totalCount}
                  onPageChange={setPage}
                  onRowsPerPageChange={setRowsPerPage}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                  noDataMessage={donations.length > 0 ? '' : 'Nenhuma doação encontrada.'}
                />
              )}
            </Box>

            <ConfirmDialog
              open={openDeleteModal}
              onClose={() => setOpenDeleteModal(false)}
              onConfirm={confirmDelete}
              title="Confirmar Exclusão"
              message="Deseja realmente excluir esta Doação?"
              highlightText={`ID: ${donationToDelete?.id}`}
              confirmLabel="Excluir"
              cancelLabel="Cancelar"
              danger
            />

            <DialogPadronized
              open={openModal}
              onClose={handleCloseModal}
              maxWidth="md"
              title={dialogTitle}
              content={
                editingData && (
                  <Box
                    component="form"
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
                  >
                    <TextField
                      margin="dense"
                      label="Valor *"
                      type="number"
                      name="value"
                      value={editingData.value ?? ''}
                      onChange={handleTextChange}
                      fullWidth
                      variant="outlined"
                      slotProps={{
                        input: {
                          readOnly: isVisualizing,
                        },
                      }}
                      sx={isVisualizing ? { pointerEvents: 'none' } : {}}
                    />
                    <DatePicker
                      label="Data *"
                      value={editingData.donationDate ? dayjs(editingData.donationDate) : null}
                      onChange={(newValue) =>
                        setEditingData((prev) =>
                          prev ? { ...prev, donationDate: newValue?.format('YYYY-MM-DD') } : null
                        )
                      }
                      format="DD/MM/YYYY"
                      disabled={isVisualizing}
                      slotProps={{
                        textField: { margin: 'dense', fullWidth: true, variant: 'outlined' },
                      }}
                    />
                    <Divider sx={{ my: 1 }} />
                    <FormControl fullWidth variant="outlined" margin="dense" disabled={!isCreating || isVisualizing}>
                      <InputLabel>Tipo de Doador *</InputLabel>
                      <Select
                        value={uiDoadorTipo}
                        label="Tipo de Doador *"
                        onChange={handleDoadorTipoChange}
                      >
                        <MenuItem value="Pessoa">Pessoa</MenuItem>
                        <MenuItem value="Empresa">Empresa</MenuItem>
                      </Select>
                    </FormControl>

                    {uiDoadorTipo === 'Pessoa' && (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        disabled={!isCreating || isVisualizing}
                      >
                        <InputLabel>Pessoa (Doador) *</InputLabel>
                        <Select
                          name="personId"
                          value={editingData.personId ?? ''}
                          label="Pessoa (Doador) *"
                          onChange={handleSelectChange}
                        >
                          {people.map((p) => (
                            <MenuItem key={p.personId} value={p.personId}>
                              {p.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    {uiDoadorTipo === 'Empresa' && (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        disabled={!isCreating || isVisualizing}
                      >
                        <InputLabel>Empresa (Doador) *</InputLabel>
                        <Select
                          name="companyId"
                          value={editingData.companyId ?? ''}
                          label="Empresa (Doador) *"
                          onChange={handleSelectChange}
                        >
                          {companies.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.nome}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    <Divider sx={{ my: 1 }} />
                    <FormControl fullWidth variant="outlined" margin="dense" disabled={isVisualizing}>
                      <InputLabel>Tipo de Destino</InputLabel>
                      <Select
                        value={uiDestinoTipo}
                        label="Tipo de Destino"
                        onChange={handleDestinoTipoChange}
                      >
                        <MenuItem value="Nenhum">IGESC (Geral)</MenuItem>
                        <MenuItem value="OSC">OSC</MenuItem>
                        <MenuItem value="Team">Turma</MenuItem>
                      </Select>
                    </FormControl>

                    {uiDestinoTipo === 'OSC' && (
                      <FormControl fullWidth variant="outlined" margin="dense" disabled={isVisualizing}>
                        <InputLabel>OSC</InputLabel>
                        <Select
                          name="oscId"
                          value={editingData.oscId ?? ''}
                          label="OSC"
                          onChange={handleSelectChange}
                        >
                          {oscs.map((o) => (
                            <MenuItem key={o.oscId} value={o.oscId}>
                              {o.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    {uiDestinoTipo === 'Team' && (
                      <>
                        <FormControl fullWidth variant="outlined" margin="dense" disabled={isVisualizing}>
                          <InputLabel>Programa</InputLabel>
                          <Select
                            name="courseId"
                            value={editingData.courseId ?? ''}
                            label="Programa"
                            onChange={handleSelectChange}
                          >
                            {courses.map((c) => (
                              <MenuItem key={c.courseId} value={c.courseId}>
                                {c.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined" margin="dense" disabled={isVisualizing}>
                          <InputLabel>Turma</InputLabel>
                          <Select
                            name="teamId"
                            value={editingData.teamId ?? ''}
                            label="Turma"
                            onChange={handleSelectChange}
                          >
                            {teams.map((t) => (
                              <MenuItem key={t.teamId} value={t.teamId}>
                                {t.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </>
                    )}
                  </Box>
                )
              }
              actions={
                isVisualizing ? (
                  <Button
                    variant="contained"
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
                      {isCreating ? 'Salvar' : 'Atualizar'}
                    </Button>
                  </>
                )
              }
            />
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default DonationPage;
