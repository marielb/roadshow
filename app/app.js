var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var auction = require('./routes/auction');
var bid = require('./routes/auction');

//Load Mustache Template Engine
var mustachex = require('mustachex');

var multer = require('multer');

var app = express();

//Set Global App Settings
app.engine('html', mustachex.express);

app.use(multer({
    dest: __dirname + '/public/images'
}));

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser('partypooper'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/auction', auction);

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
    console.log(err);
    console.log(err.stack);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err.stack
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});


module.exports = app;
