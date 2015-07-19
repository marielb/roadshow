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
  		console.log(auction.doc);
  		if (!auction.doc.closed) {
  			rows.push(auction);
  		} else {
  			console.log(auction);
  		}
  	});
    res.render('index', {auctions: rows});
  })
});

module.exports = router;
