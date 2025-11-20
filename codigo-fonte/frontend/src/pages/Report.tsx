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

const isPublished = (s?: number | null) => Number(s) === 1;

const Report: React.FC = () => {
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | ''>('');
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
        rootEntityLabel: r.rootEntity ? entityLabelByName.get(r.rootEntity) ?? r.rootEntity : '-',
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

  const [fullReport, setFullReport] = useState<any | null>(null);
  const [showConfigReview, setShowConfigReview] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: null as number | null,
    action: '' as 'delete' | 'publish' | 'unpublish' | '',
    loading: false,
  });

  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardId, setWizardId] = useState<number | null>(null);

  const [runnerOpen, setRunnerOpen] = useState(false);
  const [runnerId, setRunnerId] = useState<number | null>(null);

  const reportsApi = new ReportsApi(apiConfig);

  const currentRowStatus = useMemo(
    () => reports.find(r => r.id === editingId)?.status,
    [reports, editingId]
  );

  const statusLabel = (s?: number | null) => (isPublished(s) ? 'Publicado' : 'Rascunho');
  const statusColor = (s?: number | null) => (isPublished(s) ? 'success' : 'default');

  const ensureCanConfigure = (status?: number | null) => {
    if (isPublished(status)) {
      toast.warning('Para configurar esse relatório, favor despublicá-lo');
      return false;
    }
    return true;
  };

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
          filters.push({
            propertyName: 'Status',
            operation: Op.NUMBER_1,
            value: filterStatus,
          });
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
        const n = Number(i.status);
        return {
          id: i.id,
          name: i.name,
          rootEntity: root,
          status: Number.isNaN(n) ? 0 : n,
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

      const normalizedFields = (data.fields || []).map((f: any) => ({
        ...f,
        entity: f.entity || data.rootEntity,
      }));

      const normalizedFilters = (data.filterQuestions || []).map((f: any) => ({
        ...f,
        entity: f.entity || data.rootEntity,
      }));

      const normalizedSorts = (data.sorts || []).map((s: any) => ({
        ...s,
        entity: s.entity || data.rootEntity,
      }));

      setForm({
        id: data.id,
        name: data.name || '',
        description: data.description || '',
        rootEntity: data.rootEntity || '',
        readerCanExecute: !!data.readerCanExecute,
      });

      const reportForView = {
        ...data,
        fields: normalizedFields,
        filterQuestions: normalizedFilters,
        sorts: normalizedSorts,
      };

      setFullReport(reportForView);
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
      relations: [],
      fields: [],
      filterQuestions: [],
      sorts: [],
    };

    await reportsApi.createReport(payload);
  };

  const editReport = async () => {
    const { data: fullReportApi } = await reportsApi.getReport(form.id!);
    const payload: EditReportRequest = {
      ...fullReportApi,
      id: form.id!,
      name: form.name,
      description: form.description || undefined,
      rootEntity: form.rootEntity,
      readerCanExecute: form.readerCanExecute,
      relations:
        fullReportApi.relations?.map((r: any) => ({
          fromEntity: r.fromEntity,
          path: r.path,
          entity: r.entity,
          joinType: r.joinType,
          alias: r.alias,
          isCollection: r.isCollection,
        })) ?? [],
      fields:
        fullReportApi.fields?.map((f: any, i: number) => ({
          entity: f.entity || fullReportApi.rootEntity,
          fieldPath: f.fieldPath,
          label: f.label,
          dataType: f.dataType,
          formatHint: f.formatHint,
          displayOrder: f.displayOrder ?? i,
        })) ?? [],
      filterQuestions:
        fullReportApi.filterQuestions?.map((q: any) => ({
          entity: q.entity || fullReportApi.rootEntity,
          fieldPath: q.fieldPath,
          defaultOperator: q.defaultOperator,
          dataType: q.dataType,
          isRequired: q.isRequired,
          isDateBase: q.isDateBase,
          label: q.label,
          enumOptionsJson: q.enumOptionsJson,
        })) ?? [],
      sorts:
        fullReportApi.sorts?.map((s: any, i: number) => ({
          entity: s.entity || fullReportApi.rootEntity,
          fieldPath: s.fieldPath,
          direction: s.direction,
          priority: s.priority ?? i + 1,
        })) ?? [],
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
    setShowConfigReview(false);
    setFullReport(null);
    setForm({ name: '', description: '', rootEntity: '', readerCanExecute: false });
    setOpenModal(true);
  };

  const handleView = async (row: ReportListItem) => {
    if (!row.id) return;
    setIsVisualizing(true);
    setShowConfigReview(false);
    setEditingId(row.id);
    await getReport(row.id);
    setOpenModal(true);
  };

  const handleEdit = async (row: ReportListItem) => {
    if (!row.id) return;
    setIsVisualizing(false);
    setShowConfigReview(false);
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

  const handleCloseConfirm = () =>
    setConfirmDialog({ open: false, id: null, action: '', loading: false });

  const handleOpenWizardFromRow = (row: ReportListItem) => {
    if (!row.id) return;
    if (!ensureCanConfigure(row.status)) return;
    setWizardId(row.id);
    setWizardOpen(true);
  };

  const handleOpenWizardFromModal = () => {
    if (!editingId) return;
    if (!ensureCanConfigure(currentRowStatus)) return;
    setWizardId(editingId);
    setWizardOpen(true);
  };

  const handleRun = (row: ReportListItem) => {
    if (!row.id) return;
    if (!isPublished(row.status)) {
      toast.warning('Para executar o relatório, é necessário publicá-lo primeiro');
      return;
    }
    setRunnerId(row.id);
    setRunnerOpen(true);
  };

  const columns: Column<ReportListItem>[] = [
    { label: 'Nome', field: 'name' },
    { label: 'Entidade Raiz', field: 'rootEntityLabel' },
    {
      label: 'Status',
      field: 'status',
      render: (_, row) => (
        <Chip
          size="small"
          label={statusLabel(row.status)}
          color={statusColor(row.status) as any}
        />
      ),
      align: 'center',
    },
    { label: 'Leitor executa?', field: 'readerCanExecuteText', align: 'center' },
  ];

  const renderConfigReview = () => {
    if (!fullReport) return null;

    const getEntityLabel = (name?: string | null) =>
      name ? entityLabelByName.get(name) || name : '-';

    const joinTypeLabels: Record<string, string> = {
      Left: 'Todos da origem + correspondências (LEFT)',
      Inner: 'Somente registros com correspondência (INNER)',
      Right: 'Todos do destino + correspondências (RIGHT)',
    };

    const directionLabel = (dir: any): string => {
      if (dir === null || dir === undefined) return 'Crescente';
      if (typeof dir === 'number') {
        return dir === 0 ? 'Crescente' : 'Decrescente';
      }
      const d = String(dir).toLowerCase();
      if (d.includes('asc')) return 'Crescente';
      if (d.includes('desc')) return 'Decrescente';
      return 'Crescente';
    };

    const getFieldLabel = (entity?: string | null, fieldPath?: string | null) => {
      if (!fieldPath) return 'Campo';

      const targetEntity = entity || fullReport.rootEntity;

      const match = (fullReport.fields || []).find((f: any) => {
        const fe = f.entity || fullReport.rootEntity;
        return fe === targetEntity && f.fieldPath === fieldPath;
      });

      return match?.label || fieldPath;
    };

    const operatorLabel = (op: any): string => {
      if (op === null || op === undefined) return '';

      if (typeof op === 'number') {
        switch (op) {
          case 1: return 'Igual a';
          case 2: return 'Diferente de';
          case 3: return 'Menor que';
          case 4: return 'Menor ou igual a';
          case 5: return 'Maior que';
          case 6: return 'Maior ou igual a';
          case 7: return 'Contém';
          case 8: return 'Começa com';
          case 9: return 'Termina com';
          case 10: return 'Não contém';
          case 11: return 'É nulo';
          case 12: return 'É vazio';
          case 13: return 'Não é nulo';
          case 14: return 'Não é vazio';
          default: return '';
        }
      }

      const value = String(op).toLowerCase();
      if (value.includes('greaterorequal') || value.includes('greater_or_equal'))
        return 'Maior ou igual a';
      if (value.includes('greater'))
        return 'Maior que';
      if (value.includes('lessorequal') || value.includes('less_or_equal'))
        return 'Menor ou igual a';
      if (value.includes('less'))
        return 'Menor que';
      if (value.includes('notequal') || (value.includes('not') && value.includes('equal')))
        return 'Diferente de';
      if (value.includes('equal'))
        return 'Igual a';
      if (value.includes('doesnotcontain') || (value.includes('not') && value.includes('contain')))
        return 'Não contém';
      if (value.includes('contains'))
        return 'Contém';
      if (value.includes('startswith'))
        return 'Começa com';
      if (value.includes('endswith'))
        return 'Termina com';
      if (value.includes('isnotnull'))
        return 'Não é nulo';
      if (value.includes('isnull'))
        return 'É nulo';
      if (value.includes('isnotempty'))
        return 'Não é vazio';
      if (value.includes('isempty'))
        return 'É vazio';

      return '';
    };

    const orderedSorts: any[] = Array.isArray(fullReport.sorts)
      ? [...fullReport.sorts].sort(
          (a, b) => (a.priority ?? 999) - (b.priority ?? 999)
        )
      : [];

    return (
      <Box
        sx={{
          mt: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: alpha('#1E4EC4', 0.15),
          p: 2.5,
          bgcolor: alpha('#1E4EC4', 0.01),
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
          Revisão da Configuração
        </Typography>

        {/* GERAL */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Geral
          </Typography>
          <Typography variant="body2">
            <strong>Nome:</strong> {fullReport.name}
          </Typography>
          <Typography variant="body2">
            <strong>Descrição:</strong> {fullReport.description || '-'}
          </Typography>
          <Typography variant="body2">
            <strong>Entidade Raiz:</strong> {getEntityLabel(fullReport.rootEntity)}
          </Typography>
        </Box>

        {/* RELACIONAMENTOS */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Relacionamentos
          </Typography>

          {fullReport.relations && fullReport.relations.length > 0 ? (
            fullReport.relations.map((rel: any, idx: number) => {
              const from = getEntityLabel(rel.fromEntity);
              const to = getEntityLabel(rel.entity);
              const jtRaw = rel.joinType?.toString?.() ?? '';
              const jtLabel = joinTypeLabels[jtRaw] ?? jtRaw;

              const text = jtLabel
                ? `${from} — ${jtLabel} → ${to}`
                : `${from} → ${to}`;

              return (
                <Box
                  key={idx}
                  sx={{
                    mb: 0.5,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    bgcolor: alpha('#1E4EC4', 0.05),
                    fontSize: '0.85rem',
                  }}
                >
                  {text}
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhum relacionamento configurado.
            </Typography>
          )}
        </Box>

        {/* CAMPOS */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Campos
          </Typography>

          {fullReport.fields && fullReport.fields.length > 0 ? (
            fullReport.fields.map((f: any, idx: number) => {
              const label = f.label || getFieldLabel(f.entity, f.fieldPath) || 'Campo sem rótulo';

              return (
                <Box
                  key={idx}
                  sx={{
                    mb: 0.5,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    bgcolor: alpha('#1E4EC4', 0.05),
                    fontSize: '0.85rem',
                  }}
                >
                  {label}
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhum campo configurado.
            </Typography>
          )}
        </Box>

        {/* FILTROS (antes da ordenação) */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Filtros
          </Typography>

          {fullReport.filterQuestions && fullReport.filterQuestions.length > 0 ? (
            fullReport.filterQuestions.map((f: any, idx: number) => {
              const label =
                f.label || getFieldLabel(f.entity, f.fieldPath) || 'Filtro sem rótulo';
              const op = operatorLabel(f.defaultOperator);

              return (
                <Box
                  key={idx}
                  sx={{
                    mb: 0.5,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    bgcolor: alpha('#1E4EC4', 0.05),
                    fontSize: '0.85rem',
                  }}
                >
                  {op ? `${label} — ${op}` : label}
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhum filtro configurado.
            </Typography>
          )}
        </Box>

        {/* ORDENAÇÃO (vem depois dos filtros) */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Ordenação
          </Typography>

          {orderedSorts.length > 0 ? (
            orderedSorts.map((s: any, idx: number) => {
              const label = getFieldLabel(s.entity, s.fieldPath);
              const dir = directionLabel(s.direction);
              const ord = s.priority ?? idx + 1;

              return (
                <Box
                  key={idx}
                  sx={{
                    mb: 0.5,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    bgcolor: alpha('#1E4EC4', 0.05),
                    fontSize: '0.85rem',
                  }}
                >
                  #{ord} — {label} ({dir})
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhuma ordenação configurada.
            </Typography>
          )}
        </Box>
      </Box>
    );
  };


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
            title="Gerador de Relatórios"
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
              <Typography
                variant="h6"
                sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '1.1rem' }}
              >
                Filtro de Busca
              </Typography>
              {(filterName || filterRoot || filterStatus !== '') && (
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
                label="Nome"
                variant="outlined"
                value={filterName}
                size="small"
                onChange={e => setFilterName(e.target.value)}
              />

              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>Entidade Raiz</InputLabel>
                <Select
                  value={filterRoot}
                  label="Entidade Raiz"
                  onChange={(e: SelectChangeEvent<string | ''>) =>
                    setFilterRoot(e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>Todas</em>
                  </MenuItem>
                  {entities.map(e => (
                    <MenuItem key={e.name} value={e.name || ''}>
                      {e.label || e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e: SelectChangeEvent<string>) =>
                    setFilterStatus(e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  <MenuItem value="Draft">Rascunho</MenuItem>
                  <MenuItem value="Published">Publicado</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                mt: 2.5,
                gap: 3,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
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
                onClick={handleClearFilters}
                sx={{
                  borderColor: alpha('#1E4EC4', 0.3),
                  color: '#1E4EC4',
                  fontWeight: 600,
                  px: 4,
                  py: 1,
                  borderRadius: 1.5,
                  textTransform: 'none',
                }}
              >
                Limpar Filtros
              </Button>
            </Box>
          </Paper>

          {loading || entitiesLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 200,
              }}
            >
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
              onDelete={row => openConfirm(row, 'delete')}
              onReport={handleRun}
              noDataMessage={noDataMessage}
            />
          )}
        </Box>
      </Paper>

      <DialogPadronized
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setShowConfigReview(false);
        }}
        title={
          isVisualizing
            ? 'Visualizar Relatório'
            : editingId
            ? 'Editar Relatório'
            : 'Novo Relatório'
        }
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
                onChange={e => setForm({ ...form, name: e.target.value })}
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
                onChange={e => setForm({ ...form, description: e.target.value })}
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
                  onChange={(e: SelectChangeEvent<string>) =>
                    setForm({ ...form, rootEntity: e.target.value as string })
                  }
                >
                  {entities.length === 0 ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} style={{ marginRight: 8 }} /> Carregando...
                    </MenuItem>
                  ) : (
                    entities.map(e => (
                      <MenuItem key={e.name} value={e.name || ''}>
                        {e.label || e.name}
                      </MenuItem>
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
                  onChange={(e: SelectChangeEvent<number>) =>
                    setForm({
                      ...form,
                      readerCanExecute: Number(e.target.value) === 1,
                    })
                  }
                >
                  <MenuItem value={1}>Sim</MenuItem>
                  <MenuItem value={0}>Não</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {editingId && (
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                {isVisualizing ? (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowConfigReview(prev => !prev)}
                    >
                      {showConfigReview ? 'Ocultar configuração' : 'Visualizar configuração'}
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button variant="outlined" onClick={handleOpenWizardFromModal}>
                      CONFIGURAR RELATÓRIO
                    </Button>
                    {isPublished(currentRowStatus) ? (
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() =>
                          openConfirm({ id: editingId } as ReportListItem, 'unpublish')
                        }
                      >
                        Despublicar
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() =>
                          openConfirm({ id: editingId } as ReportListItem, 'publish')
                        }
                      >
                        Publicar
                      </Button>
                    )}
                  </Box>
                )}
              </Grid>
            )}

            {isVisualizing && showConfigReview && (
              <Grid size={{ xs: 12 }}>{renderConfigReview()}</Grid>
            )}
          </Grid>
        }
        actions={
          isVisualizing ? (
            <Button
              variant="contained"
              onClick={() => {
                setOpenModal(false);
                setShowConfigReview(false);
              }}
              sx={{
                bgcolor: '#6b7280',
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 1.5,
                textTransform: 'none',
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
        confirmLabel={
          confirmDialog.action === 'delete'
            ? 'Excluir'
            : confirmDialog.action === 'publish'
            ? 'Publicar'
            : 'Despublicar'
        }
        cancelLabel="Cancelar"
        onClose={handleCloseConfirm}
        onConfirm={handleConfirm}
        loading={confirmDialog.loading}
        danger={confirmDialog.action === 'delete'}
      />

      <DialogPadronized
        open={runnerOpen}
        onClose={() => setRunnerOpen(false)}
        title="Executar Relatório"
        content={
          <Box sx={{ minWidth: 320 }}>
            <Typography variant="body1">
              Aqui será executado o relatório ID {runnerId}.
            </Typography>
          </Box>
        }
        actions={
          <Button
            variant="contained"
            onClick={() => setRunnerOpen(false)}
            sx={{
              bgcolor: '#1E4EC4',
              color: 'white',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 1.5,
              textTransform: 'none',
            }}
          >
            Fechar
          </Button>
        }
      />
    </Container>
  );
};

export default Report;
