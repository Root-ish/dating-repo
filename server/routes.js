const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const slug = require('slug')
const multer = require('multer')
const upload = multer({dest: __dirname + '/assets/upload/'})
const mongo = require('mongodb')
const session = require('express-session')
const login = require('./log-in')
const logform = require('./log-in-form')
const logout = require('./log-in')
let searchResults = [];

require('dotenv').config()

let db = null
let url = process.env.DB

mongo.MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
  if (err) throw err
  db = client.db(process.env.DB_NAME)
})

router.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}))



// Log-in form

router.get('/log-in', login)


router.post('/log-in', logform)

// Log-out

router.get('/log-out', logout)



// Sign-up form

router.get('/sign-up', (req, res) => {
  res.render('sign-up.ejs')
});

// Post sign-up form

router.post('/sign-up', (req, res, next) => {
const username = req.body.username
const password = req.body.password

if (!username || !password) {
  return res.status(400).send('Username or password are missing')
}

if (db.collection('drinkers').find({name: username}) === username) {
  return res.status(400).send('Username already exist')
}

else {
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



// Home page

router.get('/', (req, res, next) => {

  if (req.session.user) {
    matchUsers(req.session.user)
    res.render('home.ejs', {user: req.session.user})
  } else {
    res.render('home.ejs', {user: null})
  }

});


function matchUsers(user){
if (user.beerProfile) {
  for (var i = 0; i < Object.keys(user.beerProfile).length; i++) {
    const beer = Object.values(user.beerProfile)[i]
    const bitBeer = beer.bid
    // console.log({"beerProfile": {[bitBeer]: {"bid" : bitBeer}}});
    const nameBeer = beer.name
    const beerProfiles = db.collection('drinkers').findOne({"beer.bid": "24893"}, done);

    function done(err, match) {
      if (err) {
        console.log(err);
      }
      else {
        // console.log(match);
        user.match = match;
      }
    }
  }
} else {
  console.log("no beer profile");
}
}



// Get form for adding new beer

router.get('/add-beer', (req, res) => {
  if (req.session.user) {
    res.render('add-beer.ejs', {user: req.session.user})
  } else {
    res.redirect('/');
    return res.status(401).send('Not loged in...')
  }
});

router.get('/not-found', (req, res) => {
  res.render('not-found.ejs')
});

// Get account details

router.get('/user/:id', (req, res, next) => {
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
  		 res.render('account.ejs', {user: user})
  	 }
   }
} else {
  res.redirect('/not-found');
}
});


// Post for changing user name
//
router.post('/user/:id', upload.single('photo'), (req, res, next) => {

  if (req.session.user) {
      db.collection('drinkers').updateMany(
        { _id: mongo.ObjectID(req.session.user._id)},
        { $set: { name : req.body.name, profilePhoto : req.file ? req.file.filename : null, } },
        { upsert: true }, done)

      function done(err, data) {
        if (err) {
          next(err)
        } else {
          res.redirect('/');
        }
      }
    }else {
  }
});



// Post for adding new beer

router.post('/add-beer', (req, res, next) => {

  if (req.session.user) {
    const userBeer = req.session.user.beerProfile
    // console.log({[req.body.bid]: req.body.name});
      db.collection('drinkers').updateOne(
        { _id: mongo.ObjectID(req.session.user._id)},
        { $set: { beerProfile : {[req.body.beerBid]: { "name" : req.body.beerName, "img" : req.body.beerImg, "bid" : req.body.beerBid } } } },
        { upsert: true }, done)

      function done(err, data) {
        if (err) {
          next(err)
        } else {
          console.log("nice! You added");
          res.redirect('/');
        }
      }

  }
});


module.exports = router;
