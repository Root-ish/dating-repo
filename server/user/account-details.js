const express = require('express')
const mongo = require('mongodb')
const session = require('express-session')
const account = express.Router()
const accountform = express.Router()
const multer = require('multer')
const upload = multer({
  dest: __dirname + '../../assets/upload/'
})

require('dotenv').config()

let db = null
let url = process.env.DataBase

mongo.MongoClient.connect(url, {
  useNewUrlParser: true
}, function(err, client) {
  if (err) throw err
  db = client.db(process.env.DB_NAME)
})

// Get account details

account.get('/user/:id', (req, res, next) => {
  const id = req.params.id
  if (id.length == 12 || id.length == 24) {

    db.collection('drinkers').findOne({
      _id: mongo.ObjectID(id)
    }, done)

    function done(err, user) {
      if (err) {
        next(err)
        res.redirect('/');
      } else {
        res.render('account.ejs', {
          user: user
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
      $set: {
        name: req.body.name,
        profilePhoto: req.file ? req.file.filename : null,
      }
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
