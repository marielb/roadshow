var express = require('express');
var router = express.Router();
var fs = require('fs');
//var auctionModel = require('../models/auction.js');
var couch = require('../couch.js');
var uuid = require('node-uuid');
var userModel = require('../models/user.js');
var schedule = require('node-schedule');

/* Open a page to create a new auction */
router.get('/', function(req, res, next) {
  res.render('create_auction', {
    auction: {
    },
    data: JSON.stringify({
      auction: {image_name: 'test'}
    })
  });
});

/* Open a page to view an auction */
router.get('/id/:id', function(req, res, next) {
  couch.id('auction', req.params.id, function(err, data) {
    res.render('auction', {
      auction: data,
      data: JSON.stringify({
        auction: data
      })
    });
  });
});

/* Make a bid */
router.post('/id/:id', function(req, res, next) {

 // Fetch the record from the DB before updating it
 couch.id('auction', req.params.id, function(err, data) {
   userModel.login(req.cookies.user_id, req.body.user_email);
   res.cookie('user_id', userModel._id);

   data._rev = req.body.rev;
   data.current_bidder = userModel._id;
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
  userModel.login(req.cookies.user_id, req.body.user_email);
  res.cookie('user_id', userModel._id);

  var auctionModel = {};
  var endTime = calculateEndDate(req.body.end_date);
  console.log(endTime);
  auctionModel._id = uuid.v4();
  auctionModel.auctioneer_id = userModel._id;
  auctionModel.auction_name = req.body.auction_name;
  auctionModel.end_date = endTime;
  auctionModel.start_bid = req.body.start_bid;
  auctionModel.step = req.body.step;
  auctionModel.image_path = req.files.item_photo.name;
  auctionModel.bid_count = 0;
  couch.save('auction', auctionModel, function(err, data) {
    if (!err) {
      schedule.scheduleJob(endTime, function(model_id) {
        couch.id('auction', model_id, function(err, data) {
          data.closed = true;
          console.log('Triggered!');
          couch.save('auction', data, function(err) {
            if (err) {
              console.log('Auction expired but failed to closed. We done messed up');
            } else {
              console.log('GREAT SUCCESS!!');
            }
          });
        });
      }.bind(null, data._id));
    }
    console.log(data);
  });
  fs.readFile(req.files.item_photo.path, function (err, data) {
    var newPath = __dirname + "/images/";
    fs.writeFile(newPath, data, function (err) {
      res.redirect('/');
    });
  });
});

// helper date function
// it expects time in 24 hour format "HH:MM"
function calculateEndDate(endTimeString) {
  var hour = parseInt(endTimeString.slice(0,2));
  var minute = parseInt(endTimeString.slice(3,5));
  var x = new Date();
  return new Date(x.getFullYear(), x.getMonth(), (((x.getHours()<=hour&&x.getMinutes()<minute)||x.getHours()<hour)?x.getDate():x.getDate()+1), hour, minute);
}

module.exports = router;
