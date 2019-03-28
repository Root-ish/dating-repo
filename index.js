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
    .listen(8000);
