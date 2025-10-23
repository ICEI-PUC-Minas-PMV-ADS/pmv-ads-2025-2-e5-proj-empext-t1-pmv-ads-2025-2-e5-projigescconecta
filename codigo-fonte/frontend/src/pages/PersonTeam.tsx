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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '../components/ConfirmDelete';
import DialogPadronized from '@/components/DialogPadronized';
import { apiConfig } from '../services/auth';
import {
  PersonTeamsApi,
  PersonsApi,
  TeamsApi,
  CreatePersonTeamRequest,
  EditPersonTeamRequest,
  MemberType,
} from './../api';

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
}

interface Person {
  id?: number;
  name?: string;
}

interface Team {
  teamId?: number;
  name?: string | null;
}

const MemberTypeLabels: Record<MemberType, string> = {
  [MemberType.NUMBER_0]: 'Estudante',
  [MemberType.NUMBER_1]: 'Professor',
  [MemberType.NUMBER_2]: 'Coordenador',
  [MemberType.NUMBER_3]: 'Supervisor',
  [MemberType.NUMBER_4]: 'Líder da Equipe',
  [MemberType.NUMBER_5]: 'Mentor',
  [MemberType.NUMBER_6]: 'Voluntário',
  [MemberType.NUMBER_7]: 'Observador',
};

const PersonTeam: React.FC = () => {
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
  const [selectedPersonOption, setSelectedPersonOption] = useState<{
    id: number;
    label: string;
  } | null>(null);
  const [inputPersonValue, setInputPersonValue] = useState('');

  const apiInstance = useMemo(() => new PersonTeamsApi(apiConfig), []);
  const personsApiInstance = useMemo(() => new PersonsApi(apiConfig), []);
  const teamsApiInstance = useMemo(() => new TeamsApi(apiConfig), []);

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
  ];

  const fetchPersonTeams = useCallback(async () => {
    if (!teamId) return;

    try {
      const response = await apiInstance.listPersonTeamsByTeam(parseInt(teamId), {
        params: {
          pageNumber: 1,
          pageSize: 1000,
          filters: undefined,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setNoDataMessage('Nenhuma pessoa vinculada a esta turma.');
          setPersonTeams([]);
          return;
        }

        setNoDataMessage('');
        setPersonTeams(response.data);
      } else {
        setPersonTeams([]);
        setNoDataMessage('Nenhuma pessoa vinculada a esta turma.');
      }
    } catch (error) {
      console.error('Erro ao buscar vínculos:', error);
      toast.error('Erro ao carregar vínculos da turma');
      setPersonTeams([]);
      setNoDataMessage('Erro ao carregar dados.');
    }
  }, [teamId, apiInstance]);

  const fetchPersons = useCallback(async () => {
    try {
      setPersonsLoading(true);
      const response = await personsApiInstance.listPerson({
        pageNumber: 1,
        pageSize: 100,
      });

      const items = response.data?.items ?? [];
      setPersons(items.map((p) => ({ id: p.personId, name: p.name })));
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
      toast.error('Erro ao carregar lista de pessoas');
    } finally {
      setPersonsLoading(false);
    }
  }, [personsApiInstance]);

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
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingPersonTeam(null);
    setSelectedPersonId('');
    setSelectedMemberTypes([]);
    setSelectedPersonOption(null);
    setInputPersonValue('');
    setIsVisualizing(false);
  };

  const handleEdit = (personTeam: PersonTeam) => {
    setEditingPersonTeam(personTeam);
    setSelectedPersonId(personTeam.personId || '');
    setSelectedMemberTypes(personTeam.memberTypes || []);

    const selectedPerson = persons.find((p) => p.id === personTeam.personId);
    if (selectedPerson) {
      setSelectedPersonOption({
        id: selectedPerson.id!,
        label: selectedPerson.name!,
      });
    }

    setInputPersonValue('');
    setIsVisualizing(false);
    setOpenModal(true);
  };

  const handleView = (personTeam: PersonTeam) => {
    setEditingPersonTeam(personTeam);
    setSelectedPersonId(personTeam.personId || '');
    setSelectedMemberTypes(personTeam.memberTypes || []);

    const selectedPerson = persons.find((p) => p.id === personTeam.personId);
    if (selectedPerson) {
      setSelectedPersonOption({
        id: selectedPerson.id!,
        label: selectedPerson.name!,
      });
    }

    setInputPersonValue('');
    setIsVisualizing(true);
    setOpenModal(true);
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
      toast.error('Erro ao salvar vínculo');
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
    setPage(0);
  };

  const handleBack = () => {
    navigate('/team');
  };

  const filteredPersonTeams = useMemo(() => {
    let filtered = personTeams;

    if (filterPersonName.trim()) {
      filtered = filtered.filter((pt) =>
        pt.personName?.toLowerCase().includes(filterPersonName.toLowerCase())
      );
    }

    if (filterMemberType !== '') {
      filtered = filtered.filter((pt) =>
        pt.memberTypes?.includes(filterMemberType as MemberType)
      );
    }

    if (search.trim()) {
      filtered = filtered.filter((pt) =>
        pt.personName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filtered;
  }, [personTeams, filterPersonName, filterMemberType, search]);

  const paginatedPersonTeams = useMemo(() => {
    return filteredPersonTeams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredPersonTeams, page, rowsPerPage]);

  useEffect(() => {
    if (teamId) {
      fetchPersonTeams();
      fetchTeamInfo();
    }
  }, [teamId, fetchPersonTeams, fetchTeamInfo]);

  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

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
            />
          </Box>
        </Box>

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
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 6,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
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
            </Box>

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
        </Paper>

        <Box sx={{ flexGrow: 1 }}>
          <Table
            columns={columns}
            data={paginatedPersonTeams}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={filteredPersonTeams.length}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            noDataMessage={noDataMessage}
          />
        </Box>
      </Paper>

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
