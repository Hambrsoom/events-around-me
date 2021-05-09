import { Grid, Avatar, Button, makeStyles, TextField } from "@material-ui/core";
import React, { useState } from "react";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import formStyling from './formStyle';



export default function Form({ handleClose, handleSubmit }: any) {
    const classes = formStyling();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit1 = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        handleSubmit(username, password);
        handleClose();
    };

    return (
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography> 
            <form className={classes.root}>
                <TextField 
                    label = 'Username'
                    value = {username}
                    onChange = {e => setUsername(e.target.value)}
                    fullWidth
                    autoFocus
                    required />
                <TextField 
                    label="Password"
                    type="password"
                    value = {password}
                    onChange = {e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    fullWidth
                    required />
                <div>
                    <Button 
                        variant="contained"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button 
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick = {handleSubmit1}>
                        Signup
                    </Button>
                    <Typography > Need an account?
                        <Link href="#">
                             Sign Up 
                        </Link>
                    </Typography>
                </div>
            </form>
        </div>
    );
}
