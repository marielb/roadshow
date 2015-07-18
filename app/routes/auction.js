var express = require('express');
var router = express.Router();
var fs = require('fs');
var auctionModel = require('../models/auction.js');

/* Open a page to create a new auction */
router.get('/', function(req, res, next) {
  res.render('create_auction', {
  });
});

/* Send the data to create a new auction*/
router.post('/', function(req, res, next) {
	// Image upload to /public/images
  auctionModel.auction_name = req.body.auction_name;
  auctionModel.end_time = req.body.end_time;
  auctionModel.start_bid = req.body.start_bid;
  auctionModel.step = req.body.step;
  auctionModel.image_path = req.files.item_photo.name;
  auctionModel.save();
  console.log(req.files);
  fs.readFile(req.files.item_photo.path, function (err, data) {
	  var newPath = __dirname + "/images/";
	  fs.writeFile(newPath, data, function (err) {
		  res.render('create_auction', {
		  });
	  });
	});
});

module.exports = router;
