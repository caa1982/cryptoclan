const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Coin = require("../models/coin");
const PortfolioLog = require("../models/portfolio_history");
const CoinLog = require("../models/coin_history");
const async = require("async");
const bcryptSalt = 10;

router.get("/coin24/:coinId", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  let time24 = Date.now() - 24 * 60 * 60 * 1000;
  CoinLog.find({ "id": req.params.coinId, time: { $gt: time24 } }, (err, log) => {
    if (err) {
      res.status(500).json({ message: "DB error" });
    } else {
      res.status(200).json(log.map(el => el.price_usd));
    }
  })
});

router.post("/user_search", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  console.log('req.body.coins: ', req.body.coins);
  console.log('req.body.city: ', req.body.city);
  console.log('req.body.name: ', req.body.name);
  if (req.body.name || req.body.city || req.body.coins) {
    let query = {};

    if (req.body.name) query.name = new RegExp(req.body.name, "i");
    if (req.body.city) query.city = new RegExp(req.body.city, "i");
    let coinsArr =  typeof req.body.coins === 'string' ? [req.body.coins] : req.body.coins
    if (req.body.coins) query.coins = { $in: coinsArr };
    console.log('query: ', query);

    User.find(query, (err, users) => {

      console.log('users: ', users);
      if (err) {
        res.status(500).json({ message: "DB error" });
      } else {
        res.status(200).json(users);
      }
    })
  } else {
    res.status(200).json([]);
  }
})


router.get("/portfolio24", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  let time24 = Date.now() - 24 * 60 * 60 * 1000;
  PortfolioLog.find({ "userId": req.user.id, time: { $gt: time24 } }, (err, log) => {
    if (err) {
      res.status(500).json({ message: "DB error" });
    } else {
      res.status(200).json(log.map(el => Math.round(100 * el.total) / 100));
    }
  })

});

module.exports = router;