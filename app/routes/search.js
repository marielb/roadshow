var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('underscore');
//var searchModel = require('../models/search.js');
var couch = require('../couch.js');
var uuid = require('node-uuid');

/* Open a page to create a new search */
router.get('/', function(req, res, next) {
  couch.all('auction', {}, function(err, data) {
    var auctions = [];
    _.each(data.rows, function(auction) {
      var regexp = new RegExp('^.*' + req.query.search_term.toLowerCase() + '.*$');
      if (auction.doc.auction_name.toLowerCase().match(regexp)) {
        auctions.push(auction);
      }
    });
    res.render('search', {auctions: auctions, search_term: req.query.search_term});
  })
});

module.exports = router;
