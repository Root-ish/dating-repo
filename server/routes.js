const express = require('express')
const bodyParser = require('body-parser')
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
const username = req.body.username
const password = req.body.password

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


// Log-in form

router.get('/log-in', (req, res) => {
  res.render('log-in.ejs')
});

// Log-in Post

router.post('/log-in', (req, res) => {
const username = req.body.username
const password = req.body.password

db.collection('users').findOne({
  name: username
}, done);

  function done(err, user) {
    if (err) {
      console.log(err);
    } if(user.password === password) {
      // console.log(user._id);
      req.session.user = user;
      res.redirect('/')
    }
    else {
      console.log("Wrong password");
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
    const beerProfiles = db.collection('users').findOne({"beer.bid": "24893"}, done);

    function done(err, match) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(match);
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

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  if (id.length == 12 || id.length == 24) {

  	db.collection('users').findOne({
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


// Post for adding new beer

router.post('/:id', upload.single('photo'), (req, res, next) => {

  if (req.session.user) {
    const user = req.session.user.beerProfile
      db.collection('users').updateMany(
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

  }
});



// Post for adding new beer

router.post('/add-beer', (req, res, next) => {

  if (req.session.user) {
    const userBeer = req.session.user.beerProfile
    console.log({[req.body.bid]: req.body.name});
      db.collection('users').updateOne(
        { _id: mongo.ObjectID(req.session.user._id)},
        { $set: { beerProfile : {[req.body.bid]: { "name" : req.body.name, "img" : req.body.img, "bid" : req.body.bid } } } },
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
