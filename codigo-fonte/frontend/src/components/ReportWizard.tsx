// src/components/ReportWizard.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  ReportsApi,
  MetadataEntityDto,
  MetadataRootDto,
  MetadataRelationDto,
  MetadataFieldDto,
} from '@/api';
import { apiConfig } from '@/services/auth';

type WizardProps = {
  open: boolean;
  reportId?: number;
  onClose: () => void;
};

type JoinType = 'Inner' | 'Left';

const joinTypeLabel: Record<JoinType, string> = {
  Inner: 'Somente registros com correspondência (INNER)',
  Left: 'Todos da origem + correspondências (LEFT)',
};

type WizardRelation = {
  path: string;
  entity: string;
  label: string;
  isCollection: boolean;
  joinType: JoinType;
  alias?: string;
};

type WizardField = {
  entity: string;
  name: string;
  fullPath: string;
  label: string;
  dataType: string;
};

type FilterOp =
  | 'Equals'
  | 'NotEquals'
  | 'Contains'
  | 'StartsWith'
  | 'EndsWith'
  | 'GreaterThan'
  | 'GreaterOrEqual'
  | 'LessThan'
  | 'LessOrEqual';

const opLabel: Record<FilterOp, string> = {
  Equals: 'Igual a',
  NotEquals: 'Diferente de',
  Contains: 'Contém',
  StartsWith: 'Começa com',
  EndsWith: 'Termina com',
  GreaterThan: 'Maior que',
  GreaterOrEqual: 'Maior ou igual a',
  LessThan: 'Menor que',
  LessOrEqual: 'Menor ou igual a',
};

type WizardFilter = {
  entity: string;
  field: string;
  fullPath: string;
  op: FilterOp;
  label: string;
  dataType: string;
};

type SortDir = 'ASC' | 'DESC';

const sortDirLabel: Record<SortDir, string> = {
  ASC: 'Crescente',
  DESC: 'Decrescente',
};

type WizardSort = {
  entity: string;
  field: string;
  fullPath: string;
  direction: SortDir;
  label: string;
  dataType: string;
};

const steps = ['Geral', 'Relacionamentos', 'Campos', 'Filtros e ordenação', 'Revisão'];

export default function ReportWizard({ open, reportId, onClose }: WizardProps) {
  const reportsApi = new ReportsApi(apiConfig);

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [entities, setEntities] = useState<MetadataEntityDto[]>([]);
  const entityLabelByName = useMemo(() => {
    const map = new Map<string, string>();
    entities?.forEach(e => map.set(e.name ?? '', e.label ?? e.name ?? ''));
    return map;
  }, [entities]);

  const [rootMeta, setRootMeta] = useState<MetadataRootDto | null>(null);
  const [entityFields, setEntityFields] = useState<Record<string, MetadataFieldDto[]>>({});

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rootEntity, setRootEntity] = useState('');
  const [readerCanExecute, setReaderCanExecute] = useState(false);

  const [relations, setRelations] = useState<WizardRelation[]>([]);
  const [fields, setFields] = useState<WizardField[]>([]);
  const [filters, setFilters] = useState<WizardFilter[]>([]);
  const [sorts, setSorts] = useState<WizardSort[]>([]);

  const canNextFromGeral = !!name.trim() && !!rootEntity;
  const canNextFromFields = fields.length > 0;

  useEffect(() => {
    if (!open) return;
    bootstrap();
  }, [open, reportId]);

  async function loadRootMeta(rootName: string) {
    try {
      const { data } = await reportsApi.apiReportMetadataEntitiesRootFieldsGet(rootName);
      setRootMeta(data ?? null);
      const rootFields = data?.fields ?? [];
      setEntityFields({ root: rootFields });
    } catch {
      setRootMeta(null);
      setEntityFields({});
      toast.error('Não foi possível carregar os metadados da entidade raiz.');
    }
  }

  const bootstrap = async () => {
  try {
    setLoading(true);

    // 1. Carrega lista de entidades
    const meta = await reportsApi.apiReportMetadataEntitiesGet();
    setEntities(meta.data || []);

    // 2. Se for criação, só limpa e sai
    if (!reportId) {
      setName('');
      setDescription('');
      setRootEntity('');
      setReaderCanExecute(false);
      setRootMeta(null);
      setEntityFields({});
      setRelations([]);
      setFields([]);
      setFilters([]);
      setSorts([]);
      setActiveStep(0);
      return;
    }

    // 3. Carrega o relatório
    const { data } = await reportsApi.getReport(reportId);

    setName(data.name ?? '');
    setDescription(data.description ?? '');
    const r = data.rootEntity ?? '';
    setRootEntity(r);
    setReaderCanExecute(!!data.readerCanExecute);

    // 4. Carrega metadado da raiz
    let rootMetaResp: { data?: MetadataRootDto | null } | null = null;

    if (r) {
      rootMetaResp = await reportsApi.apiReportMetadataEntitiesRootFieldsGet(r);
      const rootMetaData = rootMetaResp.data ?? null;

      setRootMeta(rootMetaData);

      const rootFields = rootMetaData?.fields ?? [];
      setEntityFields({ root: rootFields });
    }

    // 5. Dados do relatório
    const rel = data.relations ?? [];
    const flds = data.fields ?? [];
    const flt = data.filterQuestions ?? [];
    const srt = data.sorts ?? [];

    // 6. Carrega campos das entidades relacionadas
    if (rootMetaResp?.data?.relations?.length) {
      for (const relItem of rel) {
        if (!relItem.path) continue;

        const metaRel = rootMetaResp.data.relations.find(
          (x: MetadataRelationDto) => x.path === relItem.path
        );
        if (!metaRel?.entity) continue;

        const resp = await reportsApi.apiReportMetadataEntitiesRootFieldsGet(
          metaRel.entity
        );
        const fields = resp?.data?.fields ?? [];

        setEntityFields(prev => ({
          ...prev,
          [relItem.path]: fields,
        }));
      }
    }

    // 7. Seta relações
    setRelations(
      rel.map((x: any) => ({
        path: x.path,
        entity: x.entity,
        label: x.alias || x.entity,
        isCollection: x.isCollection,
        joinType: x.joinType,
        alias: x.alias ?? '',
      }))
    );

    // Helper pra separar entidade/campo caso venha com ponto
    const mapFieldToEntity = (fp: string) => {
      if (!fp.includes('.')) return { entity: 'root', field: fp };
      const [entity, ...rest] = fp.split('.');
      return { entity, field: rest.join('.') };
    };

    // 8. Campos
    setFields(
      flds.map((f: any) => {
        const { entity, field } = mapFieldToEntity(f.fieldPath);
        return {
          entity,
          name: field,
          fullPath: f.fieldPath,
          label: f.label,
          dataType: f.dataType,
        };
      })
    );

    // 9. Filtros
    setFilters(
      flt.map((x: any) => {
        const { entity, field } = mapFieldToEntity(x.fieldPath);
        return {
          entity,
          field,
          fullPath: x.fieldPath,
          op: x.defaultOperator,
          label: x.label,
          dataType: x.dataType,
        };
      })
    );

    // 10. Ordenações
    setSorts(
      srt.map((x: any) => {
        const { entity, field } = mapFieldToEntity(x.fieldPath);
        return {
          entity,
          field,
          fullPath: x.fieldPath,
          direction: x.direction,
          label: '',
          dataType: '',
        };
      })
    );

    setActiveStep(0);
  } catch (err) {
    toast.error('Falha ao carregar dados do relatório.');
  } finally {
    setLoading(false);
  }
};

  
  const handleChangeRoot = async (e: SelectChangeEvent<string>) => {
    const value = e.target.value as string;
    setRootEntity(value);
    setRelations([]);
    setFields([]);
    setFilters([]);
    setSorts([]);
    await loadRootMeta(value);
  };

  const firstLevelRelations: MetadataRelationDto[] = useMemo(
    () => rootMeta?.relations ?? [],
    [rootMeta]
  );

  const getFieldsFor = (entityRef: string): MetadataFieldDto[] => {
    return entityFields[entityRef] ?? [];
  };

  const ensureEntityFieldsLoaded = async (entityRef: string) => {
    if (!entityRef || entityRef === 'root') return;
    if (entityFields[entityRef]?.length) return;
    const rel = firstLevelRelations.find(r => r.path === entityRef);
    const entityName = rel?.entity;
    if (!entityName) return;
    try {
      const { data } = await reportsApi.apiReportMetadataEntitiesRootFieldsGet(entityName);
      const fields = data?.fields ?? [];
      setEntityFields(prev => ({ ...prev, [entityRef]: fields }));
    } catch {
      toast.error('Não foi possível carregar os campos da entidade relacionada.');
    }
  };

  const addRelation = () => {
    if (!rootEntity) return;
    setRelations(prev => [
      ...prev,
      {
        path: '',
        entity: '',
        label: '',
        isCollection: false,
        joinType: 'Left',
        alias: '',
      },
    ]);
  };

  const updateRelation = (idx: number, patch: Partial<WizardRelation>) =>
    setRelations(prev => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const removeRelation = (idx: number) =>
    setRelations(prev => prev.filter((_, i) => i !== idx));

  const addField = () =>
    setFields(prev => [
      ...prev,
      {
        entity: 'root',
        name: '',
        fullPath: '',
        label: '',
        dataType: '',
      },
    ]);

  const updateField = (idx: number, patch: Partial<WizardField>) =>
    setFields(prev => prev.map((f, i) => (i === idx ? { ...f, ...patch } : f)));

  const removeField = (idx: number) =>
    setFields(prev => prev.filter((_, i) => i !== idx));

  const addFilter = async () => {
    const entityRef = 'root';
    await ensureEntityFieldsLoaded(entityRef);
    const available = getFieldsFor(entityRef);
    const firstField = available[0];
    setFilters(prev => [
      ...prev,
      {
        entity: entityRef,
        field: firstField?.path ?? '',
        fullPath: firstField?.path ?? '',
        op: 'Equals',
        label: firstField?.label ?? '',
        dataType: firstField?.dataType ?? '',
      },
    ]);
  };

  const updateFilter = (idx: number, patch: Partial<WizardFilter>) =>
    setFilters(prev => prev.map((f, i) => (i === idx ? { ...f, ...patch } : f)));

  const removeFilter = (idx: number) =>
    setFilters(prev => prev.filter((_, i) => i !== idx));

  const addSort = async () => {
    const entityRef = 'root';
    await ensureEntityFieldsLoaded(entityRef);
    const available = getFieldsFor(entityRef);
    const firstField = available[0];
    setSorts(prev => [
      ...prev,
      {
        entity: entityRef,
        field: firstField?.path ?? '',
        fullPath: firstField?.path ?? '',
        direction: 'ASC',
        label: firstField?.label ?? '',
        dataType: firstField?.dataType ?? '',
      },
    ]);
  };

  const updateSort = (idx: number, patch: Partial<WizardSort>) =>
    setSorts(prev => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));

  const removeSort = (idx: number) =>
    setSorts(prev => prev.filter((_, i) => i !== idx));

  const handleNext = () => {
    if (activeStep === 0 && !canNextFromGeral) return;
    if (activeStep === 2 && !canNextFromFields) return;
    setActiveStep(s => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => setActiveStep(s => Math.max(s - 1, 0));

  const handleSave = async () => {
    if (!reportId) {
      toast.error('ID do relatório não informado.');
      return;
    }

    const normalizeFilterValue = (f: WizardFilter) => {
      return null;
    };

    try {
      setSaving(true);

      await reportsApi.editReport({
        id: reportId,
        name,
        description,
        rootEntity,
        readerCanExecute,
        relations: relations.map(r => ({
          fromEntity: rootEntity,
          path: r.path,
          entity: r.entity,
          joinType: r.joinType,
          alias: r.alias ?? '',
          isCollection: r.isCollection,
        })),
        fields: fields.map((f, index) => ({
          fieldPath: f.fullPath,
          label: f.label || '',
          dataType: f.dataType,
          formatHint: null,
          displayOrder: index,
        })),
        filterQuestions: filters.map((f, index) => ({
          fieldPath: f.fullPath,
          defaultOperator: f.op,
          dataType: f.dataType,
          isRequired: false,
          isDateBase: f.dataType === '6' || f.dataType === 6 ? index === 0 : false,
          label: f.label,
          enumOptionsJson: null,
          value: normalizeFilterValue(f),
        })),
        sorts: sorts.map((s, index) => ({
          fieldPath: s.fullPath,
          direction: s.direction === 'ASC' ? 0 : 1,
          priority: index + 1,
        })),
      });

      toast.success('Relatório configurado com sucesso.');
      onClose();
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.title;
      toast.error(apiMessage || 'Falha ao salvar configuração do relatório.');
    } finally {
      setSaving(false);
    }
  };

  const rootEntityLabel = entityLabelByName.get(rootEntity) ?? rootEntity;
  const noFirstLevelRelations = (firstLevelRelations?.length ?? 0) === 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        Configurar Relatório
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 && (
              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  label="Nome do relatório"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  fullWidth
                />

                <TextField
                  label="Descrição"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                />

                <FormControl fullWidth>
                  <InputLabel>Entidade Raiz</InputLabel>
                  <Select
                    value={rootEntity}
                    label="Entidade Raiz"
                    onChange={handleChangeRoot}
                  >
                    {entities.map(e => (
                      <MenuItem key={e.name} value={e.name!}>
                        {e.label ?? e.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Relacionamentos</Typography>
                  <Button variant="contained" onClick={addRelation} disabled={!rootEntity}>
                    Adicionar relacionamento
                  </Button>
                </Box>

                {relations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum relacionamento adicionado.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    {relations.map((rel, idx) => {
                      const origemText = rootEntityLabel || '';
                      const options = firstLevelRelations;

                      return (
                        <Box
                          key={idx}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: {
                                xs: '1fr',
                                md: '1.2fr 1fr 1fr',
                              },
                              gap: 2,
                            }}
                          >
                            <TextField label="Origem" value={origemText} disabled fullWidth />

                            <FormControl fullWidth>
                              <InputLabel>Entidade Relacionada</InputLabel>
                              <Select
                                value={rel.path}
                                label="Entidade Relacionada"
                                onChange={(e: SelectChangeEvent<string>) =>
                                  updateRelation(idx, {
                                    path: e.target.value,
                                    entity:
                                      options.find(o => o.path === e.target.value)?.entity ?? '',
                                    label:
                                      options.find(o => o.path === e.target.value)?.label ??
                                      e.target.value,
                                    isCollection:
                                      options.find(o => o.path === e.target.value)?.isCollection ??
                                      false,
                                  })
                                }
                              >
                                {options.map(r => (
                                  <MenuItem key={r.path} value={r.path!}>
                                    {r.label ?? r.path}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl fullWidth>
                              <InputLabel>Tipo de junção</InputLabel>
                              <Select
                                value={rel.joinType}
                                label="Tipo de junção"
                                onChange={(e: SelectChangeEvent<JoinType>) =>
                                  updateRelation(idx, {
                                    joinType: e.target.value as JoinType,
                                  })
                                }
                              >
                                <MenuItem value="Inner">{joinTypeLabel.Inner}</MenuItem>
                                <MenuItem value="Left">{joinTypeLabel.Left}</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
                              gap: 2,
                              mt: 2,
                            }}
                          >
                            <TextField
                              label="Alias (opcional)"
                              value={rel.alias ?? ''}
                              onChange={e =>
                                updateRelation(idx, {
                                  alias: e.target.value,
                                })
                              }
                              fullWidth
                            />

                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                              }}
                            >
                              <Button
                                color="error"
                                variant="outlined"
                                onClick={() => removeRelation(idx)}
                              >
                                Remover
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Campos</Typography>

                  <Button variant="contained" onClick={addField} disabled={!rootEntity}>
                    Adicionar campo
                  </Button>
                </Box>

                {fields.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum campo selecionado.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    {fields.map((f, idx) => {
                      const fieldOptions =
                        f.entity === 'root'
                          ? getFieldsFor('root')
                          : getFieldsFor(f.entity);

                      return (
                        <Box
                          key={idx}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: {
                                xs: '1fr',
                                md: '1fr 1fr 1fr auto',
                              },
                              gap: 2,
                            }}
                          >
                            <FormControl fullWidth>
                              <InputLabel>Entidade</InputLabel>
                              <Select
                                value={f.entity}
                                label="Entidade"
                                onChange={async (e: SelectChangeEvent<string>) => {
                                  const en = e.target.value as string;
                                  if (en !== 'root') await ensureEntityFieldsLoaded(en);
                                  updateField(idx, {
                                    entity: en,
                                    name: '',
                                    fullPath: '',
                                    label: '',
                                    dataType: '',
                                  });
                                }}
                              >
                                <MenuItem value="root">{rootEntityLabel || 'Raiz'}</MenuItem>

                                {relations.map(r => (
                                  <MenuItem key={r.path} value={r.path}>
                                    {r.label ?? r.path}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl fullWidth>
                              <InputLabel>Nome do campo</InputLabel>
                              <Select
                                value={f.name}
                                label="Nome do campo"
                                onChange={(e: SelectChangeEvent<string>) => {
                                  const selected = e.target.value as string;
                                  const opt = fieldOptions.find(o => o.path === selected);

                                  updateField(idx, {
                                    name: selected,
                                    fullPath: selected,
                                    label: opt?.label ?? '',
                                    dataType: opt?.dataType ?? '',
                                  });
                                }}
                              >
                                {fieldOptions.map(opt => (
                                  <MenuItem key={opt.path} value={opt.path!}>
                                    {opt.label ?? opt.path}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <TextField
                              label="Rótulo (opcional)"
                              value={f.label ?? ''}
                              onChange={e => updateField(idx, { label: e.target.value })}
                              fullWidth
                            />

                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                              }}
                            >
                              <Button
                                color="error"
                                variant="outlined"
                                onClick={() => removeField(idx)}
                              >
                                Remover
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            )}

            {activeStep === 3 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Filtros</Typography>

                  <Button variant="contained" onClick={addFilter}>
                    Adicionar filtro
                  </Button>
                </Box>

                {filters.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum filtro definido.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    {filters.map((f, idx) => {
                      const opts =
                        f.entity === 'root'
                          ? getFieldsFor('root')
                          : getFieldsFor(f.entity);

                      return (
                        <Box
                          key={idx}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: {
                                xs: '1fr',
                                md: '1fr 1fr 1fr auto',
                              },
                              gap: 2,
                            }}
                          >
                            <FormControl fullWidth>
                              <InputLabel>Entidade</InputLabel>
                              <Select
                                value={f.entity}
                                label="Entidade"
                                onChange={async (e: SelectChangeEvent<string>) => {
                                  const en = e.target.value as string;
                                  if (en !== 'root') await ensureEntityFieldsLoaded(en);

                                  const available = getFieldsFor(en);
                                  const first = available[0];

                                  updateFilter(idx, {
                                    entity: en,
                                    field: first?.path ?? '',
                                    fullPath: first?.path ?? '',
                                    label: first?.label ?? '',
                                    dataType: first?.dataType ?? '',
                                  });
                                }}
                              >
                                <MenuItem value="root">{rootEntityLabel || 'Raiz'}</MenuItem>

                                {relations.map(r => (
                                  <MenuItem key={r.path} value={r.path}>
                                    {r.label ?? r.path}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl fullWidth>
                              <InputLabel>Campo</InputLabel>
                              <Select
                                value={f.field}
                                label="Campo"
                                onChange={(e: SelectChangeEvent<string>) => {
                                  const selected = e.target.value as string;
                                  const opt = opts.find(o => o.path === selected);

                                  updateFilter(idx, {
                                    field: selected,
                                    fullPath: selected,
                                    label: opt?.label ?? '',
                                    dataType: opt?.dataType ?? '',
                                  });
                                }}
                              >
                                {opts.map(opt => (
                                  <MenuItem key={opt.path} value={opt.path!}>
                                    {opt.label ?? opt.path}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl fullWidth>
                              <InputLabel>Operador</InputLabel>
                              <Select
                                value={f.op}
                                label="Operador"
                                onChange={(e: SelectChangeEvent<FilterOp>) =>
                                  updateFilter(idx, { op: e.target.value as FilterOp })
                                }
                              >
                                {(Object.keys(opLabel) as FilterOp[]).map(op => (
                                  <MenuItem key={op} value={op}>
                                    {opLabel[op]}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                              }}
                            >
                              <Button
                                color="error"
                                variant="outlined"
                                onClick={() => removeFilter(idx)}
                              >
                                Remover
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Ordenação</Typography>
                  <Button variant="contained" onClick={addSort}>
                    Adicionar ordenação
                  </Button>
                </Box>

                {sorts.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma ordenação definida.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    {sorts.map((s, idx) => {
                      const opts =
                        s.entity === 'root'
                          ? getFieldsFor('root')
                          : getFieldsFor(s.entity);

                      return (
                        <Box
                          key={idx}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: {
                                xs: '1fr',
                                md: '1fr 1fr 1fr auto',
                              },
                              gap: 2,
                            }}
                          >
                            <FormControl fullWidth>
                              <InputLabel>Entidade</InputLabel>
                              <Select
                                value={s.entity}
                                label="Entidade"
                                onChange={async (e: SelectChangeEvent<string>) => {
                                  const en = e.target.value as string;
                                  if (en !== 'root') await ensureEntityFieldsLoaded(en);
                                  const available = getFieldsFor(en);
                                  const first = available[0];

                                  updateSort(idx, {
                                    entity: en,
                                    field: first?.path ?? '',
                                    fullPath: first?.path ?? '',
                                    label: first?.label ?? '',
                                    dataType: first?.dataType ?? '',
                                  });
                                }}
                              >
                                <MenuItem value="root">{rootEntityLabel || 'Raiz'}</MenuItem>
                                {relations.map(r => (
                                  <MenuItem key={r.path} value={r.path}>
                                    {r.label ?? r.path}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl fullWidth>
                              <InputLabel>Campo</InputLabel>
                              <Select
                                value={s.field}
                                label="Campo"
                                onChange={(e: SelectChangeEvent<string>) => {
                                  const selected = e.target.value as string;
                                  const opt = opts.find(o => o.path === selected);

                                  updateSort(idx, {
                                    field: selected,
                                    fullPath: selected,
                                    label: opt?.label ?? '',
                                    dataType: opt?.dataType ?? '',
                                  });
                                }}
                              >
                                {opts.map(opt => (
                                  <MenuItem key={opt.path} value={opt.path!}>
                                    {opt.label ?? opt.path}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl fullWidth>
                              <InputLabel>Direção</InputLabel>
                              <Select
                                value={s.direction}
                                label="Direção"
                                onChange={(e: SelectChangeEvent<SortDir>) =>
                                  updateSort(idx, {
                                    direction: e.target.value as SortDir,
                                  })
                                }
                              >
                                <MenuItem value="ASC">{sortDirLabel.ASC}</MenuItem>
                                <MenuItem value="DESC">{sortDirLabel.DESC}</MenuItem>
                              </Select>
                            </FormControl>

                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                              }}
                            >
                              <Button
                                color="error"
                                variant="outlined"
                                onClick={() => removeSort(idx)}
                              >
                                Remover
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            )}

            {activeStep === 4 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Revisão
                </Typography>

                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2">Geral</Typography>
                    <Divider sx={{ my: 1 }} />

                    <Typography>
                      <strong>Nome:</strong> {name || '-'}
                    </Typography>

                    <Typography>
                      <strong>Descrição:</strong> {description || '-'}
                    </Typography>

                    <Typography>
                      <strong>Entidade Raiz:</strong> {rootEntityLabel || '-'}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2">Relacionamentos</Typography>
                    <Divider sx={{ my: 1 }} />

                    {relations.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Nenhum
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'grid', gap: 1 }}>
                        {relations.map((r, i) => (
                          <Chip
                            key={i}
                            label={`${rootEntityLabel} — ${
                              joinTypeLabel[r.joinType]
                            } → ${r.label}${r.alias ? ` (alias: ${r.alias})` : ''}`}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2">Campos</Typography>
                    <Divider sx={{ my: 1 }} />

                    {fields.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Nenhum
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'grid', gap: 1 }}>
                        {fields.map((f, i) => (
                          <Chip
                            key={i}
                            label={`${f.entity === 'root' ? rootEntityLabel : f.entity}.${
                              f.label || f.name
                            }`}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2">Filtros</Typography>
                    <Divider sx={{ my: 1 }} />

                    {filters.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Nenhum
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'grid', gap: 1 }}>
                        {filters.map((f, i) => (
                          <Chip
                            key={i}
                            label={`${f.entity === 'root' ? rootEntityLabel : f.entity}.${
                              f.label
                            } ${opLabel[f.op]}`}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2">Ordenação</Typography>
                    <Divider sx={{ my: 1 }} />

                    {sorts.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Nenhuma
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'grid', gap: 1 }}>
                        {sorts.map((s, i) => (
                          <Chip
                            key={i}
                            label={`${s.entity === 'root' ? rootEntityLabel : s.entity}.${
                              s.label
                            } (${sortDirLabel[s.direction]})`}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>

        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={saving}>
            Voltar
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={
              saving ||
              (activeStep === 0 && !canNextFromGeral) ||
              (activeStep === 2 && !canNextFromFields)
            }
          >
            Próximo
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !canNextFromFields || !canNextFromGeral}
            startIcon={saving ? <CircularProgress size={18} /> : undefined}
          >
            Salvar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
