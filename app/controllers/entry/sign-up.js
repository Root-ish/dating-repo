const mongoose = require("mongoose");
const User = require("../../models/User");

require("dotenv").config();

// Sign-up form

function signup(req, res) {
  res.render("sign-up.ejs");
}

// Post sign-up form

function signform(req, res, next) {

    const { username, password, firstName, lastName } = req.body;
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      beers: []
    });

    signUpAndSet();

    async function signUpAndSet() {
      try {

        User.create(newUser);

        req.session.user = {
          username: username,
          firstName: firstName,
          lastName: lastName,
          beers: []
        };

      } catch (error) {
        next(error);
      }
    }

  res.redirect("/beers");
}

module.exports = {
  signup,
  signform
};
