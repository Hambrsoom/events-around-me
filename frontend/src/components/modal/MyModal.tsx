import React from 'react'
import useStyles from './MyModalStyling';
import { Modal } from '@material-ui/core';

function rand() {
    return Math.round(Math.random() * 20) - 10;
}
  
function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


export default function MyModal(props:any) {
    const [modalStyle] = React.useState(getModalStyle);
    const classes = useStyles();

    return (
        <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                {props.children}
            </div>
        </Modal>
    )
}
