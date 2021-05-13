import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { gql, useMutation } from '@apollo/client';
import { Modal } from '@material-ui/core';
import useStyles from './UploadImageModalStyling';
const UPLOAD_IMAGE = gql`
     mutation addImageToEvent($eventId: String!, $pictures:[Upload!]!){
        addImageToEvent(eventId: $eventId, pictures: $pictures)
    }`

interface Props {
    eventId: string
    open: boolean,
    handleClose: any
}

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

export default function UploadImage(props: Props) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [uploadImage] = useMutation(UPLOAD_IMAGE);
      const onDrop = useCallback(
        ([image]) => {
            uploadImage({ 
                variables: {
                    pictures: [image],
                    eventId: props.eventId } });
        },
        [uploadImage]
      );
      const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    
    return (
        <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag 'n' drop some files here, or click to select files</p>
                )}
                </div>
            </div>
            
        </Modal>
        
    );
}
