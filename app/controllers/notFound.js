const express = require('express')
const notFound = express.Router()
const session = require('express-session')

// Log-out

notFound.get('/not-found', (req, res) => {
  res.render('not-found.ejs')
});

module.exports = notFound;
