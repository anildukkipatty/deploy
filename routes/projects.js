var express = require('express');
var router = express.Router();
var config = require('../config');
var Project = require('../models/Project');
var Auth = require('../helpers/auth');
var mongoose = require('mongoose');

router.get('/add', Auth.authRedirect, function(req, res, next) {
  res.render('projects/add.html', { user: req.user });
});
router.get('/:id/slots/add', Auth.authRedirect, function(req, res, next) {
  res.render('projects/add-slot.html', { user: req.user, projectId: req.params.id });
});

router.get('/:id', Auth.authRedirect, function(req, res, next) {
  Project.findOne({_id: mongoose.Types.ObjectId(req.params.id)}, function (err, project) {
    if (err) return res.send(err, 500);
    res.render('projects/project.html', { user: req.user, project: project });
  });
});

router.post('/', Auth.authRedirect, function (req, res) {
  var projectData = req.body;
  projectData.user = req.user._id;
  var project = new Project(projectData);
  project.save(function (err, project) {
    if (err || ! project) return res.send(err || 'Project not saved', 500);
    res.send(project);
  });
});

router.post('/:id/slots', Auth.authRedirect, function(req, res, next) {
  Project.update({_id: req.params.id}, {$push: {slots: req.body}}, function (err, obj) {
    if (err) return res.send(err, 500);
    res.send(obj);
  })
});
router.delete('/:id/slots/:name', Auth.authRedirect, function(req, res, next) {
  Project.update({_id: req.params.id}, {$pull: {slots: {name: req.params.name}}}, function (err, obj) {
    if (err) return res.send(err, 500);
    res.send(obj);
  })
});

module.exports = router;
