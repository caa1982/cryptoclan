const express     = require("express");
const router      = express.Router();
const ensureLogin = require("connect-ensure-login");
const User        = require("../models/user");
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;


router.get("/user/dashboard", ensureLogin.ensureLoggedIn("/"), (req, res)=>{
  res.render('user/dashboard');
});

router.get("/user/edit", ensureLogin.ensureLoggedIn("/"), (req, res)=>{
  res.render('user/edit');
});

router.post("/user/:userId", ensureLogin.ensureLoggedIn("/"), (req, res, next)=>{
  const password = req.body.password,
        passwordRepeat = req.body.passwordRepeat;

  const data = {
    name: req.body.name,
    email: req.body.email,
    company: req.body.company,
    website: req.body.website,
    bio: req.body.bio,
    address: req.body.address,
    city: req.body.city
  }

  if(password) {
    if(password !== passwordRepeat) {
      res.render("/user/edit", {message: "Passwords don't match"});
      return;
    } else {
      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      data.password = hashPass;
    }
  }

  User.findOneAndUpdate({"_id":req.params.userId}, data, (err, user)=>{
    if(err) {next(err); return;}
    res.redirect("/user/dashboard");
  })
});

router.get("/user/clan_join", ensureLogin.ensureLoggedIn("/"), (req, res)=>{
  res.render('user/clan_join');
});

module.exports = router;