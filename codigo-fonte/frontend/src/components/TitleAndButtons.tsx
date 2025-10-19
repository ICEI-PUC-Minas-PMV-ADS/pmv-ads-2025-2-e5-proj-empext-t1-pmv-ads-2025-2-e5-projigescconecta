import { Box, Typography, Stack, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface TitleAndButtonsProps {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  onImportCsv?: () => void;
  importLabel?: string;
  onExportCsv?: () => void;
  exportLabel?: string;
}

const TitleAndButtons = ({
  title,
  onAdd,
  addLabel,
  onImportCsv,
  importLabel,
  onExportCsv,
  exportLabel,
}: TitleAndButtonsProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: { xs: 'flex-start', sm: 'center' },
      justifyContent: 'space-between',
      mb: { xs: 3, sm: 4 },
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 2, sm: 0 },
    }}
  >
    <Typography
      variant="h4"
      sx={{
        color: '#1a1a2e',
        fontWeight: 700,
        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
        letterSpacing: '-0.5px',
      }}
    >
      {title}
    </Typography>
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{ width: { xs: '100%', sm: 'auto' } }}
    >
      {onAdd && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{
            bgcolor: '#1E4EC4',
            color: 'white',
            fontWeight: 600,
            px: { xs: 2, sm: 3 },
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(30, 78, 196, 0.3)',
            '&:hover': {
              bgcolor: '#1640a8',
              boxShadow: '0 6px 16px rgba(30, 78, 196, 0.4)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {addLabel}
        </Button>
      )}
      {onImportCsv && (
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={onImportCsv}
          sx={{
            bgcolor: '#3B82F6',
            color: 'white',
            fontWeight: 600,
            px: { xs: 2, sm: 3 },
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              bgcolor: '#0062ff',
              boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {importLabel}
        </Button>
      )}
      {onExportCsv && (
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={onExportCsv}
          sx={{
            bgcolor: '#F59E0B',
            color: 'white',
            fontWeight: 600,
            px: { xs: 2, sm: 3 },
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            '&:hover': {
              bgcolor: '#e49000',
              boxShadow: '0 6px 16px rgba(245, 158, 11, 0.4)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {exportLabel}
        </Button>
      )}
    </Stack>
  </Box>
);

export default TitleAndButtons;
