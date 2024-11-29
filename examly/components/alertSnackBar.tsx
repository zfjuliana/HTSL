import React from 'react';
import { Snackbar, Alert } from '@mui/material';

type AlertSnackbarProps = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
  onClose: () => void;
};

const AlertSnackbar: React.FC<AlertSnackbarProps> = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
