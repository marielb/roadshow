var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('underscore');

var routes = require('./routes/index');
var users = require('./routes/users');
var auction = require('./routes/auction');
var bid = require('./routes/auction');
var search = require('./routes/search');
var email = require('./routes/email');

//Load Mustache Template Engine
var mustachex = require('mustachex');
var multer = require('multer');
var mailer = require('express-mailer');
var app = express();
var bodyParser = require('body-parser');

// Build search structure
var couch = require('./couch.js');
var fozzy = require('fuzzyset.js');
var fuzzy_auctions = FuzzySet();
couch.all('auction', {}, function(err, data) {
  // TODO: if err
  _.each(data.rows, function(auction) {
    fuzzy_auctions.add(auction.doc.auction_name);
  });
});
app.fuzzy_auctions = fuzzy_auctions;


//Set Global App Settings
app.engine('mustache', mustachex.express);

app.use(multer({
    dest: __dirname + '/public/images'
}));

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'mustache');
app.set('views', __dirname + '/templates');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser('partypoopah'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.locals.logged_in = !!req.cookies.user_id;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/auction', auction);
app.use('/search', search);
app.use('/email', email);

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
