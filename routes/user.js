var express = require('express')
var router = express.Router()

  router.get('/', function (req, res) {
    res.send('User list')
  })

  router.get('/1', function (req, res) {
    res.send('Name: Pickle Rick')
  })

  router.get('/2', function (req, res) {
    res.send('Name: Morty')
  })

  router.get('/3', function (req, res) {
    res.send('Name: Snowball')
  })

module.exports = router
