const express = require('express')
const mongoose = require("mongoose");
const User = require("../../models/User");
const session = require('express-session')

require('dotenv').config()

// Get form for adding new beer

function beer(req, res, next) {
  if (req.session.user) {
    res.render('add-beer.ejs', {
      user: req.session.user
    })
  } else {
    res.redirect('/');
    return res.status(401).send('Not loged in...')
  }
};


// Post for adding new beer

async function beerform(req, res, next) {
  try {
    const beersArray = req.session.user.beers;
    const beer_bid = req.body.beerBid;
    const beer_name = req.body.beerName;
    const beer_label = req.body.beerImg;
    const beer_description = req.body.beerDescription;
    const beer_brewery = req.body.brewery;
    const objectBeer = {
      beer: {
        bid: beer_bid,
        name: beer_name,
        img: beer_label,
        description: beer_description,
        brewery: beer_brewery
      }
    };

    beersArray.push(objectBeer);

    await User.updateMany({
      username: req.session.user.username
    }, {
      beers: beersArray
    });

    req.session.user.beers = beersArray;

    res.redirect("/");

  } catch (error) {
    next(error);
  }
}

module.exports = {
  beer,
  beerform
};
