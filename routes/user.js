const express     = require("express");
const router      = express.Router();
const ensureLogin = require("connect-ensure-login");
const User        = require("../models/user");

router.get("/user/dashboard", ensureLogin.ensureLoggedIn("/"), (req, res)=>{
  res.render('user/dashboard');
});

router.get("/user/edit", ensureLogin.ensureLoggedIn("/"), (req, res)=>{
  res.render('user/edit');
});

module.exports = router;