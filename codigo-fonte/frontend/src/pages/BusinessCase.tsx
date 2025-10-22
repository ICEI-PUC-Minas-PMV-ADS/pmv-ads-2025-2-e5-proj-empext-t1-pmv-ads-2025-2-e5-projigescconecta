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
    BusinessCasesApi,
    OriginsBusinessCasesApi,
    CreateBusinessCaseRequest,
    UpdateBusinessCaseRequest,
    ListBusinessCaseRequest,
    Filter,
    Op,
} from './../api';
import { apiConfig } from '../services/auth';
import { alpha } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { Chip, Paper } from '@mui/material';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { useNavigate } from 'react-router-dom';
import DialogPadronized from '@/components/DialogPadronized';

dayjs.locale('pt-br');

interface BusinessCase {
    businessCaseId?: number;
    name?: string;
    originsBusinessCases?: number;
    origins?: OriginBusinessCase[];
}

interface OriginBusinessCase {
    originBusinessCaseId?: number;
    name?: string;
}

const BusinessCase: React.FC = () => {
    const [businessCase, setBusinessCase] = useState<BusinessCase[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [noDataMessage, setNoDataMessage] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [updateBusinessCase, setUpdateBusinessCase] = useState<BusinessCase | null>(null);
    const [createBusinessCase, setCreateBusinessCase] = useState<BusinessCase | null>(null);
    const [selectedBusinessCase, setSelectedBusinessCase] = useState<BusinessCase | null>(null);

    const [filterBusinessCaseName, setFilterBusinessCaseName] = useState<string>('');

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [businessCaseToDelete, setBusinessCaseToDelete] = useState<BusinessCase | null>(null);

    const businessCaseApi = new BusinessCasesApi(apiConfig);
    const navigate = useNavigate();

    const handleDirect = (businessCase: BusinessCase) => {
        if (!businessCase.businessCaseId)
            return;

        navigate(`/business-case/${businessCase.businessCaseId}/origin-business-case`, {
            state: { name: businessCase.name }
        });
    };

    const dialogTitle = () => {
        return isVisualizing ? `Visualizar Grupo de Causas` : updateBusinessCase ? `Editar Grupo de Causas` : 'Adicionar Grupo de Causas';
    }

    useEffect(() => {
        fetchBusinessCases();
    }, [page, rowsPerPage]);

    const fetchBusinessCases = async (customFilters?: Filter[]) => {
        try {
            setLoading(true);
            setBusinessCase([]);

            const filters: Filter[] = customFilters ? customFilters : [];

            const listBusinessCaseRequest: ListBusinessCaseRequest = {
                pageNumber: page + 1,
                pageSize: rowsPerPage,
                filters: filters.length > 0 ? filters : undefined,
            };

            const { data } = await businessCaseApi.listBusinessCase(listBusinessCaseRequest);

            if (!data.items || data.items.length === 0) {
                setNoDataMessage('Nenhum Grupo de Causas encontrado.');
                setBusinessCase([]);
                return;
            }

            setBusinessCase(
                (data.items ?? []).map((item) => ({
                    ...item,
                }))
            );

            setTotalCount(data.totalItems || 0);
            setNoDataMessage('');
        } catch (error) {
            console.error('Erro ao carregar Grupo de Causas:', error);
            toast.error('Erro ao carregar Grupo de Causas.');
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = () => {
        const filters: Filter[] = [];

        if (filterBusinessCaseName && filterBusinessCaseName.trim() !== '') {
            filters.push({
                propertyName: 'name',
                operation: 7,
                value: filterBusinessCaseName.trim(),
            });
        }
        setPage(0);
        fetchBusinessCases(filters);
    }

    const handleClearFilters = () => {
        setPage(0);
        setFilterBusinessCaseName('');
        fetchBusinessCases([]);
    }

    const handleAdd = () => {
        setCreateBusinessCase({
            name: '',
        });
        setIsVisualizing(false);
        resetForm();
        setOpenModal(true);
    }

    const resetForm = () => {
        setUpdateBusinessCase(null);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setTimeout(() => {
            resetForm();
            setIsVisualizing(false);
            setSelectedBusinessCase(null);
        }, 300);
    }

    const handleUpdateBusinessCase = async (businessCase: BusinessCase) => {
        try {
            setModalLoading(true);

            const { data } = await businessCaseApi.getBusinessCase(businessCase.businessCaseId!);

            setUpdateBusinessCase(data);
            setIsVisualizing(false);
            setOpenModal(true);
        } catch (error) {
            console.error('Erro ao carregar Grupo de Causas:', error);
            toast.error('Erro ao carregar Grupo de Causas.');
        } finally {
            setModalLoading(false);
        }
    }

    const handleView = async (businessCase: BusinessCase) => {
        try {
            const { data } = await businessCaseApi.getBusinessCase(businessCase.businessCaseId!);
            setSelectedBusinessCase(data);
            setIsVisualizing(true);
            setOpenModal(true);
        } catch (error) {
            console.error('Erro ao carregar Grupo de Causas:', error);
            toast.error('Erro ao carregar Grupo de Causas.');
        }
    }

    const handleDelete = async (businessCase: BusinessCase) => {
        setBusinessCaseToDelete(businessCase);
        setOpenDeleteModal(true);
    }

    const confirmDelete = async () => {
        if (!businessCaseToDelete)
            return;

        try {
            await businessCaseApi.deleteBusinessCase(businessCaseToDelete.businessCaseId!);
            toast.success('Grupo de Causas deletado com sucesso.');
            fetchBusinessCases();
        } catch (error) {
            console.error('Erro ao deletar Grupo de Causas:', error);
            toast.error(error?.response?.data?.errors?.[0]);
        } finally {
            setOpenDeleteModal(false);
            setBusinessCaseToDelete(null);
        }
    }

    const handleSave = async () => {
        const businessCaseForm = updateBusinessCase || createBusinessCase;

        if (validateBusinessCaseForm(businessCaseForm) !== null)
            return;

        if (updateBusinessCase) {
            try {
                const updateBusinessCaseRequest: UpdateBusinessCaseRequest = {
                    name: updateBusinessCase.name!,
                };

                await businessCaseApi.updateBusinessCase(updateBusinessCase.businessCaseId!, updateBusinessCaseRequest);

                toast.success('Grupo de Causas atualizado com sucesso.');
                handleCloseModal();
                fetchBusinessCases();
            } catch (error) {
                console.error('Erro ao atualizar Grupo de Causas:', error);
                toast.error('Erro ao atualizar Grupo de Causas.');
            } finally {
                setModalLoading(false);
            }
        }
        else {
            try {
                const createBusinessCaseRequest: CreateBusinessCaseRequest = {
                    name: createBusinessCase!.name!,
                };

                await businessCaseApi.createBusinessCase(createBusinessCaseRequest);

                toast.success('Grupo de Causas criado com sucesso.');
                handleCloseModal();
                fetchBusinessCases();
            } catch (error) {
                console.error('Erro ao criar Grupo de Causas:', error);
                toast.error('Erro ao criar Grupo de Causas.');
            } finally {
                setModalLoading(false);
            }
        }
    }

    const validateBusinessCaseForm = (businessCase: any): string | null => {
        const requiredFields = ['name'];

        for (const field of requiredFields) {
            if (!businessCase[field] || businessCase[field].toString().trim() === '') {
                const message = (`O campo "${formatFieldName(field)}" é obrigatório!`);
                toast.error(message)
                return message;
            }
        }

        return null;
    }

    const formatFieldName = (field: string): string => {
        const mapping: Record<string, string> = {
            name: 'Nome',
        };
        return mapping[field] || field;
    }

    const columns: Column<BusinessCase>[] = [
        { label: 'ID', field: 'businessCaseId' },
        { label: 'Nome', field: 'name' },
        { label: 'Causas', field: 'originsBusinessCases' },
    ];

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
                    }}
                >
                    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <TitleAndButtons title="Lista de Grupo de Causas" onAdd={handleAdd} addLabel="Novo Grupo de Causas" />

                        {/* Filtro por nome de Grupo de Causas */}
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
                                    Busca de Grupo de Causas
                                </Typography>

                                {filterBusinessCaseName && (
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
                                        label="Nome do Grupo de Causas"
                                        value={filterBusinessCaseName}
                                        onChange={(e) => setFilterBusinessCaseName(e.target.value)}
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
                                    data={businessCase}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    totalCount={totalCount}
                                    onPageChange={setPage}
                                    onRowsPerPageChange={setRowsPerPage}
                                    onEdit={handleUpdateBusinessCase}
                                    onView={handleView}
                                    onDelete={handleDelete}
                                    onOriginBusinessCase={handleDirect}
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
                            highlightText={businessCaseToDelete?.name}
                            confirmLabel='Excluir'
                            cancelLabel='Cancelar'
                            danger
                        />

                        {/* Modal */}
                        <DialogPadronized
                            open={openModal}
                            onClose={handleCloseModal}
                            maxWidth="sm"
                            title={dialogTitle()}
                            content={isVisualizing && selectedBusinessCase ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                                    <TextField
                                        label="Nome"
                                        value={selectedBusinessCase.name || ''}
                                        fullWidth
                                        variant="outlined"
                                        slotProps={{
                                            input: { readOnly: true },
                                        }}
                                        sx={{ pointerEvents: 'none' }}
                                    />

                                    {/* Chips de Causas */}
                                    <Box>
                                        <Typography variant="subtitle1">
                                            <strong>Causas</strong>
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />

                                        {selectedBusinessCase.origins && selectedBusinessCase.origins.length > 0 ? (
                                            <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                                                {selectedBusinessCase.origins.map((b) => (
                                                    <Chip
                                                        key={b.originBusinessCaseId}
                                                        label={b.name}
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Typography color="text.secondary" mt={1}>
                                                Nenhuma Causa.
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            ) : updateBusinessCase ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                                    {/* Campos de texto editáveis */}
                                    <TextField
                                        label="Nome"
                                        value={updateBusinessCase.name || ''}
                                        onChange={(e) => setUpdateBusinessCase({ ...updateBusinessCase, name: e.target.value })}
                                        fullWidth
                                    />

                                    {/* Chips de OriginBusinessCase */}
                                    <Box>
                                        <Typography variant="subtitle1">
                                            <strong>Causas</strong>
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />

                                        {updateBusinessCase.origins && updateBusinessCase.origins.length > 0 ? (
                                            <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                                                {updateBusinessCase.origins.map((b) => (
                                                    <Chip
                                                        key={b.originBusinessCaseId}
                                                        label={b.name}
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Typography color="text.secondary" mt={1}>Nenhuma Causa.</Typography>
                                        )}
                                    </Box>
                                </Box>
                            ) : createBusinessCase ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                                    {/* Campos de texto editáveis */}
                                    <TextField
                                        label="Nome"
                                        value={createBusinessCase.name || ''}
                                        onChange={(e) => setCreateBusinessCase({ ...createBusinessCase, name: e.target.value })}
                                        fullWidth
                                    />
                                </Box>) :
                                (
                                    <Typography>Nenhum dado encontrado.</Typography>
                                )}
                            actions={isVisualizing ? (
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
                            )}
                        />
                    </Box>
                </Paper>
            </Container>
        </LocalizationProvider>
    );
};

export default BusinessCase;