import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CssBaseline from '@material-ui/core/CssBaseline';

/** Local Imports */
import './Navbar.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    maxWidth: 160,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export function Navbar() {
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let AuthButton, MemberArea, ExecutiveArea;

   if (isLoggedIn) {
      AuthButton = <Link className="item-nav" to="/Logout">    Logout</Link>;
      MemberArea = <Link className="item-nav" to="/MemberArea">MemberArea</Link>;
    } else {
      AuthButton = <Link className="item-nav" to="/Login">     Login</Link>;
    }
  return (
    <div className={classes.root}>
      <AppBar position="static">
      <CssBaseline />
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <img src='logo.png' alt="logo" className={classes.logo}></img>
          <Link className="item-nav" to="/">         Home</Link>
          <Link className="item-nav" to="/AboutUs">  About Us</Link>
          <Link className="item-nav" to="/Events">   Events</Link>
          <Link className="item-nav" to="/News">     News</Link>
          <Link className="item-nav" to="/Resources">Resources</Link>
          {MemberArea}
          {AuthButton}
        </Toolbar>
      </AppBar>
    </div>
  );
};