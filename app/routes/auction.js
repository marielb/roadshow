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
  couch.id('auction', req.params.id, function(err, data) {
    res.render('auction', {auction: data});
  });
});

/* Make a bid */
router.post('/id/:id', function(req, res, next) {
  // Fetch the record from the DB before updating it
 couch.id('auction', req.params.id, function(err, data) {
   console.log(req);
   data._rev = req.body.rev;
   data.current_bidder = req.body.user_id;
   data.current_bid = data.current_bid ? parseInt(data.current_bid) + parseInt(data.step) : data.start_bid;
   data.bid_count += 1;
   console.log(data);
   couch.save('auction', data, function(err, doc) {
     if (err) {
       console.log('WAAHHH');
       console.log(err);
     }
     res.render('auction', {auction: data});
   })
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
  auctionModel.bid_count = 0;
  couch.save('auction', auctionModel, function(err, data) {
    console.log(err);
    console.log(data);
  });
  fs.readFile(req.files.item_photo.path, function (err, data) {
    var newPath = __dirname + "/images/";
    fs.writeFile(newPath, data, function (err) {
      res.redirect('/');
    });
  });
});

module.exports = router;
