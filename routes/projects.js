var express = require('express');
var router = express.Router();
var config = require('../config');
var Project = require('../models/Project');
var Auth = require('../helpers/auth');
var mongoose = require('mongoose');
var _ = require('lodash');

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
router.delete('/:id', Auth.authRedirect, function(req, res, next) {
  Project.find({_id: mongoose.Types.ObjectId(req.params.id)}).remove().exec();
  res.sendStatus(200);
});
router.put('/:id/:slotName', Auth.authRedirect, function(req, res, next) {
  Project.update({_id: mongoose.Types.ObjectId(req.params.id), 'slots.name': req.params.slotName},
    {
      $set: {
        'slots.$.status': req.body.status
      }
    }, function (err, project) {
      if (err) return res.sendStatus(500);
      res.send(project);
  });
});

router.get('/:projectId/slot/:slotName/results', function (req, res) {
  Project.findOne({_id: mongoose.Types.ObjectId(req.params.projectId)}, function (err, project) {
    if (err) return res.send(err, 500);
    var slots = _.filter(project.slots, {name: req.params.slotName});
    if (! slots || slots.length <= 0) return res.send([]);
    return res.send(slots[0].results);
  });
});

router.get('/:projectId/slot/:slotName/edit', function (req, res) {
  Project.findOne({_id: mongoose.Types.ObjectId(req.params.projectId)}, function (err, project) {
    if (err) return res.send(err, 500);
    var slots = _.filter(project.slots, {name: req.params.slotName});
    if (! slots || slots.length <= 0) return res.send('No such slot found.');
    return res.render('projects/edit-slot.html', {slot: slots[0], projectId: req.params.projectId});
  });
});
router.post('/:projectId/slot/:slotName/edit', function (req, res) {
  Project.findOne({_id: mongoose.Types.ObjectId(req.params.projectId)}, function (err, project) {
    if (err) return res.send(err, 500);
    project.slots = _.map(project.slots, function (slot) {
      if (slot.name == req.params.slotName) {
        slot = req.body;
      }
      return slot;
    });

    project.save(function (err, result) {
      // console.log();
      return res.send(result);
    });
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
  var slot = req.body;
  slot.ref = 'refs/heads/' + slot.branch;
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
