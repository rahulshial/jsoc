const sqlConnection = require('../lib/db');
const nodemailer = require('nodemailer');

/** Global Declarations */
let  queryString = '';
let queryParams = [];

const initQueryVars = (queryString, queryParams) => {
  queryString = '';
  queryParams = [];
};

const generateRandomString = function(length) {
  let result             = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$^*()[]{}=|><;*';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const sendEmail = (type, email, token1, token2) => {
  let message = '';
  const transporter = 
    nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
      }
    });
    if (type === 'Reset') {
      message = {
        from: process.env.EMAIL_ACCOUNT,
        to: email,
        subject: 'Password Reset',
        html: `
        <h4><b>Jain Society of Calgary</b></h4> 
        <br /> 
        <p> Use the temporary password below to log into your account</p>
        <br />
        <p> This password will expire in 24 hours and can only be used once</p>
        ${token1} 
        <br /> 
        <p> Change your password after logging in using the above temporary password.</p>
        <br />
        <p>Please contact the system administrator at <a href='calgaryjains@gmail.com'>calgaryjains@gmail.com</a> if you have any issues.</p>
        <p>Jain Society Of Calgary</p>`
      };        
    } else if(type === 'Activation') {
      const activationToken = encodeURIComponent(token1);
      const authToken = encodeURIComponent(token2);
      const URL = `http://localhost:3000/activation/${email}:${activationToken}:${authToken}`
      message = {
        from: process.env.EMAIL_ACCOUNT,
        to: email,
        subject: 'JSOC - Activation Request',
        html: `
        <h4><b>Jain Society of Calgary</b></h4> 
        <br /> 
        <p> Click the link below to activate your JSOC Login Id</p>
        <br />
        <p> This link will expire in 24 hours and can only be used once</p>
        <br /> 
        <p>If the button above doesn’t work, paste this link into your web browser:</p>
        <p>${URL}</p>
        <p>Please contact the system administrator at <a href='calgaryjains@gmail.com'>calgaryjains@gmail.com</a> if you have any issues.</p>
        <p>Jain Society Of Calgary</p>`
      }; 
    };

    return new Promise(function(resolve, reject) {
      return transporter.sendMail(message, function(error, info) {
      if (error) {
        return reject(error)
      } else {
        return resolve(info);
      }  
    });
  });
};

const getUserByEmail = (email) => {
  initQueryVars(queryString, queryParams);
  queryParams = [email];
  queryString = `
  SELECT id, email, password, type FROM users
  WHERE email = ?;`;
  return new Promise(function(resolve, reject) {
    return sqlConnection.query(queryString, queryParams, (error, rows, fields) => {
      if(error) {
        return reject(error)
      }
      return resolve(rows);
    });
  });
};

const addNewUser = (email, password, type) => {
  initQueryVars(queryString, queryParams);
  queryParams = [email, password, type];
  queryString = `INSERT INTO users (email, password, type) VALUES (?, ?, ?);`;
  return new Promise(function(resolve, reject) {
    return sqlConnection.query(queryString, queryParams, (error, rows, fields) => {
      if(error) {
        return reject(error)
      }
      return resolve(rows);
    });  
  });
};

const updatePassword = (id, newPassword) => {
  initQueryVars(queryString, queryParams);
  queryParams = [newPassword, id];
  queryString = `UPDATE users SET password = ? WHERE id = ?;`;
  return new Promise(function(resolve, reject) {
    return sqlConnection.query(queryString, queryParams, (error, rows, fields) => {
      if(error) {
        return reject(error)
      }
      return resolve(rows);
    });  
  });
};

const createActivationRecord = (email, activation_token, auth_token) => {
  initQueryVars(queryString, queryParams);
  queryParams = [email, activation_token, auth_token];
  queryString = `INSERT INTO activation (email, activation_token, auth_token) VALUES (?, ?, ?);`;
  return new Promise(function(resolve, reject) {
    return sqlConnection.query(queryString, queryParams, (error, rows, fields) => {
      if(error) {
        return reject(error)
      }
      return resolve(rows);
    });  
  });
};

const getUserActivationRecord = (email) => {
  initQueryVars(queryString, queryParams);
  queryParams = [email];
  queryString = `
  SELECT id, email, activation_token, auth_token FROM activation
  WHERE email = ?;`;
  return new Promise(function(resolve, reject) {
    return sqlConnection.query(queryString, queryParams, (error, rows, fields) => {
      if(error) {
        return reject(error)
      }
      return resolve(rows);
    });
  });
};

const deleteUserActivationRecord = (email) => {
  initQueryVars(queryString, queryParams);
  queryParams = [email];
  queryString = `
  DELETE FROM activation WHERE email = ?;`;
  return new Promise(function(resolve, reject) {
    return sqlConnection.query(queryString, queryParams, (error, rows, fields) => {
      if(error) {
        return reject(error)
      }
      return resolve(rows);
    });
  });
};

const getEvents = () => {
  initQueryVars(queryString, queryParams);
  // const todayDate = new Date().toISOString().split('T')[0];
  const todayDate = '2021-01-01';
  queryParams = [todayDate];
  queryString = `
  SELECT id, title, description, venue, start_date AS 'date', end_date, TIME_FORMAT(start_time, "%h %i %p") AS 'from', TIME_FORMAT(end_time, "%h %i %p") AS 'to', rsvp_required FROM events
  WHERE start_date >= ?`
  return new Promise(function(resolve, reject) {
    return sqlConnection.query(queryString, queryParams, (error, rows, fields) => {
      if(error) {
        return reject(error)
      }
      return resolve(rows);
    });
  });
};

/** Module Exports */
module.exports = {
  generateRandomString,
  getUserByEmail,
  addNewUser,
  updatePassword,
  sendEmail,
  createActivationRecord,
  getUserActivationRecord,
  deleteUserActivationRecord,
  getEvents,
};