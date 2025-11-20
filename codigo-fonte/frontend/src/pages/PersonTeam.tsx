// ==================== Imports ====================
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  CircularProgress,
  Paper,
  alpha,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Stack,
  Divider,
  Autocomplete,
  FormGroup,
  FormControlLabel,
  Switch,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessTime from '@mui/icons-material/AccessTime';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '../components/ConfirmDelete';
import DialogPadronized from '@/components/DialogPadronized';
import { apiConfig } from '../services/auth';
import { UploadCsvModal } from '@/components/UploadCsvModal';
import { extractErrorMessage } from '@/utils/error';
import {
  PersonTeamsApi,
  PersonsApi,
  TeamsApi,
  UsersApi,
  CreatePersonTeamRequest,
  EditPersonTeamRequest,
  MemberType,
  Filter,
  Op,
  ListPersonTeamRequest,
} from './../api';

dayjs.locale('pt-br');

// ==================== Tipos/Interfaces ====================
interface PersonTeam {
  id?: number;
  personId?: number;
  personName?: string;
  teamId?: number;
  teamName?: string;
  oscId?: number | null;
  oscName?: string | null;
  memberTypes?: MemberType[];
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
}

interface Person {
  id?: number;
  name?: string;
}

interface Team {
  teamId?: number;
  name?: string | null;
}

interface ListPersonTeamViewModel {
  totalItems: number;
  items: PersonTeam[];
}

interface PersonTeamCsvRow {
  personId: number | string;
  memberTypes: string;
}

// ==================== Constantes/Funções ====================
const MemberTypeLabels: Record<MemberType, string> = {
  [MemberType.NUMBER_0]: 'Participante',
  [MemberType.NUMBER_1]: 'Professor',
  [MemberType.NUMBER_2]: 'Coordenador',
  [MemberType.NUMBER_3]: 'Consultor Social',
  [MemberType.NUMBER_4]: 'Mentor',
  [MemberType.NUMBER_5]: 'Coordenador Geral',
  [MemberType.NUMBER_6]: 'Palestrante',
  [MemberType.NUMBER_7]: 'Apoio Técnico',
};

const PERSON_TEAM_CSV_HEADERS: (keyof PersonTeamCsvRow)[] = ['personId', 'memberTypes'];

const headerTranslations: Record<keyof PersonTeamCsvRow, string> = {
  personId: 'ID da Pessoa',
  memberTypes: 'Funções (separadas por ";")',
};

const memberTypeByNormalizedLabel: Record<string, MemberType> = Object.entries(
  MemberTypeLabels
).reduce(
  (map, [enumValue, label]) => {
    const normalizedLabel = label
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
    map[normalizedLabel] = parseInt(enumValue) as MemberType;
    return map;
  },
  {} as Record<string, MemberType>
);

const parseMemberTypes = (raw: string): MemberType[] => {
  const tokens = (raw || '')
    .split(/[;,]/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);

  const memberTypes: MemberType[] = [];
  for (const token of tokens) {
    if (/^\d+$/.test(token)) {
      const numericValue = parseInt(token, 10);
      if (numericValue >= 0 && numericValue <= 7) memberTypes.push(numericValue as MemberType);
      continue;
    }
    const normalizedLabel = token
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
    const memberType = memberTypeByNormalizedLabel[normalizedLabel];
    if (memberType !== undefined) memberTypes.push(memberType);
  }
  return Array.from(new Set(memberTypes));
};

const validatePersonTeamCsvForm = (row: PersonTeamCsvRow): string | null => {
  const personId = Number((row.personId ?? '').toString().trim());
  const parsedMemberTypes = parseMemberTypes(row.memberTypes ?? '');

  if (!personId || personId <= 0)
    return 'O campo "ID da Pessoa" é obrigatório e deve ser numérico.';
  if (!parsedMemberTypes.length)
    return 'O campo "Funções" é obrigatório. Informe ao menos uma função válida (por número ou rótulo).';

  return null;
};

// ==================== Componente ====================
const PersonTeam: React.FC = () => {
  // ==================== Estados ====================
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [personTeams, setPersonTeams] = useState<PersonTeam[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [editingPersonTeam, setEditingPersonTeam] = useState<PersonTeam | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<number | ''>('');
  const [selectedMemberTypes, setSelectedMemberTypes] = useState<MemberType[]>([]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [personsLoading, setPersonsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    personTeam: null as PersonTeam | null,
    loading: false,
  });
  const [filterPersonName, setFilterPersonName] = useState('');
  const [filterMemberType, setFilterMemberType] = useState<MemberType | ''>('');
  const [totalCount, setTotalCount] = useState(0);
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<undefined | 'Inactive' | 'all'>(undefined);
  const [userUpdatedName, setUserUpdatedName] = useState<string | null>(null);
  const [auditDate, setAuditDate] = useState<Dayjs | undefined>(undefined);
  const [selectedPersonOption, setSelectedPersonOption] = useState<{
    id: number;
    label: string;
  } | null>(null);
  const [inputPersonValue, setInputPersonValue] = useState('');

  const memberTypeOptions = useMemo(
    () =>
      Object.entries(MemberTypeLabels).map(([value, label]) => ({
        id: parseInt(value) as MemberType,
        label,
      })),
    []
  );

  const personOptions = useMemo(
    () =>
      persons.map((person) => ({
        id: person.id!,
        label: person.name!,
      })),
    [persons]
  );

  const apiInstance = useMemo(() => new PersonTeamsApi(apiConfig), []);
  const personsApiInstance = useMemo(() => new PersonsApi(apiConfig), []);
  const teamsApiInstance = useMemo(() => new TeamsApi(apiConfig), []);
  const userApi = useMemo(() => new UsersApi(apiConfig), []);

  // ==================== Funções Internas ====================
  const dialogTitle = () => {
    return isVisualizing
      ? 'Visualizar Vínculo'
      : editingPersonTeam
        ? 'Editar Vínculo'
        : 'Adicionar Pessoa à Turma';
  };

  const columns: Column<PersonTeam>[] = [
    { label: 'Id', field: 'id' },
    { label: 'Nome da Pessoa', field: 'personName' },
    {
      label: 'Funções',
      field: 'memberTypes',
      render: (value) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {(value as MemberType[] | undefined)?.map((type, index) => (
            <Chip
              key={index}
              label={MemberTypeLabels[type]}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
      ),
    },
    {
      label: 'Status',
      field: 'isDeleted',
      render: (value) => (value ? 'Inativo' : 'Ativo'),
    },
  ];

  const fetchPersonTeams = useCallback(
    async (statusFilterParam?: string) => {
      if (!teamId) return;

      try {
        const filters: Filter[] = [];
        if (filterPersonName.trim()) {
          filters.push({
            propertyName: 'Person.Name',
            operation: Op.NUMBER_7,
            value: filterPersonName,
          });
        }
        if (filterMemberType !== '') {
          filters.push({
            propertyName: 'MemberType',
            operation: Op.NUMBER_1,
            value: filterMemberType as number,
          });
        }

        const body: ListPersonTeamRequest = {
          teamId: parseInt(teamId),
          filters,
          pageNumber: page + 1,
          pageSize: rowsPerPage,
          statusFilter: statusFilterParam,
        } as any;
        const response = await apiInstance.searchPersonTeams(body);

        const data = response.data as unknown as ListPersonTeamViewModel;

        if (data && Array.isArray(data.items)) {
          const hasActiveFilters = filterPersonName.trim() !== '' || filterMemberType !== '';
          const isEmpty = data.items.length === 0;
          setNoDataMessage(
            isEmpty
              ? hasActiveFilters
                ? 'Nenhum resultado encontrado para os filtros aplicados.'
                : 'Nenhuma pessoa vinculada a esta turma.'
              : ''
          );
          setPersonTeams(data.items);
          setTotalCount(data.totalItems || 0);
        } else {
          setPersonTeams([]);
          setTotalCount(0);
          const hasActiveFilters = filterPersonName.trim() !== '' || filterMemberType !== '';
          setNoDataMessage(
            hasActiveFilters
              ? 'Nenhum resultado encontrado para os filtros aplicados.'
              : 'Nenhuma pessoa vinculada a esta turma.'
          );
        }
      } catch (error) {
        console.error('Erro ao buscar vínculos:', error);
        toast.error('Erro ao carregar vínculos da turma');
        setPersonTeams([]);
        setTotalCount(0);
        setNoDataMessage('Erro ao carregar dados.');
      }
    },
    [teamId, apiInstance, filterPersonName, filterMemberType, page, rowsPerPage]
  );

  const fetchPerson = useCallback(
    async (searchValue?: string) => {
      try {
        setPersonsLoading(true);

        const request = {
          pageNumber: 1,
          pageSize: 10,
          ...(searchValue && searchValue.trim() !== ''
            ? {
                filters: [
                  {
                    propertyName: 'Name',
                    operation: Op.NUMBER_7,
                    value: searchValue,
                  },
                ],
              }
            : {}),
        };

        const { data } = await personsApiInstance.listPerson(request as any);
        const items = data?.items || [];
        setPersons(items.map((p: any) => ({ id: p.personId, name: p.name })));
      } catch (error) {
        console.error('Erro ao buscar Pessoa', error);
        toast.error('Erro ao buscar Pessoa');
      } finally {
        setPersonsLoading(false);
      }
    },
    [personsApiInstance]
  );

  const fetchTeamInfo = useCallback(async () => {
    if (!teamId) return;

    try {
      const response = await teamsApiInstance.getTeamById(parseInt(teamId));
      if (response.data) {
        setCurrentTeam(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar informações da turma:', error);
      toast.error('Erro ao carregar informações da turma');
    }
  }, [teamId, teamsApiInstance]);

  const handleAdd = () => {
    setOpenModal(true);
    setEditingPersonTeam(null);
    setSelectedPersonId('');
    setSelectedMemberTypes([]);
    setSelectedPersonOption(null);
    setInputPersonValue('');
    setIsVisualizing(false);
    fetchPerson('');
  };

  const handleUploadPersonTeam = () => {
    setUploadOpen(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingPersonTeam(null);
    setSelectedPersonId('');
    setSelectedMemberTypes([]);
    setSelectedPersonOption(null);
    setInputPersonValue('');
    setIsVisualizing(false);
    setPersons([]);
  };

  const handleEdit = (personTeam: PersonTeam) => {
    setEditingPersonTeam(personTeam);
    setSelectedPersonId(personTeam.personId || '');
    setSelectedMemberTypes(personTeam.memberTypes || []);

    if (personTeam.personId && personTeam.personName) {
      setSelectedPersonOption({ id: personTeam.personId, label: personTeam.personName });
    } else {
      setSelectedPersonOption(null);
    }

    setInputPersonValue('');
    setIsVisualizing(false);
    setOpenModal(true);
  };

  const handleView = async (personTeam: PersonTeam) => {
    try {
      setEditingPersonTeam(personTeam);
      setSelectedPersonId(personTeam.personId || '');
      setSelectedMemberTypes(personTeam.memberTypes || []);

      if (personTeam.personId && personTeam.personName) {
        setSelectedPersonOption({ id: personTeam.personId, label: personTeam.personName });
      } else {
        setSelectedPersonOption(null);
      }

      if (personTeam.id) {
        const { data } = await apiInstance.getPersonTeamById(personTeam.id);

        const userId = data.updatedBy;
        const date = data.updatedAt || data.createdAt;

        if (userId) {
          const { data: userData } = await userApi.getUserById(userId);
          setUserUpdatedName(userData.name || null);
        }
        setAuditDate(date ? dayjs(date) : undefined);
      }

      setInputPersonValue('');
      setIsVisualizing(true);
      setOpenModal(true);
    } catch (error) {
      console.error('Erro ao visualizar vínculo:', error);
      toast.error('Erro ao carregar detalhes do vínculo');
      setInputPersonValue('');
      setIsVisualizing(true);
      setOpenModal(true);
    }
  };

  const handleDelete = (personTeam: PersonTeam) => {
    setConfirmDialog({
      open: true,
      personTeam,
      loading: false,
    });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      personTeam: null,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.personTeam?.id) return;

    setConfirmDialog((prev) => ({ ...prev, loading: true }));

    try {
      await apiInstance.deletePersonTeam(confirmDialog.personTeam.id);
      toast.success('Vínculo removido com sucesso!');
      await fetchPersonTeams();
      handleCloseConfirmDialog();
    } catch (error) {
      console.error('Erro ao remover vínculo:', error);
      toast.error('Erro ao remover vínculo');
    } finally {
      setConfirmDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const validateForm = (): boolean => {
    const requiredFields = ['personId', 'memberTypes'];

    const createRequest: CreatePersonTeamRequest = {
      personId: selectedPersonOption?.id || (selectedPersonId as number),
      memberTypes: selectedMemberTypes,
    };

    for (const field of requiredFields) {
      if (!createRequest[field] || createRequest[field].toString().trim() === '') {
        toast.error(`O campo "${formatFieldName(field)}" é obrigatório!`);
        return false;
      }
    }

    return true;
  };

  const formatFieldName = (field: string): string => {
    const mapping: Record<string, string> = {
      personId: 'Pessoa',
      memberTypes: 'Funções',
    };
    return mapping[field] || field;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setModalLoading(true);

    try {
      if (editingPersonTeam) {
        const editRequest: EditPersonTeamRequest = {
          memberTypes: selectedMemberTypes,
        };

        await apiInstance.editPersonTeam(editingPersonTeam.id!, editRequest);
        toast.success('Vínculo atualizado com sucesso!');
      } else {
        const createRequest: CreatePersonTeamRequest = {
          personId: selectedPersonOption!.id,
          memberTypes: selectedMemberTypes,
        };

        await apiInstance.createPersonTeam(parseInt(teamId || ''), createRequest);
        toast.success('Pessoa adicionada à turma com sucesso!');
      }

      await fetchPersonTeams();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar vínculo:', error);
      toast.error(extractErrorMessage(error));
    } finally {
      setModalLoading(false);
    }
  };

  const handleMemberTypesChange = (event: SelectChangeEvent<MemberType[]>) => {
    const value = event.target.value;
    setSelectedMemberTypes(typeof value === 'string' ? [] : value);
  };

  const handleClearFilters = () => {
    setFilterPersonName('');
    setFilterMemberType('');
    setSearch('');
    setStatusFilter(undefined);
    setPage(0);
  };

  const handleBack = () => {
    navigate('/team');
  };

  useEffect(() => {
    if (teamId) {
      fetchPersonTeams(statusFilter);
    }
  }, [teamId, fetchPersonTeams, statusFilter]);

  useEffect(() => {
    if (teamId) {
      fetchPersonTeams(statusFilter);
      fetchTeamInfo();
    }
  }, [teamId, fetchPersonTeams, fetchTeamInfo, statusFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (openModal && !isVisualizing && !editingPersonTeam) {
        fetchPerson(inputPersonValue);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [inputPersonValue, openModal, isVisualizing, editingPersonTeam, fetchPerson]);

  const apiCreateFromCsv = (row: PersonTeamCsvRow) => {
    const personId = Number((row.personId ?? '').toString().trim());
    const memberTypes = parseMemberTypes(row.memberTypes ?? '');

    const body: CreatePersonTeamRequest = {
      personId,
      memberTypes,
    };

    return apiInstance.createPersonTeam(parseInt(teamId || ''), body);
  };

  // ==================== JSX ====================
  return (
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
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Botão Voltar e Breadcrumb */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            alignItems: 'start',
            width: '100%',
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              color: '#1E4EC4',
              borderColor: alpha('#1E4EC4', 0.3),
              fontWeight: 600,
              px: 3,
              py: 1,
              mb: 2,
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
            Voltar para Turmas
          </Button>

          {currentTeam && (
            <Typography variant="body2" sx={{ color: '#555' }}>
              Turmas › Turma: {currentTeam.name}
            </Typography>
          )}
          <Box sx={{ width: '100%' }}>
            <TitleAndButtons
              title="Integrantes da Turma"
              onAdd={handleAdd}
              addLabel="Adicionar Integrante"
              onImportCsv={handleUploadPersonTeam}
              importLabel="Importar Integrantes"
            />
          </Box>
        </Box>

        {/* Área de Filtros */}
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
            <FilterListIcon sx={{ color: '#1E4EC4', fontSize: '1.25rem' }} />
            <Typography
              variant="h6"
              sx={{
                color: '#1a1a2e',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              Filtro de Busca
            </Typography>
            {(filterPersonName || filterMemberType || search) && (
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

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Nome da Pessoa"
                variant="outlined"
                value={filterPersonName}
                size="small"
                onChange={(e) => setFilterPersonName(e.target.value)}
              />

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Função</InputLabel>
                <Select
                  value={filterMemberType}
                  onChange={(e) => setFilterMemberType(e.target.value)}
                  label="Função"
                >
                  <MenuItem value="">
                    <em>Todas as funções</em>
                  </MenuItem>
                  {memberTypeOptions.map((memberType) => (
                    <MenuItem key={memberType.id} value={memberType.id}>
                      {memberType.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={statusFilter === 'Inactive'}
                      onChange={() =>
                        setStatusFilter((prev) => (prev === 'Inactive' ? undefined : 'Inactive'))
                      }
                    />
                  }
                  label="Somente Inativos"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={statusFilter === 'all'}
                      onChange={() =>
                        setStatusFilter((prev) => (prev === 'all' ? undefined : 'all'))
                      }
                    />
                  }
                  label="Incluir Inativos"
                />
              </FormGroup>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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
            </Box>
          </Box>
        </Paper>

        {/* Tabela */}
        <Box sx={{ flexGrow: 1 }}>
          <Table
            columns={columns}
            data={personTeams}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={totalCount}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newRows) => setRowsPerPage(newRows)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            pagination={true}
            noDataMessage={noDataMessage}
          />
        </Box>
      </Paper>

      {/* Modal de Criação/Edição */}
      <DialogPadronized
        open={openModal}
        onClose={handleCloseModal}
        title={dialogTitle()}
        maxWidth="sm"
        content={
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3} sx={{ width: '100%', mx: 'auto' }}>
              <Grid size={{ xs: 12 }}>
                {!isVisualizing && !editingPersonTeam ? (
                  <Box>
                    <Typography id="person-label" variant="subtitle1">
                      <strong>Nome</strong>
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Autocomplete
                      options={personOptions}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      value={selectedPersonOption}
                      onChange={(_, value) => {
                        if (value) {
                          setSelectedPersonId(value.id);
                          setSelectedPersonOption(value);
                        } else {
                          setSelectedPersonId('');
                          setSelectedPersonOption(null);
                        }
                      }}
                      inputValue={inputPersonValue}
                      onInputChange={(_, newInputValue) => {
                        setInputPersonValue(newInputValue);
                      }}
                      filterOptions={(x) => x} // não filtra no cliente; lista vem da API
                      onOpen={() => {
                        if (persons.length === 0) {
                          fetchPerson('');
                        }
                      }}
                      loading={personsLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Selecione uma pessoa"
                          variant="outlined"
                          fullWidth
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {personsLoading ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            },
                          }}
                        />
                      )}
                      noOptionsText="Nenhuma pessoa encontrada"
                      loadingText="Carregando pessoas..."
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography id="person-label" variant="subtitle1">
                      <strong>Nome</strong>
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <TextField
                      label="Pessoa selecionada"
                      variant="outlined"
                      fullWidth
                      value={selectedPersonOption?.label || ''}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      sx={{ pointerEvents: 'none' }}
                    />
                  </Box>
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography id="member-types-label" variant="subtitle1">
                  <strong>Funções</strong>
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <FormControl fullWidth variant="outlined">
                  <InputLabel>Selecione as funções</InputLabel>
                  <Select
                    multiple
                    value={selectedMemberTypes}
                    onChange={handleMemberTypesChange}
                    label="Selecione as funções"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={MemberTypeLabels[value]} size="small" />
                        ))}
                      </Box>
                    )}
                    slotProps={{
                      input: {
                        readOnly: isVisualizing,
                      },
                    }}
                    sx={isVisualizing ? { pointerEvents: 'none' } : {}}
                  >
                    {memberTypeOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {isVisualizing && (
              <>
                <Divider sx={{ mt: 4 }} />

                <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      {userUpdatedName?.[0] || '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Atualizado por
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {userUpdatedName || '—'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AccessTime fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Atualizado em
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {auditDate ? auditDate.format('DD/MM/YYYY HH:mm') : '—'}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </>
            )}
          </Box>
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

      {/* Modal de Importação CSV */}
      {isUploadOpen && (
        <UploadCsvModal<PersonTeamCsvRow>
          title="Importar Integrantes"
          onClose={() => setUploadOpen(false)}
          apiCreate={apiCreateFromCsv}
          expectedHeaders={PERSON_TEAM_CSV_HEADERS}
          headerTranslations={headerTranslations}
          validateFields={validatePersonTeamCsvForm}
          onFinish={() => {
            setUploadOpen(false);
            fetchPersonTeams();
          }}
        />
      )}

      {/* Modal de Confirmação */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="Remover Vínculo"
        message="Tem certeza que deseja remover o vínculo da pessoa"
        highlightText={confirmDialog.personTeam?.personName}
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        loading={confirmDialog.loading}
        danger={true}
      />
    </Container>
  );
};

export default PersonTeam;
