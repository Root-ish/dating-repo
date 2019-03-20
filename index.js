const express = require('express')
const sassMiddleware = require('node-sass-middleware')
const path = require('path');
const bodyParser = require('body-parser')
const router = require('./server/routes')

express()
    .use(sassMiddleware({
      src: __dirname ,
      dest: path.join(__dirname),
       debug: true,
       outputStyle: 'compressed'
     }))
    .use('/assets', express.static(path.join(__dirname, 'assets')))
    .use(bodyParser.urlencoded({extended: true}))
    .set('view engine', 'ejs')
    .use('views', express.static('view'))
    .use('/', router)
    .get('*', notFound)
    .listen(8000);

    function notFound(req, res){
      res.status(404).send("404 not found")
    }
