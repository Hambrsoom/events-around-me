
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Form from './Form';

export const ModalDialog = ({ open, handleClose, handleSubmit }: any) => {
  return (
    <Dialog open={open} onClose={handleClose}>

      <Form handleClose={handleClose} handleSubmit = {handleSubmit} />
    </Dialog>
  );
};
