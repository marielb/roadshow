var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');
var auction = require('./routes/auction');
var bid = require('./routes/auction');
var search = require('./routes/search');

//Load Mustache Template Engine
var mustachex = require('mustachex');
var mailer = require('express-mailer');
var app = express();

//Set Global App Settings
app.engine('mustache', mustachex.express);

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'mustache');
app.set('views', __dirname + '/templates');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser('partypoopah'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/auction', auction);
app.use('/search', search);

mailer.extend(app, {
  from: 'roadshowapp@gmail.com',
  host: 'smtp.gmail.com', // hostname 
  secureConnection: true, // use SSL 
  port: 465, // port for secure SMTP 
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
  auth: {
    user: 'roadshowapp@gmail.com',
    pass: fs.readFileSync(__dirname + '/password','utf8')
  }
});

app.get('/email', function(req, res, next) {
  app.mailer.send('login_email', {
    to: req.query.email,  
    subject: 'Roadshow Login',
    _id: req.query._id
  }, function (err) {
    if (err) {
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
  });
  res.redirect('/');
});

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
