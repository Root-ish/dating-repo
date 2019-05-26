// Require dependancies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
require("dotenv").config();


// Require controllers
const serveHome = require("./app/controllers/serveHome");
const { login, logform } = require("./app/controllers/entry/log-in");
const logout = require("./app/controllers/entry/log-out");
const { signup, signform } = require("./app/controllers/entry/sign-up");
const { account, accountform } = require("./app/controllers/user/account-details");
const { beer, beerform } = require("./app/controllers/user/add-beer");
const beers = require("./app/controllers/user/beers");
const { searchBeer } = require("./app/controllers/user/searchBeerHome");
const notFound = require("./app/controllers/notFound");


// Conncet to database
const uri = process.env.MONGODB_URI;
mongoose.set("useNewUrlParser", true);
mongoose.connect(uri);

// Declare session
const expSession = {
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
};

express()
  .use("/", express.static("app/static"))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(session(expSession))
  .set("view engine", "ejs")
  .set("views", "app/views")


  .get("/log-in", login)
  .get("/log-out", logout)
  .get("/add-beer", beer)
  .get("/user/:id", account)
  .get("/sign-up", signup)
  .get("/", serveHome)
  .get("/beers", beers)


  .post("/log-in", logform)
  .post("/sign-up", signform)
  .post("/user/:id", accountform)
  .post("/search-beer", searchBeer)
  .post("/add-beer", beerform)

  .get("/not-found", notFound)

  .listen(process.env.PORT || 8000);
