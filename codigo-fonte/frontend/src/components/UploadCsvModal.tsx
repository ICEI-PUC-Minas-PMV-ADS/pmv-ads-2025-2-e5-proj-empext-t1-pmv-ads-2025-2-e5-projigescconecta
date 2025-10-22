import React, { useState } from "react";
import { CsvService } from "@/services/csvService";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
} from "@mui/material";

interface UploadCsvModalProps<T> {
    title: string;
    onClose: () => void;
    apiCreate: (item: T) => Promise<any>;
    expectedHeaders: (keyof T)[];
    validateFields?: (item: T) => string | null;
    onFinish?: () => void;
}

interface UploadResult {
    row: number;
    id?: number;
    name?: string;
    message: string;
}

export function UploadCsvModal<T extends Record<string, any>>({ title, onClose, apiCreate, expectedHeaders, validateFields, onFinish }: UploadCsvModalProps<T>) {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [results, setResults] = useState<UploadResult[]>([]);
    const [processing, setProcessing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handlePreview = async () => {
        if (!file) return;

        setLoading(true);
        try {
            const data = await CsvService.parseCsvFile<T>(file);
            console.log(data)
            setParsedData(data);
            setShowPreview(true);
        } catch (error) {
            console.error("Erro ao processar CSV:", error);
            alert("Falha ao ler o arquivo CSV.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        setProcessing(true);

        const validationHeaderErros = validateCsvHeaders(parsedData, expectedHeaders)

        if (validationHeaderErros) {
            alert(validationHeaderErros);
            handleCloseAll();
            return;
        }

        const resultsList: UploadResult[] = [];
        let rowNumber = 2

        for (const item of parsedData) {
            try {
                if(validateFields){
                    const validationMessage = validateFields(item)
                    if(validationMessage){
                        resultsList.push({
                            row: rowNumber,
                            id: (item as any).id ?? "-",
                            name: (item as any).name ?? "-",
                            message: validationMessage,
                        });
                        rowNumber++
                        continue
                    }
                }

                const response = await apiCreate(item);
                console.log(response)
                resultsList.push({
                    row: rowNumber,
                    id: response.data?.id ?? "-",
                    name: response.data?.name ?? "-",
                    message: "Criado com sucesso",
                });
            } catch (error: any) {
                resultsList.push({
                    row: rowNumber,
                    id: (item as any).id ?? "-",
                    name: (item as any).name ?? "-",
                    message: error.response?.data || "Erro ao criar",
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
        if(onFinish) onFinish();
    };

    function validateCsvHeaders<T extends Record<string, any>>(
        parsedData: T[],
        expectedHeaders: (keyof T)[]): string | null {
        if (!parsedData || parsedData.length === 0) {
            return "O arquivo CSV está vazio ou inválido.";
        }

        const csvHeaders = Object.keys(parsedData[0]);
        const expected = expectedHeaders.map(String);

        const missing = expected.filter(h => !csvHeaders.includes(h));
        const extra = csvHeaders.filter(h => !expected.includes(h));

        if (missing.length > 0 || extra.length > 0) {
            return `As colunas do CSV não estão corretas.
            Esperado: [${expected.join(", ")}]
            Encontrado: [${csvHeaders.join(", ")}]`;
        }

        return null;
    }

    {/*Modal de loading enquanto processa upload*/}
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

    {/*Modal de resultado final*/}
    if (showResults) {
        return (
            <Dialog open onClose={handleCloseAll} fullWidth maxWidth="md">
                <DialogTitle>Resultado da Importação</DialogTitle>
                <DialogContent dividers>
                    <Paper>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Linha</TableCell>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Mensagem</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((r, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{r.id}</TableCell>
                                        <TableCell>{r.row}</TableCell>
                                        <TableCell>{r.name}</TableCell>
                                        <TableCell
                                            sx={{ color: r.message.includes('sucesso') ? 'green' : 'red' }}
                                        >
                                            {r.message}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAll} variant="contained" color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    {/*Modal de upload + prévia*/}
    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                {!showPreview ? (
                    <>
                        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
                            {file ? file.name : 'Selecionar arquivo CSV'}
                            <input
                                type="file"
                                accept=".csv"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="body2" mb={1}>
                            Prévia dos dados:
                        </Typography>
                        <Paper variant="outlined" sx={{ maxHeight: 240, overflowY: 'auto', mb: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {Object.keys(parsedData[0] || {}).map((key) => (
                                            <TableCell
                                                key={key}
                                                sx={{
                                                    backgroundColor: '#f3f4f6',
                                                    fontWeight: 'bold',
                                                    color: '#111827',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {key}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {parsedData.map((row, i) => (
                                        <TableRow key={i}>
                                            {Object.values(row as any).map((value, j) => (
                                                <TableCell key={j}>{String(value)}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                        <Typography variant="caption" display="block" textAlign="right" mb={2}>
                            Total de Registros: {parsedData.length}
                        </Typography>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {!showPreview ? (
                    <>
                        <Button onClick={onClose} color="inherit">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handlePreview}
                            disabled={!file || loading}
                            variant="contained"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {loading ? 'Processando' : 'Pré-visualizar'}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => setShowPreview(false)} color="inherit">
                            Voltar
                        </Button>
                        <Button onClick={handleUpload} variant="contained" color="success">
                            Enviar
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}
