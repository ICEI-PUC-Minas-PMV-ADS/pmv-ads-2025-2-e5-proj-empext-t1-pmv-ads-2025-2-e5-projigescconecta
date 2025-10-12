import React, { useState, useEffect, FormEvent } from 'react';
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
import { mask } from 'remask';
import dayjs from 'dayjs';

// URL base dos seus Endpoints
const API_BASE_URL = 'http://localhost:5000/api/donations';

// ==================== TIPOS E INTERFACES (PascalCase para Backend) ====================
type DoadorType = 'Pessoa' | 'Empresa' | '';
type DestinoType = 'Turma' | 'OSC' | 'Nenhum';

interface Doacao {
    IDDoacao: string;
    Valor: number;
    Data: string;
    DoadorPessoaCPF: string | null;
    DoadorEmpresaCNPJ: string | null;
    DestinoTipo: string | null;
    DestinoTurmaId: string | null;
    DestinoOSCCodigo: string | null;
}

// ==================== FUNÇÕES DE RENDERIZAÇÃO (FORA DO COMPONENTE) ====================

const formatDoador = (doacao: Doacao) => {
    if (doacao.DoadorPessoaCPF) {
        return `Pessoa: ${mask(doacao.DoadorPessoaCPF, ['999.999.999-99'])}`;
    }
    if (doacao.DoadorEmpresaCNPJ) {
        return `Empresa: ${mask(doacao.DoadorEmpresaCNPJ, ['99.999.999/9999-99'])}`;
    }
    return 'N/A';
};

const formatDestino = (doacao: Doacao) => {
    if (doacao.DestinoTipo === 'TURMA') {
        return `Turma: ${doacao.DestinoTurmaId}`;
    }
    if (doacao.DestinoTipo === 'OSC') {
        return `OSC: ${doacao.DestinoOSCCodigo}`;
    }
    return 'Geral';
};

// ==================== COLUNAS DA TABELA (FINALMENTE CORRIGIDAS) ====================
const columns: Column<Doacao>[] = [
    { label: 'ID', field: 'IDDoacao' },
    { label: 'Valor', field: 'Valor', render: (data) => `R$ ${data.Valor.toFixed(2)}` },
    { label: 'Data', field: 'Data', render: (data) => dayjs(data.Data).format('DD/MM/YYYY') },
    { label: 'Doador', field: 'DoadorPessoaCPF', render: (data) => formatDoador(data) },
    { label: 'Destino', field: 'DestinoTipo', render: (data) => formatDestino(data) },
];


// ==================== O COMPONENTE PRINCIPAL ====================
const DonationPage: React.FC = () => {
    // ... (Estados de dados e UI - inalterados)
    const [doacoes, setDoacoes] = useState<Doacao[]>([]);
    const [editingDoacao, setEditingDoacao] = useState<Doacao | null>(null);
    const [filterId, setFilterId] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [uiDoadorTipo, setUiDoadorTipo] = useState<DoadorType>('Pessoa');
    const [uiDestinoTipo, setUiDestinoTipo] = useState<DestinoType>('Nenhum');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [doacaoToDelete, setDoacaoToDelete] = useState<Doacao | null>(null);

    const dialogTitle = isVisualizing ? 'Visualizar Doação' : editingDoacao ? 'Editar Doação' : 'Nova Doação';
    
    // ... (fetchDoacoes, handleSearch, handleClearFilters - inalterados)
    const fetchDoacoes = async (idFilter?: string) => {
        if (!idFilter) {
            setDoacoes([]);
            setTotalCount(0);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get<Doacao>(`${API_BASE_URL}/${idFilter}`);
            setDoacoes([data]);
            setTotalCount(1);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                toast.info('Nenhuma doação encontrada com este ID.');
                setDoacoes([]);
            } else {
                toast.error('Erro ao buscar doações');
            }
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (filterId) fetchDoacoes(filterId);
    }, [page, rowsPerPage]);

    const handleSearch = () => {
        if (filterId.trim() === '') {
            toast.warn("Digite um ID (GUID) para buscar.");
            return;
        }
        setPage(0);
        fetchDoacoes(filterId);
    };

    const handleClearFilters = () => {
        setPage(0);
        setFilterId('');
        setDoacoes([]);
    };
    
    const handleAdd = () => {
        setEditingDoacao({
            IDDoacao: '',
            Valor: 0,
            Data: new Date().toISOString().split('T')[0],
            DoadorPessoaCPF: '',
            DoadorEmpresaCNPJ: null,
            DestinoTipo: null,
            DestinoTurmaId: null,
            DestinoOSCCodigo: null,
        });
        setUiDoadorTipo('Pessoa');
        setUiDestinoTipo('Nenhum');
        setIsVisualizing(false);
        setOpenModal(true);
    };

    const handleEdit = async (doacao: Doacao) => {
        try {
            setModalLoading(true);
            const { data } = await axios.get<Doacao>(`${API_BASE_URL}/${doacao.IDDoacao}`);
            
            setUiDoadorTipo(data.DoadorPessoaCPF ? 'Pessoa' : data.DoadorEmpresaCNPJ ? 'Empresa' : '');
            setUiDestinoTipo(data.DestinoTipo === 'TURMA' ? 'Turma' : data.DestinoTipo === 'OSC' ? 'OSC' : 'Nenhum');
            
            setEditingDoacao(data);
            setIsVisualizing(false);
            setOpenModal(true);
        } catch (error) {
            toast.error('Erro ao carregar edição da doação');
        } finally {
            setModalLoading(false);
        }
    };
    
    const handleDelete = (doacao: Doacao) => {
        setDoacaoToDelete(doacao);
        setOpenDeleteModal(true);
    }
    
    const confirmDelete = async () => {
        if (!doacaoToDelete) return;
    
        try {
            setModalLoading(true);
            await axios.delete(`${API_BASE_URL}/${doacaoToDelete.IDDoacao}`);
            
            toast.success(`Doação excluída com sucesso!`);
            fetchDoacoes(filterId);
        } catch (error) {
            toast.error('Erro ao excluir doação');
        } finally {
            setModalLoading(false);
            setOpenDeleteModal(false);
            setDoacaoToDelete(null);
        }
    };
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? parseFloat(value) : value;
        setEditingDoacao(prev => ({ 
            ...prev!, 
            [name]: newValue 
        }));
    };

    const handleDoadorTipoChange = (newType: DoadorType) => {
        setUiDoadorTipo(newType);
        setEditingDoacao(prev => ({
            ...prev!,
            DoadorPessoaCPF: newType === 'Pessoa' ? prev!.DoadorPessoaCPF : null,
            DoadorEmpresaCNPJ: newType === 'Empresa' ? prev!.DoadorEmpresaCNPJ : null,
        }));
    };
    
    const handleDestinoTipoChange = (event: SelectChangeEvent<DestinoType>) => {
        const newType = event.target.value as DestinoType;
        setUiDestinoTipo(newType);
        
        setEditingDoacao(prev => ({
            ...prev!,
            DestinoTipo: newType === 'Nenhum' ? null : newType.toUpperCase(),
            
            // Lógica para manter/limpar os IDs
            DestinoTurmaId: newType === 'Turma' ? prev!.DestinoTurmaId : null,
            DestinoOSCCodigo: newType === 'OSC' ? prev!.DestinoOSCCodigo : null,
        }));
    };


    const handleSave = async () => {
        const data = editingDoacao;

        if (!data?.Valor || data.Valor <= 0) {
            toast.error('O valor da doação deve ser positivo.');
            return;
        }

        const isCreating = data.IDDoacao === '';
        
        if (isCreating) {
            const doadorIsPessoa = uiDoadorTipo === 'Pessoa' && !!data.DoadorPessoaCPF;
            const doadorIsEmpresa = uiDoadorTipo === 'Empresa' && !!data.DoadorEmpresaCNPJ;
            
            if (!doadorIsPessoa && !doadorIsEmpresa) {
                toast.error("Obrigatório informar o CPF da Pessoa OU o CNPJ da Empresa.");
                return;
            }
        }
        
        try {
            setModalLoading(true);
            
            const { IDDoacao, ...requestData } = data; 
            
            if (isCreating) {
                await axios.post(API_BASE_URL, requestData);
                toast.success('Doação criada com sucesso!');
            } else {
                await axios.put(`${API_BASE_URL}/${IDDoacao}`, requestData);
                toast.success('Doação atualizada com sucesso!');
            }

            handleCloseModal();
            fetchDoacoes(filterId);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorDetails = error.response.data.errors?.join('; ') || 'Erro desconhecido.';
                toast.error(`Falha ao salvar: ${errorDetails}`);
            } else {
                toast.error('Erro de rede ou servidor não respondeu.');
            }
        } finally {
            setModalLoading(false);
        }
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingDoacao(null);
        setIsVisualizing(false);
    };


    // ==================== RENDERIZAÇÃO DE COMPONENTES ====================
    return (
        <Container maxWidth="xl" sx={{ minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
            <Paper elevation={0} sx={{ backgroundColor: '#ffffff', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: alpha('#1E4EC4', 0.1) }}>
                <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <TitleAndButtons title="Lista de Doações" onAdd={handleAdd} addLabel="Nova Doação" />

                    {/* Filtro de Busca (ID) */}
                    <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mb: 3, backgroundColor: alpha('#1E4EC4', 0.02), border: '1px solid', borderColor: alpha('#1E4EC4', 0.1), borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                            <SearchIcon sx={{ color: '#1E4EC4', fontSize: '1.25rem' }} />
                            <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '1.1rem' }}>Busca de Doação (ID)</Typography>
                            {filterId && <Chip label="Busca ativa" size="small" sx={{ ml: 1, bgcolor: alpha('#1E4EC4', 0.1), color: '#1E4EC4', fontWeight: 600 }} />}
                        </Box>

                        <Grid container spacing={2.5}> 
                            <Grid item xs={12} sm={6} md={4}> 
                                <TextField label="ID da Doação (GUID)" value={filterId} onChange={(e) => setFilterId(e.target.value)} fullWidth size="small"/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1.5 }}>
                                <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} sx={{ bgcolor: '#1E4EC4', color: 'white', fontWeight: 600, px: 4, py: 1, borderRadius: 1.5 }}>Buscar</Button>
                                <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClearFilters} sx={{ color: '#1E4EC4', fontWeight: 600, px: 4, py: 1, borderRadius: 1.5 }}>Limpar Filtros</Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Tabela de Doações */}
                    <Box sx={{ flexGrow: 1, mt: 3 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}><CircularProgress sx={{ color: '#1E4EC4' }} /></Box>
                        ) : (
                            <Table
                                columns={columns}
                                data={doacoes}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                totalCount={totalCount}
                                onPageChange={setPage}
                                onRowsPerPageChange={setRowsPerPage}
                                onEdit={handleEdit}
                                onView={handleEdit} 
                                onDelete={handleDelete}
                                noDataMessage={filterId ? "Nenhuma doação encontrada com este ID ou inativa." : "Use o filtro acima para buscar doações."}
                            />
                        )}
                    </Box>

                    {/* Delete Modal (Inalterado) */}
                    <ConfirmDialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} onConfirm={confirmDelete} title='Confirmar Exclusão' message='Deseja realmente EXCLUIR DEFINITIVAMENTE esta Doação?' highlightText={doacaoToDelete?.IDDoacao} confirmLabel='Excluir' cancelLabel='Cancelar' danger/>

                    {/* Modal de Criação/Edição/Visualização */}
                    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                        <DialogTitle sx={{ bgcolor: alpha('#1E4EC4', 0.03), borderBottom: '1px solid', borderColor: alpha('#1E4EC4', 0.1), py: 2.5, px: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a2e' }}>{dialogTitle}</Typography>
                        </DialogTitle>

                        <DialogContent sx={{ p: 3, mt: 1 }}>
                            {editingDoacao && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 1 }}>
                                    {/* DADOS PRINCIPAIS */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField label="Valor" type="number" name="Valor" value={editingDoacao.Valor} onChange={handleValueChange} fullWidth disabled={isVisualizing} size="small" inputProps={{ readOnly: isVisualizing || !editingDoacao.IDDoacao }}/>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField label="Data" type="date" name="Data" value={editingDoacao.Data} onChange={handleValueChange} fullWidth disabled={isVisualizing} size="small" inputProps={{ readOnly: isVisualizing || !editingDoacao.IDDoacao }}/>
                                        </Grid>
                                    </Grid>

                                    {/* INFO DOADOR */}
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Doador (Não Editável na Edição)</Typography>
                                        <Divider sx={{ mb: 1 }} />
                                        <Typography color="text.secondary">
                                            {editingDoacao.IDDoacao ? formatDoador(editingDoacao) : 'Defina na criação'}
                                        </Typography>
                                    </Box>
                                    
                                    {/* SEÇÃO DOADOR (Apenas na CRIAÇÃO) */}
                                    {!editingDoacao.IDDoacao && (
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Quem doou?</Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4}>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>Tipo de Doador</InputLabel>
                                                        <Select value={uiDoadorTipo} label="Tipo de Doador" onChange={(e: SelectChangeEvent<DoadorType>) => handleDoadorTipoChange(e.target.value as DoadorType)} disabled={isVisualizing}>
                                                            <MenuItem value={'Pessoa'}>Pessoa (CPF)</MenuItem>
                                                            <MenuItem value={'Empresa'}>Empresa (CNPJ)</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={8}>
                                                    {uiDoadorTipo === 'Pessoa' && (
                                                        <TextField label="CPF do Doador" name="DoadorPessoaCPF" value={editingDoacao.DoadorPessoaCPF || ''} onChange={handleValueChange} fullWidth size="small" disabled={isVisualizing} inputProps={{ readOnly: isVisualizing }}/>
                                                    )}
                                                    {uiDoadorTipo === 'Empresa' && (
                                                        <TextField label="CNPJ da Empresa" name="DoadorEmpresaCNPJ" value={editingDoacao.DoadorEmpresaCNPJ || ''} onChange={handleValueChange} fullWidth size="small" disabled={isVisualizing} inputProps={{ readOnly: isVisualizing }}/>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}

                                    {/* SEÇÃO DESTINO (Editável em ambas as situações) */}
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Destino da Doação</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={4}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Destino</InputLabel>
                                                    <Select value={uiDestinoTipo} label="Destino" onChange={handleDestinoTipoChange} disabled={isVisualizing}>
                                                        <MenuItem value={'Nenhum'}>Nenhum (Geral)</MenuItem>
                                                        <MenuItem value={'Turma'}>Turma</MenuItem>
                                                        <MenuItem value={'OSC'}>OSC</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                {uiDestinoTipo === 'Turma' && (
                                                    <TextField label="ID da Turma" name="DestinoTurmaId" value={editingDoacao.DestinoTurmaId || ''} onChange={handleValueChange} fullWidth size="small" disabled={isVisualizing} inputProps={{ readOnly: isVisualizing }}/>
                                                )}
                                                {uiDestinoTipo === 'OSC' && (
                                                    <TextField label="Código da OSC" name="DestinoOSCCodigo" value={editingDoacao.DestinoOSCCodigo || ''} onChange={handleValueChange} fullWidth size="small" disabled={isVisualizing} inputProps={{ readOnly: isVisualizing }}/>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Box>

                                </Box>
                            )}
                            {!editingDoacao && <Typography>Nenhum dado encontrado.</Typography>}
                        </DialogContent>

                        <DialogActions sx={{ px: 3, py: 2.5, bgcolor: alpha('#1E4EC4', 0.02), borderTop: '1px solid', borderColor: alpha('#1E4EC4', 0.1), gap: 1.5 }}>
                            {isVisualizing ? (
                                <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleCloseModal} sx={{ bgcolor: '#6b7280', color: 'white', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5 }}>Voltar</Button>
                            ) : (
                                <>
                                    <Button onClick={handleCloseModal} disabled={modalLoading} sx={{ color: '#6b7280', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5 }}>Cancelar</Button>
                                    <Button onClick={handleSave} variant="contained" disabled={modalLoading} startIcon={modalLoading ? <CircularProgress size={20} color="inherit" /> : null} 
                                            sx={{ bgcolor: '#1E4EC4', color: 'white', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5, textTransform: 'none' }}>
                                        {editingDoacao?.IDDoacao ? 'Atualizar' : 'Criar'}
                                    </Button>
                                </>
                            )}
                        </DialogActions>
                    </Dialog>
                </Box>
            </Paper>
        </Container>
    );
};

export default DonationPage;