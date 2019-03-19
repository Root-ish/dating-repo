var express = require('express')
var router = express.Router()

  router.get('/', function (req, res) {
    res.send('Chat list')
  })

  router.get('/1', function (req, res) {
    res.send('chat with: Pickle Rick')
  })

  router.get('/2', function (req, res) {
    res.send('chat with: Morty')
  })

  router.get('/3', function (req, res) {
    res.send('chat with: Snowball')
  })

module.exports = router
