var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var jwt = require('jsonwebtoken');
var User = require('./models/User');
var config = require('./config')

// Database setup
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/deployapp');

var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('view cache', false);
swig.setDefaults({ cache: false, varControls: ['<%=', '%>'] });

// Setting up middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  jwt.verify(req.cookies.tracker, config.secret, function (err, decoded) {
    if (! err && decoded) {
      User.findOne({email: decoded._doc.email}, function (err, user) {
        if (! err && user) req.user = user;
        next()
      })
      return
    }
    next()
  })
})

// Declaring routes
app.use('/', require('./routes/index'));
app.use('/projects', require('./routes/projects'));
app.use('/deploy', require('./routes/deploy'));
app.use('/test', require('./routes/test'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
