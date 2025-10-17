import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  alpha,
} from '@mui/material';

interface DialogPadronizedProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: ReactNode;
  actions: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

const DialogPadronized: React.FC<DialogPadronizedProps> = ({
  open,
  onClose,
  title,
  content,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          px: 2,
          py: 1.5,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: alpha('#1E4EC4', 0.03),
          borderBottom: '1px solid',
          borderColor: alpha('#1E4EC4', 0.1),
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 1 }}>{content}</DialogContent>

      <DialogActions
        sx={{
          pt: 2,
          borderTop: '1px solid',
          bgcolor: alpha('#1E4EC4', 0.03),
          borderColor: alpha('#1E4EC4', 0.1),
          gap: 1.5,
        }}
      >
        {actions}
      </DialogActions>
    </Dialog>
  );
};

export default DialogPadronized;