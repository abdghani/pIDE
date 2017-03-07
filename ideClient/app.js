var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var database = require(path.join(__dirname,'bin','mongooseConfig'))();
var passport = require('passport');
var passportConfig = require(path.join(__dirname,'bin','passport'));
var session = require('express-session');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));


passport.use( passportConfig.newpassportfacebook);
passport.use( passportConfig.newpassportgoogle);
passport.serializeUser(passportConfig.serialize);
passport.deserializeUser(passportConfig.deserialize);

app.use(session({secret:'this id the secret'}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
// app.set('view engine', 'jade');



app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/code',require('./routes/code'));
module.exports = app;
