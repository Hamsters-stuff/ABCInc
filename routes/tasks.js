var express = require('express');
var router = express.Router();
var User = require('../models/user.model');
var Task = require('../models/task.model');
const bcrypt = require ('bcrypt');

const saltRounds = 10;

router.get('/', function(req, res){
  User.hasMany(Task, {foreignKey: 'user_id'})
  Task.belongsTo(User, {foreignKey: 'user_id'})

  Task.findAll({
    include: [{
      model: User
    }],
    where: {
      user_id: req.session.user.id
    }
  }).then(result => {
    res.locals.tasks = result
    
    res.render('tasks');
  }).catch((error) => {
    console.error('Failed to create a new record : ', error);
  });
});

router.get('/create', function(req, res){
  res.render('tasks_create');
});


router.post('/create', function(req, res, next) {
  if (!req.body.description.length > 0) {
    req.session.error = 'Invalid description'
    res.redirect('/tasks/create');
    return
  }

  if (!req.body.summary.length > 0) {
    req.session.error = 'Invalid summary'
    res.redirect('/tasks/create');
    return
  }

  Task.create({
    user_id: req.session.user.id,
    task: req.body.description,
    summary: req.body.summary,
    status: req.body.status,
  }).then(result => {
      req.session.success = 'Task created successfully'
      res.redirect('/tasks');
  }).catch((error) => {
    console.error('Failed to create a new record : ', error);
  });
});

router.get('/:taskId/edit', function(req, res){
  Task.findOne({
    where: {
      id: req.params.taskId,
      user_id: req.session.user.id
    }
  }).then(result => {
    res.locals.task = result
    res.render('tasks_edit');
  }).catch((error) => {
    console.error('Failed to create a new record : ', error);
  });
});

router.post('/:taskId/edit', function(req, res){
  Task.findOne({
    where: {
      id: req.params.taskId,
      user_id: req.session.user.id
    }
  }).then(result => {
    if (!result) {
      req.session.error = 'Invalid description'
      res.redirect('/tasks/create');
      return
    }

    if (!req.body.description.length > 0) {
      req.session.error = 'Invalid description'
      res.redirect('/tasks/create');
      return
    }
  
    if (!req.body.summary.length > 0) {
      req.session.error = 'Invalid summary'
      res.redirect('/tasks/create');
      return
    }
  
    result.set({
      user_id: req.session.user.id,
      task: req.body.description,
      summary: req.body.summary,
      status: req.body.status,
    })
    result.save();

    req.session.success = 'Task updated successfully'
    res.redirect('/tasks');
  }).catch((error) => {
    console.error('Failed to create a new record : ', error);
  });
});

router.get('/:taskId/delete', function(req, res){
  Task.destroy({
    where: {
      id: req.params.taskId,
      user_id: req.session.user.id
    }
  }).then(result => {
    res.redirect('/tasks');
  }).catch((error) => {
    console.error('Failed to create a new record : ', error);
  });
});

module.exports = router;
