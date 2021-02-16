import { useState} from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useHistory } from 'react-router-dom';

export default function useApplicationData() {
  const [cookies, setCookie] = useCookies(["name"]);
  const history = useHistory();
  const [state, setState] = useState({
    email:'',
    password: '',
    passwordConfirmation: '',
    currPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
    errorFlag: false,
    errorText: '',
    mainButtonText: 'Sign In',
    functionState: 'signIn',
    secondButtonText: 'Forgot Password?',
    thirdButtonText: "Don't have an account? Sign Up",
    errorBarColor: 'secondary',
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

  const setPasswordConfirmation = (event) => {
    setState((prev) => ({
      ...prev,
      passwordConfirmation: event.target.value,
    }));
  };

  const setCurrPassword = (event) => {
    setState((prev) => ({
      ...prev,
      currPassword: event.target.value,
    }));
  };

  const setNewPassword = (event) => {
    setState((prev) => ({
      ...prev,
      newPassword: event.target.value,
    }));
  };

  const setNewPasswordConfirmation = (event) => {
    setState((prev) => ({
      ...prev,
      newPasswordConfirmation: event.target.value,
    }));
  };

  const changeState = (event) => {
    event.preventDefault();
    const buttonClicked = event.target.childNodes[0].parentElement.attributes[1].nodeValue;
    if(state.functionState === 'signIn' && buttonClicked === 'secondButton') {
      setState((prev) => ({
        ...prev,
        functionState: 'passwordReset',
        mainButtonText: 'Send Password Reset Email',
        secondButtonText: 'Sign In',
        thirdButtonText: "Don't have an account? Sign Up",
      }));
    } else if(state.functionState === 'passwordReset' && buttonClicked === 'secondButton') {
      setState((prev) => ({
        ...prev,
        functionState: 'signIn',
        mainButtonText: 'Sign In',
        secondButtonText: 'Forgot Password?',
        thirdButtonText: "Don't have an account? Sign Up",
      }));  
    } else if(buttonClicked === 'thirdButton') {
      setState((prev) => ({
        ...prev,
        functionState: 'signUp',
        mainButtonText: 'Create Account',
        secondButtonText: 'Sign In?',
        thirdButtonText: ''
      }));
    } else if(state.functionState === 'signUp' && buttonClicked === 'secondButton') {
      setState((prev) => ({
        ...prev,
        functionState: 'signIn',
        mainButtonText: 'Sign In',
        secondButtonText: 'Forgot Password?',
        thirdButtonText: "Don't have an account? Sign Up",
      }));
    };
  };

  const signInProcess = () => {
    const encodedPassword = encodeURIComponent(state.password);
    if (!state.email || !state.password){
      setState((prev) => ({
        ...prev,
        errorFlag: true,
        errorText: 'Email / Password cannot be blank!',
      }));
    } else {
      axios
      .get(`/users/${state.email}&${encodedPassword}`)
      .then((res) => {
        console.log('sign in process: ',res);
        if (res.status === 200) {
          const email = state.email;
          const type = res.data.rows[0].type;
          setCookie("userLogged", { email, type }, { path: "/" });
          history.push('/');
          history.go(history.length - 1);
          window.location.reload();
        } else if (res.status === 204 || res.status === 206) {
          setState((prev) => ({
            ...prev,
            errorFlag: true,
            errorText: 'Email / Password combination does not exist',
          }));
        };
      })
      .catch((error) => {
        console.log(error);
        setState((prev) => ({
          ...prev,
          errorFlag: true,
          errorText: 'Server Error. Please try again later!!!',
        }));
      });
    }
  };

  const passwordResetProcess = () => {
    axios
    .post(`/users/password-reset/${state.email}`)
    .then((res) => {
      if(res.status === 204) {
        setState((prev) => ({
          ...prev,
          errorFlag: true,
          errorText: 'User not found! Please check the email address entered!',
        }));
      } else if (res.status === 200) {
        setState((prev) => ({
          ...prev,
          errorFlag: true,
          errorText: 'Please check your email for password reset email!',
          errorBarColor: 'primary',
          functionState: 'signIn',
          mainButtonText: 'Sign In',
          secondButtonText: 'Forgot Password?',
          thirdButtonText: "Don't have an account? Sign Up",
        }));
      }
    })
    .catch((error) => {
      setState((prev) => ({
        ...prev,
        errorFlag: true,
        errorText: 'Server Error. Please try again later!',
      }));
    });
  };

  const signUpProcess = () => {
    if (!state.email || !state.password || !state.passwordConfirmation){
      setState((prev) => ({
        ...prev,
        errorFlag: true,
        errorText: 'Email / Password cannot be blank!',
      }));
    } else if (state.password !== state.passwordConfirmation) {
      setState((prev) => ({
        ...prev,
        errorFlag: true,
        errorText: 'Passwords do not match!',
      }));
    } else {
      axios
      .post(`/users/${state.email}&${state.password}`)
      .then((res) => {
        if(res.status === 201) {
          const email = state.email;
          const type = 'MEM';
          setCookie("userLogged", { email, type }, { path: "/" });
          history.push('/');
          history.go(history.length - 1);
          window.location.reload();  
        } else if(res.status === 200) {
          setState((prev) => ({
            ...prev,
            errorFlag: true,
            errorText: 'User Exists. Consider Sign In!!!',
          }));
        }
      })
      .catch((error) => {
        console.log(error);
        setState((prev) => ({
          ...prev,
          errorFlag: true,
          errorText: 'Server Error. Please try again later!!!',
        }));
      });
    }
  };

  const processEvent = (event) => {
    event.preventDefault();
    if(state.functionState === 'signIn') {
      signInProcess();
    } else if(state.functionState === 'passwordReset') {
      passwordResetProcess();
    } else if(state.functionState === 'signUp') {
      signUpProcess();
    }
  };

  const changePassword = (event) => {
    event.preventDefault();
    if (!state.currPassword || !state.newPassword || !state.newPasswordConfirmation){
      setState((prev) => ({
        ...prev,
        errorFlag: true,
        errorText: 'Password cannot be blank!',
      }));
    } else 
    if(Object.keys(cookies).length > 0 && 'userLogged' in cookies) {
      console.log(cookies.userLogged.email);
      setState((prev) => ({
        ...prev,
        email: cookies.userLogged.email,
      }));
      console.log(state);
      if (state.newPassword !== state.newPasswordConfirmation) {
        setState((prev) => ({
          ...prev,
          errorFlag: true,
          errorText: 'Passwords do not match, please enter matching passwords!'
        }));
      } else {
        /**send email, curr & new password to server to validate and update*/
        const currPassword = encodeURIComponent(state.currPassword);
        const newPassword = encodeURIComponent(state.newPassword);
        axios
        .post(`/users/changePassword/${cookies.userLogged.email}&${currPassword}&${newPassword}`)
        .then((res) => {
          console.log('change password res on update',res);
          let errorMessage = '';
          let errorBarColor = 'secondary'
            switch (res.status) {
              case 200:
                errorMessage = 'Password Change Success!';
                errorBarColor = 'primary';
                break;
              case 204:
                errorMessage = 'User not found!';
                break;
              case 206:
                errorMessage = 'Current Password does not match!';
                break;
              default:
                errorMessage = 'Unknown Error!';
                break;
              };
            setState((prev) => ({
              ...prev,
              currPassword: '',
              newPassword: '',
              newPasswordConfirmation: '',
              errors: true,
              errorText: errorMessage,
              errorBarColor: errorBarColor,
            }));
        })
        .catch((error) => {
          console.log(error);
        });
      }
    };
  };

  return {
    state,
    setEmail,
    setPassword,
    changeState,
    setPasswordConfirmation,
    processEvent,
    setCurrPassword,
    setNewPassword,
    setNewPasswordConfirmation,
    changePassword,
  };
};