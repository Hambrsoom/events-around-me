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


  onClickCancelHandle = () => {
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
        <ModalDialog openSignIn={this.state.openSignIn} openSignUp = {this.state.openSignUp} onClickCancelHandle={this.onClickCancelHandle} isSignIn={this.state.OpenSignIn}/>
      </div>
    );
  }
}

export default withStyles(styles)(SignUpOrIn);