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


router.get("/connect/:userId", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  User.findOneAndUpdate({"_id":req.user.id}, { $addToSet: { "following": req.params.userId } }, err=>{
    if (err) {
      res.status(500).json({ message: "DB error" });
    } else {
      User.findOneAndUpdate({"_id":req.params.userId}, { $addToSet: { "followers": req.user.id } }, err=>{
        if (err) {
          res.status(500).json({ message: "DB error" });
        } else {
          res.status(200).json({});
        }
      });
    }
  })
});

router.get("/toggle_public", ensureLogin.ensureLoggedIn("/"), (req, res) => {

  let toggle = !req.user.portfolio.public;
 
  User.findOneAndUpdate({"_id":req.user.id}, {"portfolio.public":toggle}, err=>{
    if (err) {
      res.status(500).json({ message: "DB error" });
    } else {
      res.status(200).json({public:toggle});
    }
  });
});

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

router.post("/console_coin", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  Coin.findOne({ "id": req.body.coin }, (err, coin) => {
    if (err) {
      res.status(500).json({ message: "DB error" });
    } else {
      res.status(200).json(coin);
    }
  })
});

router.post("/user_search", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  if (req.body.mycoins === "1") {

    User.findOne({ "_id": req.user.id }, (err, user) => {
      User.find({ coins: { $in: user.coins } }, (err, users) => {
        if (err) {
          res.status(500).json({ message: "DB error" });
        } else {
          users.forEach(user=>{
            if(req.user.following.length && req.user.following.find(con=>con === user.id)) 
              user._doc.isFriend = true;
          })
          users = users.filter(user=>user.id!==req.user.id)
          res.status(200).json(users);
        }
      })
    })

  } else {

    if (req.body.name || req.body.city || req.body.coins) {
      let query = {};

      if (req.body.name) query.name = new RegExp(req.body.name, "i");
      if (req.body.city) query.city = new RegExp(req.body.city, "i");
      let coinsArr = typeof req.body.coins === 'string' ? [req.body.coins] : req.body.coins
      if (req.body.coins) query.coins = { $in: coinsArr };

      User.find(query, (err, users) => {
        if (err) {
          res.status(500).json({ message: "DB error" });
        } else {
          res.status(200).json(users);
        }
      })
    } else {
      res.status(200).json([]);
    }
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