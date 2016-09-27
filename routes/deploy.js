var express = require('express');
var router = express.Router();
var config = require('../config');
var Project = require('../models/Project');
var Auth = require('../helpers/auth');
var mongoose = require('mongoose');
var _ = require('lodash');
var SSH = require('simple-ssh');
var fs = require('fs');
var exec = require('child_process').exec;

router.post('/:id/callback', function(req, res) {
  var data = req.body;
  if (! data.ref) return res.send('not a request', 500);

  Project.findOne({_id: mongoose.Types.ObjectId(req.params.id)}, function (err, project) {
    if (err || !project) return res.send('project not found', 500);

    var slots = _.filter(project.slots, {ref: data.ref});
    if (slots.length <= 0) return res.send('No slot found', 500);
    var slot = slots[0];
    if (! slot.status) return res.send('Auto deploy disabled', 500);

    var connectionString = "ssh " + project.serverUser + "@" + project.server + " ";
    var commands = "cd " + slot.location + " && " + slot.commands;

    exec('ssh-keyscan -H -p 22 '+ project.server +' >> ~/.ssh/known_hosts',
      function (err, stdOut, stdErr) {

        exec(connectionString + commands,
          function (err, stdOut, stdErr) {
            if (err) console.log(err);
            return res.send(stdOut);
          }
        );

      }
    );


  });
});


module.exports = router;
