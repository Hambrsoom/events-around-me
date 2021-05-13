import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import ImageGallery from '../../components/imageGallery/ImageGallery'
import { gql, useQuery } from '@apollo/client';
import { Severity } from '../../models/ErrorNotification';
import Box from '@material-ui/core/Box';
import { Grid, Typography } from '@material-ui/core';
import useStyles from './eventStyling';
import { Event as EventModel } from '../../models/Event.Model';
import Button from '../../components/controls/Button';
import UploadImage from '../../components/uploadImage/UploadImage';
import SnackBar from '../../components/snackbar/SnackBar';
import { getEventById } from '../../graphql/Event.graphql';
import Loading from '../../components/loading/Loading';

type Props = RouteComponentProps & {
    match: {
      isExact: boolean;
      params: {
        id: string;
      };
    };
};



export default function Event(props: Props) {
    const eventId = props.match.params.id; 
    const classes = useStyles();
    const GET_EVENT_BY_ID = getEventById(eventId);

    const {loading, error, data} = useQuery(GET_EVENT_BY_ID);
    const [openUploadImageModal, setOpenUploadImageModal] = useState(false);

    if(loading) return <Loading/>

    if(error) {
      return <SnackBar
        message={error.message}
        severity={Severity.Error}/>
    }

    const event: EventModel = data.getEventById;

    const handleCloseUploadImageModal = () => {
        setOpenUploadImageModal(false);
    }

    return (
        <div>
            <ImageGallery images={event.images}/>
            <div style={{ width: '100%' }}>
                <Grid container>
                    <Grid item xs={8}>
                        <Box component="span" display="block" p={1} m={1} className={classes.box}>
                            <h1> Description </h1>
                            {event.description}
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box component="span" display="block" p={1} m={1} className={classes.box}>
                            <h1> Address </h1>
                            <Typography>{event.address.street}, {event.address.province}, {event.address.country}</Typography>
                            <Typography>{event.address.postalCode}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </div>
            <Button
                text="Upload Image"
                onClick={()=>setOpenUploadImageModal(true)}
            />
            <UploadImage 
                eventId={eventId}
                open={openUploadImageModal} 
                handleClose={handleCloseUploadImageModal} />
        </div>
    )
}
