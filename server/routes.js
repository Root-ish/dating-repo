const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const slug = require('slug')
const mongo = require('mongodb')
const session = require('express-session')


// Log-in /out entry
const {
  login,
  logform
} = require('./entry/log-in')
const logout = require('./entry/log-out')


// Sign up entry
const {
  signup,
  signform
} = require('./entry/sign-up')


// account details
const {
  account,
  accountform
} = require('./user/account-details')


// account details
const {
  beer,
  beerform
} = require('./user/add-beer')


require('dotenv').config()

let db = null
let url = process.env.DataBase

mongo.MongoClient.connect(url, {
  useNewUrlParser: true
}, function(err, client) {
  if (err) throw err
  db = client.db(process.env.DB_NAME)
})

router.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}))


// Log-in
router.get('/log-in', login)


// Log-in form
router.post('/log-in', logform)


// Log-out
router.get('/log-out', logout)


// Sign-up form
router.get('/sign-up', signup)


// Post sign-up form
router.post('/sign-up', signform)


// Home page
router.get('/', (req, res, next) => {

  if (req.session.user) {
    matchUsers(req.session.user)
    res.render('home.ejs', {
      user: req.session.user
    })
  } else {
    res.render('home.ejs', {
      user: null
    })
  }

});


// Account details
router.get('/user/:id', account)


// Account details change
router.post('/user/:id', accountform)


// Add beer
router.get('/add-beer', beer)


// Add beer - post form
router.post('/add-beer', beerform)


// Not found page
router.get('/not-found', (req, res) => {
  res.render('not-found.ejs')
});

module.exports = router;
