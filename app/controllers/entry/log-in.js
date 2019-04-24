const express = require('express')
const mongoose = require("mongoose");
const User = require("../../models/User");
const session = require('express-session')

require('dotenv').config()

// Log-in form

function login(req, res) {
  res.render('log-in.ejs')
}

async function logform(req, res) {
  try {
    const { username, password } = req.body

    await User.findOne({
        username: username
      }, (err, data) => {
        if (err) console.log(err);

        if (data.password === password) {

          req.session.user = {
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            beers: data.beers
          };
          res.redirect('/')

        } else {
          console.log("Wrong password");
        }
    });
  }  catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  logform
};
