import React from 'react';
import { Typography, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import DialogPadronized from './DialogPadronized';

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
    <DialogPadronized
      open={open}
      onClose={onClose}
      maxWidth="xs"
      title={title}
      content={
        <Typography sx={{ color: '#444', fontSize: '0.95rem', marginTop: 2 }}>
          {message}
          {highlightText && (
            <>
              <br />
              <strong>{highlightText}</strong>
            </>
          )}
        </Typography>
      }
      actions={
        <>
          <Button
            onClick={onClose}
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
        </>
      }
    />
  );
};
