const express = require('express')
const bodyParser = require('body-parser')
const beerlist = require('./beers')
const find = require('array-find')
const router = express.Router()
const slug = require('slug')
const multer = require('multer')
const upload = multer({dest: 'assets/upload/'})
const mongo = require('mongodb')
let searchResults = [];

require('dotenv').config()

var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

mongo.MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
  if (err) throw err
  db = client.db(process.env.DB_NAME)
})

// get list with users

router.get('/', (req, res, next) => {
	db.collection('users').find().toArray(done)

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.render('home.ejs', {user: data, beers: beerlist})
    }
  }

});

// post new user details

router.post('/', (req, res, next) => {
	console.log(req.body.name);
	db.collection('users').insertOne({
    name: req.body.name,
    profileAbout: req.body.profileAbout,
    profilePhoto: req.file ? req.file.filename : null,
    description: req.body.description,
    beerProfile: req.body.beerProfile
  }, done)

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.redirect('/' + data.insertedId)
    }
  }
});

// Get form for new user details

router.get('/sign-up', (req, res) => {
  res.render('sign-up.ejs',  {searchResults})
});

// Delete user

router.delete('/:id', (req, res, next) => {
	var id = req.params.id

	db.collection('users').deleteOne({
    _id: new mongo.ObjectID(id)
  }, done)

  function done(err) {
    if (err) {
      next(err)
    } else {
      res.json({status: 'ok'})
    }
  }
});

// get user details

router.get('/:id', (req, res, next) => {
  var id = req.params.id

	db.collection('users').findOne({
	 _id: mongo.ObjectID(id)
 }, done)

 function done(err, data) {
	 if (err) {
		 next(err)
	 } else {
		 res.render('user.ejs', {user: data, beers: beerlist})
	 }
 }
});

module.exports = router;
