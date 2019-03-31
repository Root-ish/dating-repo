const express = require('express')
const logout = express.Router()

// Log-out

logout.get('/log-out', (req, res, next) => {
    req.session.destroy(function (err) {
    if (err) {
      next(err)
    } else {
      res.redirect('/')
    }
  })
});

module.exports = logout;