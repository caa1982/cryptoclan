// routes/auth-routes.js
const express     = require("express");
const authRoutes  = express.Router();
const passport    = require("passport");
const ensureLogin = require("connect-ensure-login");
const auth        = require("../helpers/auth");
// User model
const User        = require("../models/user");
const mongoose      = require("mongoose");
const nev           = require('email-verification')(mongoose);
const configuration = require("../configuration");
// Bcrypt to encrypt passwords
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;




authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const passwordRepeat = req.body.passwordRepeat;

  console.log("start ", req.body.type)

  nev.configure({
        verificationURL: configuration.baseUrl+'/email-verification/${URL}',
        persistentUserModel: User,
        tempUserCollection: configuration.verificationEmail.tempUserCollection,

        transportOptions: {
            service: 'Gmail',
            auth: {
                user: configuration.verificationEmail.user,
                pass: configuration.verificationEmail.pass
            }
        },
        verifyMailOptions: {
            from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
            subject: 'Please confirm account',
            html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
            text: 'Please confirm your account by clicking the following link: ${URL}'
        }
    }, function(error, options){
    });

  if( !nev.options.tempUserModel) {
    nev.generateTempUserModel(User, (err, model)=>{
      //console.log('err: ', err);
    });
  }

  if(req.body.type === "register") {
    console.log("register")
    if (email === "" || password === "" || passwordRepeat === "") {
      console.log("here")
      res.status(500).json( {message:"Please enter email and password"} );
      return;
    }

    if(password!==passwordRepeat) {
      console.log("here1")
      res.status(500).json( {message:"Passwords do not match"} );
      return;
    }

    User.findOne({ email }, "email", (err, user) => {
      if (user !== null) {
        res.status(500).json( { message: "Email already exists" });
        return;
      }

      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        email: email,
        password: hashPass
      });
      
      nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
          // some sort of error
          if (err) {
            
            res.status(500).json({ message: "Error creating temp user: "+err });
            return;
          }
              // handle error...

          // // user already exists in persistent collection...
          if (existingPersistentUser) {
            res.status(500).json({ message: "Email already exists" });
            
            return;
          }
              // handle user's existence... violently.

          // a new user
          if (newTempUser) {
              var URL = newTempUser[nev.options.URLFieldName];
              nev.sendVerificationEmail(email, URL, function(err, info) {
                  if (err) {
                    res.status(500).json({message: "Error sending confirmation email" });
                    return;
                  }
                      // handle error...
                    res.status(200).json({});
                  
                  // flash message of success
              });

          // user already exists in temporary collection...
          } else {
              // flash message of failure...
              res.status(200).json({userExists:true, message: "Email already exists" });
          }

      });

      
    });
      
      // newUser.save((err) => {
      //   if (err) {
      //     res.render(redirectError, { message: "Something went wrong" });
      //   } else {
      //     res.redirect(redirectSuccess);
      //   }
      // });
    
  } else { //resend confirmetion email
    nev.resendVerificationEmail(email, function(err, userFound) {
      if (err) {
        return res.status(404).send('ERROR: resending verification email FAILED');
      }
      if (userFound) {
        console.log("1")
        res.json({
          message: 'An email has been sent to you, yet again. Please check it to verify your account.'
        });
      } else {
        console.log("2")
        res.json({
          message: 'Your verification code has expired. Please sign up again.'
        });
      }
    });

  }
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}), (req, res)=>{

  res.redirect("/dashboard");
});

authRoutes.get("/", (req, res) => {
  res.render('index');
});


authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
authRoutes.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/dashboard",
  failureRedirect: "/"
}));

authRoutes.get('/auth/linkedin', passport.authenticate('linkedin'));

authRoutes.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/dashboard');
  });
authRoutes.get('/email-verification/:url', (req,res) => {
  const url = req.params.url;
  
   nev.configure({
        verificationURL: configuration.baseUrl+'/email-verification/${URL}',
        persistentUserModel: User,
        tempUserCollection: configuration.verificationEmail.tempUserCollection,

        transportOptions: {
            service: 'Gmail',
            auth: {
                user: configuration.verificationEmail.user,
                pass: configuration.verificationEmail.pass
            }
        },
        verifyMailOptions: {
            from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
            subject: 'Please confirm account',
            html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
            text: 'Please confirm your account by clicking the following link: ${URL}'
        }
    }, function(error, options){
    });

    nev.generateTempUserModel(User, (err, model)=>{
      nev.confirmTempUser(url, function(err, user) {
          if (err) {
            

          }
          if (user) {
              // optional
              nev.sendConfirmationEmail(user['email'], function(err, info) {
                  res.redirect('/dashboard')
              });
          }    // user's data probably expired...
          else {
            // redirect to sign-up
            res.redirect("/signup");
          }
              
      });
    });
});


module.exports = authRoutes;