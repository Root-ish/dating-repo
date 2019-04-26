const express = require('express')
const mongoose = require("mongoose");
const User = require("../../models/User");
const session = require('express-session')
const account = express.Router()
const accountform = express.Router()
const multer = require('multer')
const upload = multer({
  dest: __dirname + '../../assets/upload/'
})

require('dotenv').config()

// Get account details

account.get('/user/:id', (req, res, next) => {
  const id = req.params.id
  if (id.length == 12 || id.length == 24) {

    User.findOne({
      _id: req.session.user._id
    }, done)

    function done(err, user) {
      if (err) {
        next(err)
        res.redirect('/');
      } else {
        res.render('account.ejs', {
          user: user,
          matchList: ''
        })
      }
    }
  } else {
    res.redirect('/not-found');
  }
});


// Post for changing user name

accountform.post('/user/:id', upload.single('photo'), (req, res, next) => {

  if (req.session.user) {
    db.collection('drinkers').updateMany({
      _id: mongo.ObjectID(req.session.user._id)
    }, {
        name: req.body.name,
        profilePhoto: req.file ? req.file.filename : null,
    }, {
      upsert: true
    }, done)

    function done(err, data) {
      if (err) {
        next(err)
      } else {
        res.redirect('/');
      }
    }
  } else {}
});

module.exports = {
  account,
  accountform
};
