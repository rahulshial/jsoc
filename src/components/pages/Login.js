/** React Imports */
import React, { useEffect } from 'react';
import axios from 'axios';

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

/** Local Imports */
import useApplicationData from '../../hooks/useApplicationData';

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
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  passwordRules: {
    fontSize: '.8em',
    margin: '0',
  },
  class1: {
    backgroundColor: '#FF0000',
    color: '#FF0000',
  },
  class2: {
    backgroundColor: '#FFA500',
    color: '#FFA500',
  },
  class3: {
    backgroundColor: '#FFFF00',
    color: '#FFFF00',
  },
  class4: {
    backgroundColor: '#00FF00',
    color: '#00FF00',
  },
  class5: {
    backgroundColor: '#006400',
    color: '#006400',
  },
  gridContainer: {
    cursor: 'pointer',
  }
}));

export function Login() {
  const classes = useStyles();
  const passwordMeterColor = [`${classes.class1}`, `${classes.class2}`,`${classes.class3}`,`${classes.class4}`,`${classes.class5}`];
  const { state, setState, setEmail, setPassword, setPasswordConfirmation, changeState, processEvent, handleChange } = useApplicationData();

  useEffect(() => {
    if(window.location.pathname.toString().includes('activation')) {
      const activationData = window.location.pathname.split("/").pop().split(":");
      const activationDataObj = {
        email: activationData[0],
        activationToken: decodeURIComponent(activationData[1]),
        authToken: decodeURIComponent(activationData[2]),
      };
      axios
      .post('/users/activate', activationDataObj)
      .then((res) => {
        if(res.status === 200) {
          setState((prev) => ({
            ...prev,
            errorFlag: true,
            errorText: 'Account Activated, create a password!.',
            errorBarColor: 'primary',
            email: activationDataObj.email,
            functionState: 'createAccount',
            mainButtonText: 'Create Password',
            secondButtonText: '',
            thirdButtonText: '',
          }));
        }
      })
      .catch((error) => {
        console.log(error)
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {state.errorFlag? 
          <div className={classes.root}>
            {state.errorIcon}
            <Chip
              label={state.errorText}
              color={state.errorBarColor}
            />
          </div>
          : <></>}
        <form className={classes.form} validate='true'>
        {state.functionState !== 'createAccount'?
          <TextField 
            variant="outlined"
            margin="normal"
            required fullWidth id="email"
            type="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={setEmail}/>:<></>}
          {state.functionState === 'signIn'|| state.functionState === 'createAccount'?
            <TextField 
              variant="outlined" 
              margin="normal" 
              required fullWidth 
              name="password"
              label="Password" 
              type="password" 
              id="password" 
              autoComplete="current-password"
              onCopy={(event) => {handleChange(event)}}
              onChange={setPassword}/>
              : <></>}
          {state.functionState === 'createAccount'?
            <div>
              <TextField 
                variant="outlined" 
                margin="normal" 
                required fullWidth 
                name="passwordConfirmation"
                label="Password Confirmation" 
                type="password" 
                id="passwordConfirmation" 
                autoComplete=""
                onCopy={(event) => {handleChange(event)}}
                onPaste={(event) => {handleChange(event)}}
                onChange={setPasswordConfirmation}/>
                {state.password.length > 0? 
                  <div className={classes.passwordStrength}>
                    <Chip className={passwordMeterColor[state.passwordStrengthScore]}
                      size='small'
                      label='PASSWORD STRENGTH'
                    />
                    <b>   {state.passwordStrength}</b>
                  </div>
                  : <></>}
                <div className={classes.passwordRules}>
                  <p><b>Password Criteria:</b></p>
                  <ul>
                    <li>8 - 64 characters</li>
                    <li>Besides Uppercase & Lowercase letters,<br />
                        include at least one number and <br/>
                        one symbol !@#$%^&*+-=(){}[]?&lt;&gt;</li>
                    <li>Password is case sensitive</li>
                  </ul>
                </div>                         
            </div>
              : <></>}
          <Button 
            type="submit" 
            fullWidth variant="contained" 
            color="primary" 
            className={classes.submit}
            onClick={(event) => {processEvent(event)}}>
            {state.mainButtonText}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link 
                className={classes.gridContainer} 
                id="secondButton" 
                variant="body2" 
                onClick={changeState}>{state.secondButtonText}
              </Link>
            </Grid>
            <Grid item>
              <Link
                className={classes.gridContainer}
                id="thirdButton"
                variant="body2"
                onClick={changeState}>{state.thirdButtonText}
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
};