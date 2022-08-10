var express = require('express');
var router = express.Router();
var User = require('../models/user.model');
const bcrypt = require ('bcrypt');

const saltRounds = 10;

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res, next) {
  if (!req.body.username.length > 0) {
    req.session.error = 'Invalid username'
    res.redirect('/users/register');
    return
  }

  if (!req.body.password.length > 6) {
    req.session.error = 'Passwords needs to be longer than 6 characters'
    res.redirect('/users/register');
    return
  }

  if (req.body.password != req.body.password2) {
    req.session.error = 'Passwords do not match'
    res.redirect('/users/register');
    return
  }

  req.session.error = ''

  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(result => {
    if (result) {
      req.session.error = 'A user with the username "' + req.body.username + '" already exists' 
      res.redirect('/login');
      return
    }

    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        User.create({
          username: req.body.username,
          hash: hash,
          salt: salt,
        }).then(result => {  
          req.session.success = 'User created successfully'
          res.redirect('/login');
        }).catch((error) => {
          console.error('Failed to create a new record : ', error);
        });
      });
    });
  }).catch((error) => {
    console.error('Failed to create a new record : ', error);
  });
});

module.exports = router;
