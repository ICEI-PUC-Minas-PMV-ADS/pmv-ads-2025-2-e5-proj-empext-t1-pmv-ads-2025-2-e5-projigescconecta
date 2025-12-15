import React, { useState } from 'react';
import generateXlsx from '../utils/generateXlsx';
import { CsvService } from '@/services/csvService';
import { extractErrorMessage } from '@/utils/error';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import GetAppIcon from '@mui/icons-material/GetApp';
import {
  Dialog,
  DialogContent,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  Box,
  alpha,
  Divider,
  Chip,
} from '@mui/material';
import DialogPadronized from './DialogPadronized';

interface UploadCsvModalProps<T> {
  title: string;
  onClose: () => void;
  apiCreate: (item: T) => Promise<any>;
  expectedHeaders: (keyof T)[];
  headerTranslations?: Record<string, string>;
  validateFields?: (item: T) => string | null;
  onFinish?: () => void;
}

interface UploadResult {
  row: number;
  id?: number;
  name?: string;
  message: string;
}

export function UploadCsvModal<T extends Record<string, any>>({
  title,
  onClose,
  apiCreate,
  expectedHeaders,
  headerTranslations = {},
  validateFields,
  onFinish,
}: UploadCsvModalProps<T>) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const reverseTranslations = Object.entries(headerTranslations).reduce(
    (acc, [eng, pt]) => ({ ...acc, [pt]: eng }),
    {} as Record<string, string>
  );

  const translateToPortuguese = (header: string): string => {
    return headerTranslations[header] || header;
  };

  const translateToEnglish = (header: string): string => {
    return reverseTranslations[header] || header;
  };

  const convertKeysToEnglish = (obj: Record<string, any>): T => {
    const converted: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      const englishKey = translateToEnglish(key);
      converted[englishKey] = value;
    });
    return converted as T;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleBoxClick = () => {
    document.getElementById('csv-file-input')?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      // Verificar se é um arquivo CSV
      if (droppedFile.type === 'text/csv' || droppedFile.name.toLowerCase().endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        alert('Por favor, selecione apenas arquivos CSV.');
      }
    }
  };

  const handleDownloadTemplate = () => {
    const portugueseHeaders = expectedHeaders.map((h) => translateToPortuguese(String(h)));

    generateXlsx({
      headers: portugueseHeaders,
      filename: `modelo_${title.toLowerCase().replace(/\s+/g, '_')}`,
    });
  };

  const handlePreview = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const data = await CsvService.parseCsvFile<Record<string, any>>(file);

      const convertedData = data.map((row) => convertKeysToEnglish(row));

      setParsedData(convertedData);
      setShowPreview(true);
    } catch (error) {
      console.error('Erro ao processar CSV:', error);
      alert('Falha ao ler o arquivo CSV.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    setProcessing(true);

    const validationHeaderErros = validateCsvHeaders(parsedData, expectedHeaders);

    if (validationHeaderErros) {
      alert(validationHeaderErros);
      handleCloseAll();
      return;
    }

    const resultsList: UploadResult[] = [];
    let rowNumber = 2;

    for (const item of parsedData) {
      try {
        if (validateFields) {
          const validationMessage = validateFields(item);
          if (validationMessage) {
            resultsList.push({
              row: rowNumber,
              id: (item as any).id ?? '-',
              name: (item as any).name ?? '-',
              message: validationMessage,
            });
            rowNumber++;
            continue;
          }
        }

        const response = await apiCreate(item);
        console.log(response);
        resultsList.push({
          row: rowNumber,
          id: response.data?.id ?? '-',
          name: response.data?.name ?? '-',
          message: 'Criado com sucesso',
        });
      } catch (error: any) {
        resultsList.push({
          row: rowNumber,
          id: (item as any).id ?? '-',
          name: (item as any).name ?? '-',
          message: extractErrorMessage(error) || 'Erro ao criar',
        });
      }

      rowNumber++;
    }

    setResults(resultsList);
    setProcessing(false);
    setShowResults(true);
  };

  const handleCloseAll = () => {
    setFile(null);
    setParsedData([]);
    setShowPreview(false);
    setShowResults(false);
    onClose();
    if (onFinish) onFinish();
  };

  function validateCsvHeaders<T extends Record<string, any>>(
    parsedData: T[],
    expectedHeaders: (keyof T)[]
  ): string | null {
    if (!parsedData || parsedData.length === 0) {
      return 'O arquivo CSV está vazio ou inválido.';
    }

    const csvHeaders = Object.keys(parsedData[0]);
    const expected = expectedHeaders.map(String);
    const expectedConverted = expectedHeaders.map((h) => translateToPortuguese(String(h)));

    const missing = expected.filter((h) => !csvHeaders.includes(h));
    const extra = csvHeaders.filter((h) => !expected.includes(h));

    if (missing.length > 0 || extra.length > 0) {
      return `As colunas do CSV não estão corretas.
            Esperado: [${expectedConverted.join(', ')}]
            Encontrado: [${csvHeaders.join(', ')}]`;
    }

    return null;
  }

  {
    /*Modal de loading enquanto processa upload*/
  }
  if (processing) {
    return (
      <Dialog open fullWidth maxWidth="xs">
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 6,
          }}
        >
          <CircularProgress />
          <Typography mt={2} variant="body1" align="center">
            Exportando dados, aguarde...
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  {
    /*Modal de resultado final*/
  }
  if (showResults) {
    return (
      <DialogPadronized
        open={true}
        onClose={handleCloseAll}
        maxWidth="md"
        title="Resultado da Importação"
        content={
          <Box sx={{ py: 1 }}>
            <Paper
              variant="outlined"
              sx={{
                maxHeight: 320,
                overflowY: 'auto',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: '#f8fafc',
                        fontWeight: 700,
                        color: '#374151',
                        borderBottom: '2px solid #e5e7eb',
                        fontSize: '0.875rem',
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: '#f8fafc',
                        fontWeight: 700,
                        color: '#374151',
                        borderBottom: '2px solid #e5e7eb',
                        fontSize: '0.875rem',
                      }}
                    >
                      Linha
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: '#f8fafc',
                        fontWeight: 700,
                        color: '#374151',
                        borderBottom: '2px solid #e5e7eb',
                        fontSize: '0.875rem',
                      }}
                    >
                      Nome
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: '#f8fafc',
                        fontWeight: 700,
                        color: '#374151',
                        borderBottom: '2px solid #e5e7eb',
                        fontSize: '0.875rem',
                      }}
                    >
                      Mensagem
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((r, i) => (
                    <TableRow
                      key={i}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: alpha('#f8fafc', 0.5),
                        },
                        '&:hover': {
                          backgroundColor: alpha('#1E4EC4', 0.05),
                        },
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.875rem', color: '#374151' }}>{r.id}</TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', color: '#374151' }}>{r.row}</TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', color: '#374151' }}>
                        {r.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: '0.875rem',
                          color: r.message.includes('sucesso') ? '#10b981' : '#ef4444',
                          fontWeight: 600,
                        }}
                      >
                        {r.message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            {/* Resumo dos Resultados */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
                p: 2,
                bgcolor: alpha('#1E4EC4', 0.05),
                borderRadius: 1,
                border: `1px solid ${alpha('#1E4EC4', 0.2)}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#1E4EC4',
                }}
              >
                Processamento concluído
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={`${results.filter((r) => r.message.includes('sucesso')).length} sucessos`}
                  size="small"
                  sx={{
                    bgcolor: '#10b981',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                {results.filter((r) => !r.message.includes('sucesso')).length > 0 && (
                  <Chip
                    label={`${results.filter((r) => !r.message.includes('sucesso')).length} erros`}
                    size="small"
                    sx={{
                      bgcolor: '#ef4444',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        }
        actions={
          <Button
            onClick={handleCloseAll}
            variant="contained"
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
              transition: 'all 0.2s ease',
            }}
          >
            Fechar
          </Button>
        }
      />
    );
  }

  {
    /*Modal de upload + prévia*/
  }
  return (
    <DialogPadronized
      open={true}
      onClose={onClose}
      maxWidth="sm"
      title={title}
      content={
        !showPreview ? (
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}
            >
              <CloudUploadIcon sx={{ fontSize: 40, color: '#1E4EC4' }} />

              {/* Planilha de Modelo */}
              <Button
                onClick={handleDownloadTemplate}
                variant="outlined"
                startIcon={<GetAppIcon />}
                sx={{
                  borderColor: '#f59e0b',
                  color: '#f59e0b',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#d97706',
                    bgcolor: alpha('#f59e0b', 0.05),
                  },
                }}
              >
                Baixar Planilha Modelo
              </Button>

              {/* Guia de Instruções e Formatos */}
              <Box
                sx={{
                  p: 2.5,
                  bgcolor: alpha('#1E4EC4', 0.05),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#1E4EC4', 0.2)}`,
                  mb: 2,
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#1E4EC4',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <InfoIcon sx={{ fontSize: 16 }} />
                  Como importar
                </Typography>

                {/* Instruções */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: '#1E4EC4', minWidth: 20 }}
                    >
                      1.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6, flex: 1 }}>
                      Baixe a planilha modelo acima
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: '#1E4EC4', minWidth: 20 }}
                    >
                      2.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6, flex: 1 }}>
                      Preencha os dados respeitando as colunas
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: '#1E4EC4', minWidth: 20 }}
                    >
                      3.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6, flex: 1 }}>
                      Exporte como CSV UTF-8 usando:
                    </Typography>
                  </Box>

                  {/* Formatos Suportados */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 4.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label="✓"
                        size="small"
                        sx={{
                          bgcolor: '#10b981',
                          color: 'white',
                          fontSize: '0.65rem',
                          height: 20,
                          minWidth: 20,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
                        Excel 2019+
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                        → Salvar como → CSV UTF-8
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label="✓"
                        size="small"
                        sx={{
                          bgcolor: '#10b981',
                          color: 'white',
                          fontSize: '0.65rem',
                          height: 20,
                          minWidth: 20,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
                        Google Sheets
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                        → Arquivo → Baixar → Valores separados por vírgulas (.csv)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Seleção de Arquivo */}
              <Box
                onClick={handleBoxClick}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                  width: '100%',
                  position: 'relative',
                  cursor: 'pointer',
                  border: `2px dashed ${isDragOver ? '#1E4EC4' : file ? '#10b981' : '#d1d5db'}`,
                  borderRadius: 2,
                  bgcolor: isDragOver
                    ? alpha('#1E4EC4', 0.08)
                    : file
                      ? alpha('#10b981', 0.05)
                      : alpha('#f9fafb', 0.5),
                  py: 4,
                  px: 3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  '&:hover': {
                    borderColor: file ? '#10b981' : '#1E4EC4',
                    bgcolor: file ? alpha('#10b981', 0.08) : alpha('#1E4EC4', 0.05),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(file ? '#10b981' : '#1E4EC4', 0.15)}`,
                  },
                }}
              >
                <input
                  id="csv-file-input"
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleFileChange}
                />

                {isDragOver ? (
                  <>
                    <CloudUploadIcon
                      sx={{
                        fontSize: 48,
                        color: '#1E4EC4',
                        animation: 'pulse 1.5s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
                        },
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: '#1E4EC4', textAlign: 'center' }}
                    >
                      Solte o arquivo aqui
                    </Typography>
                  </>
                ) : file ? (
                  <>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: alpha('#10b981', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CloudUploadIcon sx={{ fontSize: 32, color: '#10b981' }} />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#111827',
                          mb: 0.5,
                          wordBreak: 'break-all',
                        }}
                      >
                        {file.name}
                      </Typography>
                      <Chip
                        label="Arquivo carregado"
                        size="small"
                        icon={
                          <Box component="span" sx={{ fontSize: '0.75rem' }}>
                            ✓
                          </Box>
                        }
                        sx={{
                          bgcolor: '#10b981',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          height: 24,
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: alpha('#1E4EC4', 0.08),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <CloudUploadIcon sx={{ fontSize: 32, color: '#1E4EC4' }} />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: '#374151',
                          mb: 0.5,
                        }}
                      >
                        Clique para selecionar arquivo
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.875rem',
                          color: '#9ca3af',
                        }}
                      >
                        ou arraste e solte aqui
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        mt: 0.5,
                      }}
                    >
                      Apenas arquivos CSV
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ py: 1 }}>
            {/* Cabeçalho da Prévia */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#111827',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 20, color: '#1E4EC4' }} />
                Prévia dos Dados
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  mb: 2,
                }}
              >
                Verifique se os dados estão corretos antes de prosseguir com o envio.
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Box>

            {/* Tabela */}
            <Paper
              variant="outlined"
              sx={{
                maxHeight: 280,
                overflowY: 'auto',
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {Object.keys(parsedData[0] || {}).map((key) => (
                      <TableCell
                        key={key}
                        sx={{
                          backgroundColor: '#f8fafc',
                          fontWeight: 700,
                          color: '#374151',
                          textTransform: 'capitalize',
                          borderBottom: '2px solid #e5e7eb',
                          fontSize: '0.875rem',
                        }}
                      >
                        {translateToPortuguese(key)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parsedData.map((row, i) => (
                    <TableRow
                      key={i}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: alpha('#f8fafc', 0.5),
                        },
                        '&:hover': {
                          backgroundColor: alpha('#1E4EC4', 0.05),
                        },
                      }}
                    >
                      {Object.values(row as any).map((value, j) => (
                        <TableCell
                          key={j}
                          sx={{
                            fontSize: '0.875rem',
                            color: '#374151',
                          }}
                        >
                          {String(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            {/* Informações do Resumo */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                bgcolor: alpha('#10b981', 0.05),
                borderRadius: 1,
                border: `1px solid ${alpha('#10b981', 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon sx={{ fontSize: 18, color: '#10b981' }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#065f46',
                  }}
                >
                  Arquivo processado com sucesso
                </Typography>
              </Box>
              <Chip
                label={`${parsedData.length} registros`}
                size="small"
                sx={{
                  bgcolor: '#10b981',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
        )
      }
      actions={
        !showPreview ? (
          <>
            <Button
              onClick={onClose}
              color="inherit"
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
              onClick={handlePreview}
              disabled={!file || loading}
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                bgcolor: '#1E4EC4',
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 1.5,
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(30, 78, 196, 0.25)',
                cursor: !file || loading ? 'not-allowed' : 'pointer',
                '&:hover': {
                  bgcolor: '#1640a8',
                  boxShadow: '0 4px 12px rgba(30, 78, 196, 0.35)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? 'Processando' : 'Pré-visualizar'}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setShowPreview(false)}
              color="inherit"
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
              Voltar
            </Button>
            <Button
              onClick={handleUpload}
              variant="contained"
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
              Enviar
            </Button>
          </>
        )
      }
    />
  );
}
