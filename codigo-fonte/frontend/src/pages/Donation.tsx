import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, Grid, Typography, Stack, Divider, TextField, Chip, Paper,
    alpha, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { toast } from 'react-toastify';
import axios from 'axios';
import dayjs from 'dayjs';
import { apiConfig } from '@/services/auth';

import {
    CreateDonationEndpointApi,
    ListDonationEndpointApi,
    UpdateDonationEndpointApi,
    DeleteDonationEndpointApi,
    type CreateDonationCommand,
    type UpdateDonationCommand,
} from '@/api';

interface Donation {
    Id: number;
    Valor: number;
    Data: string;
    PersonId: number | null;
    CompanyId: number | null;
    OscId: number | null;
    TeamId: number | null;
}

type DoadorType = 'Pessoa' | 'Empresa';
type DestinoType = 'OSC' | 'Team' | 'Nenhum';

const columns: Column<Donation>[] = [
    { label: 'ID', field: 'Id' },
    { label: 'Valor', field: 'Valor', render: (data) => `R$ ${data.Valor.toFixed(2)}` },
    { label: 'Data', field: 'Data', render: (data) => dayjs(data.Data).format('DD/MM/YYYY') },
    { label: 'Doador', render: (data) => data.PersonId ? `Pessoa ID: ${data.PersonId}` : `Empresa ID: ${data.CompanyId}` },
    { label: 'Destino', render: (data) => data.OscId ? `OSC ID: ${data.OscId}` : data.TeamId ? `Turma ID: ${data.TeamId}` : 'Geral' },
];

const DonationPage: React.FC = () => {
    const createApi = useMemo(() => new CreateDonationEndpointApi(apiConfig), []);
    const listApi = useMemo(() => new ListDonationEndpointApi(apiConfig), []);
    const updateApi = useMemo(() => new UpdateDonationEndpointApi(apiConfig), []);
    const deleteApi = useMemo(() => new DeleteDonationEndpointApi(apiConfig), []);

    const [donations, setDonations] = useState<Donation[]>([]);
    const [editingDonation, setEditingDonation] = useState<Partial<Donation> | null>(null);
    const [filterId, setFilterId] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [donationToDelete, setDonationToDelete] = useState<Donation | null>(null);
    const [uiDoadorTipo, setUiDoadorTipo] = useState<DoadorType>('Pessoa');
    const [uiDestinoTipo, setUiDestinoTipo] = useState<DestinoType>('Nenhum');
    
    const isCreating = editingDonation ? !('Id' in editingDonation) : false;
    const dialogTitle = isCreating ? 'Nova Doação' : 'Editar Doação';

    const fetchDonation = async (idFilter?: string) => {
        if (!idFilter || isNaN(parseInt(idFilter, 10))) {
            setDonations([]);
            return;
        }
        try {
            setLoading(true);
            const { data } = await listApi.get(parseInt(idFilter, 10));
            setDonations([data as Donation]);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                toast.info('Nenhuma doação encontrada com este ID.');
                setDonations([]);
            } else {
                toast.error('Erro ao buscar doação.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (filterId.trim() === '' || isNaN(parseInt(filterId, 10))) {
            toast.warn("Digite um ID numérico para buscar.");
            return;
        }
        fetchDonation(filterId);
    };

    const handleClearFilters = () => {
        setFilterId('');
        setDonations([]);
    };

    const handleAdd = () => {
        setEditingDonation({
            Valor: 0,
            Data: dayjs().format('YYYY-MM-DD'),
            PersonId: null,
            CompanyId: null,
            OscId: null,
            TeamId: null,
        });
        setUiDoadorTipo('Pessoa');
        setUiDestinoTipo('Nenhum');
        setOpenModal(true);
    };

    const handleEdit = async (donation: Donation) => {
        setUiDoadorTipo(donation.PersonId ? 'Pessoa' : 'Empresa');
        setUiDestinoTipo(donation.OscId ? 'OSC' : donation.TeamId ? 'Team' : 'Nenhum');
        setEditingDonation(donation);
        setOpenModal(true);
    };

    const handleDelete = (donation: Donation) => {
        setDonationToDelete(donation);
        setOpenDeleteModal(true);
    }

    const confirmDelete = async () => {
        if (!donationToDelete) return;
        try {
            setModalLoading(true);
            await deleteApi._delete(donationToDelete.Id);
            toast.success(`Doação ID ${donationToDelete.Id} excluída com sucesso!`);
            handleClearFilters();
        } catch (error) {
            toast.error('Erro ao excluir doação.');
        } finally {
            setModalLoading(false);
            setOpenDeleteModal(false);
            setDonationToDelete(null);
        }
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditingDonation(prev => ({ ...prev, [name]: value }));
    };

    const handleDoadorTipoChange = (event: SelectChangeEvent<DoadorType>) => {
        const newType = event.target.value as DoadorType;
        setUiDoadorTipo(newType);
        setEditingDonation(prev => ({
            ...prev,
            PersonId: newType === 'Pessoa' ? (prev?.PersonId ?? null) : null,
            CompanyId: newType === 'Empresa' ? (prev?.CompanyId ?? null) : null,
        }));
    };

    const handleDestinoTipoChange = (event: SelectChangeEvent<DestinoType>) => {
        const newType = event.target.value as DestinoType;
        setUiDestinoTipo(newType);
        setEditingDonation(prev => ({
            ...prev,
            OscId: newType === 'OSC' ? (prev?.OscId ?? null) : null,
            TeamId: newType === 'Team' ? (prev?.TeamId ?? null) : null,
        }));
    };

    const handleSave = async () => {
        const data = editingDonation;
        if (!data) return;

        if (!data.Valor || data.Valor <= 0) {
            toast.error('O valor da doação deve ser positivo.');
            return;
        }

        const requestData = {
            value: Number(data.Valor),
            donationDate: data.Data,
            personId: data.PersonId ? Number(data.PersonId) : undefined,
            companyId: data.CompanyId ? Number(data.CompanyId) : undefined,
            oscId: data.OscId ? Number(data.OscId) : undefined,
            teamId: data.TeamId ? Number(data.TeamId) : undefined,
        };

        try {
            setModalLoading(true);
            if (isCreating) {
                await createApi.post(requestData as CreateDonationCommand);
                toast.success('Doação criada com sucesso!');
            } else {
                await updateApi.put(data.Id!, requestData as UpdateDonationCommand);
                toast.success('Doação atualizada com sucesso!');
            }
            handleCloseModal();
            fetchDonation(filterId);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const message = error.response.data?.title || 'Erro desconhecido.';
                toast.error(`Falha ao salvar: ${message}`);
            } else {
                toast.error('Erro de rede ou servidor não respondeu.');
            }
        } finally {
            setModalLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingDonation(null);
    };

    return (
        <Container maxWidth="xl" sx={{ minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
            <Paper elevation={0} sx={{ backgroundColor: '#ffffff', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: alpha('#1E4EC4', 0.1) }}>
                <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <TitleAndButtons title="Lista de Doações" onAdd={handleAdd} addLabel="Nova Doação" />
                    
                    <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mb: 3, backgroundColor: alpha('#1E4EC4', 0.02), border: '1px solid', borderColor: alpha('#1E4EC4', 0.1), borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                            <SearchIcon sx={{ color: '#1E4EC4', fontSize: '1.25rem' }} />
                            <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '1.1rem' }}>Busca de Doação (ID)</Typography>
                        </Box>
                        <Grid container spacing={2.5}> 
                            <Grid item xs={12} sm={6} md={4}> 
                                <TextField label="ID da Doação" value={filterId} onChange={(e) => setFilterId(e.target.value)} fullWidth size="small" type="number" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1.5 }}>
                                <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} sx={{ bgcolor: '#1E4EC4', color: 'white', fontWeight: 600, px: 4, py: 1, borderRadius: 1.5 }}>Buscar</Button>
                                <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClearFilters} sx={{ color: '#1E4EC4', fontWeight: 600, px: 4, py: 1, borderRadius: 1.5 }}>Limpar</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                    
                    <Box sx={{ flexGrow: 1, mt: 3 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}><CircularProgress sx={{ color: '#1E4EC4' }} /></Box>
                        ) : (
                            <Table
                                columns={columns}
                                data={donations}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                noDataMessage={filterId ? "Nenhuma doação encontrada com este ID." : "Use o filtro acima para buscar doações."}
                            />
                        )}
                    </Box>

                    <ConfirmDialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} onConfirm={confirmDelete} title='Confirmar Exclusão' message='Deseja realmente excluir esta Doação?' highlightText={`ID: ${donationToDelete?.Id}`} confirmLabel='Excluir' cancelLabel='Cancelar' danger/>

                    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogContent>
                            {editingDonation && (
                                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                    <TextField label="Valor" type="number" name="Valor" value={editingDonation.Valor ?? ''} onChange={handleValueChange} fullWidth size="small" />
                                    <TextField label="Data" type="date" name="Data" value={dayjs(editingDonation.Data).format('YYYY-MM-DD')} onChange={handleValueChange} fullWidth size="small" InputLabelProps={{ shrink: true }} />

                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle1">Doador</Typography>
                                    <FormControl fullWidth size="small" disabled={!isCreating}>
                                        <InputLabel>Tipo de Doador</InputLabel>
                                        <Select value={uiDoadorTipo} label="Tipo de Doador" onChange={handleDoadorTipoChange}>
                                            <MenuItem value="Pessoa">Pessoa</MenuItem>
                                            <MenuItem value="Empresa">Empresa</MenuItem>
                                        </Select>
                                    </FormControl>

                                    {uiDoadorTipo === 'Pessoa' && <TextField label="ID da Pessoa" type="number" name="PersonId" value={editingDonation.PersonId ?? ''} onChange={handleValueChange} fullWidth size="small" disabled={!isCreating} />}
                                    {uiDoadorTipo === 'Empresa' && <TextField label="ID da Empresa" type="number" name="CompanyId" value={editingDonation.CompanyId ?? ''} onChange={handleValueChange} fullWidth size="small" disabled={!isCreating} />}

                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle1">Destino</Typography>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Tipo de Destino</InputLabel>
                                        <Select value={uiDestinoTipo} label="Tipo de Destino" onChange={handleDestinoTipoChange}>
                                            <MenuItem value="Nenhum">Nenhum (Geral)</MenuItem>
                                            <MenuItem value="OSC">OSC</MenuItem>
                                            <MenuItem value="Team">Turma</MenuItem>
                                        </Select>
                                    </FormControl>

                                    {uiDestinoTipo === 'OSC' && <TextField label="ID da OSC" type="number" name="OscId" value={editingDonation.OscId ?? ''} onChange={handleValueChange} fullWidth size="small" />}
                                    {uiDestinoTipo === 'Team' && <TextField label="ID da Turma" type="number" name="TeamId" value={editingDonation.TeamId ?? ''} onChange={handleValueChange} fullWidth size="small" />}
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal} disabled={modalLoading}>Cancelar</Button>
                            <Button onClick={handleSave} variant="contained" disabled={modalLoading}>
                                {modalLoading ? <CircularProgress size={24} /> : (isCreating ? 'Criar' : 'Atualizar')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Paper>
        </Container>
    );
};

export default DonationPage;