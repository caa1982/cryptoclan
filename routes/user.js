const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Coin = require("../models/coin");
const bcryptSalt = 10;


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
      res.status(500).json({ message: err })
    } else {
      res.status(200).json({ message: "ok" })
    }
  });
});

router.get("/user/edit", ensureLogin.ensureLoggedIn("/"), (req, res) => {
    console.log(res.locals);
    res.render('user/edit');
});


router.get("/user/portfolio", ensureLogin.ensureLoggedIn("/"), (req, res) => {
  res.render('user/portfolio');
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
  res.render('user/connect');
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
    address: req.body.address,
    city: req.body.city,
    poloniex: {apikey:req.body.poloniex_apikey, apisecret:req.body.poloniex_apisecret},
    bittrex: {apikey:req.body.bittrex_apikey, apisecret:req.body.bittrex_apisecret}
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