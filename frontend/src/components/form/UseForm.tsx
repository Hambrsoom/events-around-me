import { useState } from 'react';
import useStyles from './FormStyling';

export function useForm(initialFormValues: any) {
    const [values, setValues] = useState(initialFormValues);

    function handleInputChange(nameParameter: string, valueParmeter:any) {
        const name: string = nameParameter;
        const value: any = valueParmeter;

        setValues({
          ...values,
          [name]: value
        })
    }

    return{
        values,
        setValues,
        handleInputChange
    }
}

export function Form(props: any) {
    const classes = useStyles();
    return (
        <form className ={classes.root}>
            {props.children}
        </form>
    )
}
