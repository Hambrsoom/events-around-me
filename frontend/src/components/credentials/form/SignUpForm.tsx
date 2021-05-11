import { Grid, Avatar, Button, makeStyles, TextField, createStyles, Theme, Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import useStyle from './FormStyling';
import { useForm, Form } from '../../form/UseForm';
import Controls from '../../controls/Controls';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useHistory } from "react-router";
import { RegisterUserInput } from '../../../models/User';

const initialFormValues = {
  username: '',
  email: '',
  password: ''
}

const SIGNUP_MUTATION = gql`
mutation registerRegularUser($user: RegisterUserInput!) {
  registerRegularUser(user: $user)
}`

export default function SignUpForm({ onClickCancelHandle }: any) {
  const history = useHistory();
  const classes = useStyle();
  const {values, setValues, handleInputChange} = useForm(initialFormValues)

  const [signup] = useMutation(SIGNUP_MUTATION);


  const onClickSubmitHandle = async() =>{
    console.log(values.username);
    const user: RegisterUserInput = {
      username: values.username,
      password: values.password
    }
    const response = await signup({
      variables: {
        user: user
      }
    })
  }

  return(
    <div className={classes.paper}>
      <Paper>
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
            name="email"
            label="Email"
            value={values.email}
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
                    text="Sign Up"
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