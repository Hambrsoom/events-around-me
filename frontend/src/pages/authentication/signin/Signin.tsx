import { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Controls from '../../../components/controls/Controls';
import { useForm, Form } from '../../../components/form/UseForm';
import { LoginUserInput } from '../../../models/User.Model';
import { gql, useMutation } from '@apollo/client';
import { Severity } from '../../../models/ErrorNotification';
import useStyles from '../AuthenticationStyling';
import SnackBar from '../../../components/snackbar/SnackBar';
import { signinMutation } from '../../../graphql/Authentication.graphql';
import { useHistory } from 'react-router';

const initialFormValues = {
    username: '',
    email: '',
    password: ''
}
  
const SIGN_IN_MUTATION = signinMutation();

export default function SignIn() {
  const classes = useStyles();
  const {values, setValues, handleInputChange} = useForm(initialFormValues)
  const [login, {data}] = useMutation(SIGN_IN_MUTATION);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const onClickSubmitHandle = async(e:any)=> {
    e.preventDefault();
    const user: LoginUserInput = {
      password: values.password,
      username: values.username
    }
  
    if(user.username !== '' && user.password !== ''){
      try{
        const response = await login({ variables: {
          user: user
        }});

        localStorage.setItem('accessToken', response.data.login.accessToken);
        localStorage.setItem('refreshToken', response.data.login.refreshToken);
        history.replace('dashboard');
      } catch(err) {
          setErrorMessage(err.message);
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
            type="password"
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
      { errorMessage !== ''  && (
        <SnackBar
          severity={Severity.Error}
          message={errorMessage}
        />
      )}
    </Container>
  );
  }