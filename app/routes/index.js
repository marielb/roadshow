var express = require('express');
var router = express.Router();
var couch = require('../couch.js');
var _ = require('underscore');

/* GET home page. */
router.get('/', function(req, res, next) {
  couch.all('auction', {}, function(err, data) {
  	var rows = [];
  	data.rows.sort(function(a, b) {
  		return new Date(b.doc.date_created).getTime() - new Date(a.doc.date_created).getTime();
  	});
  	_.each(data.rows, function(auction) {
  		// TODO: if err

  		// only add if the end date has not passed
  		if (new Date().getTime() < new Date(auction.doc.end_date).getTime()) {
  			rows.push(auction);
  		}
  	});
    res.render('index', {auctions: rows});
  })
});

module.exports = router;
