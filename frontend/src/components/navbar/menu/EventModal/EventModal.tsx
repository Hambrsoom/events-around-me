import { Grid } from '@material-ui/core';
import Controls from '../../../controls/Controls';
import { Form, useForm } from '../../../form/UseForm';
import { useMutation } from '@apollo/client';
import SnackBar from '../../../snackbar/SnackBar';
import { Severity } from '../../../../models/ErrorNotification';
import MyModal from '../../../modal/MyModal';
import { addEventMutation } from '../../../../graphql/Event.graphql';

const initialFormValues = {
    title: '',
    url: '',
    date: '',
    street: '',
    postalCode: '',
    description: '',
}

const ADD_EVENT = addEventMutation();
  
export default function EventModal({open, handleClose}:any) {
    const {values, setValues, handleInputChange} = useForm(initialFormValues)
    const [addEvent] = useMutation(ADD_EVENT);

    const onClickSubmitHandle = async() => {
        try{
            await addEvent({ variables: {
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
                }
            });
        } catch(err) {
            <SnackBar
                message={err.message}
                severity={Severity.Error}/>
        }
    }

    const body = (
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
    );

    return (
        <MyModal
            open={open}
            handleClose={handleClose}
        >
            {body}
        </MyModal>
    )
}
