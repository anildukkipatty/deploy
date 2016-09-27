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
  if (! data.ref) return res.sendStatus(500);
  return res.sendStatus(200);

  Project.findOne({_id: mongoose.Types.ObjectId(req.params.id)}, function (err, project) {
    if (err || !project) return res.sendStatus(500);
    //  -ssh into slot
    // run commands file
    // return output


    var slots = _.filter(project.slots, {ref: data.ref});
    if (slot.length <= 0) return res.sendStatus(500);
    var slot = slots[0];

    if (! slot.status) return res.send(200);

    var connectionString = "ssh " + slot.serverUser + "@" + slot.server + " ";
    var commands = slot.commands;
    exec("ssh " + connectionString + commands,
      function (err, stdOut, stdErr) {
        console.log('out: ' + stdOut);
        console.log('err: ' + stdErr);

        if (err) console.log(err);
      }
    )


  });
});


module.exports = router;
