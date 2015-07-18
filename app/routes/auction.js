var express = require('express');
var router = express.Router();

/* Open a page to create a new auction */
router.get('/', function(req, res, next) {
  res.render('create_auction', {
  });
});

/* Send the data to create a new auction*/
router.post('/', function (req, res, next) {
  res.render('create_auction', {
  });
});

module.exports = router;
