const express = require("express");
const Router = express.Router();
const sqlConnection = require('../lib/db');
const bcrypt = require('bcrypt');

/** Check user email and password */
Router.get("/:email&:password", (req, res) => {
  const email = req.params.email;
  const password = req.params.password;

  console.log(email);
  console.log(password);

  const queryString = `
  SELECT id, password, type FROM users
  WHERE email = '${email}';`;

  console.log(queryString);

  sqlConnection.query(queryString, (err, row, fields) => {
    if (err) {
      res.send(err);
      console.log("Error retrieving users data!!!");
    } else {
      /** verify password else send back error */
      console.log(row[0].password, password);
      const passwordFromDB = row[0].password;
      if(passwordFromDB !== password) {
        res.send('invalid password');
      } else {
        res.send(row);
      }
    };
  });
});

Router.get("/:email", (req, res) => {
  const email = req.params.email;
  const queryString = `
  SELECT id, password, type FROM users
  WHERE email = '${email}';`;
  sqlConnection.query(queryString, (err, row, fields) => {
    if (err) {
      res.send(err);
      console.log("Error retrieving users data!!!");
    } else {
      res.send(row)
    }
  });
});

Router.put("/:email&:password", (req, res) => {
  const password = bcrypt.hashSync(req.body.password, 10);

});
module.exports = Router;