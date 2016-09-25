var express = require('express');
var router = express.Router();
var config = require('../config');
var Project = require('../models/Project');
var Auth = require('../helpers/auth');
var mongoose = require('mongoose');

router.get('/:id/callback', function(req, res) {
  console.log(JSON.stringify(req.body));
  res.sendStatus(200);
});


module.exports = router;
