var express = require('express');
var router = express.Router();
var User = require('../models/user.model');
const bcrypt = require ('bcrypt');

function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);
  User.findOne({
    where: {
      username: name
    }
  }).then(res => {
    if (!res) {
      return fn(null, null)
    }
    
    checkPass(res, pass, fn);
  }).catch((error) => {
    return fn(null, null)
  });
}

function checkPass(user, pass, fn) {
  bcrypt.compare(pass, user.hash, function(err, result) {
    if (err) return fn(err);
    if (result) {
      fn(null, user);
    } else {
      fn(null, null);
    }
  });
}

router.get('/', function(req, res){
  res.redirect('/login');
});

router.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/login');
  });
});

router.get('/login', function(req, res){
  res.render('login');
});

router.post('/login', function (req, res, next) {
 authenticate(req.body.username, req.body.password, function(err, user){
    if (err) return next(err)
    if (user) {
      req.session.regenerate(function(){
        req.session.user = user;
        res.redirect('/tasks');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.';
      res.redirect('/login');
    }
  });
});

module.exports = router;
