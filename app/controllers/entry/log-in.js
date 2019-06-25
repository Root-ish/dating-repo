const User = require("../../models/User");

require("dotenv").config();

// Log-in form

function login(req, res) {
  res.render("log-in.ejs");
}

async function logform(req, res, next) {
  try {
    const { username, password } = req.body;

    await User.findOne({
        username: username
      }, (err, data) => {
        if (err) console.log(err);

        if (data.password === password) {

          req.session.user = {
            _id: data._id,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            beers: data.beers,
            image: data.image
          };

          res.redirect("/beers");

        } else {
          console.log("Wrong password");
        }
    });
  }  catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  logform
};
