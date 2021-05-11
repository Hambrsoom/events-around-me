import { Grid, Avatar, Button, makeStyles, TextField, createStyles, Theme, Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import useStyle from './FormStyling';
import { useForm, Form } from '../../form/UseForm';
import Controls from '../../controls/Controls';
import { gql, useMutation, useQuery } from '@apollo/client';
import { LoginUserInput } from "../../../models/User";

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

export default function SignInForm({ onClickCancelHandle }: any) {
  const classes = useStyle();

  const {values, setValues, handleInputChange} = useForm(initialFormValues)
  const [login, {data}] = useMutation(SIGN_IN_MUTATION);

  const onClickSubmitHandle = async()=>{
    console.log(values.username);

    const user: LoginUserInput = {
      password: values.password,
      username: values.username
    }
    
    const response = await login({ variables: {
      user: user
    }});

    localStorage.setItem('accessToken', response.data.login.accessToken);
    localStorage.setItem('refreshToken', response.data.login.accessToken);

  }

  return(
    <div className={classes.paper}>
      <Paper>

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
          <div>
              <Controls.Button 
                color="default"
                text="Cancel"
                onClick={onClickCancelHandle}
              />
              <Controls.Button  
                  type="submit"
                  color="primary"
                  onClick={onClickSubmitHandle}
                  text="Submit"
              />
              <Typography > Need an account?
                  <Link href="#">
                        Sign Up 
                  </Link>
              </Typography>
          </div>
        </Form>
      </Paper>
    </div>
  )
}