const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Coin = require("../models/coin");
const PortfolioHistories = require("../models/portfolio_history");
const CoinLog = require("../models/coin_history");
const async = require("async");
const bcryptSalt = 10;

router.get("/coin24/:coinId",  ensureLogin.ensureLoggedIn("/"), (req, res) => {
  let time24 = Date.now() - 24*60*60*1000;
  CoinLog.find({"id":req.params.coinId, time:{$gt:time24}}, (err,log)=>{
    
    res.status(200).json(log.map(el=>el.price_usd));
  })
  
});

module.exports = router;