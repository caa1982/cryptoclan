const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Coin = require("../models/coin");
const PortfolioHistories = require("../models/portfolio_history");
const async = require("async");
const bcryptSalt = 10;



router.get("/user/portfolio", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  if (req.user.portfolio) {

    let pieTotalLabels = [];
    let pieTotalData = [];

    let piePoloniexLabels = [];
    let piePoloniexData = [];

    let pieBittrexLabels = [];
    let pieBittrexData = [];

    async.each(req.user.portfolio.coins, (coin, callback) => {
      Coin.findOne({ "id": coin.id }, (err, cmcCoin) => {
        if (cmcCoin) {
          coin.value = Math.round(coin.balance * cmcCoin.price_usd * 100) / 100;
          coin.price = cmcCoin.price_usd;

          pieTotalLabels.push(coin.id);
          pieTotalData.push(Math.round(coin.balance * cmcCoin.price_usd * 100) / 100);
          if (coin.exchange === "poloniex") {
            piePoloniexLabels.push(coin.id);
            piePoloniexData.push(Math.round(coin.balance * cmcCoin.price_usd * 100) / 100);
          }
          if (coin.exchange === "bittrex") {
            pieBittrexLabels.push(coin.id);
            pieBittrexData.push(Math.round(coin.balance * cmcCoin.price_usd * 100) / 100);
          }


        }

        callback();
      })
    }, err => {
      res.render('user/portfolio', { pieTotalData, pieTotalLabels, piePoloniexData, piePoloniexLabels, pieBittrexData, pieBittrexLabels });
    })
  } else {
    res.render('user/portfolio');
  }
});




router.get("/user/dashboard", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  Coin.find({}, function (err, coins) {
    User.findOne({ "_id": req.user.id }, "coins", function (err, userCoins) {
      res.render('user/dashboard', {
        coins,
        userCoins: userCoins.coins
      });
    });
  });
});

router.post("/send_save", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  User.findOneAndUpdate({ "_id": req.user.id }, { $addToSet: { "coins": req.body.name } }, (err, user) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      res.status(200).json({ message: "ok" });
    }
  });
});

router.get("/user/edit", ensureLogin.ensureLoggedIn("/"), (req, res) => {

  res.render('user/edit');

});



router.get("/user/map", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  res.render('user/map');
});

router.get("/user/email", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  res.render('user/email');
});

router.get("/user/notifications", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  res.render('user/notifications');
});

router.get("/user/connect", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  User.find({}, function (err, users) {
    users,
    res.render('user/addFriends');
  });
});

router.get("/user/logout", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post("/user/:userId", ensureLogin.ensureLoggedIn("/"), (req, res, next) => {
  const password = req.body.password,
    passwordRepeat = req.body.passwordRepeat;

  const data = {
    name: req.body.name,
    email: req.body.email,
    company: req.body.company,
    website: req.body.website,
    bio: req.body.bio,
    address: req.body.city,
    location: { type: 'Point', coordinates: [req.body.lng, req.body.lat], default: [0, 0] },
    poloniex: { apikey: req.body.poloniex_apikey, apisecret: req.body.poloniex_apisecret },
    bittrex: { apikey: req.body.bittrex_apikey, apisecret: req.body.bittrex_apisecret }
  }

  if (password) {
    if (password !== passwordRepeat) {
      res.render("/user/edit", { message: "Passwords don't match" });
      return;
    } else {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      data.password = hashPass;
    }
  }

  User.findOneAndUpdate({ "_id": req.params.userId }, data, (err, user) => {
    if (err) { next(err); return; }
    res.redirect("/user/dashboard");
  })
});

router.get("/user/clan_join", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  res.render('user/clan_join');
});


module.exports = router;