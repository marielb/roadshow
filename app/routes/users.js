var express = require('express');
var router = express.Router();
var couch = require('../couch.js');
var app = require('../app.js');

/* Display account page or login. */
router.get('/', function(req, res, next) {
  var userID = req.cookies.user_id;
  console.log(userID);
  if (!userID) {
  	res.render('login', {})
  } else {
	  couch.all('auction', {}, function(err, data) {
	  	var auctions = [];
	  	for (var i in data.rows) {
	  		console.log(data.rows[i].doc);
	  		if (data.rows[i].doc.auctioneer_id === userID) {
	  			auctions.push(data.rows[i]);
	  		}
	  	}
  		res.render('user', {auctions: auctions});
	  });
  }
});

/* Login page. */
router.get('/login', function(req, res, next) {
  var email = req.query.email;
  var user_id = null;

  couch.all('user_account', {}, function(err, data) {
  	for (var i in data.rows) {
  		if (data.rows[i].doc.email === email) {
  			user_id = data.rows[i].doc._id;
  		}
  	}
  	if (user_id) {
  		res.redirect('/email?_id=' + user_id + '&email=' + email);
  	}
  });
});

/* Authenticate user */
router.get('/login/:token', function(req, res, next) {
  res.cookie('user_id', req.params.token);
  res.redirect('/users');
});
module.exports = router;
