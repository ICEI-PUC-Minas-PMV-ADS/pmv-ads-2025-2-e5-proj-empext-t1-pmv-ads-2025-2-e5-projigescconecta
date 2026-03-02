import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Paper,
  alpha,
  Typography,
  Chip,
  CircularProgress,
  Stack,
  Switch,
  FormControlLabel,
  Autocomplete,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  Divider,
  Avatar,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTime from '@mui/icons-material/AccessTime';
import TitleAndButtons from '@/components/TitleAndButtons';
import Table, { Column } from '../components/Table';
import DialogPadronized from '@/components/DialogPadronized';
import { ConfirmDialog } from '../components/ConfirmDelete';
import { toast } from 'react-toastify';
import {
  ProjectProgramsApi,
  ListProjectProgramRequest,
  Filter,
  Op,
  ProjectDecisionType,
  TeamsApi,
  ProjectTypesApi,
  ProjectThemesApi,
  OscsApi,
  UsersApi,
} from '../api';
import { apiConfig } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';

type ListItem = {
  projectProgramId: number;
  name: string;
  decision: number | string;
  isDeleted: boolean;
  projectThemeId: number;
  projectThemeName: string;
  projectTypeId: number;
  projectTypeName: string;
  teamId: number;
  teamName: string;
  oscId: number;
  oscName: string;
  oscCnpj?: string;
  odsTypes: number[];
};

type ListItemWithLabel = ListItem & { decisionLabel?: string };

type ComboBasic = { id: number; name: string };
type ComboOsc = { id: number; name: string; cnpj?: string };
type OptDecisao = { value: number; label: string };
type OptOds = { value: number; label: string };

const DECISION_OPTIONS: OptDecisao[] = [
  { value: 0, label: 'Iniciado' },
  { value: 1, label: 'Incompleto' },
  { value: 2, label: 'Aprovado' },
  { value: 3, label: 'Reprovado' },
];

const ODS_OPTIONS: OptOds[] = [
  { value: 1, label: 'ODS 1 Erradicação da Pobreza' },
  { value: 2, label: 'ODS 2 Fome Zero e Agricultura Sustentável' },
  { value: 3, label: 'ODS 3 Saúde e Bem-Estar' },
  { value: 4, label: 'ODS 4 Educação de Qualidade' },
  { value: 5, label: 'ODS 5 Igualdade de Gênero' },
  { value: 6, label: 'ODS 6 Água Potável e Saneamento' },
  { value: 7, label: 'ODS 7 Energia Limpa e Acessível' },
  { value: 8, label: 'ODS 8 Trabalho Decente e Crescimento Econômico' },
  { value: 9, label: 'ODS 9 Indústria, Inovação e Infraestrutura' },
  { value: 10, label: 'ODS 10 Redução das Desigualdades' },
  { value: 11, label: 'ODS 11 Cidades e Comunidades Sustentáveis' },
  { value: 12, label: 'ODS 12 Consumo e Produção Responsáveis' },
  { value: 13, label: 'ODS 13 Ação Contra a Mudança do Clima' },
  { value: 14, label: 'ODS 14 Vida na Água' },
  { value: 15, label: 'ODS 15 Vida Terrestre' },
  { value: 16, label: 'ODS 16 Paz, Justiça e Instituições Eficazes' },
  { value: 17, label: 'ODS 17 Parcerias e Meios de Implementação' },
];

const ProjectProgram: React.FC = () => {
  const api = new ProjectProgramsApi(apiConfig);
  const navigate = useNavigate();
  const userApi = new UsersApi(apiConfig);

  const [items, setItems] = useState<ListItemWithLabel[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');

  const [qName, setQName] = useState('');
  const [qOsc, setQOsc] = useState<ComboOsc | null>(null);
  const [qTeam, setQTeam] = useState<ComboBasic | null>(null);
  const [qType, setQType] = useState<ComboBasic | null>(null);
  const [qTheme, setQTheme] = useState<ComboBasic | null>(null);
  const [qDecisionOpt, setQDecisionOpt] = useState<OptDecisao | null>(null);
  const [qOdsOpt, setQOdsOpt] = useState<OptOds | null>(null);
  const [statusFilter, setStatusFilter] = useState<undefined | 'Inactive' | 'all'>(undefined);

  const [oscOptions, setOscOptions] = useState<ComboOsc[]>([]);
  const [teamOptions, setTeamOptions] = useState<ComboBasic[]>([]);
  const [typeOptions, setTypeOptions] = useState<ComboBasic[]>([]);
  const [themeOptions, setThemeOptions] = useState<ComboBasic[]>([]);
  const [loadingCombos, setLoadingCombos] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [editing, setEditing] = useState<ListItemWithLabel | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [userUpdatedName, setUserUpdatedName] = useState<string | null>(null);
  const [auditDate, setAuditDate] = useState<Dayjs | undefined>(undefined);

  const [projectName, setProjectName] = useState('');
  const [mDecisionOpt, setMDecisionOpt] = useState<OptDecisao | null>(null);
  const [mOsc, setMOsc] = useState<ComboOsc | null>(null);
  const [mTeam, setMTeam] = useState<ComboBasic | null>(null);
  const [mType, setMType] = useState<ComboBasic | null>(null);
  const [mTheme, setMTheme] = useState<ComboBasic | null>(null);
  const [mOdsOpts, setMOdsOpts] = useState<OptOds[]>([]);
  const [mOdsInput, setMOdsInput] = useState('');
  const [odsOpen, setOdsOpen] = useState(false);

  const columns: Column<ListItemWithLabel>[] = [
    { label: 'ID', field: 'projectProgramId' },
    { label: 'Nome do Projeto', field: 'name' },
    { label: 'Tipo do Projeto', field: 'projectTypeName' },
    { label: 'Tema do Projeto', field: 'projectThemeName' },
    { label: 'Turma', field: 'teamName' },
    { label: 'OSC', field: 'oscName' },
    { label: 'Decisão', field: 'decisionLabel' },
    {
      label: 'Status',
      field: 'isDeleted',
      align: 'center',
      render: (value) => (
        <Chip
          label={value ? 'Inativo' : 'Ativo'}
          size="small"
          color={value ? 'error' : 'success'}
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
  ];

  const hasAnyFilter =
    !!qName ||
    !!qOsc ||
    !!qTeam ||
    !!qType ||
    !!qTheme ||
    !!qDecisionOpt ||
    !!qOdsOpt ||
    statusFilter !== undefined;

  const buildFilters = (): Filter[] => {
    const filters: Filter[] = [];
    const CONTAINS = Op.NUMBER_7;
    const EQUALS = Op.NUMBER_1;
    if (qName.trim())
      filters.push({ propertyName: 'Name', operation: CONTAINS, value: qName.trim() });
    if (qOsc) filters.push({ propertyName: 'Osc.Name', operation: CONTAINS, value: qOsc.name });
    if (qTeam) filters.push({ propertyName: 'Team.Name', operation: CONTAINS, value: qTeam.name });
    if (qType)
      filters.push({ propertyName: 'ProjectType.Name', operation: CONTAINS, value: qType.name });
    if (qTheme)
      filters.push({ propertyName: 'ProjectTheme.Name', operation: CONTAINS, value: qTheme.name });
    if (qDecisionOpt)
      filters.push({
        propertyName: 'Decision',
        operation: EQUALS,
        value: qDecisionOpt.label,
      });
    if (qOdsOpt)
      filters.push({ propertyName: 'OdsTypes', operation: CONTAINS, value: String(qOdsOpt.value) });
    return filters;
  };

  const decorateDecision = (d: number | string | undefined): OptDecisao | undefined => {
    if (d === undefined || d === null) return undefined;
    const num = typeof d === 'string' ? Number(d) : d;
    return DECISION_OPTIONS.find((o) => o.value === num);
  };

  const fetchList = async (statusFilterParam?: string) => {
    try {
      setLoading(true);
      const request: ListProjectProgramRequest = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        filters: buildFilters(),
        statusFilter: statusFilterParam ?? statusFilter,
      };
      const { data } = await api.listProjectProgram(request);
      const raw = (data.items as unknown as ListItem[]) || [];
      const list: ListItemWithLabel[] = raw.map((i) => {
        const match = decorateDecision(i.decision);
        return {
          ...i,
          decisionLabel: match?.label ?? String(i.decision ?? ''),
        };
      });
      setItems(list);
      setTotalCount(data.totalItems || 0);
      setNoDataMessage(list.length ? '' : 'Nenhum projeto encontrado');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.join(', ') ||
        'Erro ao carregar projetos';
      toast.error(message);
      setItems([]);
      setTotalCount(0);
      setNoDataMessage('Nenhum projeto encontrado');
    } finally {
      setLoading(false);
    }
  };

  const fetchCombos = async () => {
    try {
      setLoadingCombos(true);
      const oscApi = new OscsApi(apiConfig);
      const teamApi = new TeamsApi(apiConfig);
      const typeApi = new ProjectTypesApi(apiConfig);
      const themeApi = new ProjectThemesApi(apiConfig);
      const [oscResp, teamResp, typeResp, themeResp] = await Promise.all([
        oscApi.listOsc({ pageNumber: 1, pageSize: 200 }),
        teamApi.listTeam({ pageNumber: 1, pageSize: 200 }),
        typeApi.listProjectType({ pageNumber: 1, pageSize: 200 }),
        themeApi.listProjectTheme({ pageNumber: 1, pageSize: 200 }),
      ]);
      const oscs = (oscResp.data.items || []).map((o: any) => ({
        id: o.oscId ?? o.id,
        name: o.name,
        cnpj: o.oscPrimaryDocumment,
      })) as ComboOsc[];
      oscs.sort((a, b) => a.name.localeCompare(b.name));
      setOscOptions(oscs);
      const teams = (teamResp.data.items || []).map((t: any) => ({
        id: t.teamId ?? t.id,
        name: t.name,
      })) as ComboBasic[];
      teams.sort((a, b) => a.name.localeCompare(b.name));
      setTeamOptions(teams);
      const types = (typeResp.data.items || []).map((t: any) => ({
        id: t.projectTypeId ?? t.id,
        name: t.name,
      })) as ComboBasic[];
      types.sort((a, b) => a.name.localeCompare(b.name));
      setTypeOptions(types);
      const themes = (themeResp.data.items || []).map((t: any) => ({
        id: t.projectThemeId ?? t.id,
        name: t.name,
      })) as ComboBasic[];
      themes.sort((a, b) => a.name.localeCompare(b.name));
      setThemeOptions(themes);
    } catch {
      toast.error('Erro ao carregar dados para filtros/formulário');
    } finally {
      setLoadingCombos(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchList(statusFilter);
  };

  const handleClear = () => {
    setPage(0);
    setQName('');
    setQOsc(null);
    setQTeam(null);
    setQType(null);
    setQTheme(null);
    setQDecisionOpt(null);
    setQOdsOpt(null);
    setStatusFilter(undefined);
    fetchList(undefined);
  };

  const handleAdd = () => {
    setEditing(null);
    setIsVisualizing(false);
    setUserUpdatedName(null);
    setAuditDate(undefined);
    setProjectName('');
    setMDecisionOpt(null);
    setMOsc(null);
    setMTeam(null);
    setMType(null);
    setMTheme(null);
    setMOdsOpts([]);
    setMOdsInput('');
    setOpenModal(true);
  };

  const handleView = async (row: ListItemWithLabel) => {
    try {
      const { data } = await api.getProjectProgramById(row.projectProgramId);

      const audit = data as unknown as {
        updatedBy?: number;
        updatedAt?: string;
        createdAt?: string;
      };

      const userId = audit.updatedBy;
      const date = audit.updatedAt || audit.createdAt;

      if (userId) {
        const { data: userData } = await userApi.getUserById(userId);
        setUserUpdatedName(userData.name || null);
      } else {
        setUserUpdatedName(null);
      }

      setAuditDate(date ? dayjs(date) : undefined);

      setIsVisualizing(true);
      setEditing(row);
      setProjectName(data.name || row.name || '');
      const dec = data?.decision ?? row.decision;
      const matched = decorateDecision(dec) ?? null;
      setMDecisionOpt(matched);
      setMOsc({ id: row.oscId, name: row.oscName, cnpj: row.oscCnpj });
      setMTeam({ id: row.teamId, name: row.teamName });
      setMType({ id: row.projectTypeId, name: row.projectTypeName });
      setMTheme({ id: row.projectThemeId, name: row.projectThemeName });
      const odsValues: number[] = (data.odsTypes as number[]) ?? row.odsTypes ?? [];
      setMOdsOpts(ODS_OPTIONS.filter((o) => odsValues.includes(o.value)));
      setMOdsInput('');
      setOpenModal(true);
    } catch {
      toast.error('Erro ao carregar detalhes do projeto');
    }
  };

  const handleEdit = async (row: ListItemWithLabel) => {
    try {
      const { data } = await api.getProjectProgramById(row.projectProgramId);
      setIsVisualizing(false);
      setUserUpdatedName(null);
      setAuditDate(undefined);
      setEditing(row);
      setProjectName(data.name || row.name || '');
      const dec = data?.decision ?? row.decision;
      const matched = decorateDecision(dec) ?? null;
      setMDecisionOpt(matched);
      setMOsc({ id: row.oscId, name: row.oscName, cnpj: row.oscCnpj });
      setMTeam({ id: row.teamId, name: row.teamName });
      setMType({ id: row.projectTypeId, name: row.projectTypeName });
      setMTheme({ id: row.projectThemeId, name: row.projectThemeName });
      const odsValues: number[] = (data.odsTypes as number[]) ?? row.odsTypes ?? [];
      setMOdsOpts(ODS_OPTIONS.filter((o) => odsValues.includes(o.value)));
      setMOdsInput('');
      setOpenModal(true);
    } catch {
      toast.error('Erro ao carregar projeto para edição');
    }
  };

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    loading: false,
    row: null as ListItemWithLabel | null,
    restore: false,
  });

  const openDelete = (row: ListItemWithLabel) =>
    setConfirmDialog({ open: true, loading: false, row, restore: false });

  const openRestore = (row: ListItemWithLabel) =>
    setConfirmDialog({ open: true, loading: false, row, restore: true });

  const closeConfirm = () =>
    setConfirmDialog({ open: false, loading: false, row: null, restore: false });

  const handleConfirmDeleteOrRestore = async () => {
    if (!confirmDialog.row) return;
    try {
      setConfirmDialog((p) => ({ ...p, loading: true }));
      const id = confirmDialog.row.projectProgramId;
      if (confirmDialog.restore) {
        await api.restoreProjectProgram(id);
        toast.success(`Projeto "${confirmDialog.row.name}" restaurado com sucesso!`);
      } else {
        await api.deleteProjectProgram(id);
        toast.success(`Projeto "${confirmDialog.row.name}" excluído com sucesso!`);
      }
      closeConfirm();
      fetchList();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.join(', ') ||
        'Operação não concluída';
      toast.error(message);
      setConfirmDialog((p) => ({ ...p, loading: false }));
    }
  };

  const dialogTitle = () =>
    isVisualizing ? 'Visualizar Projeto' : editing ? 'Editar Projeto' : 'Adicionar Projeto';

  const activeChips = useMemo(() => {
    const chips: string[] = [];
    if (qName) chips.push(`Projeto: ${qName}`);
    if (qOsc) chips.push(`OSC: ${qOsc.name}`);
    if (qTeam) chips.push(`Turma: ${qTeam.name}`);
    if (qType) chips.push(`Tipo: ${qType.name}`);
    if (qTheme) chips.push(`Tema: ${qTheme.name}`);
    if (qDecisionOpt) chips.push(`Decisão: ${qDecisionOpt.label}`);
    if (qOdsOpt) chips.push(qOdsOpt.label);
    if (statusFilter === 'Inactive') chips.push('Somente inativos');
    else if (statusFilter === 'all') chips.push('Incluir inativos');
    return chips;
  }, [qName, qOsc, qTeam, qType, qTheme, qDecisionOpt, qOdsOpt, statusFilter]);

  const validateModal = () => {
    if (!projectName.trim()) return 'Informe o nome do projeto.';
    if (!mDecisionOpt) return 'Selecione a decisão.';
    if (!mOsc) return 'Selecione a OSC.';
    if (!mTeam) return 'Selecione a Turma.';
    if (!mType) return 'Selecione o Tipo do Projeto.';
    if (!mTheme) return 'Selecione o Tema do Projeto.';
    return '';
  };

  const handleSave = async () => {
    const err = validateModal();
    if (err) {
      toast.error(err);
      return;
    }
    try {
      setModalLoading(true);
      const payload: any = {
        name: projectName.trim(),
        decision: mDecisionOpt!.value as unknown as ProjectDecisionType,
        oscId: mOsc?.id,
        teamId: mTeam?.id,
        projectTypeId: mType?.id,
        projectThemeId: mTheme?.id,
        odsTypes: mOdsOpts.map((o) => o.value),
      };
      if (editing) {
        await (api as any).editProjectProgram(editing.projectProgramId, payload);
        toast.success('Projeto atualizado com sucesso!');
      } else {
        await (api as any).createProjectProgram(payload);
        toast.success('Projeto criado com sucesso!');
      }
      setOpenModal(false);
      fetchList();
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data?.errors?.join(', ') ||
        'Erro ao salvar projeto';
      toast.error(message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDocuments = (row: ListItemWithLabel) => {
    if (!row.projectProgramId) return;
    navigate(`/project-program/${row.projectProgramId}/documents`, {
      state: { name: row.name },
    });
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  useEffect(() => {
    fetchList(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, statusFilter]);

  const norm = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

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
        <TitleAndButtons title="Listar Projetos" onAdd={handleAdd} addLabel="Novo Projeto" />

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
            <FilterListIcon sx={{ color: '#1E4EC4', fontSize: '1.25rem' }} />
            <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '1.1rem' }}>
              Filtro de Busca
            </Typography>
            {hasAnyFilter && (
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

          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              label="Nome do Projeto"
              variant="outlined"
              size="small"
              value={qName}
              onChange={(e) => setQName(e.target.value)}
              onKeyUp={(e) => (e.key === 'Enter' ? handleSearch() : undefined)}
              sx={{ minWidth: 220 }}
            />

            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>OSC</InputLabel>
              <Select
                value={qOsc?.id ?? ''}
                onChange={(e) => {
                  const value = e.target.value as number | '';
                  if (value === '') {
                    setQOsc(null);
                  } else {
                    const selected = oscOptions.find((o) => o.id === Number(value));
                    setQOsc(selected || null);
                  }
                }}
                label="OSC"
                disabled={loadingCombos}
              >
                <MenuItem value="">
                  <em>Todas</em>
                </MenuItem>
                {oscOptions.map((osc) => (
                  <MenuItem key={osc.id} value={osc.id}>
                    {osc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Turma</InputLabel>
              <Select
                value={qTeam?.id ?? ''}
                onChange={(e) => {
                  const value = e.target.value as number | '';
                  if (value === '') {
                    setQTeam(null);
                  } else {
                    const selected = teamOptions.find((t) => t.id === Number(value));
                    setQTeam(selected || null);
                  }
                }}
                label="Turma"
                disabled={loadingCombos}
              >
                <MenuItem value="">
                  <em>Todas</em>
                </MenuItem>
                {teamOptions.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Tipo do Projeto</InputLabel>
              <Select
                value={qType?.id ?? ''}
                onChange={(e) => {
                  const value = e.target.value as number | '';
                  if (value === '') {
                    setQType(null);
                  } else {
                    const selected = typeOptions.find((t) => t.id === Number(value));
                    setQType(selected || null);
                  }
                }}
                label="Tipo do Projeto"
                disabled={loadingCombos}
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                {typeOptions.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Tema do Projeto</InputLabel>
              <Select
                value={qTheme?.id ?? ''}
                onChange={(e) => {
                  const value = e.target.value as number | '';
                  if (value === '') {
                    setQTheme(null);
                  } else {
                    const selected = themeOptions.find((t) => t.id === Number(value));
                    setQTheme(selected || null);
                  }
                }}
                label="Tema do Projeto"
                disabled={loadingCombos}
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                {themeOptions.map((theme) => (
                  <MenuItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Decisão</InputLabel>
              <Select
                value={qDecisionOpt?.value ?? ''}
                onChange={(e) => {
                  const value = e.target.value as number | '';
                  if (value === '') {
                    setQDecisionOpt(null);
                  } else {
                    const selected = DECISION_OPTIONS.find((o) => o.value === Number(value));
                    setQDecisionOpt(selected || null);
                  }
                }}
                label="Decisão"
              >
                <MenuItem value="">
                  <em>Todas</em>
                </MenuItem>
                {DECISION_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 280 }}>
              <InputLabel>ODS</InputLabel>
              <Select
                value={qOdsOpt?.value ?? ''}
                onChange={(e) => {
                  const value = e.target.value as number | '';
                  if (value === '') {
                    setQOdsOpt(null);
                  } else {
                    const selected = ODS_OPTIONS.find((o) => o.value === Number(value));
                    setQOdsOpt(selected || null);
                  }
                }}
                label="ODS"
              >
                <MenuItem value="">
                  <em>Todas</em>
                </MenuItem>
                {ODS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              mt: 2.5,
              gap: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
              flexWrap: 'wrap',
            }}
          >
            <FormGroup row sx={{ mb: 2 }}>
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
                    onChange={() => setStatusFilter((prev) => (prev === 'all' ? undefined : 'all'))}
                  />
                }
                label="Incluir Inativos"
              />
            </FormGroup>

            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              sx={{
                bgcolor: '#1E4EC4',
                color: 'white',
                fontWeight: 600,
                px: 3,
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
                flex: { xs: 1, sm: 'initial' },
              }}
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClear}
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

          {hasAnyFilter && (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
              {activeChips.map((c, idx) => (
                <Chip key={idx} label={c} size="small" />
              ))}
            </Stack>
          )}
        </Paper>

        <Box sx={{ flexGrow: 1 }}>
          {loading ? (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Table<ListItemWithLabel>
              columns={columns}
              data={items}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              onPageChange={setPage}
              onRowsPerPageChange={setRowsPerPage}
              onView={handleView}
              onEdit={(row) => (!row.isDeleted ? handleEdit(row) : undefined)}
              onDelete={(row) => (!row.isDeleted ? openDelete(row) : openRestore(row))}
              noDataMessage={noDataMessage}
              onProjectDocument={handleDocuments}
            />
          )}
        </Box>
      </Paper>

      <DialogPadronized
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        title={dialogTitle()}
        content={
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                autoFocus={!isVisualizing}
                margin="dense"
                label="Nome do Projeto *"
                type="text"
                fullWidth
                variant="outlined"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                slotProps={{
                  input: {
                    readOnly: isVisualizing,
                  },
                }}
                sx={isVisualizing ? { pointerEvents: 'none' } : {}}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                options={DECISION_OPTIONS}
                value={mDecisionOpt}
                onChange={(_, opt) => setMDecisionOpt(opt)}
                isOptionEqualToValue={(o, v) => o.value === v.value}
                getOptionLabel={(o) => o?.label ?? ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Decisão *"
                    margin="dense"
                    fullWidth
                    variant="outlined"
                  />
                )}
                disabled={isVisualizing}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                options={oscOptions}
                value={mOsc}
                onChange={(_, v) => setMOsc(v)}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                getOptionLabel={(o) => (o ? `${o.name}${o.cnpj ? ` — ${o.cnpj}` : ''}` : '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="OSC *"
                    margin="dense"
                    fullWidth
                    variant="outlined"
                  />
                )}
                disabled={isVisualizing}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                options={teamOptions}
                value={mTeam}
                onChange={(_, v) => setMTeam(v)}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                getOptionLabel={(o) => o?.name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Turma *"
                    margin="dense"
                    fullWidth
                    variant="outlined"
                  />
                )}
                disabled={isVisualizing}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                options={typeOptions}
                value={mType}
                onChange={(_, v) => setMType(v)}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                getOptionLabel={(o) => o?.name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo do Projeto *"
                    margin="dense"
                    fullWidth
                    variant="outlined"
                  />
                )}
                disabled={isVisualizing}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                options={themeOptions}
                value={mTheme}
                onChange={(_, v) => setMTheme(v)}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                getOptionLabel={(o) => o?.name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tema do Projeto *"
                    margin="dense"
                    fullWidth
                    variant="outlined"
                  />
                )}
                disabled={isVisualizing}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Autocomplete<OptOds, true, false, false>
                multiple
                options={ODS_OPTIONS}
                value={mOdsOpts}
                open={odsOpen}
                onOpen={() => setOdsOpen(true)}
                onClose={() => setOdsOpen(false)}
                onChange={(_, v) => {
                  setMOdsOpts(v);
                  setMOdsInput('');
                  setOdsOpen(false);
                }}
                isOptionEqualToValue={(o, v) => o.value === v.value}
                getOptionLabel={(o) => o?.label ?? ''}
                inputValue={mOdsInput}
                onInputChange={(_, v) => setMOdsInput(v)}
                filterOptions={(options, state) => {
                  const q = (state.inputValue || '').trim();
                  if (!q) return options;
                  const nq = norm(q);
                  return options.filter((o) => norm(o.label).includes(nq));
                }}
                renderTags={() => null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Adicionar ODS"
                    margin="dense"
                    fullWidth
                    variant="outlined"
                  />
                )}
                disabled={isVisualizing}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ mt: 1 }}>
                {mOdsOpts.length === 0 ? (
                  <Typography color="text.secondary">Nenhuma ODS adicionada.</Typography>
                ) : (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {mOdsOpts.map((opt) => (
                      <Chip
                        key={opt.value}
                        label={opt.label}
                        onDelete={
                          isVisualizing
                            ? undefined
                            : () => setMOdsOpts((prev) => prev.filter((x) => x.value !== opt.value))
                        }
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Grid>

            {isVisualizing && (
              <Grid size={{ xs: 12 }}>
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
              </Grid>
            )}
          </Grid>
        }
        actions={
          isVisualizing ? (
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => setOpenModal(false)}
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
                onClick={() => setOpenModal(false)}
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
        title={confirmDialog.restore ? 'Restaurar Projeto' : 'Excluir Projeto'}
        message={
          confirmDialog.restore
            ? 'Tem certeza que deseja restaurar o projeto'
            : 'Tem certeza que deseja excluir o projeto'
        }
        highlightText={confirmDialog.row?.name}
        confirmLabel={confirmDialog.restore ? 'Restaurar' : 'Excluir'}
        cancelLabel="Cancelar"
        onClose={closeConfirm}
        onConfirm={handleConfirmDeleteOrRestore}
        loading={confirmDialog.loading}
        danger={!confirmDialog.restore}
      />
    </Container>
  );
};

export default ProjectProgram;
