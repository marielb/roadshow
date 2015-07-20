var express = require('express');
var router = express.Router();
var couch = require('../couch.js');
var app = require('../app.js');

/* Display account page or login. */
router.get('/', function(req, res, next) {
  var userID = req.cookies.user_id;
  if (!userID) {
  	res.render('login', {});
  } else {
	  couch.all('auction', {}, function(err, data) {
      // TODO: if err
      couch.id('user_account',  userID, function(err, user) {
  	  	var hosted_auctions = [];
        var bidded_auctions = [];
  	  	for (var i in data.rows) {
  	  		if (data.rows[i].doc.auctioneer_id === userID) {
  	  			hosted_auctions.push(data.rows[i]);
  	  		}
          if (user.auctions) {
            if (user.auctions.indexOf(data.rows[i].doc._id) > -1) {
              if (data.rows[i].doc.current_bidder === userID){
                data.rows[i].winning = true;
              } else {
                data.rows[i].losing = true;
              }
              bidded_auctions.push(data.rows[i]);
            }
          }
  	  	}
    		res.render('user', {hosted_auctions: hosted_auctions, bidded_auctions: bidded_auctions});
  	  });
    });
  }
});

/* Log in a user. */
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
  		res.redirect('/email?_id=' + user_id + '&email=' + email + '&template=login_email');
  	} else {
  		res.render('login', { message: { text: "Account not found. Post a bid or auction to get started!" }})
  	}
  });
});

router.get('/logout', function(req, res, next) {
  res.clearCookie('user_id');
  res.redirect('/');
});

/* Authenticate user */
router.get('/login/:token', function(req, res, next) {
  res.cookie('user_id', req.params.token);
  res.redirect('/users');
});
module.exports = router;
