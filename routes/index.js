var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/User');
var Project = require('../models/Project');
var bCrypt = require('bcrypt');
var Auth = require('../helpers/auth');
var mongoose = require('mongoose');
var exec = require('child_process').exec;
var fs = require('fs');

/* GET home page. */
router.get('/', Auth.authRedirect, function(req, res, next) {
  Project.find({user: new mongoose.Types.ObjectId(req.user._id)}, function (err, projects) {
    if (err) return res.send(err, 500);
    res.render('index.html', { user: req.user, projects: projects });
  });
});

router.get('/login', Auth.guestRedirect, function(req, res, next) {
  return res.render('sessions/login.html');
});

router.post('/login', function(req, res, next) {
  if (! req.body.email || ! req.body.password) {
    return res.sendStatus(412);
  }
  User.findOne({email: req.body.email}, function (err, user) {
    if (err || ! user) return res.sendStatus(500);
    if (! isValidPassword(user, req.body.password)) return res.sendStatus(500);

    res.cookie('tracker', jwt.sign(user, config.secret));
    res.send(user);
  });
});

router.get('/logout', function (req, res) {
  res.cookie('tracker', '');
  res.redirect('/login');
});

router.get('/active-user-profile', function (req, res) {
  if (req.user) res.send(req.user);
  else res.send({message: 'Not loggedin'}, 403);
});

router.get('/fetch-key', Auth.authRedirect, function (req, res) {
  var key = fs.readFileSync(config.keyPath, 'utf8');

  res.send({key: key});
});

router.get('/reg/bro/:email', function (req, res) {
  var email = req.params.email;
  var user = new User({name: 'Anil Dukkipatty', email: email, password: createHash('demo')});
  user.save(function (err, user) {
    res.send(user || err);
  });
});

function isValidPassword(user, password) {
  var result =  bCrypt.compareSync(password, user.password);
  console.log(result);
  return result;
}

function createHash(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = router;
