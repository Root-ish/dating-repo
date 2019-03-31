const express = require('express')
const mongo = require('mongodb')
const session = require('express-session')
const login = express.Router()
const logform = express.Router()

require('dotenv').config()

let db = null
let url = process.env.DataBase

mongo.MongoClient.connect(url, {
  useNewUrlParser: true
}, function(err, client) {
  if (err) throw err
  db = client.db(process.env.DB_NAME)
})

// Log-in form

login.get('/log-in', (req, res) => {
  res.render('log-in.ejs')
});

// Log-in Post

logform.post('/log-in', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  db.collection('drinkers').findOne({
    name: username
  }, done);

  function done(err, user) {
    if (err) {
      console.log(err);
    }
    if (user.password === password) {
      // console.log(user._id);
      req.session.user = user;
      res.redirect('/')
    } else {
      console.log("Wrong password");
    }
  }
});

module.exports = {
  login,
  logform
};
