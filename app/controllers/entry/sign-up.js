const mongoose = require("mongoose");
const User = require("../../models/User");

require("dotenv").config();

// Sign-up form

function signup(req, res) {
  res.render("sign-up.ejs");
}

// Post sign-up form

async function signform(req, res, next) {
  try {

    const { username, password, firstName, lastName } = req.body;
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      beers: []
    });

    User.create(newUser);

  }  catch (error) {
    console.log(error);
  }

  setSession();

  function setSession(error) {
    if (error) {
        next(error);
    } else {
      const {username, firstName, lastName} = req.body;
        req.session.user = {
          username: username,
          firstName: firstName,
          lastName: lastName,
          beers: []
        };
      }
  }

  res.redirect("/beers");
}

module.exports = {
  signup,
  signform
};
