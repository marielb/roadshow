var express = require('express');
var router = express.Router();
var couch = require('../couch.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  couch.all('auction', {}, function(err, data) {
    res.render('index', {auctions: data.rows});
  })
});

module.exports = router;
