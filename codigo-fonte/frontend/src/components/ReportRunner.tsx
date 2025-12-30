// src/components/ReportRunner.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  Paper,
} from '@mui/material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportsApi, MetadataEntityDto } from '@/api';
import { apiConfig } from '@/services/auth';

type ReportRunnerProps = {
  reportId?: number | null;
};

type FilterQuestionView = {
  key: string;         // chave única da UI (inclui operador)
  answerKey: string;   // chave enviada para o backend (Entidade.Campo)
  label: string;
  dataType: number;
  isDate: boolean;
  enumOptions?: { value: string; label: string }[];
};

type ReportColumn = {
  fieldPath: string;
  label: string;
  dataType: string;
};

type ReportResult = {
  reportName: string;
  rootEntity: string;
  columns: ReportColumn[];
  rows: Record<string, any>[];
};

const ReportRunner: React.FC<ReportRunnerProps> = ({ reportId }) => {
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [running, setRunning] = useState(false);
  const [questions, setQuestions] = useState<FilterQuestionView[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReportResult | null>(null);
  const [reportName, setReportName] = useState<string>('');

  const reportsApi = useMemo(() => new ReportsApi(apiConfig), []);

  const parseEnumOptions = (raw?: string | null) => {
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((x: any) => {
          if (typeof x === 'string') {
            return { value: x, label: x };
          }
          const value = x.value ?? x.key ?? x.id ?? String(x);
          const label = x.label ?? x.name ?? value;
          return { value: String(value), label: String(label) };
        });
      }
      if (typeof parsed === 'object') {
        return Object.entries(parsed).map(([k, v]) => ({
          value: String(k),
          label: String(v),
        }));
      }
    } catch {
      return undefined;
    }
    return undefined;
  };

  useEffect(() => {
    const loadConfig = async () => {
      if (!reportId) return;
      try {
        setLoadingConfig(true);
        setResult(null);
        setQuestions([]);
        setFormValues({});

        // 1) Carrega o relatório
        const { data } = await reportsApi.getReport(reportId);
        setReportName(data.name || '');

        // 2) Carrega metadados para termos o label das entidades
        let entityLabelMap = new Map<string, string>();
        try {
          const metaResp = await reportsApi.apiReportMetadataEntitiesGet();
          const entities: MetadataEntityDto[] = metaResp.data || [];
          entities.forEach(e => {
            if (e.name) entityLabelMap.set(e.name, e.label || e.name);
          });
        } catch {
          entityLabelMap = new Map<string, string>();
        }

        const getEntityLabel = (entityName?: string | null) => {
          if (!entityName) return '';
          return entityLabelMap.get(entityName) || entityName;
        };

        // 3) Monta as perguntas de filtro
        const qs: FilterQuestionView[] =
          (data.filterQuestions || []).map((q: any) => {
            const entity = q.entity || data.rootEntity;
            const entityLabel = getEntityLabel(entity);

            const answerKey = `${entity}.${q.fieldPath}`; // o que vai para o backend
            // chave única para a UI (mesmo campo com operadores diferentes não colide)
            const key = `${answerKey}__${q.defaultOperator || 'op'}`;

            const dt: number = q.dataType;
            const isDate = dt === 6;
            const enumOptions = dt === 7 ? parseEnumOptions(q.enumOptionsJson) : undefined;

            const baseLabel = q.label || q.fieldPath || answerKey;
            const opRaw = (q.defaultOperator || '').toString().toLowerCase();

            const opText =
              opRaw.includes('greaterorequal') || opRaw.includes('greater_or_equal')
                ? 'maior ou igual a'
                : opRaw.includes('greater')
                ? 'maior que'
                : opRaw.includes('lessorequal') || opRaw.includes('less_or_equal')
                ? 'menor ou igual a'
                : opRaw.includes('less')
                ? 'menor que'
                : opRaw.includes('notequal') || (opRaw.includes('not') && opRaw.includes('equal'))
                ? 'diferente de'
                : opRaw.includes('doesnotcontain') ||
                  (opRaw.includes('not') && opRaw.includes('contain'))
                ? 'não contém'
                : opRaw.includes('contains')
                ? 'contém'
                : opRaw.includes('equal')
                ? 'igual a'
                : '';

            const prettyLabel = entityLabel
              ? opText
                ? `${baseLabel} em ${entityLabel} ${opText}:`
                : `${baseLabel} em ${entityLabel}:`
              : opText
              ? `${baseLabel} ${opText}:`
              : `${baseLabel}:`;

            return {
              key,
              answerKey,
              label: prettyLabel,
              dataType: dt,
              isDate,
              enumOptions,
            };
          }) || [];

        setQuestions(qs);
      } catch {
        toast.error('Erro ao carregar filtros do relatório');
      } finally {
        setLoadingConfig(false);
      }
    };

    loadConfig();
  }, [reportId, reportsApi]);

  const handleChange = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const validateAndBuildAnswers = (): Record<string, string> | null => {
    const answers: Record<string, string> = {};

    for (const q of questions) {
      const raw = formValues[q.key]?.trim() ?? '';

      if (!raw) {
        toast.error(`Preencha o campo "${q.label}"`);
        return null;
      }

      if (q.isDate) {
        const ok = dayjs(raw, 'DD/MM/YYYY', true).isValid();
        if (!ok) {
          toast.error(`Data inválida em "${q.label}". Use o formato DD/MM/AAAA.`);
          return null;
        }
        answers[q.answerKey] = raw;
        continue;
      }

      if (q.dataType === 7) {
        answers[q.answerKey] = raw;
        continue;
      }

      if ([1, 2, 3, 4, 5].includes(q.dataType)) {
        const normalized = raw.replace(',', '.');
        if (Number.isNaN(Number(normalized))) {
          toast.error(`Valor numérico inválido em "${q.label}".`);
          return null;
        }
        answers[q.answerKey] = normalized;
        continue;
      }

      answers[q.answerKey] = raw;
    }

    return answers;
  };

  const executeReport = async () => {
    if (!reportId) {
      toast.error('Relatório inválido');
      return;
    }

    const answers = validateAndBuildAnswers();
    if (!answers) return;

    try {
      setRunning(true);
      setResult(null);

      const body = { answers };
      const apiAny = reportsApi as any;
      let response: any;

      if (typeof apiAny.runReport === 'function') {
        response = await apiAny.runReport(reportId, body);
      } else if (typeof apiAny.apiReportsIdRunPost === 'function') {
        response = await apiAny.apiReportsIdRunPost(reportId, body);
      } else {
        throw new Error('Método de execução de relatório não encontrado no client da API');
      }

      const data = response.data ?? response;
      setResult(data as ReportResult);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao executar relatório');
    } finally {
      setRunning(false);
    }
  };

  const formatCellValue = (value: any): string => {
    if (Array.isArray(value)) return value.join(', ');
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (value instanceof Date) return dayjs(value).format('DD/MM/YYYY');
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const getSafeFileName = (base: string, ext: string) => {
    const cleaned = (base || 'relatorio')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\-]+/g, '_');
    return `${cleaned || 'relatorio'}.${ext}`;
  };

  const handleExportExcel = () => {
    if (!result || !result.rows.length) {
      toast.warning('Não há dados para exportar');
      return;
    }

    const headers = result.columns.map(c => c.label || c.fieldPath);
    const lines: string[] = [];

    const escape = (value: string) => {
      const v = value ?? '';
      const needsQuote = /[;"\n\r,]/.test(v);
      const escaped = v.replace(/"/g, '""');
      return needsQuote ? `"${escaped}"` : escaped;
    };

    lines.push(headers.map(h => escape(h)).join(';'));

    result.rows.forEach(row => {
      const cols = result.columns.map(col => {
        const v = formatCellValue(row[col.fieldPath]);
        return escape(v);
      });
      lines.push(cols.join(';'));
    });

    const blob = new Blob([lines.join('\r\n')], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getSafeFileName(result.reportName || 'relatorio', 'csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    if (!result || !result.rows.length) {
      toast.warning('Não há dados para exportar');
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape' });
    const title = result.reportName || 'Relatório';

    doc.setFontSize(14);
    doc.text(title, 14, 15);

    const head = [result.columns.map(c => c.label || c.fieldPath)];
    const body = result.rows.map(row =>
      result.columns.map(col => formatCellValue(row[col.fieldPath]))
    );

    autoTable(doc, {
      head,
      body,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 78, 196] },
      margin: { left: 10, right: 10 },
    } as any);

    doc.save(getSafeFileName(result.reportName || 'relatorio', 'pdf'));
  };

  return (
    <Box sx={{ minWidth: 900, maxWidth: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {reportName ? `Executar: ${reportName}` : 'Executar Relatório'}
      </Typography>

      {loadingConfig ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : questions.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Este relatório não possui filtros. Clique em Executar para gerar os dados.
        </Typography>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Filtros
          </Typography>
          <Grid container spacing={2}>
            {questions.map(q => (
              <Grid item xs={12} sm={6} key={q.key}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, lineHeight: 1.3, wordBreak: 'break-word' }}
                  >
                    {q.label}
                  </Typography>

                  {q.dataType === 7 && q.enumOptions && q.enumOptions.length > 0 ? (
                    <FormControl fullWidth size="small">
                      <Select
                        value={formValues[q.key] ?? ''}
                        onChange={(e: SelectChangeEvent<string>) =>
                          handleChange(q.key, e.target.value as string)
                        }
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Selecione...</em>
                        </MenuItem>
                        {q.enumOptions.map(opt => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      size="small"
                      value={formValues[q.key] ?? ''}
                      onChange={e => handleChange(q.key, e.target.value)}
                      placeholder={q.isDate ? 'DD/MM/AAAA' : ''}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          {result && result.rows.length > 0 && (
            <>
              <Button
                variant="outlined"
                onClick={handleExportPdf}
                sx={{
                  borderColor: '#1E4EC4',
                  color: '#1E4EC4',
                  fontWeight: 600,
                  px: 2.5,
                  py: 0.75,
                  borderRadius: 1.5,
                  textTransform: 'none',
                }}
              >
                Exportar PDF
              </Button>
              <Button
                variant="outlined"
                onClick={handleExportExcel}
                sx={{
                  borderColor: '#1E4EC4',
                  color: '#1E4EC4',
                  fontWeight: 600,
                  px: 2.5,
                  py: 0.75,
                  borderRadius: 1.5,
                  textTransform: 'none',
                }}
              >
                Exportar Excel
              </Button>
            </>
          )}
        </Box>

        <Button
          variant="contained"
          onClick={executeReport}
          disabled={running || (!!reportId === false)}
          startIcon={running ? <CircularProgress size={18} /> : null}
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
          Executar
        </Button>
      </Box>

      {result && (
        <Paper
          variant="outlined"
          sx={{
            mt: 2,
            maxHeight: 450,
            overflow: 'auto',
            borderRadius: 2,
            borderColor: 'rgba(30, 78, 196, 0.2)',
          }}
        >
          <Box sx={{ minWidth: 900 }}>
            <Box
              sx={{
                display: 'flex',
                borderBottom: '1px solid #e5e7eb',
                bgcolor: '#f9fafb',
              }}
            >
              {result.columns.map(col => (
                <Box
                  key={col.fieldPath}
                  sx={{
                    flex: 1,
                    p: 1,
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    borderRight: '1px solid #e5e7eb',
                    '&:last-of-type': { borderRight: 'none' },
                  }}
                >
                  {col.label || col.fieldPath}
                </Box>
              ))}
            </Box>

            {result.rows.map((row, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  borderBottom: '1px solid #f3f4f6',
                  '&:nth-of-type(odd)': { bgcolor: '#fcfcfc' },
                }}
              >
                {result.columns.map(col => (
                  <Box
                    key={col.fieldPath}
                    sx={{
                      flex: 1,
                      p: 1,
                      fontSize: '0.85rem',
                      borderRight: '1px solid #f3f4f6',
                      '&:last-of-type': { borderRight: 'none' },
                    }}
                  >
                    {formatCellValue(row[col.fieldPath])}
                  </Box>
                ))}
              </Box>
            ))}

            {result.rows.length === 0 && (
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center' }}
                >
                  Nenhum registro encontrado para os filtros informados.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ReportRunner;
