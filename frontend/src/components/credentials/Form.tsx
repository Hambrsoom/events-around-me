import { Grid, Avatar, Button, makeStyles, TextField } from "@material-ui/core";
import React, { useState } from "react";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';


const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.dark,
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
      },

    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(2),
  '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '300px',
      },
  '& .MuiButtonBase-root': {
        margin: theme.spacing(2),
      },
    },
  }));

export default function Form({ handleClose, handleSubmit }: any) {
    const classes = useStyles();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit1 = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log(username)
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
