import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';

/**
 * Componente TitleAndButtons
 *
 * Exibe um título com botões de ação opcionais: Adicionar, Importar CSV e Exportar CSV.
 *
 * Uso básico:
 *
 * import TitleAndButtons from './TitleAndButtons';
 *
 * const handleAdd = () => {...};
 * const handleImportCsv = () => {...};
 * const handleExportCsv = () => {...};
 *
 * <TitleAndButtons
 *   title="Lista de Usuários"
 *   onAdd={handleAdd}           // botão "Adicionar" (opcional)
 *   onImportCsv={handleImportCsv} // botão "Importar CSV" (opcional)
 *   onExportCsv={handleExportCsv} // botão "Exportar CSV" (opcional)
 *   addLabel="Novo Usuário"       // rótulo personalizado (opcional)
 *   importLabel="Importar"        // rótulo personalizado (opcional)
 *   exportLabel="Exportar"        // rótulo personalizado (opcional)
 * />
 *
 * 🔹 Observações:
 * - Cada botão aparece apenas se a função correspondente for passada.
 * - Cores e ícones já estão pré-configurados: azul para importar, laranja para exportar, azul institucional para adicionar.
 */

type TitleAndButtonsProps = {
  title: string;
  onAdd?: () => void;
  onImportCsv?: () => void;
  onExportCsv?: () => void;
  addLabel?: string;
  importLabel?: string;
  exportLabel?: string;
};

const TitleAndButtons: React.FC<TitleAndButtonsProps> = ({
  title,
  onAdd,
  onImportCsv,
  onExportCsv,
  addLabel = 'Adicionar',
  importLabel = 'Importar CSV',
  exportLabel = 'Exportar CSV',
}) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
    <Typography
      variant="h4"
      gutterBottom
      sx={{
        color: '#264197',
        fontWeight: 700,
        fontSize: { xs: '2rem', sm: '2.5rem' },
        mb: { xs: 2, sm: 3 },
      }}
    >
      {title}
    </Typography>
    <Stack direction="row" spacing={2}>
      {onAdd && (
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={onAdd}>
          {addLabel}
        </Button>
      )}
      {onImportCsv && (
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={onImportCsv}
          sx={{ bgcolor: '#3B82F6', '&:hover': { bgcolor: '#0062ff' } }}
        >
          {importLabel}
        </Button>
      )}
      {onExportCsv && (
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={onExportCsv}
          sx={{ bgcolor: '#F59E0B', '&:hover': { bgcolor: '#e49000' } }}
        >
          {exportLabel}
        </Button>
      )}
    </Stack>
  </Box>
);

export default TitleAndButtons;
