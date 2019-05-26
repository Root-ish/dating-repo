const User = require("../../models/User");
const _ = require("underscore");

function serveHome(req, res, next) {
  if (!req.session.user) {
    res.render("beers", {
      user: null
    });
  } else {
    res.render("beers", {
      user: req.session.user,
      beerResults: ""
    });
  }
}
module.exports = serveHome;
