import React, { useEffect, useMemo, useState } from 'react';
import {
 Box,
 Button,
 Chip,
 CircularProgress,
 Container,
 FormControl,
 Grid,
 InputLabel,
 MenuItem,
 Paper,
 Select,
 SelectChangeEvent,
 TextField,
 Typography,
 alpha,
 Divider,
} from '@mui/material';
import { toast } from 'react-toastify';
import TitleAndButtons from '@/components/TitleAndButtons';
import Table, { Column } from '@/components/Table';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import DialogPadronized from '@/components/DialogPadronized';
import ReportWizard from '@/components/ReportWizard';
import {
 ReportsApi,
 CreateReportRequest,
 EditReportRequest,
 ListReportsRequest,
 Filter,
 Op,
 ReportStatus,
 MetadataEntityDto,
} from '@/api';
import { apiConfig } from '@/services/auth';

interface ReportListItem {
 id?: number;
 name?: string;
 rootEntity?: string;
 status?: number;
 readerCanExecute?: boolean;
 rootEntityLabel?: string;
 readerCanExecuteText?: string;
}

interface ReportFormState {
 id?: number;
 name: string;
 description?: string;
 rootEntity: string;
 readerCanExecute: boolean;
}

const normalizeBool = (v: any): boolean => {
 if (typeof v === 'boolean') return v;
 if (typeof v === 'number') return v === 1;
 if (typeof v === 'string') return ['true', '1', 'sim', 'yes'].includes(v.toLowerCase());
 return false;
};

const Report: React.FC = () => {
 const [filterName, setFilterName] = useState('');
 const [filterStatus, setFilterStatus] = useState<number | ''>('');
 const [filterRoot, setFilterRoot] = useState<string | ''>('');

 const [reports, setReports] = useState<ReportListItem[]>([]);
 const [page, setPage] = useState(0);
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [totalCount, setTotalCount] = useState(0);
 const [loading, setLoading] = useState(false);
 const [entitiesLoading, setEntitiesLoading] = useState(true);
 const [noDataMessage, setNoDataMessage] = useState('');

 const [entities, setEntities] = useState<MetadataEntityDto[]>([]);
 const entityLabelByName = useMemo(() => {
  const map = new Map<string, string>();
  entities?.forEach(e => map.set(e.name ?? '', e.label ?? e.name ?? ''));
  return map;
 }, [entities]);

 const displayedReports = useMemo<ReportListItem[]>(
  () =>
   (reports ?? []).map(r => ({
    ...r,
    rootEntityLabel: r.rootEntity ? (entityLabelByName.get(r.rootEntity) ?? r.rootEntity) : '-',
    readerCanExecuteText: normalizeBool(r.readerCanExecute) ? 'Sim' : 'Não',
   })),
  [reports, entityLabelByName]
 );

 const [openModal, setOpenModal] = useState(false);
 const [modalLoading, setModalLoading] = useState(false);
 const [isVisualizing, setIsVisualizing] = useState(false);
 const [editingId, setEditingId] = useState<number | null>(null);
 const [form, setForm] = useState<ReportFormState>({
  name: '',
  description: '',
  rootEntity: '',
  readerCanExecute: false,
 });

 const [confirmDialog, setConfirmDialog] = useState({
  open: false,
  id: null as number | null,
  action: '' as 'delete' | 'publish' | 'unpublish' | '',
  loading: false,
 });

 const [wizardOpen, setWizardOpen] = useState(false);
 const [wizardId, setWizardId] = useState<number | null>(null);

 const reportsApi = new ReportsApi(apiConfig);

 const currentRowStatus = useMemo(
  () => reports.find(r => r.id === editingId)?.status,
  [reports, editingId]
 );

 useEffect(() => {
  fetchEntities();
 }, []);

 useEffect(() => {
  fetchReports();
 }, [page, rowsPerPage]);

 const fetchEntities = async () => {
  try {
   setEntitiesLoading(true);
   const { data } = await reportsApi.apiReportMetadataEntitiesGet();
   setEntities(data || []);
  } catch {
   toast.error('Erro ao carregar entidades do metadado');
   setEntities([]);
  } finally {
   setEntitiesLoading(false);
  }
 };

 const fetchReports = async (customFilters?: Filter[]) => {
  try {
   setLoading(true);
   setReports([]);
   const filters: Filter[] = customFilters ?? [];
   if (!customFilters) {
    if (filterName) {
     filters.push({ propertyName: 'name', operation: Op.NUMBER_7, value: filterName });
    }
    if (filterRoot) {
     filters.push({ propertyName: 'rootEntity', operation: Op.NUMBER_1, value: filterRoot });
    }
    if (filterStatus !== '') {
     filters.push({ propertyName: 'status', operation: Op.NUMBER_1, value: filterStatus });
    }
   }
   const req: ListReportsRequest = {
    pageNumber: page + 1,
    pageSize: rowsPerPage,
    filters: filters.length ? filters : undefined,
   };
   const { data } = await reportsApi.listReports(req);
   const items = (data as any)?.items ?? [];
   const normalized: ReportListItem[] = items.map((i: any) => {
    const can = normalizeBool(i.readerCanExecute);
    const root = i.rootEntity as string | undefined;
    return {
     id: i.id,
     name: i.name,
     rootEntity: root,
     status: i.status,
     readerCanExecute: can,
    };
   });
   setReports(normalized);
   setTotalCount((data as any).totalCount ?? (data as any).totalItems ?? 0);
   setNoDataMessage(normalized.length ? '' : 'Nenhum relatório encontrado');
  } catch {
   toast.error('Erro ao carregar relatórios');
   setReports([]);
   setTotalCount(0);
  } finally {
   setLoading(false);
  }
 };

 const getReport = async (id: number) => {
  try {
   const { data } = await reportsApi.getReport(id);
   setForm({
    id: data.id,
    name: data.name || '',
    description: data.description || '',
    rootEntity: data.rootEntity || '',
    readerCanExecute: !!data.readerCanExecute,
   });
  } catch {
   toast.error('Erro ao carregar relatório');
  }
 };

 const createReport = async () => {
  const payload: CreateReportRequest = {
   name: form.name,
   description: form.description || undefined,
   rootEntity: form.rootEntity,
   readerCanExecute: form.readerCanExecute,
   relations: undefined,
   fields: undefined,
   filterQuestions: undefined,
   sorts: undefined,
  };
  await reportsApi.createReport(payload);
 };

 const editReport = async () => {
  const { data: fullReport } = await reportsApi.getReport(form.id!);

  const payload: EditReportRequest = {
   ...fullReport,
   id: form.id!,
   name: form.name,
   description: form.description || undefined,
   rootEntity: form.rootEntity,
   readerCanExecute: form.readerCanExecute,
  };

  await reportsApi.editReport(payload);
 };

 const deleteReport = async (id: number) => {
  await reportsApi.deleteReport(id);
 };

 const publish = async (id: number) => {
  await reportsApi.publishReport(id);
 };

 const unpublish = async (id: number) => {
  await reportsApi.unpublishReport(id);
 };

 const statusLabel = (s?: number) => (s === ReportStatus.NUMBER_1 ? 'Publicado' : 'Rascunho');
 const statusColor = (s?: number) => (s === ReportStatus.NUMBER_1 ? 'success' : 'default');

 const validateForm = (): boolean => {
  if (!form.name.trim()) {
   toast.error('O nome do relatório é obrigatório');
   return false;
  }
  if (!form.rootEntity) {
   toast.error('Selecione a entidade raiz');
   return false;
  }
  return true;
 };

 const handleSearch = () => {
  setPage(0);
  fetchReports();
 };

 const handleClearFilters = () => {
  setFilterName('');
  setFilterRoot('');
  setFilterStatus('');
  setPage(0);
  fetchReports([]);
 };

 const handleAdd = () => {
  setEditingId(null);
  setIsVisualizing(false);
  setForm({ name: '', description: '', rootEntity: '', readerCanExecute: false });
  setOpenModal(true);
 };

 const handleView = async (row: ReportListItem) => {
  if (!row.id) return;
  setIsVisualizing(true);
  setEditingId(row.id);
  await getReport(row.id);
  setOpenModal(true);
 };

 const handleEdit = async (row: ReportListItem) => {
  if (!row.id) return;
  setIsVisualizing(false);
  setEditingId(row.id);
  await getReport(row.id);
  setOpenModal(true);
 };

 const handleSave = async () => {
  if (!validateForm()) return;
  try {
   setModalLoading(true);
   if (editingId) {
    await editReport();
    toast.success('Relatório atualizado com sucesso');
   } else {
    await createReport();
    toast.success('Relatório criado com sucesso');
   }
   setOpenModal(false);
   fetchReports([]);
  } catch {
   toast.error('Erro ao salvar relatório');
  } finally {
   setModalLoading(false);
  }
 };

 const isWizardComplete = (d: any) => {
  const hasRoot = !!d?.rootEntity;
  const hasFields = Array.isArray(d?.fields) && d.fields.length > 0;
  return hasRoot && hasFields;
 };

 const openConfirm = async (row: ReportListItem, action: 'delete' | 'publish' | 'unpublish') => {
  if (!row.id) return;
  if (action === 'publish') {
   try {
    const { data } = await reportsApi.getReport(row.id);
    if (!isWizardComplete(data)) {
     toast.warning('Falta finalizar o wizard de configuração');
     return;
    }
   } catch {
    toast.error('Não foi possível validar o relatório');
    return;
   }
  }
  setConfirmDialog({ open: true, id: row.id ?? null, action, loading: false });
 };

 const handleConfirm = async () => {
  const { id, action } = confirmDialog;
  if (!id || !action) return;
  try {
   setConfirmDialog(prev => ({ ...prev, loading: true }));

   if (action === 'delete') {
    await deleteReport(id);
   } else if (action === 'publish') {
    await publish(id);
   } else if (action === 'unpublish') {
    await unpublish(id);
   }

   toast.success('Operação concluída');
   setConfirmDialog({ open: false, id: null, action: '', loading: false });

   fetchReports();

   if (action === 'delete' && openModal && editingId && editingId === id) {
    setOpenModal(false);
    setEditingId(null);
   } else if (action !== 'delete' && openModal && editingId && editingId === id) {
    await getReport(id);
   }
  } catch {
   toast.error('Falha na operação');
   setConfirmDialog(prev => ({ ...prev, loading: false }));
  }
 };

 const handleCloseConfirm = () => setConfirmDialog({ open: false, id: null, action: '', loading: false });

 const columns: Column<ReportListItem>[] = [
  { label: 'ID', field: 'id', align: 'center' },
  { label: 'Nome', field: 'name' },
  { label: 'Entidade Raiz', field: 'rootEntityLabel' },
  {
   label: 'Status',
   field: 'status',
   render: (row) => (
    <Chip size="small" label={statusLabel(row.status)} color={statusColor(row.status) as any} />
   ),
   align: 'center',
  },
  { label: 'Leitor executa?', field: 'readerCanExecuteText', align: 'center' },
 ];

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
    }}
   >
    <Box sx={{ p: { xs: 2, sm: 3, md: 4, flex: 1 } }}>
     <TitleAndButtons
      title="Listar Relatórios"
      onAdd={handleAdd}
      addLabel="Novo Relatório"
     />

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
       <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '1.1rem' }}>
        Filtro de Busca
       </Typography>
       {(filterName || filterRoot || filterStatus !== '') && (
        <Chip
         label="Filtros ativos"
         size="small"
         sx={{ ml: 1, bgcolor: alpha('#1E4EC4', 0.1), color: '#1E4EC4', fontWeight: 600, fontSize: '0.75rem' }}
        />
       )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
       <TextField
        label="Nome"
        variant="outlined"
        value={filterName}
        size="small"
        onChange={(e) => setFilterName(e.target.value)}
       />

       <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel>Entidade Raiz</InputLabel>
        <Select value={filterRoot} label="Entidade Raiz" onChange={(e: SelectChangeEvent<string | ''>) => setFilterRoot(e.target.value)}>
         <MenuItem value="">
          <em>Todas</em>
         </MenuItem>
         {entities.map((e) => (
          <MenuItem key={e.name} value={e.name || ''}>{e.label || e.name}</MenuItem>
         ))}
        </Select>
       </FormControl>

       <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Status</InputLabel>
        <Select value={filterStatus} label="Status" onChange={(e: SelectChangeEvent<number | ''>) => setFilterStatus(e.target.value as any)}>
         <MenuItem value="">
          <em>Todos</em>
         </MenuItem>
         <MenuItem value={ReportStatus.NUMBER_0}>Rascunho</MenuItem>
         <MenuItem value={ReportStatus.NUMBER_1}>Publicado</MenuItem>
        </Select>
       </FormControl>
      </Box>

      <Box sx={{ mt: 2.5, gap: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
       <Button
        variant="contained"
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
         '&:hover': { bgcolor: '#1640a8', boxShadow: '0 4px 12px rgba(30, 78, 196, 0.35)', transform: 'translateY(-1px)' },
         transition: 'all 0.2s ease',
        }}
       >
        Buscar
       </Button>
       <Button
        variant="outlined"
        onClick={handleClearFilters}
        sx={{ borderColor: alpha('#1E4EC4', 0.3), color: '#1E4EC4', fontWeight: 600, px: 4, py: 1, borderRadius: 1.5, textTransform: 'none' }}
       >
        Limpar Filtros
       </Button>
      </Box>
     </Paper>

     {loading || entitiesLoading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
       <CircularProgress />
      </Box>
     ) : (
      <Table<ReportListItem>
       columns={columns}
       data={displayedReports}
       page={page}
       rowsPerPage={rowsPerPage}
       totalCount={totalCount}
       onPageChange={setPage}
       onRowsPerPageChange={setRowsPerPage}
       onView={handleView}
       onEdit={handleEdit}
       onDelete={(row) => openConfirm(row, 'delete')}
       extraActions={(row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
         {row.status === ReportStatus.NUMBER_1 ? (
          <Button size="small" variant="outlined" onClick={() => openConfirm(row, 'unpublish')}>Despublicar</Button>
         ) : (
          <Button size="small" variant="contained" onClick={() => openConfirm(row, 'publish')}>Publicar</Button>
         )}
         <Button
          size="small"
          variant="text"
          onClick={() => {
           setWizardId(row.id ?? null);
           setWizardOpen(true);
          }}
         >
          Configurar
         </Button>
        </Box>
       )}
       noDataMessage={noDataMessage}
      />
     )}
    </Box>
   </Paper>

   <DialogPadronized
    open={openModal}
    onClose={() => setOpenModal(false)}
    title={isVisualizing ? 'Visualizar Relatório' : editingId ? 'Editar Relatório' : 'Novo Relatório'}
    content={
     <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
       <TextField
        autoFocus={!isVisualizing}
        margin="dense"
        label="Nome*"
        type="text"
        fullWidth
        variant="outlined"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        slotProps={{ input: { readOnly: isVisualizing } }}
        sx={isVisualizing ? { pointerEvents: 'none' } : {}}
       />
      </Grid>

      <Grid size={{ xs: 12 }}>
       <TextField
        margin="dense"
        label="Descrição"
        type="text"
        fullWidth
        variant="outlined"
        value={form.description || ''}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        multiline
        minRows={2}
        slotProps={{ input: { readOnly: isVisualizing } }}
        sx={isVisualizing ? { pointerEvents: 'none' } : {}}
       />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
       <FormControl fullWidth variant="outlined" margin="dense">
        <InputLabel>Entidade Raiz*</InputLabel>
        <Select
         value={form.rootEntity}
         label="Entidade Raiz*"
         disabled={isVisualizing}
         onChange={(e: SelectChangeEvent<string>) => setForm({ ...form, rootEntity: e.target.value as string })}
        >
         {entities.length === 0 ? (
          <MenuItem disabled>
           <CircularProgress size={20} style={{ marginRight: 8 }} /> Carregando...
          </MenuItem>
         ) : (
          entities.map((e) => (
           <MenuItem key={e.name} value={e.name || ''}>{e.label || e.name}</MenuItem>
          ))
         )}
        </Select>
       </FormControl>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
       <FormControl fullWidth variant="outlined" margin="dense">
        <InputLabel>Leitor pode executar?</InputLabel>
        <Select
         value={form.readerCanExecute ? 1 : 0}
         label="Leitor pode executar?"
         disabled={isVisualizing}
         onChange={(e: SelectChangeEvent<number>) => setForm({ ...form, readerCanExecute: Number(e.target.value) === 1 })}
        >
         <MenuItem value={1}>Sim</MenuItem>
         <MenuItem value={0}>Não</MenuItem>
        </Select>
       </FormControl>
      </Grid>

      {editingId && (
       <Grid size={{ xs: 12 }}>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
         <Button
          variant="outlined"
          onClick={() => {
           setWizardId(editingId);
           setWizardOpen(true);
          }}
         >
          Abrir Wizard de Configuração
         </Button>
         {currentRowStatus === ReportStatus.NUMBER_1 ? (
          <Button variant="outlined" color="warning" onClick={() => openConfirm({ id: editingId } as ReportListItem, 'unpublish')}>
           Despublicar
          </Button>
         ) : (
          <Button variant="contained" onClick={() => openConfirm({ id: editingId } as ReportListItem, 'publish')}>
           Publicar
          </Button>
         )}
        </Box>
       </Grid>
      )}
     </Grid>
    }
    actions={
     isVisualizing ? (
      <Button
       variant="contained"
       onClick={() => setOpenModal(false)}
       sx={{ bgcolor: '#6b7280', color: 'white', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5, textTransform: 'none' }}
      >
       Voltar
      </Button>
     ) : (
      <>
       <Button onClick={() => setOpenModal(false)} disabled={modalLoading} sx={{ color: '#6b7280', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5, textTransform: 'none' }}>
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
        }}
       >
        Salvar
       </Button>
      </>
     )
    }
   />

   <ReportWizard
    open={wizardOpen}
    reportId={wizardId ?? undefined}
    onClose={() => {
     if (openModal && editingId && wizardId === editingId) {
      getReport(editingId);
     }
     setWizardOpen(false);
     setWizardId(null);
     fetchReports();
    }}
   />

   <ConfirmDialog
    open={confirmDialog.open}
    title={
     confirmDialog.action === 'delete'
      ? 'Excluir Relatório'
      : confirmDialog.action === 'publish'
      ? 'Publicar Relatório'
      : 'Despublicar Relatório'
    }
    message={
     confirmDialog.action === 'delete'
      ? 'Tem certeza que deseja excluir o relatório? Esta ação não pode ser desfeita.'
      : confirmDialog.action === 'publish'
      ? 'Deseja publicar este relatório para execução?'
      : 'Deseja despublicar este relatório?'
    }
    highlightText={undefined}
    confirmLabel={confirmDialog.action === 'delete' ? 'Excluir' : confirmDialog.action === 'publish' ? 'Publicar' : 'Despublicar'}
    cancelLabel="Cancelar"
    onClose={handleCloseConfirm}
    onConfirm={handleConfirm}
    loading={confirmDialog.loading}
    danger={confirmDialog.action === 'delete'}
   />
  </Container>
 );
};

export default Report;