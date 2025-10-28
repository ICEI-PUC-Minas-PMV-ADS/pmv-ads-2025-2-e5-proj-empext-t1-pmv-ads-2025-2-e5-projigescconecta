import React, { useState, useEffect, use } from 'react';
import {
    Box,
    Container,
    Button,
    CircularProgress,
    Grid,
    Typography,
    TextField,
    Autocomplete
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PatternFormat } from 'react-number-format';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { toast } from 'react-toastify';
import {
    PersonOscApi,
    PersonsApi,
    CreatePersonOscRequest,
    ListPersonOscRequest,
    Filter,
} from '../api';
import { apiConfig } from '../services/auth';
import { alpha } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';
import { Chip, Paper } from '@mui/material';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import DialogPadronized from '@/components/DialogPadronized';

dayjs.locale('pt-br');

interface PersonOsc {
    personOscId?: number;
    oscId?: number;
    personId?: number;
    name?: string;
    email?: string;
    personalDocumment?: string;
    primaryPhone?: string | null;
}

interface Person {
    personId?: number;
    name?: string;
    email?: string;
    personalDocumment?: string;
    primaryPhone?: string | null;
}

const PersonOsc: React.FC = () => {
    const { oscId } = useParams<{ oscId }>();

    const [personOsc, setPersonOsc] = useState<PersonOsc[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [noDataMessage, setNoDataMessage] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [createPersonOsc, setCreatePersonOsc] = useState<PersonOsc | null>(null);
    const [selectedPersonOsc, setSelectedPersonOsc] = useState<Person | null>(null);

    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [personResults, setPersonResults] = useState<Person[]>([])
    const [personLoading, setPersonLoading] = useState(false);
    const [inputPersonValue, setInputPersonValue] = useState('');
    const [filterPersonName, setFilterPersonName] = useState('');

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [personOscToDelete, setPersonOscToDelete] = useState<PersonOsc | null>(null);

    const personOscApi = new PersonOscApi(apiConfig);
    const personApi = new PersonsApi(apiConfig)
    const navigate = useNavigate();
    const locationName = useLocation();

    const { name } = locationName.state || {};

    const dialogTitle = () => {
        return isVisualizing ? 'Visualizar Integrante' : 'Adicionar Integrante';
    }

    useEffect(() => {
        fetchPersonOsc()
    }, [page, rowsPerPage])

    const fetchPersonOsc = async (customFilters?: Filter[]) => {
        try {
            setLoading(true);
            setPersonOsc([]);

            const filters: Filter[] = customFilters ? customFilters : [];

            const listPersonOscRequest: ListPersonOscRequest = {
                pageNumber: page + 1,
                pageSize: rowsPerPage,
                filters: filters.length > 0 ? filters : undefined,
            };

            const { data } = await personOscApi.listPersonOsc(Number(oscId), listPersonOscRequest)

            if (!data.items || data.items.length === 0) {
                setNoDataMessage('Nenhuma causa encontrada');
                setPersonOsc([]);
                return;
            }

            setPersonOsc(
                (data.items ?? []).map((item) => ({
                    ...item
                }))
            );

            setTotalCount(data.totalItems || 0);
            setNoDataMessage('');
        } catch (error) {
            console.error('Erro ao carregar participantes:', error);
            toast.error('Erro ao carregar participantes');
            setPersonOsc([]);
            setTotalCount(0);
        } finally {
            setLoading(false)
        }
    }

    const fetchPerson = async (searchValue?: string) => {
        try {
            setPersonLoading(true);

            const request: any = {
                pageNumber: 1,
                pageSize: 10,
            };

            if (searchValue && searchValue.trim() !== '') {
                request.filters = [
                    {
                        propertyName: 'name',
                        operation: 7,
                        value: searchValue
                    }
                ];
            }

            const { data } = await personApi.listPerson(request);

            setPersonResults(data.items || [])
        } catch (error) {
            console.error('Erro ao buscar Pessoa', error);
            toast.error('Erro ao buscas Pessoa')
        } finally {
            setPersonLoading(false);
        }
    }

    const handleAdd = () => {
        setCreatePersonOsc({
            personId: Number()
        });
        setIsVisualizing(false);
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setTimeout(() => {
            setIsVisualizing(false);
            setSelectedPersonOsc(null);
        }, 300)
        setSelectedPerson(null)
        setInputPersonValue('')
        setPersonResults([])
    }

    const handleViewPerson = async (personOsc: PersonOsc) => {
        try {
            const { data } = await personApi.getPerson(personOsc.personId!);
            setSelectedPersonOsc(data);
            setIsVisualizing(true);
            setOpenModal(true);
        } catch (error) {
            console.error('Erro ao carregar Pessoa:', error);
            toast.error('Erro ao carregar Pessoa')
        } finally {
            setModalLoading(false);
        }
    }

    const handleDelete = async (personOsc: PersonOsc) => {
        setPersonOscToDelete(personOsc);
        setOpenDeleteModal(true);
    }

    const confirmDelete = async () => {
        if (!personOsc)
            return;

        try {
            await personOscApi.deletePersonOsc(personOscToDelete?.personOscId!)
            toast.success('Integrante deletado com sucesso')
            fetchPersonOsc()
        } catch (error) {
            console.error('Erro ao deletar Integrante', error);
            toast.error('Erro ao deletar Integrante')
        } finally {
            setOpenDeleteModal(false);
            setPersonOscToDelete(null);
        }
    }

    const handleSave = async () => {
        const personOscForm = createPersonOsc;

        if (validateForm(personOscForm) !== null)
            return

        try {
            const createPersonOscRequest: CreatePersonOscRequest = {
                personId: personOscForm?.personId!
            };

            await personOscApi.createPersonOsc(Number(oscId), createPersonOscRequest);

            toast.success('Integrante adicionado com sucesso')
            handleCloseModal();
            fetchPersonOsc();
        } catch (error) {
            console.error('Erro ao adicionar integrante', error);
            toast.error('Erro ao adicionar o integrante');
        } finally {
            setModalLoading(false);
        }
    }

    const validateForm = (personOsc: any): string | null => {
        const requiredFields = ['personId'];

        for (const field of requiredFields) {
            if (!personOsc[field] || personOsc[field].toString().trim() === '') {
                const message = (`O campo "${formatFieldName(field)}" é obrigatório!`);
                toast.error(message)
                return message;
            }
        }

        return null;
    };

    const formatFieldName = (field: string): string => {
        const mapping: Record<string, string> = {
            personId: 'Pessoa',
        };
        return mapping[field] || field;
    };

    const handleSearch = () => {
        const filters: Filter[] = [];

        if(filterPersonName && filterPersonName.trim() !== ''){
            filters.push({
                propertyName: 'person.name',
                operation: 7,
                value: filterPersonName.trim(),
            });
        }
        setPage(0);
        fetchPersonOsc(filters);
    }

    const handleClearFilters = () => {
        setPage(0);
        setFilterPersonName('');
        fetchPersonOsc([]);
    }

    const columns: Column<PersonOsc>[] = [
        { label: 'ID', field: 'personId' },
        { label: 'Nome', field: 'name' },
        { label: 'Email', field: 'email' },
        {
            label: 'Documento', field: 'personalDocumment',
            render: (value) =>
                typeof value === 'string'
                    ? value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
                    : '',
        },
        {
            label: 'Telefone', field: 'primaryPhone',
            render: (value) =>
                typeof value === 'string'
                    ? value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
                    : ''
        }
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
                            <span style={{ color: '#555' }}>OSC: {name} </span> ›
                            <span style={{ color: '#555' }}> Integrantes</span>
                        </div>

                        <TitleAndButtons title="Lista de Integrantes" onAdd={handleAdd} addLabel="Novo Integrante" />

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
                                    Busca de Integrante
                                </Typography>

                                {filterPersonName && (
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
                                        label="Nome do Integrante"
                                        value={filterPersonName}
                                        onChange={(e) => setFilterPersonName(e.target.value)}
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
                                    data={personOsc}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    totalCount={totalCount}
                                    onPageChange={setPage}
                                    onRowsPerPageChange={setRowsPerPage}
                                    onView={handleViewPerson}
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
                            message='Deseja realmente excluir esse integrante?'
                            highlightText={personOscToDelete?.name}
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
                                isVisualizing && selectedPersonOsc ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                                        {/* Campos de texto editáveis */}
                                        <TextField
                                            label="Nome"
                                            value={selectedPersonOsc.name || ''}
                                            fullWidth
                                            variant='outlined'
                                            slotProps={{
                                                input: { readOnly: true }
                                            }}
                                            sx={{ pointerEvents: 'none' }}
                                        />
                                        <TextField
                                            label="Email"
                                            value={selectedPersonOsc.email || ''}
                                            fullWidth
                                            variant='outlined'
                                            slotProps={{
                                                input: { readOnly: true }
                                            }}
                                            sx={{ pointerEvents: 'none' }}
                                        />
                                        <PatternFormat
                                            customInput={TextField}
                                            label="Documento"
                                            fullWidth
                                            value={selectedPersonOsc.personalDocumment || ''}
                                            readOnly
                                            variant="outlined"
                                            format='###.###.###-##'
                                            mask="_"
                                            sx={{ pointerEvents: 'none' }}
                                        />
                                        <PatternFormat
                                            customInput={TextField}
                                            label="Telefone"
                                            fullWidth
                                            value={selectedPersonOsc.primaryPhone || ''}
                                            readOnly
                                            variant="outlined"
                                            format="(##) #####-####"
                                            mask="_"
                                            sx={{ pointerEvents: 'none' }}
                                        />
                                    </Box>
                                ) : createPersonOsc ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                                        <Autocomplete
                                            options={personResults}
                                            getOptionLabel={(option) => option.name ?? ''}
                                            loading={personLoading}
                                            value={selectedPerson}
                                            onChange={(event, newValue) => {
                                                setSelectedPerson(newValue);
                                                setCreatePersonOsc(prev => ({
                                                    ...prev,
                                                    personId: newValue?.personId,
                                                }));
                                            }}
                                            inputValue={inputPersonValue}
                                            onInputChange={(event, newInputValue, reason) => {
                                                setInputPersonValue(newInputValue);
                                                if (reason === 'input') {
                                                    fetchPerson(newInputValue);
                                                }
                                            }}
                                            onOpen={() => {
                                                if (personResults.length === 0) {
                                                    fetchPerson();
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Pessoa*"
                                                    variant="outlined"
                                                    fullWidth
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <>
                                                                {personLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </>
                                                        ),
                                                    }}
                                                />
                                            )}
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

export default PersonOsc