import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { toast } from 'react-toastify';

dayjs.locale('pt-br');

// Interfaces
interface Team {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  teamNumber: string;
  schedule: string;
  programId: number;
  programName?: string;
}

interface Program {
  id: number;
  name: string;
}

const dadosMockados = [
  {
    id: 1,
    name: 'Equipe Alpha',
    startDate: '2025-02-01',
    endDate: '2025-07-30',
    teamNumber: 'T-001',
    schedule: 'Segunda e Quarta - 19h às 21h',
    programId: 101,
    programName: 'Programa de Inovação',
  },
  {
    id: 2,
    name: 'Equipe Beta',
    startDate: '2025-03-05',
    endDate: '2025-08-20',
    teamNumber: 'T-002',
    schedule: 'Terça e Quinta - 18h às 20h',
    programId: 102,
    programName: 'Programa de Tecnologia',
  },
  {
    id: 3,
    name: 'Equipe Gamma',
    startDate: '2025-01-15',
    endDate: '2025-06-15',
    teamNumber: 'T-003',
    schedule: 'Sábado - 09h às 12h',
    programId: 103,
    programName: 'Programa de Liderança',
  },
  {
    id: 4,
    name: 'Equipe Delta',
    startDate: '2025-04-01',
    endDate: '2025-09-01',
    teamNumber: 'T-004',
    schedule: 'Segunda a Sexta - 14h às 16h',
    programId: 104,
    programName: 'Programa de Desenvolvimento Pessoal',
  },
  {
    id: 5,
    name: 'Equipe Omega',
    startDate: '2025-02-10',
    endDate: '2025-07-10',
    teamNumber: 'T-005',
    schedule: 'Segunda e Quarta - 08h às 10h',
    programId: 105,
    programName: 'Programa de Empreendedorismo',
  },
  {
    id: 6,
    name: 'Equipe Sigma',
    startDate: '2025-05-01',
    endDate: '2025-10-01',
    teamNumber: 'T-006',
    schedule: 'Terça e Quinta - 19h às 21h',
    programId: 106,
    programName: 'Programa de Sustentabilidade',
  },
  {
    id: 7,
    name: 'Equipe Zeta',
    startDate: '2025-03-20',
    endDate: '2025-08-20',
    teamNumber: 'T-007',
    schedule: 'Sexta - 18h às 21h',
    programId: 107,
    programName: 'Programa de Educação Digital',
  },
  {
    id: 8,
    name: 'Equipe Phoenix',
    startDate: '2025-04-15',
    endDate: '2025-09-15',
    teamNumber: 'T-008',
    schedule: 'Segunda a Quarta - 10h às 12h',
    programId: 108,
    programName: 'Programa de Criatividade',
  },
  {
    id: 9,
    name: 'Equipe Titan',
    startDate: '2025-02-25',
    endDate: '2025-07-25',
    teamNumber: 'T-009',
    schedule: 'Terça e Quinta - 15h às 17h',
    programId: 109,
    programName: 'Programa de Ciências Aplicadas',
  },
  {
    id: 10,
    name: 'Equipe Orion',
    startDate: '2025-01-10',
    endDate: '2025-06-30',
    teamNumber: 'T-010',
    schedule: 'Quarta e Sexta - 09h às 11h',
    programId: 110,
    programName: 'Programa de Artes e Cultura',
  },
];

const Team: React.FC = () => {
  const [search, setSearch] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [teamNumber, setTeamNumber] = useState('');
  const [schedule, setSchedule] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [programsLoading, setProgramsLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (openModal) {
      fetchPrograms();
    }
  }, [openModal]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      // TODO: Substituir por chamada real da API
      const data = {
        items: dadosMockados,
        total: dadosMockados.length,
        page: page + 1,
        limit: rowsPerPage,
      };
      setTeams(data.items);
      setTotalCount(data.total);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      toast.error('Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      setProgramsLoading(true);
      // TODO: Substituir por chamada real da API
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data: Program[] = [
        { id: 101, name: 'Programa de Inovação' },
        { id: 102, name: 'Programa de Tecnologia' },
        { id: 103, name: 'Programa de Liderança' },
      ];
      setPrograms(data);
    } catch (error) {
      console.error('Erro ao carregar programas:', error);
      toast.error('Erro ao carregar programas');
    } finally {
      setProgramsLoading(false);
    }
  };

  const columns: Column<Team>[] = [
    { label: 'ID', field: 'id' },
    { label: 'Nome da Turma', field: 'name' },
    { label: 'Número', field: 'teamNumber' },
    { label: 'Data Início', field: 'startDate' },
    { label: 'Data Fim', field: 'endDate' },
    { label: 'Horário', field: 'schedule' },
    { label: 'Programa', field: 'programName' },
  ];

  const handleSearch = () => {
    setPage(0);
    fetchTeams();
  };

  const handleAdd = () => {
    resetForm();
    setOpenModal(true);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setTeamName(team.name);
    setStartDate(dayjs(team.startDate));
    setEndDate(dayjs(team.endDate));
    setTeamNumber(team.teamNumber);
    setSchedule(team.schedule);
    setSelectedProgramId(team.programId);
    setOpenModal(true);
  };

  const handleView = (team: Team) => {
    toast.info(`Visualizando: ${team.name}`);
  };

  const handleDelete = async (team: Team) => {
    try {
      // TODO: Substituir por chamada real da API
      await new Promise((resolve) => setTimeout(resolve, 300));
      toast.success(`Turma "${team.name}" excluída com sucesso!`);
      fetchTeams();
    } catch (error) {
      console.error('Erro ao excluir turma:', error);
      toast.error('Erro ao excluir turma');
    }
  };

  const validateForm = (): boolean => {
    if (
      !teamName.trim() ||
      !startDate ||
      !endDate ||
      !teamNumber.trim() ||
      !schedule.trim() ||
      !selectedProgramId
    ) {
      toast.error('Todos os campos são obrigatórios!');
      return false;
    }
    if (endDate.isBefore(startDate)) {
      toast.error('A data de fim deve ser posterior à data de início!');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setModalLoading(true);
      const teamData = {
        name: teamName.trim(),
        startDate: startDate!.format('YYYY-MM-DD'),
        endDate: endDate!.format('YYYY-MM-DD'),
        teamNumber: teamNumber.trim(),
        schedule: schedule.trim(),
        programId: selectedProgramId,
      };

      if (editingTeam) {
        // TODO: Substituir por chamada real da API de atualização (PUT)
        toast.success('Turma atualizada com sucesso!');
      } else {
        // TODO: Substituir por chamada real da API de criação (POST)
        toast.success('Turma criada com sucesso!');
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      handleCloseModal();
      fetchTeams();
    } catch (error) {
      console.error('Erro ao salvar turma:', error);
      toast.error('Erro ao salvar turma');
    } finally {
      setModalLoading(false);
    }
  };

  const resetForm = () => {
    setEditingTeam(null);
    setTeamName('');
    setStartDate(null);
    setEndDate(null);
    setTeamNumber('');
    setSchedule('');
    setSelectedProgramId('');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const handleProgramChange = (event: SelectChangeEvent<number | ''>) => {
    setSelectedProgramId(event.target.value as number | '');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Container
        maxWidth="xl"
        sx={{
          backgroundColor: '#e2e2e2',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <TitleAndButtons title="Listar Turmas" onAdd={handleAdd} addLabel="Nova Turma" />

        <Box sx={{ width: '100%', display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <TextField
            label="Buscar por nome"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Pesquisar
          </Button>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          {loading ? (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Table<Team>
              columns={columns}
              data={teams}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              onPageChange={setPage}
              onRowsPerPageChange={setRowsPerPage}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Box>

        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle>{editingTeam ? 'Editar Turma' : 'Nova Turma'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Nome da Turma */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  autoFocus
                  required
                  label="Nome da Turma"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Informe o nome da turma"
                />
              </Grid>

              {/* Número da Turma */}
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  required
                  label="Número da Turma"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={teamNumber}
                  onChange={(e) => setTeamNumber(e.target.value)}
                  placeholder="Ex: 062"
                />
              </Grid>

              {/* Horário */}
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  required
                  label="Horário"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="Ex: 19:00 - 22:00"
                />
              </Grid>

              {/* Data de Início */}
              <Grid size={{ xs: 12, md: 6 }}>
                <DatePicker
                  label="Data de Início"
                  value={startDate}
                  onChange={setStartDate}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                />
              </Grid>

              {/* Data de Fim */}
              <Grid size={{ xs: 12, md: 6 }}>
                <DatePicker
                  label="Data de Fim"
                  value={endDate}
                  onChange={setEndDate}
                  format="DD/MM/YYYY"
                  minDate={startDate || undefined}
                  slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                />
              </Grid>

              {/* Programa */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Programa</InputLabel>
                  <Select
                    value={selectedProgramId}
                    onChange={handleProgramChange}
                    label="Programa"
                    disabled={programsLoading}
                  >
                    {programsLoading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...
                      </MenuItem>
                    ) : programs.length === 0 ? (
                      <MenuItem disabled>Nenhum programa cadastrado</MenuItem>
                    ) : (
                      programs.map((program) => (
                        <MenuItem key={program.id} value={program.id}>
                          {program.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary" disabled={modalLoading}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
              variant="contained"
              disabled={modalLoading}
              startIcon={modalLoading ? <CircularProgress size={20} /> : null}
            >
              {modalLoading ? 'Salvando...' : editingTeam ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default Team;
