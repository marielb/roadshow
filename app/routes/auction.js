var express = require('express');
var router = express.Router();
//var auctionModel = require('../models/auction.js');
var couch = require('../couch.js');
var userModel = require('../models/user.js');
var auctionModel = require('../models/auction.js');
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
router.get('/:id', function(req, res, next) {
  couch.id('auction', req.params.id, function(err, data) {
    data.winning = req.cookies.user_id == data.current_bidder;
    data.formatted_end_date = auctionModel.formatDate(data.end_date);
    res.render('auction', {
      auction: data,
      data: JSON.stringify({
        auction: data
      })
    });
  });
});

/* Make a bid */
router.put('/:id', function(req, res, next) {
  var user_id = req.cookies.user_id;
  auctionModel.validateBid(req.params.id, user_id,
    function(err, data) {
      if (err) {
        if (err.stack) {
          res.json({message: err.message, error: err.stack});
        } else {
          // Did not pass validation
          res.status(409).json(err);
        }
      } else {
        userModel.login(user_id, '597ba6ee-768c-427d-ba81-bda5e0e2193a');
        res.cookie('user_id', userModel._id);
        auctionModel.saveBid(data, req.body._rev, userModel._id,
          function(err, data) {
            console.log(err);
            if (err) {
              res.json(err);
            } else {
              data.winning = true;
              res.json(data);
            }
          }
        );
      }
    }
  );
});

/* Create new auction */
router.post('/', function(req, res, next) {
  userModel.login(req.cookies.user_id);
  res.cookie('user_id', userModel._id);

  var auctionData = req.body;
  auctionData.auctioneer_id = userModel._id;
  auctionData.image_path = req.files.item_photo.name;
  auctionModel.create(auctionData);
  auctionModel.save(function() {
    schedule.scheduleJob(self.end_date, function(model_id) {
      couch.id('auction', model_id, function(err, data) {
        data.closed = true;
        console.log('Triggered!');
        couch.save('auction', data, function(err) {
          if (err) {
            return false;
            console.log('Auction expired but failed to close. We done messed up');
          } else {
            console.log('GREAT SUCCESS!!');
          }
        });
      });
    }.bind(null, data._id));
    req.app.fuzzy_auctions.add(auctionModel.auction_name);
    res.redirect('/');
  });
});

function closeAuction() {

}

module.exports = router;
