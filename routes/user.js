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

router.get("/user/portfolio", ensureLogin.ensureLoggedIn("/"), (req, res)=>{
  res.render('user/portfolio');
});

router.get("/user/map", ensureLogin.ensureLoggedIn("/"), (req, res)=>{
  res.render('user/map');
});

router.get("/user/email", ensureLogin.ensureLoggedIn("/"), (req, res)=>{
  res.render('user/email');
});

router.get("/user/notifications", ensureLogin.ensureLoggedIn("/"), (req, res)=>{
  res.render('user/notifications');
});

module.exports = router;