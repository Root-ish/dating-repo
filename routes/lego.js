var express = require('express')
var router = express.Router()

  router.get('/', function (req, res) {
    res.send('Lego Brick')
  })

  router.get('/about', function (req, res) {
    res.send('About the Lego Brick')
  })

module.exports = router
