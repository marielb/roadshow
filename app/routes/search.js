var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('underscore');
//var searchModel = require('../models/search.js');
var couch = require('../couch.js');
var uuid = require('node-uuid');

/* Open a page to create a new search */
router.get('/', function(req, res, next) {
  if (req.query.search_term) {
    var matched_auctions = req.app.fuzzy_auctions.get(req.query.search_term);
    couch.all('auction', {}, function(err, data) {
      // TODO: if err
      var auctions_to_render = _.filter(data.rows, function(auction) {
        return _.find(matched_auctions, function(ma) {
          return auction.doc.auction_name == ma[1];
        });
      });
      res.render('search', {auctions: auctions_to_render, search_term: req.query.search_term});
    })
  } else {
    res.redirect('/');
  }
});

module.exports = router;
