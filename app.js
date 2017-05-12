var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
const session       = require("express-session");
const passport      = require("./helpers/passport");

const flash         = require("connect-flash");
const auth          = require("./helpers/auth");
const expressLayouts= require('express-ejs-layouts');

const authRoutes    = require("./routes/auth-routes");
const userRoutes    = require("./routes/user");
const apiRoutes     = require("./routes/api");

const mongoose      = require("mongoose");
const configuration = require("./configuration");
const nev           = require('email-verification')(mongoose);

const User          = require('./models/user');

const portfolio = require('./helpers/portfolio');

const coinmarketcap = require('./helpers/coinmarketcap');

require("dotenv").config();


mongoose.connect(process.env.MONGODB_URI);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(auth.setCurrentUser);



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, "bower_components")));

app.use(expressLayouts);
app.use((req,res,next)=>{
  if(req.isAuthenticated()) {
    app.set('layout', 'layouts/main-layout');
  } else {
    app.set('layout', 'layouts/landingPage-layout');
  }
  next();
})
//app.set('layout', 'layouts/landingPage-layout');
app.set('views', __dirname + '/views');


app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/api', apiRoutes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

coinmarketcap();
portfolio.runInterval();


module.exports = app;
