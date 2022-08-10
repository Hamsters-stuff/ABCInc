var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var database = require('./db');

var app = express();

var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var tasksRouter = require('./routes/tasks');

app.use('/', authRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'shhhh, very secret'
}));
app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<div class="alert alert-danger" role="alert">' + err + '</div>';
  if (msg) res.locals.message = '<div class="alert alert-success" role="alert">' + msg + '</div>';

  if (req.session.user) {
    res.locals.username = req.session.user.username;
  }
  console.log(res.locals.user);

  var allowedRoutes = ["/login", "/logout", "/users/register"]
  if (!req.session.user && !allowedRoutes.includes(req.originalUrl)) {
    res.redirect('/login');
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app, database;
