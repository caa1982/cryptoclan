const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User          = require("../models/user");
const FbStrategy    = require('passport-facebook').Strategy;
const LinkedInStrategy    = require('passport-linkedin').Strategy;
const mongoose      = require("mongoose");

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  if(mongoose.Types.ObjectId.isValid(user)) {
    User.findOne({ "_id": user }, (err, user) => {
      if (err) { return cb(err); }
        cb(null, user);
    });
  } else {
    let providerIdField = "";
    if(user.provider==="facebook") {
      User.findOne({ "facebookId": user.id }, (err, dbUser) => {
      if (err) { return cb(err); }
        cb(null, dbUser);
      });
    }
    if(user.provider==="linkedin") {
      User.findOne({ "linkedinId": user.id }, (err, dbUser) => {
      if (err) { return cb(err); }
        cb(null, dbUser);
      });      
    }
    console.log(providerIdField, user.id)
     
    //cb(null, user);
  }

});

passport.use(new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email',
  passwordField: 'password'
}, (req, email, password, next) => {

  User.findOne({ email }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect email" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));


passport.use(new FbStrategy({
  clientID: "408192872894889",
  clientSecret: "4427a7287727fd5d4676fd3697122932",
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', "email"]
}, (accessToken, refreshToken, profile, done) => {

    User.findOne({ facebookId: profile.id }, function(err, user) {
      if(err) {
        console.log(err);  // handle errors!
      }
      if (!err && user !== null) {
        done(null, user);
      } else {
        console.log(profile)
        user = new User({
          facebookId: profile.id,
          name: profile.displayName,
          photo: profile.photos[0].value ? profile.photos[0].value : "/images/userProfileIcon.jpg"
        });
        user.save(function(err) {
          if(err) {
            console.log(err);  // handle errors!
          } else {
            
            done(null, user);
          }
        });
      }
    });
  done(null, profile);
}));

passport.use(new LinkedInStrategy({
    consumerKey: "7727j909q0ro86",
    consumerSecret: "MohL4wKqv3GRWf24",
    callbackURL: "http://localhost:3000/auth/linkedin/callback",
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'pictureUrl']
  },
  function(token, tokenSecret, profile, done) {
    console.log('profile: ', profile);

  User.findOne({ linkedinId: profile.id }, function(err, user) {
        if(err) {
          console.log(err);  // handle errors!
        }
        if (!err && user !== null) {
          done(null, user);
        } else {
          user = new User({
            linkedinId: profile.id,
            name: profile.displayName,
            photo: profile._json.pictureUrl
          });
          user.save(function(err) {
            if(err) {
              console.log(err);  // handle errors!
            } else {
              
              done(null, user);
            }
          });
        }
      });
    done(null, profile);
     }
));

module.exports = passport;