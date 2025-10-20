import React, { useState, useEffect, use } from 'react';
import {
    Box,
    Container,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    SelectChangeEvent,
    Typography,
    Stack,
    Divider,
    TextField,
    Autocomplete
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { toast } from 'react-toastify';
import {
    OscsApi,
    BeneficiariesApi,
    CreateBeneficiaryRequest,
    UpdateBeneficiaryRequest,
    ListBeneficiaryRequest,
    Filter,
    Op,
} from './../api';
import { apiConfig } from '../services/auth';
import { alpha } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { Chip, Paper } from '@mui/material';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import DialogPadronized from '@/components/DialogPadronized';

dayjs.locale('pt-br');

interface Beneficiary {
    beneficiaryId?: number;
    name?: string;
    notes?: string;
    oscs?: Osc[];
}

interface Osc {
    oscId?: number;
    name?: string;
    corporateName?: string;
}

const Beneficiary: React.FC = () => {

    const [beneficiary, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [noDataMessage, setNoDataMessage] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [updateBeneficiary, setUpdateBeneficiary] = useState<Beneficiary | null>(null);
    const [createBeneficiary, setCreateBeneficiary] = useState<Beneficiary | null>(null);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

    const [filterBeneficiaryName, setFilterBeneficiaryName] = useState('');

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [beneficiaryToDelete, setBeneficiaryToDelete] = useState<Beneficiary | null>(null);

    const beneficiariesApi = new BeneficiariesApi(apiConfig);
    const oscsApi = new OscsApi(apiConfig);

    const dialogTitle = () => {
        return isVisualizing ? 'Visualizar Público' : updateBeneficiary ? 'Atualizar Público' : 'Criar Público';
    }

    useEffect(() => {
        fetchBeneficiaries();
    }, [page, rowsPerPage]);

    const fetchBeneficiaries = async (customFilters?: Filter[]) => {
        try {
            setLoading(true);
            setBeneficiaries([]);

            const filters: Filter[] = customFilters ? customFilters : [];

            const listBeneficiaryRequest: ListBeneficiaryRequest = {
                pageNumber: page + 1,
                pageSize: rowsPerPage,
                filters: filters.length > 0 ? filters : undefined,
            };

            const { data } = await beneficiariesApi.listBeneficiary(listBeneficiaryRequest);

            if (!data.items || data.items.length === 0) {
                setNoDataMessage('Nenhum público encontrado.');
                setBeneficiaries([]);
                return;
            }

            setBeneficiaries(
                (data.items ?? []).map((item) => ({
                    ...item,
                }))
            );

            setTotalCount(data.totalItems || 0);
            setNoDataMessage('');
        } catch (error) {
            console.error('Erro ao carregar público:', error);
            toast.error('Erro ao carregar público.');
            setBeneficiaries([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = () => {
        const filters: Filter[] = [];

        if (filterBeneficiaryName && filterBeneficiaryName.trim() !== '') {
            filters.push({
                propertyName: 'name',
                operation: 7,
                value: filterBeneficiaryName.trim(),
            });
        }
        setPage(0);
        fetchBeneficiaries(filters);
    }

    const handleClearFilters = () => {
        setPage(0);
        setFilterBeneficiaryName('');
        fetchBeneficiaries([]);
    }

    const handleAdd = () => {
        setCreateBeneficiary({
            name: '',
            notes: '',
        });
        setIsVisualizing(false);
        resetForm();
        setOpenModal(true);
    }

    const resetForm = () => {
        setUpdateBeneficiary(null);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setTimeout(() => {
            resetForm();
            setIsVisualizing(false);
            setSelectedBeneficiary(null);
        }, 300);
    }

    const handleUpdateBeneficiary = async (beneficiary: Beneficiary) => {
        try {
            setModalLoading(true);

            const { data } = await beneficiariesApi.getBeneficiary(beneficiary.beneficiaryId!);

            setUpdateBeneficiary(data);
            setIsVisualizing(false);
            setOpenModal(true);
        } catch (error) {
            console.error('Erro ao carregar dados do público:', error);
            toast.error('Erro ao carregar dados do público.');
        } finally {
            setModalLoading(false);
        }
    }

    const handleView = async (beneficiary: Beneficiary) => {
        try {
            const { data } = await beneficiariesApi.getBeneficiary(beneficiary.beneficiaryId!);
            setSelectedBeneficiary(data);
            setIsVisualizing(true);
            setOpenModal(true);
        } catch (error) {
            console.error('Erro ao carregar dados do público:', error);
            toast.error('Erro ao carregar dados do público.');
        }
    }

    const handleDelete = async (beneficiary: Beneficiary) => {
        setBeneficiaryToDelete(beneficiary);
        setOpenDeleteModal(true);
    }

    const confirmDelete = async () => {
        if (!beneficiaryToDelete)
            return;

        try {
            await beneficiariesApi.deleteBeneficiary(beneficiaryToDelete.beneficiaryId!);
            toast.success('Público deletado com sucesso.');
            fetchBeneficiaries();
        } catch (error) {
            console.error('Erro ao deletar público:', error);
            toast.error('Erro ao deletar público.');
        } finally {
            setOpenDeleteModal(false);
            setBeneficiaryToDelete(null);
        }
    }

    const handleSave = async () => {
        const beneficiaryForm = updateBeneficiary || createBeneficiary;

        if (!validateBeneficiaryForm(beneficiaryForm))
            return;

        if (updateBeneficiary) {
            try {
                const updateBeneficiaryRequest: UpdateBeneficiaryRequest = {
                    name: updateBeneficiary.name!,
                    notes: updateBeneficiary.notes!,
                };

                await beneficiariesApi.updateBeneficiary(updateBeneficiary.beneficiaryId!, updateBeneficiaryRequest);

                toast.success('Público atualizado com sucesso.');
                handleCloseModal();
                fetchBeneficiaries();
            } catch (error) {
                console.error('Erro ao atualizar público:', error);
                toast.error('Erro ao atualizar público.');
            } finally {
                setModalLoading(false);
            }
        }
        else {
            try {
                const createBeneficiaryRequest: CreateBeneficiaryRequest = {
                    name: createBeneficiary!.name!,
                    notes: createBeneficiary!.notes!,
                };

                await beneficiariesApi.createBeneficiary(createBeneficiaryRequest);

                toast.success('Público criado com sucesso.');
                handleCloseModal();
                fetchBeneficiaries();
            } catch (error) {
                console.error('Erro ao criar público:', error);
                toast.error('Erro ao criar público.');
            } finally {
                setModalLoading(false);
            }
        }
    }

    const validateBeneficiaryForm = (beneficiary: any): boolean => {
        const requiredFields = ['name', 'notes'];

        for (const field of requiredFields) {
            if (!beneficiary[field] || beneficiary[field].toString().trim() === '') {
                toast.error(`O campo "${formatFieldName(field)}" é obrigatório!`);
                return false;
            }
        }

        return true;
    }

    const formatFieldName = (field: string): string => {
        const mapping: Record<string, string> = {
            name: 'Nome',
            notes: 'Observações',
        };
        return mapping[field] || field;
    }

    const columns: Column<Beneficiary>[] = [
        { label: 'ID', field: 'beneficiaryId' },
        { label: 'Nome', field: 'name' },
        { label: 'Observações', field: 'notes' },
    ];

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
                        <TitleAndButtons title="Lista de Público" onAdd={handleAdd} addLabel="Novo Público" />

                        {/* Filtro por nome de Público */}
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
                                <SearchIcon sx={{ color: '#1E4EC4', fontSize: '1.25rem' }} />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: '#1a1a2e',
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                    }}
                                >
                                    Busca de Público
                                </Typography>

                                {filterBeneficiaryName && (
                                    <Chip
                                        label="Busca ativa"
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

                            <Grid container spacing={{ xs: 2, md: 2.5 }}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <TextField
                                        label="Nome do Público"
                                        value={filterBeneficiaryName}
                                        onChange={(e) => setFilterBeneficiaryName(e.target.value)}
                                        placeholder="Digite o nome..."
                                        fullWidth
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: 'white',
                                                '&:hover fieldset': {
                                                    borderColor: '#1E4EC4',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#1E4EC4',
                                                    borderWidth: 2,
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#1E4EC4',
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid
                                    size={{ xs: 12, sm: 6, md: 8 }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                                        gap: 1.5,
                                        mt: { xs: 1.5, sm: 0 },
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<SearchIcon />}
                                        onClick={handleSearch}
                                        sx={{
                                            bgcolor: '#1E4EC4',
                                            color: 'white',
                                            fontWeight: 600,
                                            px: 4,
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
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Tabela */}
                        <Box sx={{ flexGrow: 1, mt: 3 }}>
                            {loading ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 200,
                                    }}
                                >
                                    <CircularProgress sx={{ color: '#1E4EC4' }} />
                                </Box>
                            ) : (
                                <Table
                                    columns={columns}
                                    data={beneficiary}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    totalCount={totalCount}
                                    onPageChange={setPage}
                                    onRowsPerPageChange={setRowsPerPage}
                                    onEdit={handleUpdateBeneficiary}
                                    onView={handleView}
                                    onDelete={handleDelete}
                                />
                            )}
                        </Box>

                        {/* Delete Modal */}
                        <ConfirmDialog
                            open={openDeleteModal}
                            onClose={() => setOpenDeleteModal(false)}
                            onConfirm={confirmDelete}
                            title='Confirmar exclusão'
                            message='Deseja realmente excluir este Público?'
                            highlightText={beneficiaryToDelete?.name}
                            confirmLabel='Excluir'
                            cancelLabel='Cancelar'
                            danger
                        />

                        {/* Modal */}
                        <DialogPadronized
                            open={openModal}
                            onClose={handleCloseModal}
                            maxWidth="md"
                            title={dialogTitle()}
                            content={
                                isVisualizing && selectedBeneficiary ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                                        <TextField
                                            label="Nome"
                                            value={selectedBeneficiary.name || ''}
                                            fullWidth
                                            slotProps={{
                                                input: { readOnly: true },
                                            }}
                                            sx={{ pointerEvents: 'none' }}
                                        />
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                                <strong>Observações</strong>
                                            </Typography>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    bgcolor: '#f9fafb',
                                                    borderRadius: 1.5,
                                                    minHeight: 80,
                                                    maxHeight: 300,
                                                    overflowY: 'auto',
                                                }}
                                            >
                                                <Typography
                                                    color="text.primary"
                                                    sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                                                >
                                                    {selectedBeneficiary.notes || 'Nenhuma observação registrada.'}
                                                </Typography>
                                            </Paper>
                                        </Box>

                                        {/* Chips de OSC */}
                                        <Box>
                                            <Typography variant="subtitle1">
                                                <strong>OSC</strong>
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />

                                            {selectedBeneficiary.oscs && selectedBeneficiary.oscs.length > 0 ? (
                                                <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                                                    {selectedBeneficiary.oscs.map((b) => (
                                                        <Chip key={b.oscId} label={b.name} color="primary" variant="outlined" />
                                                    ))}
                                                </Stack>
                                            ) : (
                                                <Typography color="text.secondary" mt={1}>
                                                    Nenhum OSC.
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                ) : updateBeneficiary ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                                        {/* Campos de texto editáveis */}
                                        <TextField
                                            label="Nome"
                                            value={updateBeneficiary.name || ''}
                                            onChange={(e) =>
                                                setUpdateBeneficiary({ ...updateBeneficiary, name: e.target.value })
                                            }
                                            fullWidth
                                        />
                                        <TextField
                                            label="Observações"
                                            value={updateBeneficiary.notes || ''}
                                            onChange={(e) =>
                                                setUpdateBeneficiary({ ...updateBeneficiary, notes: e.target.value })
                                            }
                                            fullWidth
                                            variant= 'outlined'
                                            multiline
                                            minRows={3}
                                            maxRows={8}
                                        />

                                        {/* Chips de OSC */}
                                        <Box>
                                            <Typography variant="subtitle1">
                                                <strong>OSC</strong>
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />

                                            {updateBeneficiary.oscs && updateBeneficiary.oscs.length > 0 ? (
                                                <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                                                    {updateBeneficiary.oscs.map((b) => (
                                                        <Chip key={b.oscId} label={b.name} color="primary" variant="outlined" />
                                                    ))}
                                                </Stack>
                                            ) : (
                                                <Typography color="text.secondary" mt={1}>
                                                    Nenhum OSC.
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                ) : createBeneficiary ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                                        {/* Campos de texto editáveis */}
                                        <TextField
                                            label="Nome"
                                            value={createBeneficiary.name || ''}
                                            onChange={(e) =>
                                                setCreateBeneficiary({ ...createBeneficiary, name: e.target.value })
                                            }
                                            fullWidth
                                        />
                                        <TextField
                                            label="Observações"
                                            value={createBeneficiary.notes || ''}
                                            onChange={(e) =>
                                                setCreateBeneficiary({ ...createBeneficiary, notes: e.target.value })
                                            }
                                            fullWidth
                                            variant= 'outlined'
                                            multiline
                                            minRows={3}
                                            maxRows={8}
                                        />
                                    </Box>
                                ) : (
                                    <Typography>Nenhum dado encontrado.</Typography>
                                )
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
                    </Box>
                </Paper>
            </Container>
        </LocalizationProvider>
    );
};

export default Beneficiary;