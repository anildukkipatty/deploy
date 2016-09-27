var express = require('express');
var router = express.Router();
var config = require('../config');
var Project = require('../models/Project');
var Auth = require('../helpers/auth');
var mongoose = require('mongoose');
var _ = require('lodash');
var SSH = require('simple-ssh');
var fs = require('fs');
var exec = require('ssh-exec');
var exec = require('child_process').exec;

router.get('/:id', function (req, res) {
  Project.findOne({_id: mongoose.Types.ObjectId(req.params.id)}, function (err, project) {
    if (err || ! project) return res.sendStatus(500);

    child = exec("ssh anil@168.63.245.167 cd facebook-bot && git pull origin master",
      function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });




  });
});

module.exports = router;
