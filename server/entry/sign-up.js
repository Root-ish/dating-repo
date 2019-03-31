const express = require('express')
const mongo = require('mongodb')
const session = require('express-session')
const signup = express.Router()
const signform = express.Router()

require('dotenv').config()

let db = null
let url = process.env.DataBase

mongo.MongoClient.connect(url, {
  useNewUrlParser: true
}, function(err, client) {
  if (err) throw err
  db = client.db(process.env.DB_NAME)
})

// Sign-up form

signup.get('/sign-up', (req, res) => {
  res.render('sign-up.ejs')
});

// Post sign-up form

signform.post('/sign-up', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(400).send('Username or password are missing')
  }

  if (db.collection('drinkers').find({
      name: username
    }) === username) {
    return res.status(400).send('Username already exist')
  } else {
    db.collection('drinkers').insertOne({
      name: username,
      password: password
    }, done)

    function done(err, user) {
      if (err) {
        next(err)
      } else {
        req.session.user = user;
        res.redirect('/')
      }
    }
  }
});

module.exports = {
  signup,
  signform
};
