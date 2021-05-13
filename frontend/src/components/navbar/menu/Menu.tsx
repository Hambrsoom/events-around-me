import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import EventModal from './EventModal/EventModal';
import { useHistory } from 'react-router-dom';

export default function MenuNavBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  let history = useHistory();

  const [open, setOpen] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenCreateEventModal = () => {
    setOpen(true);
    setAnchorEl(null);
  }

  const handleCloseCreateEventModal = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleOpenRedirect = (path: string) => {
    history.replace(`${path}`);
    setAnchorEl(null);
  }

  return (
    <div>
        <IconButton edge="start" aria-controls="simple-menu" color="inherit" aria-label="menu" onClick={handleClick}>
            <MenuIcon />
        </IconButton>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={handleOpenCreateEventModal}>Create Event</MenuItem>
            <MenuItem onClick={() => handleOpenRedirect("/dashboard")}>Dashboard</MenuItem>
            <MenuItem onClick={() => handleOpenRedirect("/map")}>Map</MenuItem>
        </Menu>
        <EventModal open={open} handleClose={handleCloseCreateEventModal}></EventModal>
    </div>
  );
}