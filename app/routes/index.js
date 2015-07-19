var express = require('express');
var router = express.Router();
var couch = require('../couch.js');
var _ = require('underscore');

/* GET home page. */
router.get('/', function(req, res, next) {
  couch.all('auction', {}, function(err, data) {
  	var rows = [];
  	_.each(data.rows, function(auction) {
  		// TODO: if err
  		if (!auction.doc.closed) {
  			rows.push(auction);
  		}
  	});
  	// !! is essentially a cast to bool. any non empty is true 
    res.render('index', {auctions: rows, logged_in: !!req.cookies.user_id});
  })
});

module.exports = router;
