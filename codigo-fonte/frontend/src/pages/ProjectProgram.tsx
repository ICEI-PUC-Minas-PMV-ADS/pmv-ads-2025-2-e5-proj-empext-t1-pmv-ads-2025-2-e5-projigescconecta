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
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
 OdsType,
 TeamsApi,
 ProjectTypesApi,
 ProjectThemesApi,
 OscsApi,
} from './../api';
import { apiConfig } from '../services/auth';

type ListItem = {
 projectProgramId: number;
 name: string;
 decision: ProjectDecisionType;
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
 odsTypes: OdsType[];
};

type ComboBasic = { id: number; name: string };
type ComboOsc = { id: number; name: string; cnpj?: string };
type OptDecisao = { value: ProjectDecisionType; label: string };
type OptOds = { value: OdsType; label: string };

const FIELD_STYLE = { minWidth: 240, flex: '1 1 240px' };

const DECISION_OPTIONS: OptDecisao[] = [
 { value: ProjectDecisionType.Started, label: 'Iniciado' },
 { value: ProjectDecisionType.Incomplete, label: 'Incompleto' },
 { value: ProjectDecisionType.Approved, label: 'Aprovado' },
 { value: ProjectDecisionType.Failed, label: 'Reprovado' },
];

const ODS_OPTIONS: OptOds[] = [
 { value: OdsType.Ods1, label: 'ODS 1 — Erradicação da Pobreza' },
 { value: OdsType.Ods2, label: 'ODS 2 — Fome Zero e Agricultura Sustentável' },
 { value: OdsType.Ods3, label: 'ODS 3 — Saúde e Bem-Estar' },
 { value: OdsType.Ods4, label: 'ODS 4 — Educação de Qualidade' },
 { value: OdsType.Ods5, label: 'ODS 5 — Igualdade de Gênero' },
 { value: OdsType.Ods6, label: 'ODS 6 — Água Potável e Saneamento' },
 { value: OdsType.Ods7, label: 'ODS 7 — Energia Limpa e Acessível' },
 { value: OdsType.Ods8, label: 'ODS 8 — Trabalho Decente e Crescimento Econômico' },
 { value: OdsType.Ods9, label: 'ODS 9 — Indústria, Inovação e Infraestrutura' },
 { value: OdsType.Ods10, label: 'ODS 10 — Redução das Desigualdades' },
 { value: OdsType.Ods11, label: 'ODS 11 — Cidades e Comunidades Sustentáveis' },
 { value: OdsType.Ods12, label: 'ODS 12 — Consumo e Produção Responsáveis' },
 { value: OdsType.Ods13, label: 'ODS 13 — Ação Contra a Mudança do Clima' },
 { value: OdsType.Ods14, label: 'ODS 14 — Vida na Água' },
 { value: OdsType.Ods15, label: 'ODS 15 — Vida Terrestre' },
 { value: OdsType.Ods16, label: 'ODS 16 — Paz, Justiça e Instituições Eficazes' },
 { value: OdsType.Ods17, label: 'ODS 17 — Parcerias e Meios de Implementação' },
];

const ProjectProgram: React.FC = () => {
 const api = new ProjectProgramsApi(apiConfig);

 const [items, setItems] = useState<ListItem[]>([]);
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
 const [includeDeleted, setIncludeDeleted] = useState(false);
 const [onlyDeleted, setOnlyDeleted] = useState(false);

 const [oscOptions, setOscOptions] = useState<ComboOsc[]>([]);
 const [teamOptions, setTeamOptions] = useState<ComboBasic[]>([]);
 const [typeOptions, setTypeOptions] = useState<ComboBasic[]>([]);
 const [themeOptions, setThemeOptions] = useState<ComboBasic[]>([]);
 const [loadingCombos, setLoadingCombos] = useState(false);

 const [openModal, setOpenModal] = useState(false);
 const [isVisualizing, setIsVisualizing] = useState(false);
 const [editing, setEditing] = useState<ListItem | null>(null);
 const [modalLoading, setModalLoading] = useState(false);

 const [projectName, setProjectName] = useState('');
 const [mDecisionOpt, setMDecisionOpt] = useState<OptDecisao | null>(null);
 const [mOsc, setMOsc] = useState<ComboOsc | null>(null);
 const [mTeam, setMTeam] = useState<ComboBasic | null>(null);
 const [mType, setMType] = useState<ComboBasic | null>(null);
 const [mTheme, setMTheme] = useState<ComboBasic | null>(null);
 const [mOdsOpts, setMOdsOpts] = useState<OptOds[]>([]);
 const [mOdsPicker, setMOdsPicker] = useState<OptOds | null>(null);

 const columns: Column<ListItem>[] = [
  { label: 'ID', field: 'projectProgramId', width: 90 },
  { label: 'Nome do Projeto', field: 'name' },
  { label: 'Tipo do Projeto', field: 'projectTypeName' },
  { label: 'Tema do Projeto', field: 'projectThemeName' },
  { label: 'Turma', field: 'teamName' },
  { label: 'OSC', field: 'oscName' },
  { label: 'CNPJ', field: 'oscCnpj' },
  { label: 'Decisão', field: 'decision' },
 ];

 const hasAnyFilter =
  !!qName ||
  !!qOsc ||
  !!qTeam ||
  !!qType ||
  !!qTheme ||
  !!qDecisionOpt ||
  !!qOdsOpt ||
  includeDeleted ||
  onlyDeleted;

 const buildFilters = (): Filter[] => {
  const filters: Filter[] = [];
  const CONTAINS = Op.NUMBER_7;
  const EQUALS = Op.NUMBER_1;
  if (qName.trim()) filters.push({ propertyName: 'Name', operation: CONTAINS, value: qName.trim() });
  if (qOsc) filters.push({ propertyName: 'Osc.Name', operation: CONTAINS, value: qOsc.name });
  if (qTeam) filters.push({ propertyName: 'Team.Name', operation: CONTAINS, value: qTeam.name });
  if (qType) filters.push({ propertyName: 'ProjectType.Name', operation: CONTAINS, value: qType.name });
  if (qTheme) filters.push({ propertyName: 'ProjectTheme.Name', operation: CONTAINS, value: qTheme.name });
  if (qDecisionOpt) filters.push({ propertyName: 'Decision', operation: EQUALS, value: String(qDecisionOpt.value) });
  if (qOdsOpt) filters.push({ propertyName: 'OdsTypes', operation: CONTAINS, value: String(qOdsOpt.value) });
  if (onlyDeleted) filters.push({ propertyName: 'IsDeleted', operation: EQUALS, value: 'true' });
  else if (!includeDeleted) filters.push({ propertyName: 'IsDeleted', operation: EQUALS, value: 'false' });
  return filters;
 };

 const fetchList = async () => {
  try {
   setLoading(true);
   const request: ListProjectProgramRequest = { pageNumber: page + 1, pageSize: rowsPerPage, filters: buildFilters() };
   const { data } = await api.listProjectProgram(request);
   const list = (data.items as unknown as ListItem[]) || [];
   setItems(list);
   setTotalCount(data.totalItems || 0);
   setNoDataMessage(list.length ? '' : 'Nenhum projeto encontrado');
  } catch (err: any) {
   const message = err?.response?.data?.message || err?.response?.data?.errors?.join(', ') || 'Erro ao carregar projetos';
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
   const oscs = (oscResp.data.items || []).map((o: any) => ({ id: o.oscId ?? o.id, name: o.name, cnpj: o.oscPrimaryDocumment })) as ComboOsc[];
   oscs.sort((a, b) => a.name.localeCompare(b.name));
   setOscOptions(oscs);
   const teams = (teamResp.data.items || []).map((t: any) => ({ id: t.teamId ?? t.id, name: t.name })) as ComboBasic[];
   teams.sort((a, b) => a.name.localeCompare(b.name));
   setTeamOptions(teams);
   const types = (typeResp.data.items || []).map((t: any) => ({ id: t.projectTypeId ?? t.id, name: t.name })) as ComboBasic[];
   types.sort((a, b) => a.name.localeCompare(b.name));
   setTypeOptions(types);
   const themes = (themeResp.data.items || []).map((t: any) => ({ id: t.projectThemeId ?? t.id, name: t.name })) as ComboBasic[];
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
  fetchList();
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
  setIncludeDeleted(false);
  setOnlyDeleted(false);
  fetchList();
 };

 const handleAdd = () => {
  setEditing(null);
  setIsVisualizing(false);
  setProjectName('');
  setMDecisionOpt(null);
  setMOsc(null);
  setMTeam(null);
  setMType(null);
  setMTheme(null);
  setMOdsOpts([]);
  setMOdsPicker(null);
  setOpenModal(true);
 };

 const handleView = async (row: ListItem) => {
  try {
   const { data } = await api.getProjectProgramById(row.projectProgramId);
   setIsVisualizing(true);
   setEditing(row);
   setProjectName(data.name || row.name || '');
   setMDecisionOpt(DECISION_OPTIONS.find(o => o.value === (data.decision ?? row.decision)) ?? null);
   setMOsc({ id: row.oscId, name: row.oscName, cnpj: row.oscCnpj });
   setMTeam({ id: row.teamId, name: row.teamName });
   setMType({ id: row.projectTypeId, name: row.projectTypeName });
   setMTheme({ id: row.projectThemeId, name: row.projectThemeName });
   const odsValues = (data.odsTypes as OdsType[]) ?? row.odsTypes ?? [];
   setMOdsOpts(ODS_OPTIONS.filter(o => odsValues.includes(o.value)));
   setMOdsPicker(null);
   setOpenModal(true);
  } catch {
   toast.error('Erro ao carregar detalhes do projeto');
  }
 };

 const handleEdit = async (row: ListItem) => {
  try {
   const { data } = await api.getProjectProgramById(row.projectProgramId);
   setIsVisualizing(false);
   setEditing(row);
   setProjectName(data.name || row.name || '');
   setMDecisionOpt(DECISION_OPTIONS.find(o => o.value === (data.decision ?? row.decision)) ?? null);
   setMOsc({ id: row.oscId, name: row.oscName, cnpj: row.oscCnpj });
   setMTeam({ id: row.teamId, name: row.teamName });
   setMType({ id: row.projectTypeId, name: row.projectTypeName });
   setMTheme({ id: row.projectThemeId, name: row.projectThemeName });
   const odsValues = (data.odsTypes as OdsType[]) ?? row.odsTypes ?? [];
   setMOdsOpts(ODS_OPTIONS.filter(o => odsValues.includes(o.value)));
   setMOdsPicker(null);
   setOpenModal(true);
  } catch {
   toast.error('Erro ao carregar projeto para edição');
  }
 };

 const [confirmDialog, setConfirmDialog] = useState({
  open: false,
  loading: false,
  row: null as ListItem | null,
  restore: false,
 });

 const openDelete = (row: ListItem) => setConfirmDialog({ open: true, loading: false, row, restore: false });
 const openRestore = (row: ListItem) => setConfirmDialog({ open: true, loading: false, row, restore: true });
 const closeConfirm = () => setConfirmDialog({ open: false, loading: false, row: null, restore: false });

 const handleConfirmDeleteOrRestore = async () => {
  if (!confirmDialog.row) return;
  try {
   setConfirmDialog(p => ({ ...p, loading: true }));
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
   const message = err?.response?.data?.message || err?.response?.data?.errors?.join(', ') || 'Operação não concluída';
   toast.error(message);
   setConfirmDialog(p => ({ ...p, loading: false }));
  }
 };

 const dialogTitle = () => (isVisualizing ? 'Visualizar Projeto' : editing ? 'Editar Projeto' : 'Adicionar Projeto');

 const activeChips = useMemo(() => {
  const chips: string[] = [];
  if (qName) chips.push(`Projeto: ${qName}`);
  if (qOsc) chips.push(`OSC: ${qOsc.name}`);
  if (qTeam) chips.push(`Turma: ${qTeam.name}`);
  if (qType) chips.push(`Tipo: ${qType.name}`);
  if (qTheme) chips.push(`Tema: ${qTheme.name}`);
  if (qDecisionOpt) chips.push(`Decisão: ${qDecisionOpt.label}`);
  if (qOdsOpt) chips.push(qOdsOpt.label);
  if (onlyDeleted) chips.push('Somente inativos');
  else if (includeDeleted) chips.push('Incluir inativos');
  return chips;
 }, [qName, qOsc, qTeam, qType, qTheme, qDecisionOpt, qOdsOpt, includeDeleted, onlyDeleted]);

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
    decision: mDecisionOpt?.value as ProjectDecisionType,
    oscId: mOsc?.id,
    teamId: mTeam?.id,
    projectTypeId: mType?.id,
    projectThemeId: mTheme?.id,
    odsTypes: mOdsOpts.map(o => o.value),
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
   const message = e?.response?.data?.message || e?.response?.data?.errors?.join(', ') || 'Erro ao salvar projeto';
   toast.error(message);
  } finally {
   setModalLoading(false);
  }
 };

 useEffect(() => {
  fetchCombos();
 }, []);

 useEffect(() => {
  fetchList();
 }, [page, rowsPerPage]);

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
       Filtros
      </Typography>
      {hasAnyFilter && (
       <Chip
        label="Filtros ativos"
        size="small"
        sx={{ ml: 1, bgcolor: alpha('#1E4EC4', 0.1), color: '#1E4EC4', fontWeight: 600, fontSize: '0.75rem' }}
       />
      )}
     </Box>

     <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
      <TextField
       label="Nome do Projeto"
       size="small"
       value={qName}
       onChange={e => setQName(e.target.value)}
       onKeyUp={e => e.key === 'Enter' && handleSearch()}
       sx={FIELD_STYLE}
      />
      <Autocomplete
       options={oscOptions}
       loading={loadingCombos}
       value={qOsc}
       onChange={(_, v) => setQOsc(v)}
       isOptionEqualToValue={(o, v) => o.id === v.id}
       getOptionLabel={o => o?.name || ''}
       renderInput={params => <TextField {...params} label="Nome da OSC" size="small" />}
       sx={FIELD_STYLE}
      />
      <Autocomplete
       options={teamOptions}
       loading={loadingCombos}
       value={qTeam}
       onChange={(_, v) => setQTeam(v)}
       isOptionEqualToValue={(o, v) => o.id === v.id}
       getOptionLabel={o => o?.name || ''}
       renderInput={params => <TextField {...params} label="Nome da Turma" size="small" />}
       sx={FIELD_STYLE}
      />
     </Stack>

     <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
      <Autocomplete
       options={typeOptions}
       loading={loadingCombos}
       value={qType}
       onChange={(_, v) => setQType(v)}
       isOptionEqualToValue={(o, v) => o.id === v.id}
       getOptionLabel={o => o?.name || ''}
       renderInput={params => <TextField {...params} label="Tipo do Projeto" size="small" />}
       sx={FIELD_STYLE}
      />
      <Autocomplete
       options={themeOptions}
       loading={loadingCombos}
       value={qTheme}
       onChange={(_, v) => setQTheme(v)}
       isOptionEqualToValue={(o, v) => o.id === v.id}
       getOptionLabel={o => o?.name || ''}
       renderInput={params => <TextField {...params} label="Tema do Projeto" size="small" />}
       sx={FIELD_STYLE}
      />
      <Autocomplete
       options={DECISION_OPTIONS}
       value={qDecisionOpt}
       onChange={(_, opt) => setQDecisionOpt(opt)}
       isOptionEqualToValue={(o, v) => o.value === v.value}
       getOptionLabel={o => o?.label ?? ''}
       renderInput={params => <TextField {...params} label="Decisão" size="small" />}
       sx={FIELD_STYLE}
      />
     </Stack>

     <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
      <Autocomplete
       options={ODS_OPTIONS}
       value={qOdsOpt}
       onChange={(_, opt) => setQOdsOpt(opt)}
       isOptionEqualToValue={(o, v) => o.value === v.value}
       getOptionLabel={o => o?.label ?? ''}
       renderInput={params => <TextField {...params} label="ODS" size="small" />}
       sx={FIELD_STYLE}
      />
      <FormControlLabel
       control={
        <Switch
         checked={includeDeleted}
         onChange={e => {
          setIncludeDeleted(e.target.checked);
          if (e.target.checked) setOnlyDeleted(false);
         }}
        />
       }
       label="Incluir inativos"
      />
      <FormControlLabel
       control={
        <Switch
         checked={onlyDeleted}
         onChange={e => {
          setOnlyDeleted(e.target.checked);
          if (e.target.checked) setIncludeDeleted(false);
         }}
        />
       }
       label="Somente inativos"
      />
      <Button
       variant="contained"
       startIcon={<SearchIcon />}
       onClick={handleSearch}
       sx={{ bgcolor: '#1E4EC4', color: 'white', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5, textTransform: 'none' }}
      >
       Buscar
      </Button>
      <Button
       variant="outlined"
       startIcon={<ClearIcon />}
       onClick={handleClear}
       sx={{ borderColor: alpha('#1E4EC4', 0.3), color: '#1E4EC4', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5, textTransform: 'none' }}
      >
       Limpar Filtros
      </Button>
     </Stack>

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
       <CircularProgress />
      </Box>
     ) : (
      <Table<ListItem>
       columns={columns}
       data={items}
       page={page}
       rowsPerPage={rowsPerPage}
       totalCount={totalCount}
       onPageChange={setPage}
       onRowsPerPageChange={setRowsPerPage}
       onView={handleView}
       onEdit={row => (!row.isDeleted ? handleEdit(row) : undefined)}
       onDelete={row => (!row.isDeleted ? openDelete(row) : openRestore(row))}
       noDataMessage={noDataMessage}
       customActionsRender={row =>
        row.isDeleted ? (
         <Button size="small" startIcon={<RestoreOutlinedIcon />} onClick={() => openRestore(row)} sx={{ textTransform: 'none' }}>
          Restaurar
         </Button>
        ) : (
         <>
          <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleView(row)} sx={{ textTransform: 'none' }}>
           Ver
          </Button>
          <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(row)} sx={{ textTransform: 'none' }}>
           Editar
          </Button>
          <Button
           size="small"
           color="error"
           startIcon={<DeleteOutlineIcon />}
           onClick={() => openDelete(row)}
           sx={{ textTransform: 'none' }}
          >
           Excluir
          </Button>
         </>
        )
       }
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
     <Stack spacing={2}>
      <Stack direction="row" spacing={2} flexWrap="wrap">
       <TextField
        autoFocus={!isVisualizing}
        label="Nome do Projeto"
        type="text"
        size="small"
        value={projectName}
        onChange={e => setProjectName(e.target.value)}
        slotProps={{ input: { readOnly: isVisualizing } }}
        sx={{ ...FIELD_STYLE, ...(isVisualizing ? { pointerEvents: 'none' } : {}) }}
       />
       <Autocomplete
        options={DECISION_OPTIONS}
        value={mDecisionOpt}
        onChange={(_, opt) => setMDecisionOpt(opt)}
        isOptionEqualToValue={(o, v) => o.value === v.value}
        getOptionLabel={o => o?.label ?? ''}
        renderInput={params => <TextField {...params} label="Decisão" size="small" />}
        sx={FIELD_STYLE}
        disabled={isVisualizing}
       />
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap">
       <Autocomplete
        options={oscOptions}
        value={mOsc}
        onChange={(_, v) => setMOsc(v)}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        getOptionLabel={o => (o ? `${o.name}${o.cnpj ? ` — ${o.cnpj}` : ''}` : '')}
        renderInput={params => <TextField {...params} label="OSC" size="small" />}
        sx={FIELD_STYLE}
        disabled={isVisualizing}
       />
       <Autocomplete
        options={teamOptions}
        value={mTeam}
        onChange={(_, v) => setMTeam(v)}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        getOptionLabel={o => o?.name || ''}
        renderInput={params => <TextField {...params} label="Turma" size="small" />}
        sx={FIELD_STYLE}
        disabled={isVisualizing}
       />
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap">
       <Autocomplete
        options={typeOptions}
        value={mType}
        onChange={(_, v) => setMType(v)}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        getOptionLabel={o => o?.name || ''}
        renderInput={params => <TextField {...params} label="Tipo do Projeto" size="small" />}
        sx={FIELD_STYLE}
        disabled={isVisualizing}
       />
       <Autocomplete
        options={themeOptions}
        value={mTheme}
        onChange={(_, v) => setMTheme(v)}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        getOptionLabel={o => o?.name || ''}
        renderInput={params => <TextField {...params} label="Tema do Projeto" size="small" />}
        sx={FIELD_STYLE}
        disabled={isVisualizing}
       />
      </Stack>

      <Autocomplete
       options={ODS_OPTIONS}
       value={mOdsPicker}
       onChange={(_, opt) => {
        if (opt && !mOdsOpts.some(o => o.value === opt.value)) {
         setMOdsOpts(prev => [...prev, opt]);
        }
        setMOdsPicker(null); // Reset the controlled value
       }}
       isOptionEqualToValue={(o, v) => o.value === v?.value}
       getOptionLabel={o => o?.label ?? ''}
       getOptionDisabled={opt => mOdsOpts.some(o => o.value === opt.value)}
       renderInput={params => <TextField {...params} label="Adicionar ODS" size="small" />}
       sx={{ flex: '1 1 100%' }}
       disabled={isVisualizing}
      />

      <Box sx={{ mt: 1 }}>
       {mOdsOpts.length === 0 ? (
        <Typography color="text.secondary">Nenhuma ODS adicionada.</Typography>
       ) : (
        <Stack direction="row" spacing={1} flexWrap="wrap">
         {mOdsOpts.map(opt => (
          <Chip
           key={opt.value}
           label={opt.label}
           onDelete={isVisualizing ? undefined : () => setMOdsOpts(prev => prev.filter(x => x.value !== opt.value))}
          />
         ))}
        </Stack>
       )}
      </Box>
     </Stack>
    }
    actions={
     isVisualizing ? (
      <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => setOpenModal(false)} sx={{ bgcolor: '#6b7280', color: 'white', textTransform: 'none' }}>
       Voltar
      </Button>
     ) : (
      <>
       <Button onClick={() => setOpenModal(false)} disabled={modalLoading} sx={{ textTransform: 'none' }}>
        Cancelar
       </Button>
       <Button onClick={handleSave} variant="contained" disabled={modalLoading} sx={{ bgcolor: '#1E4EC4', color: 'white', textTransform: 'none' }}>
        Salvar
       </Button>
      </>
     )
    }
   />

   <ConfirmDialog
    open={confirmDialog.open}
    title={confirmDialog.restore ? 'Restaurar Projeto' : 'Excluir Projeto'}
    message={confirmDialog.restore ? 'Tem certeza que deseja restaurar o projeto' : 'Tem certeza que deseja excluir o projeto'}
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