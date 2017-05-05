const express     = require("express");
const router      = express.Router();
const ensureLogin = require("connect-ensure-login");

router.get("/dashboard", ensureLogin.ensureLoggedIn(), (req, res)=>{
  res.render('user/dashboard');
});

module.exports = router;