const express = require('express')
const bodyParser = require('body-parser')
const beerlist = require('./beers')
const find = require('array-find')
const router = express.Router()
const slug = require('slug')
const multer = require('multer')
const upload = multer({dest: 'assets/upload/'})
const mongo = require('mongodb')
const session = require('express-session')
let searchResults = [];

require('dotenv').config()

var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT
var user = process.env.DB_USER

mongo.MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
  if (err) throw err
  db = client.db(process.env.DB_NAME)
})

router.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}))



// Sign-up form

router.get('/sign-up', (req, res) => {
  res.render('sign-up.ejs')
});

// Post sign-up form

router.post('/sign-up', (req, res, next) => {
var username = req.body.username
var password = req.body.password

if (!username || !password) {
  return res.status(400).send('Username or password are missing')
}

if (db.collection('users').find({name: username}) === username) {
  return res.status(400).send('Username already exist')
}

else {
  db.collection('users').insertOne({
    name: username,
    password: password
}, done)

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      req.session.user = {username: username};
      res.redirect('/')
    }
  }
  }
});


// Log-in form

router.get('/log-in', (req, res) => {
  res.render('log-in.ejs')
});

// Log-in Post

router.post('/log-in', (req, res) => {
var username = req.body.username
var password = req.body.password

db.collection('users').find({name: username}, done);

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      var user = db.collection('users').find({name: username})
      req.session.user = {username: user.username};
      res.redirect('/')
    }
  }
});



// Log-out

router.get('/log-out', (req, res, next) => {
    req.session.destroy(function (err) {
    if (err) {
      next(err)
    } else {
      res.redirect('/')
    }
  })
});




// Get form for adding new beer

router.get('/addBeer', (req, res) => {
  if (req.session.user) {
    res.render('addBeer.ejs',  {searchResults})
  } else {
    return res.status(401).send('Not loged in...')
  }
});



// Post for adding new beer

router.post('/', (req, res, next) => {

  if (req.session.user) {

  }

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





// get list of beers

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




// Delete beer

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

// get beer details

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
