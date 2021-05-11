import { TextField } from '@material-ui/core';

export default function Input(props:any) {
    const {label, value, name, onChange, ...other} = props;

    return (
        <div>
            <TextField 
                label={label}
                value={value}
                name={name}
                onChange={e => onChange(e.target.name, e.target.value)}
                {...other}
                />
        </div>
    )
}
