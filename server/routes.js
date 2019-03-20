const express = require('express')
const users = require('./users')
const beerlist = require('./beers')
const find = require('array-find')
const router = express.Router()
const slug = require('slug')
const multer = require('multer')
const upload = multer({dest: 'assets/upload/'})

router.get('/', (req, res) => {
	res.render('home.ejs', {user: users})
});

router.get('/:userId', (req, res, next) => {
  var userId = req.params.userId
  var user = find(users, function (value) {
    return value.userId === userId
  })

  if (!user) {
    next()
    return
  }

  res.render('user.ejs', {user: user, beers: beerlist})
});

router.get('/sign-up', (req, res) => {
  res.render('sign-up.ejs', {beers: beerlist})
});

router.post('/', upload.single('profilePhoto'), (req, res) => {
  var userId = slug(req.body.name, {lower: true})

  users.push({
    userId: userId,
    name: req.body.name,
    profileAbout: req.body.profileAbout,
    profilePhoto: req.file ? req.file.filename : null,
    description: req.body.description,
    beerProfile: req.body.beerProfile
  })

  res.redirect('/' + userId)
});

module.exports = router;
