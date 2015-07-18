var express = require('express');
var router = express.Router();
var fs = require('fs');
//var auctionModel = require('../models/auction.js');
var couch = require('../couch.js');
var uuid = require('node-uuid');

/* Open a page to create a new auction */
router.get('/', function(req, res, next) {
  res.render('create_auction', {});
});

/* Open a page to create a new auction */
router.get('/id/:id', function(req, res, next) {
  res.render('auction', {
  	id: req.params.id
  });
});

/* Send the data to create a new auction*/
router.post('/', function(req, res, next) {
	// Image upload to /public/images
  var auctionModel = {};
  auctionModel._id = uuid.v4();
  auctionModel.auction_name = req.body.auction_name;
  auctionModel.end_time = req.body.end_time;
  auctionModel.start_bid = req.body.start_bid;
  auctionModel.step = req.body.step;
  auctionModel.image_path = req.files.item_photo.name;
  couch.save('auction', auctionModel, function(err, data) {
    console.log(err);
    console.log(data);
  });
  console.log(auctionModel);
  fs.readFile(req.files.item_photo.path, function (err, data) {
	  var newPath = __dirname + "/images/";
	  fs.writeFile(newPath, data, function (err) {
		  res.redirect('/');
	  });
	});
});

module.exports = router;
