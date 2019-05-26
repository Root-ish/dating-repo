const User = require("../../models/User");
const _ = require("underscore");

function serveHome(req, res, next) {
  if (!req.session.user) {
    res.render("beers", {
      user: null
    });
  } else {
    matchingUsers(req, res, next);
  }
}

async function matchingUsers(req, res, next) {
  try {
    let matchingUsers = [];
    let userID = "";

    if (req.session.user.beers.length > 1) {

      await User.findOne({
        username: req.session.user.username
      }, (err, currentUser) => {
        if (err) console.log(err);

        userID = currentUser._id;
      });

      await User.find({}, (err, data) => {
        if (err) console.log(err);

        for (let i = 0; i < req.session.user.beers.length; i++) {

          for (let j = 0; j < data.length; j++) {

            for (let k = 0; k < data[j].beers.length; k++) {
              if (_.contains([data[j].beers[k].beer.bid], req.session.user.beers[i].beer.bid) == true) {

                let beerUser = data[j]._id.toString();

                if (beerUser != userID) {
                  matchingUsers.push(data[j]);
                }
              }
            }
          }
        }
        res.render("beers", {
          user: req.session.user,
          beerResults: "",
          matchList: matchingUsers,
          query : req.query
        });
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = serveHome;
