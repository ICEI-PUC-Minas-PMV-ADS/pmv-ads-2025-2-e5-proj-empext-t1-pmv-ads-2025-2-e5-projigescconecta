import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, Grid, Typography, Divider, TextField, Paper,
    alpha, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Table, { Column } from '@/components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { apiConfig } from '@/services/auth';
import {
    CreateDonationEndpointApi,
    ListDonationsEndpointApi,
    ListDonationEndpointApi,
    UpdateDonationEndpointApi,
    DeleteDonationEndpointApi,
 // PersonApi,
    ListCompaniesEndpointApi,
    OscsApi,
    CoursesApi,
    TeamsApi,
    type CreateDonationCommand,
    type UpdateDonationCommand,
    type DonationViewModel,
    type PersonViewModel,
    type CompanyViewModel,
    type OscViewModel,
    type CourseViewModel,
    type TeamViewModel,
    type Filter,
} from '@/api';

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

const columns: Column<DonationViewModel>[] = [
    { label: 'ID', field: 'id' },
    { label: 'Valor', field: 'value', render: (data) => `R$ ${data.value?.toFixed(2).replace('.', ',')}` },
    { label: 'Data', field: 'donationDate' }, 
    { label: 'Doador', field: 'doadorNome' },
    { label: 'Destino', field: 'destinoNome' },
];

type DoadorType = 'Pessoa' | 'Empresa';
type DestinoType = 'OSC' | 'Team' | 'Nenhum';

const DonationPage: React.FC = () => {
    const createApi = useMemo(() => new CreateDonationEndpointApi(apiConfig), []);
    const listApi = useMemo(() => new ListDonationEndpointApi(apiConfig), []);
    const listAllApi = useMemo(() => new ListDonationsEndpointApi(apiConfig), []);
    const updateApi = useMemo(() => new UpdateDonationEndpointApi(apiConfig), []);
    const deleteApi = useMemo(() => new DeleteDonationEndpointApi(apiConfig), []);
 // const peopleApi = useMemo(() => new PersonApi(apiConfig), []);
    const companiesApi = useMemo(() => new ListCompaniesEndpointApi(apiConfig), []);
    const oscsApi = useMemo(() => new OscsApi(apiConfig), []);
    const coursesApi = useMemo(() => new CoursesApi(apiConfig), []);
    const teamsApi = useMemo(() => new TeamsApi(apiConfig), []);

    const [donations, setDonations] = useState<DonationViewModel[]>([]);
    const [editingData, setEditingData] = useState<Partial<DonationFullDetails> | null>(null);
    const [filterId, setFilterId] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [donationToDelete, setDonationToDelete] = useState<DonationViewModel | null>(null);
    const [uiDoadorTipo, setUiDoadorTipo] = useState<DoadorType>('Pessoa');
    const [uiDestinoTipo, setUiDestinoTipo] = useState<DestinoType>('Nenhum');

    const [people, setPeople] = useState<PersonViewModel[]>([]);
    const [companies, setCompanies] = useState<CompanyViewModel[]>([]);
    const [oscs, setOscs] = useState<OscViewModel[]>([]);
    const [courses, setCourses] = useState<CourseViewModel[]>([]);
    const [teams, setTeams] = useState<TeamViewModel[]>([]);

    const isCreating = editingData ? !('id' in editingData) : false;
    const dialogTitle = isCreating ? 'Nova Doação' : 'Editar Doação';

    const fetchDropdownData = async () => {
        try {
            const [peopleRes, companiesRes, oscsRes, coursesRes, teamsRes] = await Promise.all([
                peopleApi.apiPeopleSearchPost({ pageNumber: 1, pageSize: 1000 }),
                companiesApi.apiCompaniesSearchPost({ pageNumber: 1, pageSize: 1000 }),
                oscsApi.listOsc({ pageNumber: 1, pageSize: 1000 }),
                coursesApi.listCourse({ pageNumber: 1, pageSize: 1000 }),
                teamsApi.listTeam({ pageNumber: 1, pageSize: 1000 }),
            ]);
            setPeople(peopleRes.data.items ?? []);
            setCompanies(companiesRes.data.items ?? []);
            setOscs(oscsRes.data.items ?? []);
            setCourses(coursesRes.data.items ?? []);
            setTeams(teamsRes.data.items ?? []);
        } catch (error) {
            toast.error("Erro ao carregar dados para os formulários.");
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDonations = async (idFilter: string) => {
        try {
            setLoading(true);
            const localFilters: Filter[] = [];
            if (idFilter && !isNaN(parseInt(idFilter, 10))) {
                localFilters.push({ propertyName: 'Id', operation: 0, value: parseInt(idFilter, 10) });
            }
            const response = await listAllApi.apiDonationsSearchPost({ pageNumber: page + 1, pageSize: rowsPerPage, filters: localFilters });
            const items = response.data.items ?? [];
            const formattedItems = items.map(d => ({ ...d, donationDate: d.donationDate ? dayjs(d.donationDate).format('DD/MM/YYYY') : '' }));
            setDonations(formattedItems);
            setTotalCount(response.data.totalItems ?? 0);
        } catch (error) {
            toast.error('Erro ao buscar doações.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations(filterId);
    }, [page, rowsPerPage]);

    const handleSearch = () => {
        setPage(0);
        if(page === 0) fetchDonations(filterId);
    };

    const handleClearFilters = () => {
        if (filterId) setFilterId('');
        if (page !== 0) setPage(0);
        else fetchDonations('');
    };
    
    useEffect(() => {
        if (filterId === '') fetchDonations('');
    }, [filterId]);

    const handleAdd = () => {
        setEditingData({ value: 0, donationDate: dayjs().format('YYYY-MM-DD') });
        setUiDoadorTipo('Pessoa');
        setUiDestinoTipo('Nenhum');
        setOpenModal(true);
    };

    const handleEdit = async (donation: DonationViewModel) => {
        if (!donation.id) return;
        try {
            setModalLoading(true);
            const response = await listApi.getDonationById(donation.id);
            const data = response.data as DonationFullDetails;
            setEditingData({ ...data, donationDate: dayjs(data.donationDate).format('YYYY-MM-DD') });
            setUiDoadorTipo(data.personId ? 'Pessoa' : 'Empresa');
            setUiDestinoTipo(data.oscId ? 'OSC' : data.teamId ? 'Team' : 'Nenhum');
            setOpenModal(true);
        } catch (error) {
            toast.error('Erro ao carregar dados da doação.');
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
            await deleteApi.apiDonationsIdDelete(donationToDelete.id);
            toast.success('Doação excluída com sucesso!');
            fetchDonations(filterId);
        } catch (error) {
            toast.error('Erro ao excluir doação.');
        } finally {
            setModalLoading(false);
            setOpenDeleteModal(false);
            setDonationToDelete(null);
        }
    };

    const handleFormChange = (event: SelectChangeEvent<string | number> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditingData(prev => (prev ? { ...prev, [name]: value === '' ? null : value } : null));
    };
    
    const handleDoadorTipoChange = (event: SelectChangeEvent<DoadorType>) => {
        const newType = event.target.value as DoadorType;
        setUiDoadorTipo(newType);
        setEditingData(prev => (prev ? { ...prev, personId: null, companyId: null } : null));
    };

    const handleDestinoTipoChange = (event: SelectChangeEvent<DestinoType>) => {
        const newType = event.target.value as DestinoType;
        setUiDestinoTipo(newType);
        setEditingData(prev => (prev ? { ...prev, oscId: null, courseId: null, teamId: null } : null));
    };

    const handleSave = async () => {
        const data = editingData;
        if (!data) return;
        if (!data.value || data.value <= 0) {
            toast.error('O valor da doação deve ser positivo.');
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
                await createApi.apiDonationsPost(payload as CreateDonationCommand);
                toast.success('Doação criada com sucesso!');
            } else {
                await updateApi.apiDonationsIdPut(data.id!, payload as UpdateDonationCommand);
                toast.success('Doação atualizada com sucesso!');
            }
            handleCloseModal();
            fetchDonations(filterId);
        } catch (error: any) {
            toast.error(error?.response?.data?.title || 'Erro ao salvar doação.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingData(null);
    };

    return (
        <Container maxWidth="xl" sx={{ minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
            <Paper elevation={0} sx={{ backgroundColor: '#ffffff', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: alpha('#1E4EC4', 0.1) }}>
                <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <TitleAndButtons title="Lista de Doações" onAdd={handleAdd} addLabel="Nova Doação" />
                    <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mb: 3, backgroundColor: alpha('#1E4EC4', 0.02), border: '1px solid', borderColor: alpha('#1E4EC4', 0.1), borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}><SearchIcon sx={{ color: '#1E4EC4' }} /><Typography variant="h6">Busca de Doação</Typography></Box>
                        <Grid container spacing={2.5}> 
                            <Grid item xs={12} sm={6} md={4}><TextField label="Filtrar por ID" value={filterId} onChange={(e) => setFilterId(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} fullWidth size="small" type="number" /></Grid>
                            <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}><Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>Buscar</Button><Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClearFilters}>Limpar</Button></Grid>
                        </Grid>
                    </Paper>
                    <Box sx={{ mt: 3 }}>
                        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> : <Table columns={columns} data={donations} page={page} rowsPerPage={rowsPerPage} totalCount={totalCount} onPageChange={setPage} onRowsPerPageChange={setRowsPerPage} onEdit={handleEdit} onDelete={handleDelete} noDataMessage={"Nenhuma doação encontrada."} />}
                    </Box>
                    <ConfirmDialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} onConfirm={confirmDelete} title='Confirmar Exclusão' message='Deseja realmente excluir esta Doação?' highlightText={`ID: ${donationToDelete?.id}`} confirmLabel='Excluir' cancelLabel='Cancelar' danger/>
                    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogContent>
                            {editingData && (
                                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                    <TextField label="Valor" type="number" name="value" value={editingData.value ?? ''} onChange={handleFormChange} fullWidth size="small" />
                                    <TextField label="Data" type="date" name="donationDate" value={editingData.donationDate ?? ''} onChange={handleFormChange} fullWidth size="small" InputLabelProps={{ shrink: true }} />
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle1">Doador</Typography>
                                    <FormControl fullWidth size="small" disabled={!isCreating}>
                                        <InputLabel>Tipo de Doador</InputLabel>
                                        <Select value={uiDoadorTipo} label="Tipo de Doador" onChange={handleDoadorTipoChange}><MenuItem value="Pessoa">Pessoa</MenuItem><MenuItem value="Empresa">Empresa</MenuItem></Select>
                                    </FormControl>

                                    {uiDoadorTipo === 'Pessoa' && <FormControl fullWidth size="small" disabled={!isCreating}><InputLabel>Pessoa (Doador)</InputLabel><Select name="personId" value={editingData.personId ?? ''} label="Pessoa (Doador)" onChange={handleFormChange}>{people.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}</Select></FormControl>}
                                    {uiDoadorTipo === 'Empresa' && <FormControl fullWidth size="small" disabled={!isCreating}><InputLabel>Empresa (Doador)</InputLabel><Select name="companyId" value={editingData.companyId ?? ''} label="Empresa (Doador)" onChange={handleFormChange}>{companies.map(c => <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>)}</Select></FormControl>}

                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle1">Destino</Typography>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Tipo de Destino</InputLabel>
                                        <Select value={uiDestinoTipo} label="Tipo de Destino" onChange={handleDestinoTipoChange}><MenuItem value="Nenhum">IGESC (Geral)</MenuItem><MenuItem value="OSC">OSC</MenuItem><MenuItem value="Team">Turma</MenuItem></Select>
                                    </FormControl>

                                    {uiDestinoTipo === 'OSC' && <FormControl fullWidth size="small"><InputLabel>OSC</InputLabel><Select name="oscId" value={editingData.oscId ?? ''} label="OSC" onChange={handleFormChange}>{oscs.map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>)}</Select></FormControl>}
                                    {uiDestinoTipo === 'Team' && (<>
                                        <FormControl fullWidth size="small"><InputLabel>Programa</InputLabel><Select name="courseId" value={editingData.courseId ?? ''} label="Programa" onChange={handleFormChange}>{courses.map(c => <MenuItem key={c.courseId} value={c.courseId}>{c.name}</MenuItem>)}</Select></FormControl>
                                        <FormControl fullWidth size="small"><InputLabel>Turma</InputLabel><Select name="teamId" value={editingData.teamId ?? ''} label="Turma" onChange={handleFormChange}>{teams.map(t => <MenuItem key={t.teamId} value={t.teamId}>{t.name}</MenuItem>)}</Select></FormControl>
                                    </>)}
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal} disabled={modalLoading}>Cancelar</Button>
                            <Button onClick={handleSave} variant="contained" disabled={modalLoading}>{modalLoading ? <CircularProgress size={24} /> : (isCreating ? 'Criar' : 'Atualizar')}</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Paper>
        </Container>
    );
};

export default DonationPage;