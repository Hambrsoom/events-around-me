import React, { Component, useState } from 'react';
import { ModalDialog } from './ModalDialog';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';



const styles = (theme: { spacing: (arg0: number) => any; }) => ({
  margin: {
    margin: theme.spacing(1),
  }
});


class SignUpOrIn extends Component<any, any> {
  
  constructor(props: any) {
    super(props);
    this.state = {
      openSignIn: false,
      openSignUp: false,
    };
  }


  handleClose = () => {
    this.setState({
      openSignIn: false,
      openSignUp: false
    });
  }

  handleOpenSignIn = () => {
    this.setState({
      openSignIn: true
    });
  }

  handleOpenSignUp = () => {
    this.setState({
      openSignUp: true
    });
  }

  handleSignInSubmit = (username: string, password: string) => {
    console.log(username);

    this.setState({
      openSignIn: false
    });
  }

  handleSignUpSubmit = (username: string, password: string) => {
    console.log(password);


    this.setState({
      openSignUp: false
    });
  }

  render(){
    const { classes }: any = this.props;
    return (
      <div>
        <div>
          <div>
            <Button variant="contained" color="primary" onClick={this.handleOpenSignIn} className={classes.margin}>
              Sign in
            </Button>
          </div>
          <div>
            <Button variant="contained" color="primary" onClick={this.handleOpenSignUp} className={classes.margin}>
              Sign up
            </Button>
          </div>
        </div>
        <ModalDialog open={this.state.openSignIn || this.state.openSignUp} handleClose={this.handleClose}  handleSubmit ={this.state.openSignIn ? this.handleSignInSubmit : this.handleSignUpSubmit}/>
      </div>
    );
  }
}

export default withStyles(styles)(SignUpOrIn);
