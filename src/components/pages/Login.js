/** React Imports */
import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useHistory } from 'react-router-dom';

/** Material UI imports */
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";

/** Local Imports */

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to='/'>Jain Society Of Calgary</Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export function Login() {
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(["name"]);
  const history = useHistory();
  const [state, setState] = useState({
    email:'',
    password: '',
    loginError: false,
  });
  const setEmail = (event) => {
    setState((prev) => ({
      ...prev,
      email: event.target.value,
    }));
  };

  const setPassword = (event) => {
    setState((prev) => ({
      ...prev,
      password: event.target.value,
    }));
  };

  const validateId = (event) => {
    event.preventDefault();
    console.log('Submitted');
    console.log(state.email);
    axios
      .get(`/users/${state.email}&${state.password}`)
      .then((res) => {
        console.log(res);
        if (res.data.length > 0) {
          const email = state.email;
          const type = res.data[0].type;
          setCookie("userLogged", { email, type }, { path: "/" });
          history.push('/');
          history.go(history.length - 1);
          window.location.reload();
          }
        else {
          setState((prev) => ({
            ...prev,
            loginError: true,
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const resetPassword = () => {
    console.log('Password Reset Function');
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {state.loginError? 
          <div className={classes.root}>
            <Chip
              className={classes.smallOverlay}
              icon={<FaceIcon />}
              label="Email / Password combination does not exist"
              color="secondary"
            />
          </div>
          : <></>}
        <form className={classes.form} validate='true'>
          <TextField 
            variant="outlined"
            margin="normal" 
            required fullWidth id="email" 
            type="email"
            label="Email Address" 
            name="email" 
            autoComplete="email" 
            autoFocus 
            onChange={setEmail}/>
          <TextField 
            variant="outlined" 
            margin="normal" 
            required fullWidth 
            name="password"
            label="Password" 
            type="password" 
            id="password" 
            autoComplete="current-password"
            onChange={setPassword}/>
          <Button 
            type="submit" 
            fullWidth variant="contained" 
            color="primary" 
            className={classes.submit}
            onClick={(event) => {validateId(event)}}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" onClick={resetPassword}>Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}