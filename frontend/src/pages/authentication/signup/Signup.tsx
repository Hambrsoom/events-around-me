import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Controls from '../../../components/controls/Controls';
import { useForm, Form } from '../../../components/form/UseForm';
import { RegisterUserInput } from '../../../models/User.Model';
import { gql, useMutation } from '@apollo/client';
import useStyles from '../AuthenticationStyling';
import { signupMutation } from '../../../graphql/Authentication.graphql';

const initialFormValues = {
    username: '',
    email: '',
    password: ''
  }
  
const SIGNUP_MUTATION = signupMutation();


export default function SignIn() {
  const classes = useStyles();
  const {values, setValues, handleInputChange} = useForm(initialFormValues)
  const [signup] = useMutation(SIGNUP_MUTATION);

  const onClickSubmitHandle = async() =>{
    const user: RegisterUserInput = {
      username: values.username,
      password: values.password
    }

    await signup({
      variables: {
        user: user
      }
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
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
        </Form>
      </div>
    </Container>
  );
  }