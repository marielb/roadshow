var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	auctions: new Backbone.Collections.Auctions();
  });
});

module.exports = router;
