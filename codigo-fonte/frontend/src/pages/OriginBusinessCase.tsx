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
    OriginsBusinessCasesApi,
    CreateOriginBusinessCaseRequest,
    UpdateOriginBusinessCaseRequest,
    ListOriginBusinessCaseRequest,
    Filter,
    Op,
    ListOriginsBusinessCaseByBusinessCaseIdRequest
} from '../api';
import { apiConfig } from '../services/auth';
import { alpha } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { Chip, Paper } from '@mui/material';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import DialogPadronized from '@/components/DialogPadronized';

dayjs.locale('pt-br');

interface OriginBusinessCase {
    originBusinessCaseId?: number;
    name?: string;
    notes?: string;
    businessCaseId?: number;
}

const OriginBusinessCase: React.FC = () => {
    const { businessCaseId } = useParams<{ businessCaseId: string }>();

    const [originBusinessCase, setOriginBusinessCase] = useState<OriginBusinessCase[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [noDataMessage, setNoDataMessage] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [updateOriginBusinessCase, setUpdateOriginBusinessCase] = useState<OriginBusinessCase | null>(null);
    const [createOriginBusinessCase, setCreateOriginBusinessCase] = useState<OriginBusinessCase | null>(null);
    const [selectedOriginBusinessCase, setSelectedOriginBusinessCase] = useState<OriginBusinessCase | null>(null);

    const [filterOriginBusinessCaseName, setFilterOriginBusinessCaseName] = useState<string>('');

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [originBusinessCaseToDelete, setOriginBusinessCaseToDelete] = useState<OriginBusinessCase | null>(null);

    const originBusinessCasesApi = new OriginsBusinessCasesApi(apiConfig);
    const navigate = useNavigate();
    const locationName = useLocation();

    const { name } = locationName.state || {};

    const dialogTitle = () => {
        return isVisualizing ? 'Visualizar Causa' : updateOriginBusinessCase ? 'Editar Causa' : 'Adicionar Causa';
    }

    useEffect(() => {
        fetchOriginBusinessCases();
    }, [page, rowsPerPage]);

    const fetchOriginBusinessCases = async (customFilters?: Filter[]) => {
        try {
            setLoading(true);
            setOriginBusinessCase([]);

            const filters: Filter[] = customFilters ? customFilters : [];

            const listOriginBusinessCaseRequest: ListOriginsBusinessCaseByBusinessCaseIdRequest = {
                pageNumber: page + 1,
                pageSize: rowsPerPage,
                filters: filters.length > 0 ? filters : undefined,
                businessCaseId: Number(businessCaseId!)
            };

            const { data } = await originBusinessCasesApi.listOriginsBusinessCaseByBusinessCaseId(listOriginBusinessCaseRequest);

            if (!data.items || data.items.length === 0) {
                setNoDataMessage('Nenhuma causa encontrada');
                setOriginBusinessCase([]);
                return;
            }

            setOriginBusinessCase(
                (data.items ?? []).map((item) => ({
                    ...item
                }))
            );

            setTotalCount(data.totalItems || 0);
            setNoDataMessage('');
        } catch (error) {
            console.error('Erro ao carregar causas:', error);
            toast.error('Erro ao carregar causas');
            setOriginBusinessCase([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = () => {
        const filters: Filter[] = [];

        if (filterOriginBusinessCaseName && filterOriginBusinessCaseName.trim() !== '') {
            filters.push({
                propertyName: 'name',
                operation: 7,
                value: filterOriginBusinessCaseName.trim()
            });
        }
        setPage(0);
        fetchOriginBusinessCases(filters);
    }

    const handleClearFilters = () => {
        setPage(0);
        setFilterOriginBusinessCaseName('');
        fetchOriginBusinessCases([]);
    }

    const handleAdd = () => {
        setCreateOriginBusinessCase({
            name: '',
        });
        setIsVisualizing(false);
        resetForm();
        setOpenModal(true);
    }

    const resetForm = () => {
        setUpdateOriginBusinessCase(null);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setTimeout(() => {
            resetForm();
            setIsVisualizing(false);
            setSelectedOriginBusinessCase(null);
        }, 300);
    }

    const handleUpdateOriginBusinessCase = async (originBusinessCase: OriginBusinessCase) => {
        try {
            setModalLoading(true);

            const { data } = await originBusinessCasesApi.getOriginBusinessCase(originBusinessCase.originBusinessCaseId!);

            setUpdateOriginBusinessCase(data);
            setIsVisualizing(false);
            setOpenModal(true);
        } catch (error) {
            console.error('Erro ao carregar causa:', error);
            toast.error('Erro ao carregar causa');
        } finally {
            setModalLoading(false);
        }
    }

    const handleViewOriginBusinessCase = async (originBusinessCase: OriginBusinessCase) => {
        try {
            const { data } = await originBusinessCasesApi.getOriginBusinessCase(originBusinessCase.originBusinessCaseId!);
            setSelectedOriginBusinessCase(data);
            setIsVisualizing(true);
            setOpenModal(true);
        } catch (error) {
            console.error('Erro ao carregar causa:', error);
            toast.error('Erro ao carregar causa');
        } finally {
            setModalLoading(false);
        }
    }

    const handleDelete = async (originBusinessCase: OriginBusinessCase) => {
        setOriginBusinessCaseToDelete(originBusinessCase);
        setOpenDeleteModal(true);
    }

    const confirmDelete = async () => {
        if (!originBusinessCaseToDelete)
            return;

        try {
            await originBusinessCasesApi.deleteOriginBusinessCase(originBusinessCaseToDelete.originBusinessCaseId!);
            toast.success('Causa deletada com sucesso');
            fetchOriginBusinessCases();
        } catch (error) {
            console.error('Erro ao deletar causa:', error);
            toast.error('Erro ao deletar causa');
        } finally {
            setOpenDeleteModal(false);
            setOriginBusinessCaseToDelete(null);
        }
    }

    const handleSave = async () => {
        const originBusinessCaseForm = updateOriginBusinessCase || createOriginBusinessCase;

        if (validateBeneficiaryForm(originBusinessCaseForm) !== null)
            return;

        if (updateOriginBusinessCase) {
            try {
                const updateOriginBusinessCaseRequest: UpdateOriginBusinessCaseRequest = {
                    name: originBusinessCaseForm?.name!,
                    notes: originBusinessCaseForm?.notes!,
                };

                await originBusinessCasesApi.updateOriginBusinessCase(updateOriginBusinessCase!.originBusinessCaseId!, updateOriginBusinessCaseRequest);
                toast.success('Causa atualizada com sucesso');
                handleCloseModal();
                fetchOriginBusinessCases();
            } catch (error) {
                console.error('Erro ao atualizar causa:', error);
                toast.error('Erro ao atualizar causa');
            } finally {
                setModalLoading(false);
            }
        }
        else {
            try {
                const createOriginBusinessCaseRequest: CreateOriginBusinessCaseRequest = {
                    name: originBusinessCaseForm?.name!,
                    notes: originBusinessCaseForm?.notes!,
                    businessCaseId: Number(businessCaseId),
                };

                await originBusinessCasesApi.createOriginBusinessCase(createOriginBusinessCaseRequest);

                toast.success('Causa criada com sucesso');
                handleCloseModal();
                fetchOriginBusinessCases();
            } catch (error) {
                console.error('Erro ao criar causa:', error);
                toast.error('Erro ao criar causa');
            } finally {
                setModalLoading(false);
            }
        }
    }

    const validateBeneficiaryForm = (originBusinessCase: any): string | null => {
        const requiredFields = ['name', 'notes'];

        for (const field of requiredFields) {
            if (!originBusinessCase[field] || originBusinessCase[field].toString().trim() === '') {
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
            notes: 'Observações',
        };
        return mapping[field] || field;
    }

    const columns: Column<OriginBusinessCase>[] = [
        { label: 'ID', field: 'originBusinessCaseId' },
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

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            sx={{
                                borderColor: '#1E4EC4',
                                color: '#1E4EC4',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 2,
                                mr: 2,
                                mb: 2,
                                '&:hover': {
                                    bgcolor: alpha('#1E4EC4', 0.05),
                                    borderColor: '#1E4EC4',
                                },
                            }}
                        >
                            Voltar
                        </Button>

                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ color: '#555' }}>Grupo de Causas</span> ›
                            <span style={{ color: '#555' }}> Grupo: {name} </span>
                        </div>

                        <TitleAndButtons title="Lista de Causas" onAdd={handleAdd} addLabel="Nova Causa" />

                        {/* Filtro por nome de Causa */}
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
                                    Busca de Causa
                                </Typography>

                                {filterOriginBusinessCaseName && (
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
                                        label="Nome do Causa"
                                        value={filterOriginBusinessCaseName}
                                        onChange={(e) => setFilterOriginBusinessCaseName(e.target.value)}
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
                                    data={originBusinessCase}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    totalCount={totalCount}
                                    onPageChange={setPage}
                                    onRowsPerPageChange={setRowsPerPage}
                                    onEdit={handleUpdateOriginBusinessCase}
                                    onView={handleViewOriginBusinessCase}
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
                            message='Deseja realmente excluir este Causa?'
                            highlightText={originBusinessCaseToDelete?.name}
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
                            content={
                                isVisualizing && selectedOriginBusinessCase ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                                        {/* Campos de texto editáveis */}
                                        <TextField
                                            label="Nome"
                                            value={selectedOriginBusinessCase.name || ''}
                                            fullWidth
                                            variant='outlined'
                                            slotProps={{
                                                input: { readOnly: true }
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
                                                    {selectedOriginBusinessCase.notes || 'Nenhuma observação registrada.'}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    </Box>
                                ) : updateOriginBusinessCase ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                                        {/* Campos de texto editáveis */}
                                        <TextField
                                            label="Nome*"
                                            value={updateOriginBusinessCase.name || ''}
                                            onChange={(e) => setUpdateOriginBusinessCase({ ...updateOriginBusinessCase, name: e.target.value })}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Observações*"
                                            value={updateOriginBusinessCase.notes || ''}
                                            onChange={(e) =>
                                                setUpdateOriginBusinessCase({
                                                    ...updateOriginBusinessCase,
                                                    notes: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            variant= 'outlined'
                                            multiline
                                            minRows={3}
                                            maxRows={8}
                                        />
                                    </Box>
                                ) : createOriginBusinessCase ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                                        {/* Campos de texto editáveis */}
                                        <TextField
                                            label="Nome*"
                                            value={createOriginBusinessCase.name || ''}
                                            onChange={(e) => setCreateOriginBusinessCase({ ...createOriginBusinessCase, name: e.target.value })}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Observações*"
                                            value={createOriginBusinessCase.notes || ''}
                                            onChange={(e) =>
                                                setCreateOriginBusinessCase({
                                                    ...createOriginBusinessCase,
                                                    notes: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            minRows={3}
                                            maxRows={8}
                                        />
                                    </Box>) :
                                    (
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
    )
}

export default OriginBusinessCase;