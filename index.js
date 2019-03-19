var express = require('express')
var lego = require('./routes/lego.js')

express()
    .use('/static', express.static('static'))
    .use('/views', express.static('views'))
    .use('/lego', lego)
    .set('view engine', 'pug')
    .get('/', function (req, res) {
      res.render('index', {title: 'Pickle Rick', message: 'Wabba dabba dub dub'})
    })
    .get('*', notFound)
    .listen(8000);

    function notFound(req, res){
      res.send("404 not found")
    }
