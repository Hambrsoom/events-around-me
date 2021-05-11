import React, {useRef} from 'react';
import Dialog from '@material-ui/core/Dialog';
import SignInForm from './form/SignInForm';
import SignUpForm from './form/SignUpForm';

export const ModalDialog = ({ openSignIn, openSignUp, onClickCancelHandle }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  console.log(openSignIn)
  return (
    <div ref={ref}>
      <Dialog open={openSignIn}>
        <SignInForm onClickCancelHandle={onClickCancelHandle}/>
      </Dialog>
      <Dialog open={openSignUp}>
        <SignUpForm onClickCancelHandle={onClickCancelHandle}/>
      </Dialog>
    </div>
    
  );
};