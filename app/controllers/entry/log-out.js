const express = require('express')
const session = require('express-session')

// Log-out

function logout(req, res, next) {
  req.session.destroy(function (err) {
  if (err) {
    next(err)
  } else {
    res.redirect('/')
  }
})
};

module.exports = logout;
