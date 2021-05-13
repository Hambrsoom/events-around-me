import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import useStyles from './NavBarStyling';
import { gql, useMutation } from '@apollo/client';
import SnackBar from '../../components/snackbar/SnackBar';
import { Severity } from '../../models/ErrorNotification';
import Controls from '../controls/Controls';
import MenuNavBar from './menu/Menu';
import Search from '../../pages/searchPage/Search';
import { logoutMutation } from '../../graphql/Authentication.graphql';

const LOGOUT = logoutMutation();

export default function NavBar() {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');

  const [logout] = useMutation(LOGOUT);

  const onClickLogoutHandle = async()=>{
    try{
      await logout({ variables: {
        accessToken: localStorage.getItem('accessToken')
      }});

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch(err) {
        <SnackBar
          message={err.message}
          severity={Severity.Error}/>
    }
  }

  const onSearchChange = (e: any) => {
    if(e.target.value !== '') {
      setSearchValue(e.target.value);
    } else {
      window.location.reload(false);
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <MenuNavBar></MenuNavBar>
          <Typography variant="h6" className={classes.title}>
            Events Around Me
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              name="Search"
              onChange = {(e)=>onSearchChange(e)}
            />
          </div>
          <Controls.Button
          color="primary"
          onClick={onClickLogoutHandle}
          text="Logout"/>
        </Toolbar>
      </AppBar>
      {searchValue && (
        <Search text={searchValue}/>
      )}
    </div>
  );
}