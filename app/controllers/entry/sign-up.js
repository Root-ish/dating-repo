const express = require('express')
const mongoose = require("mongoose");
const User = require("../../models/User");
const session = require('express-session')

require('dotenv').config()

// Sign-up form

function signup(req, res) {
  res.render('sign-up.ejs')
};

// Post sign-up form

function signform(req, res, next) {
  const { username, password, firstName, lastName } = req.body
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    beers: []
  });

  User.create(newUser);

  setSession();

  function setSession(error) {
    if (error) {
        next(error);
    } else {
      const {username, firstName, lastName} = req.body;
        req.session.user = {
          username: username,
          firstName: firstName,
          lastName: lastName,
          beers: []
        };
      }
  }

  res.redirect('/')
};

module.exports = {
  signup,
  signform
};
