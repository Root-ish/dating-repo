const express = require('express')
const mongo = require('mongodb')
const session = require('express-session')
const beer = express.Router()
const beerform = express.Router()

require('dotenv').config()

let db = null
let url = process.env.DataBase

mongo.MongoClient.connect(url, {
  useNewUrlParser: true
}, function(err, client) {
  if (err) throw err
  db = client.db(process.env.DB_NAME)
})

// Get form for adding new beer

beer.get('/add-beer', (req, res) => {
  if (req.session.user) {
    res.render('add-beer.ejs', {
      user: req.session.user
    })
  } else {
    res.redirect('/');
    return res.status(401).send('Not loged in...')
  }
});


// Post for adding new beer

beerform.post('/add-beer', (req, res, next) => {

  if (req.session.user) {
    const userBeer = req.session.user.beerProfile
    // console.log({[req.body.bid]: req.body.name});
    db.collection('drinkers').updateOne({
      _id: mongo.ObjectID(req.session.user._id)
    }, {
      $set: {
        beerProfile: {
          [req.body.beerBid]: {
            "name": req.body.beerName,
            "img": req.body.beerImg,
            "bid": req.body.beerBid
          }
        }
      }
    }, {
      upsert: true
    }, done)

    function done(err, data) {
      if (err) {
        next(err)
      } else {
        console.log("nice! You added");
        res.redirect('/');
      }
    }

  }
});

module.exports = {
  beer,
  beerform
};
