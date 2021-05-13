import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from '@apollo/client';
import { uploadImageToEvent } from "../../graphql/Event.graphql";
import MyModal from "../modal/MyModal";

const UPLOAD_IMAGE = uploadImageToEvent();

interface Props {
    eventId: string
    open: boolean,
    handleClose: any
}

export default function UploadImage(props: Props) {
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
        <MyModal
            open={props.open}
            handleClose={props.handleClose}
        >
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag 'n' drop some files here, or click to select files</p>
                )}
            </div>
        </MyModal>
    );
}
