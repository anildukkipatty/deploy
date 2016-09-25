var jwt = require('jsonwebtoken')
var config = require('../config')

var obj = {}

obj.authRedirect = function (req, res, next) {
  if (! req.user) {
    return res.redirect('/login')
  }
  next()
}

obj.authJson = function (req, res, next) {
  if (! req.user) {
    return res.send({message: 'Not authorized'}, 403)
  }
  next()
}

obj.guestRedirect = function (req, res, next) {
  if (req.user) return res.redirect('/')
  next()
}

obj.nseRedirect = function (req, res, next) {
  if (! req.user || req.user.role != 1) return res.redirect('/');
  next();
}

obj.nseJson = function (req, res, next) {
  if (! req.user || req.user.role != 1) return res.send({message: "Please login as an authorized user."}, 403);
  next();
}

module.exports = obj
