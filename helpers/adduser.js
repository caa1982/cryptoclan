const User       = require("../models/user");
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;

module.exports = function (req, res, redirectError, redirectSuccess) {
  const email = req.body.email;
  const password = req.body.password;


  if (email === "" || password === "") {
    res.render(redirectError, { message: "Please enter email and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render(redirectError, { message: "Email already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email: email,
      password: hashPass
    });
    
    
    newUser.save((err) => {
      if (err) {
        res.render(redirectError, { message: "Something went wrong" });
      } else {
        res.redirect(redirectSuccess);
      }
    });
  });
}