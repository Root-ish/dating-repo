const User = require("../../models/User");
const _ = require("underscore");

function serveHome(req, res) {
  if (!req.session.user) {
    res.render("beers", {
      user: null
    });
  } else {
    res.render("beers", {
      user: req.session.user,
      beerResults: "",
      beerSearch: null
    });
  }
}
module.exports = serveHome;
