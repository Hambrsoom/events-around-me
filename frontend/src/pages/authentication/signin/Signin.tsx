import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Controls from '../../../components/controls/Controls';
import { useForm, Form } from '../../../components/form/UseForm';
import { LoginUserInput } from '../../../models/User.Model';
import { gql, useMutation } from '@apollo/client';
import AlertNotifcation from '../../../components/alert/Alert';
import { Severity } from '../../../models/ErrorNotification';
import useStyles from '../AuthenticationStyling';
import { ContactSupportOutlined } from '@material-ui/icons';

const initialFormValues = {
    username: '',
    email: '',
    password: ''
}
  
  const SIGN_IN_MUTATION = gql`
  mutation login($user: LoginUserInput!) {
    login(user: $user){
      accessToken
      refreshToken
    }
  }`

export default function SignIn() {
  const classes = useStyles();
  const {values, setValues, handleInputChange} = useForm(initialFormValues)
  const [login, {data}] = useMutation(SIGN_IN_MUTATION);

  const onClickSubmitHandle = async(e:any)=>{
      e.preventDefault();
        const user: LoginUserInput = {
          password: values.password,
          username: values.username
        }
    
        if(user.username !== '' && user.password !== ''){
            const response = await login({ variables: {
                user: user
            }});

            console.log(response);

            if(response.errors !== undefined){
                <AlertNotifcation
                message={response.errors[0].message}
                severity={Severity.Error}/>
            } else {
                localStorage.setItem('accessToken', response.data.login.accessToken);
                localStorage.setItem('refreshToken', response.data.login.refreshToken);
            }
        }
    }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Form>
          <Controls.Input
            name="username"
            label="Username"
            value={values.username}
            onChange={handleInputChange}
            autoFocus
            required/>
          <Controls.Input
            name="password"
            label="Password"
            value={values.password}
            onChange={handleInputChange}
            required
          />
        <Controls.Button  
                  type="submit"
                  color="primary"
                  onClick={onClickSubmitHandle}
                  text="Submit"
          />
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
        </Form>
      </div>
    </Container>
  );
  }