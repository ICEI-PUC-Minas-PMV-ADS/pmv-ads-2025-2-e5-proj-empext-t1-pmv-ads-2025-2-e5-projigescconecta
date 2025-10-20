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
  OriginsBusinessCasesApi,
  CreateOscRequest,
  UpdateOscRequest,
  ListOscRequest,
  Filter,
  Op,
} from './../api';
import { apiConfig } from '../services/auth';
import { alpha } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { Chip, Paper } from '@mui/material';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { PatternFormat } from 'react-number-format';
import { fetchZipCode, SimplifyResponse } from '@/services/cep';
import DialogPadronized from '@/components/DialogPadronized';

dayjs.locale('pt-br');

interface Osc {
  oscId?: number;
  name?: string;
  objective?: string;
  corporateName?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  phoneNumber?: string;
  email?: string;
  webUrl?: string;
  socialMedia?: string;
  zipCode?: string;
  oscPrimaryDocumment?: string | null;
  beneficiariesCount?: number;
  beneficiaries?: Beneficiary[];
  originsBusinessCases?: OriginBusinessCase[];
}

interface Beneficiary {
  beneficiaryId?: number;
  name?: string;
}

interface OriginBusinessCase {
  originBusinessCaseId?: number;
  name?: string;
}

const Osc: React.FC = () => {
  const [osc, setOscs] = useState<Osc[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [noDataMessage, setNoDataMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [updateOsc, setUpdateOsc] = useState<Osc | null>(null);
  const [createOsc, setCreateOsc] = useState<Osc | null>(null);
  const [selectedOsc, setSelectedOsc] = useState<Osc | null>(null);

  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [beneficiaryResults, setBeneficiaryResults] = useState<Beneficiary[]>([]);
  const [beneficiaryLoading, setBeneficiaryLoading] = useState(false);
  const [inputBeneficiaryValue, setInputBeneficiaryValue] = useState('');

  const [selectedOriginBusinessCase, setSelectedOriginBusinessCase] = useState<OriginBusinessCase | null>(null);
  const [originBusinessCaseResults, setOriginBusinessCaseResults] = useState<OriginBusinessCase[]>([]);
  const [originBusinessCaseLoading, setOriginBusinessCaseLoading] = useState(false);
  const [inputOriginBusinessCaseValue, setInputOriginBusinessCaseValue] = useState('');

  const [filterOscName, setFilterOscName] = useState('');

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [oscToDelete, setOscToDelete] = useState<Osc | null>(null);

  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const oscApi = new OscsApi(apiConfig);
  const beneficiariesApi = new BeneficiariesApi(apiConfig);
  const originBusinessCaseApi = new OriginsBusinessCasesApi(apiConfig)

  const dialogTitle = () => {
    return isVisualizing ? 'Visualizar OSC' : updateOsc ? 'Editar OSC' : 'Nova OSC';
  };

  useEffect(() => {
    fetchOscs();
  }, [page, rowsPerPage]);

  const fetchBeneficiaries = async (searchValue: string) => {
    try {
      setBeneficiaryLoading(true);

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

      const { data } = await beneficiariesApi.listBeneficiary(request);

      setBeneficiaryResults(data.items || []);
    } catch (error) {
      console.error('Erro ao buscar Público', error);
      toast.error('Erro ao buscar Público');
    } finally {
      setBeneficiaryLoading(false);
    }
  };

  const fetchOriginBusinessCase = async (searchValue: string) => {
    try {
      setOriginBusinessCaseLoading(true);

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

      const { data } = await originBusinessCaseApi.listOriginBusinessCase(request);

      setOriginBusinessCaseResults(data.items || []);
    } catch (error) {
      console.error('Erro ao buscar Causa', error);
      toast.error('Erro ao buscar Causa');
    } finally {
      setOriginBusinessCaseLoading(false);
    }
  };

  const fetchOscs = async (customFilters?: Filter[]) => {
    try {
      setLoading(true);
      setOscs([]);

      const filters: Filter[] = customFilters ? customFilters : [];

      const listOscRequest: ListOscRequest = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        filters: filters.length > 0 ? filters : undefined,
      };

      const { data } = await oscApi.listOsc(listOscRequest);

      if (!data.items || data.items.length === 0) {
        setNoDataMessage('Nenhuma OSC encontrada');
        setOscs([]);
        return;
      }
      setOscs(
        (data.items ?? []).map((item) => ({
          ...item,
        }))
      );

      setTotalCount(data.totalItems || 0);
      setNoDataMessage('');
    } catch (error) {
      console.error('Erro ao carregar OSC:', error);
      toast.error('Erro ao carregar OSC');
      setOscs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {

    const filters: Filter[] = [];

    if (filterOscName && filterOscName.trim() !== '') {
      filters.push({
        propertyName: 'name',
        operation: 7,
        value: filterOscName.trim(),
      });
    }
    setPage(0);
    fetchOscs(filters);
  };

  const handleClearFilters = () => {
    setPage(0);
    setFilterOscName('');
    fetchOscs([]);
  };

  const handleAdd = () => {
    setCreateOsc({
      name: '',
      corporateName: '',
      oscPrimaryDocumment: '',
      objective: '',
      address: '',
      neighborhood: '',
      city: '',
      state: '',
      phoneNumber: '',
      email: '',
      webUrl: '',
      socialMedia: '',
      zipCode: '',
      beneficiaries: [],
      originsBusinessCases: []
    });
    setUpdateOsc(null);
    setIsVisualizing(false);
    resetForm();
    setOpenModal(true);
  };

  const resetForm = () => {
    setUpdateOsc(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCepError(null);
    setTimeout(() => {
      resetForm();
      setIsVisualizing(false);
      setSelectedOsc(null);
    }, 300);
  };

  const handleUpdateOsc = async (osc: Osc) => {
    try {
      setModalLoading(true);

      const { data } = await oscApi.getOsc(osc.oscId!);

      setUpdateOsc(data);
      setIsVisualizing(false);
      setOpenModal(true);
    } catch (error) {
      console.error('Erro ao carregar edição de OSC', error)
      toast.error('Erro ao carregar edição de OSC')
    } finally {
      setModalLoading(false);
    }
  }

  const handleView = async (osc: Osc) => {
    try {
      const oscId: number = osc.oscId!;
      const { data } = await oscApi.getOsc(oscId);
      setSelectedOsc(data);
      setIsVisualizing(true);
      setOpenModal(true)
    }
    catch (error) {
      console.error('Erro ao vizualizar OSC', error)
      toast.error('Erro ao carregar detalhes da OSC')
    }
  }

  const handleDelete = async (osc: Osc) => {
    setOscToDelete(osc);
    setOpenDeleteModal(true);
  }

  const confirmDelete = async () => {
    if (!oscToDelete)
      return;

    try {
      await oscApi.deleteOsc(oscToDelete.oscId!);
      toast.success('OSC excluida com sucesso!')
      fetchOscs();
    }
    catch (error) {
      console.error('Erro ao excluir OSC', error)
      toast.error('Erro ao excluir OSC')
    }
    finally {
      setOpenDeleteModal(false);
      setOscToDelete(null);
    }
  }

  const handleSave = async () => {
    const ocsForm = updateOsc || createOsc;

    if (!validateOscForm(ocsForm))
      return

    if (updateOsc) {
      try {
        const updateOscRequest: UpdateOscRequest = {
          name: updateOsc.name,
          objective: updateOsc.objective,
          corporateName: updateOsc.corporateName,
          address: updateOsc.address,
          neighborhood: updateOsc.neighborhood,
          city: updateOsc.city,
          state: updateOsc.state,
          phoneNumber: updateOsc.phoneNumber,
          email: updateOsc.email,
          webUrl: updateOsc.webUrl,
          socialMedia: updateOsc.socialMedia,
          zipCode: updateOsc.zipCode,
          oscPrimaryDocumment: updateOsc.oscPrimaryDocumment,
          beneficiaryIds: updateOsc.beneficiaries?.map(b => b.beneficiaryId!) || [],
          originBusinessCaseIds: updateOsc.originsBusinessCases?.map(obc => obc.originBusinessCaseId!) || []
        };

        await oscApi.updateOsc(updateOsc.oscId!, updateOscRequest);

        toast.success('OSC atualizado com sucesso!');
        handleCloseModal();
        fetchOscs();
      } catch (error) {
        console.error('Erro ao atualizar OSC', error)
        toast.error('Erro ao atualizar OSC');
      } finally {
        setModalLoading(false);
      }
    }
    else {
      try {
        const createOscRequest: CreateOscRequest = {
          name: createOsc?.name,
          objective: createOsc?.objective,
          corporateName: createOsc?.corporateName,
          address: createOsc?.address,
          neighborhood: createOsc?.neighborhood,
          city: createOsc?.city,
          state: createOsc?.state,
          phoneNumber: createOsc?.phoneNumber,
          email: createOsc?.email,
          webUrl: createOsc?.webUrl,
          socialMedia: createOsc?.socialMedia,
          zipCode: createOsc?.zipCode,
          oscPrimaryDocumment: createOsc?.oscPrimaryDocumment,
          beneficiariesIds: createOsc?.beneficiaries?.map(b => b.beneficiaryId!) || [],
          originsBusinessCasesIds: createOsc?.originsBusinessCases?.map(obc => obc.originBusinessCaseId!) || []
        };

        await oscApi.createOsc(createOscRequest);

        toast.success('OSC criada com sucesso!');
        handleCloseModal();
        fetchOscs();
      } catch (error) {
        console.error('Erro ao criar OSC', error)
        toast.error('Erro ao criar OSC');
      } finally {
        setModalLoading(false);
      }

    }
  }

  const validateOscForm = (osc: any): boolean => {
    const requiredFields = [
      'name',
      'phoneNumber',
      'corporateName',
      'objective',
      'zipCode',
      'state',
      'city',
      'neighborhood',
      'address',
    ];

    for (const field of requiredFields) {
      if (!osc[field] || osc[field].toString().trim() === '') {
        toast.error(`O campo "${formatFieldName(field)}" é obrigatório!`);
        return false;
      }
    }

    return true;
  };

  const formatFieldName = (field: string): string => {
    const mapping: Record<string, string> = {
      name: 'Nome',
      corporateName: 'Razão Social',
      oscPrimaryDocumment: 'CNPJ',
      objective: 'Objetivo',
      address: 'Endereço',
      neighborhood: 'Bairro',
      city: 'Cidade',
      state: 'UF',
      phoneNumber: 'Telefone',
      email: 'Email',
      webUrl: 'Website',
      socialMedia: 'Mídia Social',
      zipCode: 'CEP'
    };
    return mapping[field] || field;
  };

  const handleZipCodeLookup = async (zipCodeValue: string | undefined, type: 'create' | 'update') => {
    const setter = type === 'create' ? setCreateOsc : setUpdateOsc;

    if (!zipCodeValue) {
      setter(prev => ({
        ...prev,
        neighborhood: '', city: '', state: '', address: ''
      }));
      return setter
    }

    setIsLoadingCep(true);
    setCepError(null);

    try {
      const dataResponse: SimplifyResponse = await fetchZipCode(zipCodeValue);

      setter(prev => ({
        ...prev,
        neighborhood: dataResponse.neighborhood || '',
        city: dataResponse.city || '',
        state: dataResponse.state || '',
        address: dataResponse.address || '',
      }));

    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : 'Falha ao buscar CEP.';

      if (errorMessage.includes('CEP não encontrado na base de dados')) {
        errorMessage = 'CEP não encontrado.';
      }
      else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('request failed')) {
        errorMessage = 'CEP inválido';
      }

      setCepError(errorMessage)
      setter(prev => ({
        ...prev,
        neighborhood: '',
        city: '',
        state: '',
        address: '',
      }));
    } finally {
      setIsLoadingCep(false);
    }
  };


  const columns: Column<Osc>[] = [
    { label: 'ID', field: 'oscId' },
    { label: 'Nome', field: 'name' },
    { label: 'Razão Social', field: 'corporateName' },
    {
      label: 'CNPJ',
      field: 'oscPrimaryDocumment',
      render: (value) =>
        typeof value === 'string'
          ? value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
          : '',
    },
    { label: 'Endereço', field: 'address' },
    {
      label: 'CEP',
      field: 'zipCode',
      render: (value) =>
        typeof value === 'string'
          ? value.replace(/^(\d{5})(\d{3})$/, '$1-$2')
          : '',
    },
    { label: 'Objetivo', field: 'objective' },
    { label: 'Público Atendido', field: 'beneficiariesCount' },
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
            <TitleAndButtons title="Lista de Osc's" onAdd={handleAdd} addLabel="Nova OSC" />

            {/* Filtro por nome de OSC */}
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
                  Busca de OSC
                </Typography>

                {filterOscName && (
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
                    label="Nome da OSC"
                    value={filterOscName}
                    onChange={(e) => setFilterOscName(e.target.value)}
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
                  data={osc}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalCount={totalCount}
                  onPageChange={setPage}
                  onRowsPerPageChange={setRowsPerPage}
                  onEdit={handleUpdateOsc}
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
              message='Deseja realmente excluir esta OSC?'
              highlightText={oscToDelete?.name}
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
                isVisualizing && selectedOsc ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Dados principais */}
                    <Box>
                      <Typography><strong>ID:</strong> {selectedOsc.oscId}</Typography>
                      <Typography><strong>Nome:</strong> {selectedOsc.name}</Typography>
                      <Typography><strong>Razão Social:</strong> {selectedOsc.corporateName}</Typography>
                      <Typography><strong>CNPJ:</strong> <PatternFormat
                        displayType="text"
                        format="##.###.###/####-##"
                        value={selectedOsc.oscPrimaryDocumment || ''}
                        mask="_"
                      /></Typography>
                      <Typography><strong>Telefone:</strong> <PatternFormat
                        displayType="text"
                        format="(##) #####-####"
                        value={selectedOsc.phoneNumber || ''}
                        mask="_"
                      /></Typography>
                      <Typography><strong>Email:</strong> {selectedOsc.email}</Typography>
                      <Typography><strong>Website:</strong> {selectedOsc.webUrl}</Typography>
                      <Typography><strong>Mídia Social:</strong> {selectedOsc.socialMedia}</Typography>
                      <Typography><strong>Objetivo:</strong> {selectedOsc.objective}</Typography>
                      <Typography><strong>CEP:</strong> <PatternFormat
                        displayType="text"
                        format="#####-###"
                        value={selectedOsc.zipCode || ''}
                        mask="_"
                      /></Typography>
                      <Typography><strong>UF:</strong> {selectedOsc.state}</Typography>
                      <Typography><strong>Cidade:</strong> {selectedOsc.city}</Typography>
                      <Typography><strong>Bairro:</strong> {selectedOsc.neighborhood}</Typography>
                      <Typography><strong>Endereço:</strong> {selectedOsc.address}</Typography>
                    </Box>

                    {/* Público */}
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        <strong>Público</strong>
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {selectedOsc.beneficiaries && selectedOsc.beneficiaries.length > 0 ? (
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          {selectedOsc.beneficiaries.map((b) => (
                            <Chip
                              key={b.beneficiaryId}
                              label={b.name}
                              color="primary"
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary">Nenhum beneficiário associado.</Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        <strong>Causas</strong>
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {selectedOsc.originsBusinessCases && selectedOsc.originsBusinessCases.length > 0 ? (
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          {selectedOsc.originsBusinessCases.map((c) => (
                            <Chip
                              key={c.originBusinessCaseId}
                              label={c.name}
                              color="secondary"
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary">
                          Nenhuma causa associada.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : updateOsc ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {/* Campos de texto editáveis */}
                      <TextField
                        label="Nome*"
                        value={updateOsc.name || ''}
                        onChange={(e) => setUpdateOsc({ ...updateOsc, name: e.target.value })}
                        fullWidth
                      />
                      <PatternFormat
                        customInput={TextField}
                        label="Telefone*"
                        fullWidth
                        value={updateOsc.phoneNumber || ''}
                        onValueChange={(values) =>
                          setUpdateOsc({ ...updateOsc, phoneNumber: values.value })
                        }
                        format="(##) #####-####"
                        mask="_"
                      />
                    </Box>

                    <TextField
                      label="Razão Social*"
                      value={updateOsc.corporateName || ''}
                      onChange={(e) => setUpdateOsc({ ...updateOsc, corporateName: e.target.value })}
                      fullWidth
                    />

                    <TextField
                      label="Email"
                      value={updateOsc.email || ''}
                      onChange={(e) => setUpdateOsc({ ...updateOsc, email: e.target.value })}
                      fullWidth
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="Website"
                        value={updateOsc.webUrl || ''}
                        onChange={(e) => setUpdateOsc({ ...updateOsc, webUrl: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Mídia Social"
                        value={updateOsc.socialMedia || ''}
                        onChange={(e) => setUpdateOsc({ ...updateOsc, socialMedia: e.target.value })}
                        fullWidth
                      />
                    </Box>

                    <PatternFormat
                      customInput={TextField}
                      label="CNPJ"
                      fullWidth
                      value={updateOsc.oscPrimaryDocumment || ''}
                      onValueChange={(values) =>
                        setUpdateOsc({ ...updateOsc, oscPrimaryDocumment: values.value })
                      }
                      format="##.###.###/####-##"
                      mask="_"
                    />

                    <TextField
                      label="Objetivo*"
                      value={updateOsc.objective || ''}
                      onChange={(e) => setUpdateOsc({ ...updateOsc, objective: e.target.value })}
                      fullWidth
                      variant='outlined'
                      multiline
                      minRows={3}
                      maxRows={8}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <PatternFormat
                        customInput={TextField}
                        label="CEP*"
                        fullWidth
                        value={updateOsc.zipCode || ''}
                        onValueChange={(values) =>
                          setUpdateOsc({ ...updateOsc, zipCode: values.value })
                        }
                        onBlur={() => handleZipCodeLookup(updateOsc.zipCode, 'update')}
                        format="#####-###"
                        mask="_"
                        error={!!cepError}
                        helperText={cepError || ''}
                        disabled={isLoadingCep}
                      />
                      <TextField
                        label="UF*"
                        value={updateOsc.state || ''}
                        onChange={(e) => setUpdateOsc({ ...updateOsc, state: e.target.value })}
                        fullWidth
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="Cidade*"
                        value={updateOsc.city || ''}
                        onChange={(e) => setUpdateOsc({ ...updateOsc, city: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Bairro*"
                        value={updateOsc.neighborhood || ''}
                        onChange={(e) => setUpdateOsc({ ...updateOsc, neighborhood: e.target.value })}
                        fullWidth
                      />
                    </Box>

                    <TextField
                      label="Endereço*"
                      value={updateOsc.address || ''}
                      onChange={(e) => setUpdateOsc({ ...updateOsc, address: e.target.value })}
                      fullWidth
                    />

                    {/* Público editáveis */}
                    <Box>
                      <Typography variant="subtitle1"><strong>Público</strong></Typography>
                      <Divider sx={{ mb: 2 }} />

                      <Autocomplete
                        options={beneficiaryResults}
                        getOptionLabel={(option) => option.name || ''}
                        value={selectedBeneficiary}
                        onChange={(_, value) => {
                          if (value && !updateOsc.beneficiaries?.some(b => b.beneficiaryId === value.beneficiaryId)) {
                            setUpdateOsc({
                              ...updateOsc,
                              beneficiaries: [...(updateOsc.beneficiaries || []), value]
                            });
                          }
                          setSelectedBeneficiary(null);
                          setInputBeneficiaryValue('');
                        }}
                        inputValue={inputBeneficiaryValue}
                        onInputChange={(_, value) => {
                          setInputBeneficiaryValue(value);
                          fetchBeneficiaries(value);
                        }}
                        onOpen={() => {
                          if (!inputBeneficiaryValue) {
                            fetchBeneficiaries('');
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Buscar beneficiário..."
                            size="small"
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.beneficiaryId === value?.beneficiaryId}
                        fullWidth
                      />

                      {/* Chips de Público */}
                      {updateOsc.beneficiaries && updateOsc.beneficiaries.length > 0 ? (
                        <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                          {updateOsc.beneficiaries.map((b) => (
                            <Chip
                              key={b.beneficiaryId}
                              label={b.name}
                              color="primary"
                              variant="outlined"
                              onDelete={() => {
                                setUpdateOsc({
                                  ...updateOsc,
                                  beneficiaries: updateOsc.beneficiaries!.filter(
                                    x => x.beneficiaryId !== b.beneficiaryId
                                  )
                                });
                              }}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary" mt={1}>Nenhum beneficiário.</Typography>
                      )}
                    </Box>

                    {/* Causa editáveis */}
                    <Box mt={3}>
                      <Typography variant="subtitle1"><strong>Causa</strong></Typography>
                      <Divider sx={{ mb: 2 }} />

                      <Autocomplete
                        options={originBusinessCaseResults}
                        getOptionLabel={(option) => option.name || ''}
                        value={selectedOriginBusinessCase}
                        onChange={(_, value) => {
                          if (value && !updateOsc.originsBusinessCases?.some(obc => obc.originBusinessCaseId === value.originBusinessCaseId)) {
                            setUpdateOsc({
                              ...updateOsc,
                              originsBusinessCases: [...(updateOsc.originsBusinessCases || []), value]
                            });
                          }
                          setSelectedOriginBusinessCase(null);
                          setInputOriginBusinessCaseValue('');
                        }}
                        inputValue={inputOriginBusinessCaseValue}
                        onInputChange={(_, value) => {
                          setInputOriginBusinessCaseValue(value);
                          fetchOriginBusinessCase(value);
                        }}
                        onOpen={() => {
                          if (!inputOriginBusinessCaseValue) {
                            fetchOriginBusinessCase('');
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Buscar causa..."
                            size="small"
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.originBusinessCaseId === value?.originBusinessCaseId}
                        fullWidth
                      />

                      {/* Chips de Causa */}
                      {updateOsc.originsBusinessCases && updateOsc.originsBusinessCases.length > 0 ? (
                        <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                          {updateOsc.originsBusinessCases.map((obc) => (
                            <Chip
                              key={obc.originBusinessCaseId}
                              label={obc.name}
                              color="secondary"
                              variant="outlined"
                              onDelete={() => {
                                setUpdateOsc({
                                  ...updateOsc,
                                  originsBusinessCases: updateOsc.originsBusinessCases!.filter(
                                    x => x.originBusinessCaseId !== obc.originBusinessCaseId
                                  )
                                });
                              }}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary" mt={1}>Nenhuma causa.</Typography>
                      )}
                    </Box>
                  </Box>
                ) : createOsc ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {/* Campos de texto editáveis */}
                      <TextField
                        label="Nome*"
                        value={createOsc.name || ''}
                        onChange={(e) => setCreateOsc({ ...createOsc, name: e.target.value })}
                        fullWidth
                      />
                      <PatternFormat
                        customInput={TextField}
                        label="Telefone*"
                        fullWidth
                        value={createOsc.phoneNumber || ''}
                        onValueChange={(values) =>
                          setCreateOsc({ ...createOsc, phoneNumber: values.value })
                        }
                        format="(##) #####-####"
                        mask="_"
                      />
                    </Box>
                    <TextField
                      label="Razão Social*"
                      value={createOsc.corporateName || ''}
                      onChange={(e) => setCreateOsc({ ...createOsc, corporateName: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      value={createOsc.email || ''}
                      onChange={(e) => setCreateOsc({ ...createOsc, email: e.target.value })}
                      fullWidth
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="Website"
                        value={createOsc.webUrl || ''}
                        onChange={(e) => setCreateOsc({ ...createOsc, webUrl: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Mídia Social"
                        value={createOsc.socialMedia || ''}
                        onChange={(e) => setCreateOsc({ ...createOsc, socialMedia: e.target.value })}
                        fullWidth
                      />
                    </Box>
                    <PatternFormat
                      customInput={TextField}
                      label="CNPJ"
                      fullWidth
                      value={createOsc.oscPrimaryDocumment || ''}
                      onValueChange={(values) =>
                        setCreateOsc({ ...createOsc, oscPrimaryDocumment: values.value })
                      }
                      format="##.###.###/####-##"
                      mask="_"
                    />
                    <TextField
                      label="Objetivo*"
                      value={createOsc.objective || ''}
                      onChange={(e) => setCreateOsc({ ...createOsc, objective: e.target.value })}
                      fullWidth
                      variant='outlined'
                      multiline
                      minRows={3}
                      maxRows={8}

                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <PatternFormat
                        customInput={TextField}
                        label="CEP*"
                        fullWidth
                        value={createOsc.zipCode || ''}
                        onValueChange={(values) =>
                          setCreateOsc({ ...createOsc, zipCode: values.value })
                        }
                        onBlur={() => handleZipCodeLookup(createOsc.zipCode, 'create')}
                        format="#####-###"
                        mask="_"
                        error={!!cepError}
                        helperText={cepError || ''}
                        InputProps={{
                          endAdornment: (
                            <>
                              {isLoadingCep && (
                                <CircularProgress
                                  size={20}
                                  sx={{ color: 'text.secondary', mr: 1 }}
                                  aria-label="Carregando CEP"
                                />
                              )}
                            </>
                          ),
                        }}
                        disabled={isLoadingCep}
                      />
                      <TextField
                        label="UF*"
                        value={createOsc.state || ''}
                        onChange={(e) => setCreateOsc({ ...createOsc, state: e.target.value })}
                        fullWidth
                        disabled={isLoadingCep}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="Cidade*"
                        value={createOsc.city || ''}
                        onChange={(e) => setCreateOsc({ ...createOsc, city: e.target.value })}
                        fullWidth
                        disabled={isLoadingCep}
                      />
                      <TextField
                        label="Bairro*"
                        value={createOsc.neighborhood || ''}
                        onChange={(e) => setCreateOsc({ ...createOsc, neighborhood: e.target.value })}
                        fullWidth
                        disabled={isLoadingCep}
                      />
                    </Box>
                    <TextField
                      label="Endereço*"
                      value={createOsc.address || ''}
                      onChange={(e) => setCreateOsc({ ...createOsc, address: e.target.value })}
                      fullWidth
                      disabled={isLoadingCep}
                    />

                    {/* Público editáveis */}
                    <Box>
                      <Typography variant="subtitle1"><strong>Público</strong></Typography>
                      <Divider sx={{ mb: 2 }} />

                      <Autocomplete
                        options={beneficiaryResults}
                        getOptionLabel={(option) => option.name || ''}
                        value={selectedBeneficiary}
                        onChange={(_, value) => {
                          if (value && !createOsc.beneficiaries?.some(b => b.beneficiaryId === value.beneficiaryId)) {
                            setCreateOsc({
                              ...createOsc,
                              beneficiaries: [...(createOsc.beneficiaries || []), value]
                            });
                          }
                          setSelectedBeneficiary(null);
                          setInputBeneficiaryValue('');
                        }}
                        inputValue={inputBeneficiaryValue}
                        onInputChange={(_, value) => {
                          setInputBeneficiaryValue(value);
                          fetchBeneficiaries(value);
                        }}
                        onOpen={() => {
                          if (!inputBeneficiaryValue) {
                            fetchBeneficiaries('');
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Buscar beneficiário..."
                            size="small"
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.beneficiaryId === value?.beneficiaryId}
                        fullWidth
                      />

                      {/* Chips de Público */}
                      {createOsc.beneficiaries && createOsc.beneficiaries.length > 0 ? (
                        <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                          {createOsc.beneficiaries.map((b) => (
                            <Chip
                              key={b.beneficiaryId}
                              label={b.name}
                              color="primary"
                              variant="outlined"
                              onDelete={() => {
                                setCreateOsc({
                                  ...createOsc,
                                  beneficiaries: createOsc.beneficiaries!.filter(
                                    x => x.beneficiaryId !== b.beneficiaryId
                                  )
                                });
                              }}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary" mt={1}>Nenhum beneficiário.</Typography>
                      )}
                    </Box>

                    {/* Causa editáveis */}
                    <Box mt={3}>
                      <Typography variant="subtitle1"><strong>Causa</strong></Typography>
                      <Divider sx={{ mb: 2 }} />

                      <Autocomplete
                        options={originBusinessCaseResults}
                        getOptionLabel={(option) => option.name || ''}
                        value={selectedOriginBusinessCase}
                        onChange={(_, value) => {
                          if (value && !createOsc.originsBusinessCases?.some(obc => obc.originBusinessCaseId === value.originBusinessCaseId)) {
                            setCreateOsc({
                              ...createOsc,
                              originsBusinessCases: [...(createOsc.originsBusinessCases || []), value]
                            });
                          }
                          setSelectedOriginBusinessCase(null);
                          setInputOriginBusinessCaseValue('');
                        }}
                        inputValue={inputOriginBusinessCaseValue}
                        onInputChange={(_, value) => {
                          setInputOriginBusinessCaseValue(value);
                          fetchOriginBusinessCase(value);
                        }}
                        onOpen={() => {
                          if (!inputOriginBusinessCaseValue) {
                            fetchOriginBusinessCase('');
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Buscar caso de negócio..."
                            size="small"
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.originBusinessCaseId === value?.originBusinessCaseId}
                        fullWidth
                      />

                      {/* Chips de Causa */}
                      {createOsc.originsBusinessCases && createOsc.originsBusinessCases.length > 0 ? (
                        <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                          {createOsc.originsBusinessCases.map((obc) => (
                            <Chip
                              key={obc.originBusinessCaseId}
                              label={obc.name}
                              color="secondary"
                              variant="outlined"
                              onDelete={() => {
                                setCreateOsc({
                                  ...createOsc,
                                  originsBusinessCases: createOsc.originsBusinessCases!.filter(
                                    x => x.originBusinessCaseId !== obc.originBusinessCaseId
                                  )
                                });
                              }}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary" mt={1}>Nenhum causa.</Typography>
                      )}
                    </Box>
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
                      disabled={modalLoading || isLoadingCep}
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

export default Osc;