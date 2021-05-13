import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import AlertNotifcation from './alert/Alert';
import { Severity } from '../../models/ErrorNotification';

interface Props {
    severity: Severity,
    message: string
}

export default function SnackBar(props: Props) {
  const [open, setOpen] = useState(true);
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <AlertNotifcation
            severity= {props.severity}
            message= {props.message}
        />
      </Snackbar>
  );
}