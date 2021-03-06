import React from 'react'

/** Material UI imports */
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";

/** Local Imports */
import useApplicationData from '../../../hooks/useApplicationData';

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

export function ChangePassword() {
  const classes = useStyles();
  const { state, setCurrPassword, setNewPassword, setNewPasswordConfirmation, changePassword } = useApplicationData();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {state.errors? 
          <div className={classes.root}>
            <Chip
              className={classes.smallOverlay}
              icon={<FaceIcon />}
              label={state.errorText}
              color={state.errorBarColor}
            />
          </div>
          : <></>}
        <form className={classes.form} validate='true'>
          <TextField 
            variant="outlined" 
            margin="normal" 
            required fullWidth 
            name="currPassword"
            label="Current Password" 
            type="password" 
            id="currPassword"
            value={state.currPassword}
            autoFocus 
            onChange={setCurrPassword}/>
          <TextField 
            variant="outlined" 
            margin="normal" 
            required fullWidth 
            name="newPassword"
            label="New Password" 
            type="password" 
            id="newPassword"
            value={state.newPassword}
            onChange={setNewPassword}/>
          <TextField 
            variant="outlined" 
            margin="normal" 
            required fullWidth 
            name="newPasswordConfirmation"
            label="New Password Confirmation" 
            type="password"
            id="newPasswordConfirmation"
            value={state.newPasswordConfirmation}
            onChange={setNewPasswordConfirmation}/>
          <Button 
            type="submit" 
            fullWidth variant="contained" 
            color="primary" 
            className={classes.submit}
            onClick={(event) => {changePassword(event)}}>
            Submit
          </Button>
        </form>
      </div>      
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
};