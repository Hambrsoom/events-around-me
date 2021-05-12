import { Grid, Modal } from '@material-ui/core';
import React from 'react'
import Controls from '../../../controls/Controls';
import { Form, useForm } from '../../../form/UseForm';
import useStyles from './EventModalStyling';
import { Address } from '../../../../models/Address.Model';
import { gql, useMutation } from '@apollo/client';
import AlertNotifcation from '../../../alert/Alert';
import { Severity } from '../../../../models/ErrorNotification';
import jwt_decode from "jwt-decode";

const initialFormValues = {
    title: '',
    url: '',
    date: '',
    street: '',
    postalCode: '',
}


const ADD_EVENT = gql`mutation addEvent($event: EventInput!){
    addEvent(event: $event){
      title
    }
}`
  

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



export default function Temp({open, handleClose}:any) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const {values, setValues, handleInputChange} = useForm(initialFormValues)
    const [addEvent] = useMutation(ADD_EVENT);


    const onClickSubmitHandle = async(e: { preventDefault: () => void; }) => {
        e. preventDefault() 
        const token: string = localStorage.getItem('accessToken') || '';
        console.log(token);
        const decodedToken = (jwt_decode<any>(token))['userId'];
        console.log(decodedToken); 
        const response = await addEvent({ variables: {
            event: {
                title: values.title,
                url: values.url,
                description: values.description,
                date: values.date,
                address: {
                    street: values.street,
                    postalCode: values.postalCode
                }
            }
            },
            context: {
                userId: decodedToken,
                jwt: token
            },

    });
    console.log(response);
    //jwt_decode(localStorage.getItem('accessToken'))['userId']
        if(response.errors){
            <AlertNotifcation
            message={response.errors[0].message}
            severity={Severity.Error}/>
        } else {
            
        }
    }

    const body = (
            <div style={modalStyle} className={classes.paper}>
                
            </div>
    );

    return (
        <Form>
                    <Grid container>
                        <Grid item xs={6}>
                            <Controls.Input
                                name="title"
                                label="Title"
                                value={values.title}
                                onChange={handleInputChange}
                                autoFocus
                                required/>
                            <Controls.Input
                                name="url"
                                label="Url"
                                value={values.url}
                                onChange={handleInputChange}
                                required/>
                            <Controls.Input
                                name="description"
                                label="Description"
                                value={values.description}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                required/>
                            
                        </Grid>
                        <Grid item xs={6}>
                            <Controls.Input
                                name="date"
                                label="Date"
                                value={values.date}
                                onChange={handleInputChange}
                                type="datetime-local"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required/>
                            <Controls.Input
                                name="street"
                                label="Street"
                                value={values.street}
                                onChange={handleInputChange}
                                required/>
                            <Controls.Input
                                name="postalCode"
                                label="Postal Code"
                                value={values.postalCode}
                                onChange={handleInputChange}
                                required/>
                        </Grid>
                    
                    </Grid>
                    <Controls.Button  
                            type="submit"
                            color="primary"
                            onClick={onClickSubmitHandle}
                            text="Submit"
                    />
                </Form>
    )
}
