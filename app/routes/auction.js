var express = require('express');
var router = express.Router();
var fs = require('fs');
//var auctionModel = require('../models/auction.js');
var couch = require('../couch.js');
var uuid = require('node-uuid');
var userModel = require('../models/user.js');

/* Open a page to create a new auction */
router.get('/', function(req, res, next) {
  res.render('create_auction', {});
});

/* Open a page to view an auction */
router.get('/id/:id', function(req, res, next) {
  couch.id('auction', req.params.id, function(err, data) {
    res.render('auction', {auction: data});
  });
});

/* Make a bid */
router.put('/id/:id', function(req, res, next) {
  //var auctionModel = couch.
  //auctionModel._id = req.body.id;
  //auctionModel._rev = req.body.rev;
  //auctionModel.current_bidder = req.body.user_id;
  //auctionModel.current_bid = req.current_bid + ;
  //res.render('auction', {id: req.params.id});
});

/* Send the data to create a new auction*/
router.post('/', function(req, res, next) {
  userModel.login(req.cookies.user_id, req.body.user_email);
  res.cookie('user_id', userModel._id);

  var auctionModel = {};
  auctionModel._id = uuid.v4();
  auctionModel.auctioneer_id = userModel._id;
  auctionModel.auction_name = req.body.auction_name;
  auctionModel.end_time = req.body.end_time;
  auctionModel.start_bid = req.body.start_bid;
  auctionModel.step = req.body.step;
  auctionModel.image_path = req.files.item_photo.name;
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
