import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  highlightText?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  danger?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Confirmação',
  message,
  highlightText,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onClose,
  onConfirm,
  loading = false,
  danger = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: alpha('#1E4EC4', 0.03),
          borderBottom: '1px solid',
          borderColor: alpha('#1E4EC4', 0.1),
          py: 2.5,
          px: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 3, px: 3 }}>
        <Typography sx={{ color: '#444', fontSize: '0.95rem', marginTop: 2 }}>
          {message}
          {highlightText && (
            <>
              <br />
              <strong>{highlightText}</strong>
            </>
          )}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          borderTop: '1px solid',
          borderColor: alpha('#1E4EC4', 0.08),
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: alpha('#1E4EC4', 0.3),
            color: '#1E4EC4',
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            borderRadius: 2,
            '&:hover': {
              borderColor: '#1E4EC4',
              bgcolor: alpha('#1E4EC4', 0.05),
            },
          }}
        >
          {cancelLabel}
        </Button>

        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            bgcolor: danger ? '#D32F2F' : '#1E4EC4',
            color: 'white',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            '&:hover': {
              bgcolor: danger ? '#B71C1C' : '#1640a8',
              boxShadow: danger
                ? '0 4px 12px rgba(211, 47, 47, 0.35)'
                : '0 4px 12px rgba(30, 78, 196, 0.35)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? 'Aguarde...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
