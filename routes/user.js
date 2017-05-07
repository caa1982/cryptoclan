const express     = require("express");
const router      = express.Router();
const ensureLogin = require("connect-ensure-login");
const User        = require("../models/user");

router.get("/dashboard", ensureLogin.ensureLoggedIn(), (req, res)=>{
  console.log(req.user)
  User.findById(req.session.id, (err, user)=>{
    res.render('user/dashboard', {user});
  });
});

module.exports = router;