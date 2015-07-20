var express = require('express');
var router = express.Router();
//var auctionModel = require('../models/auction.js');
var couch = require('../couch.js');
var userModel = require('../models/user.js');
var auctionModel = require('../models/auction.js');
var multer = require('multer');
var path = require('path');
var schedule = require('node-schedule');

multerConfig = multer({
    dest: path.join(__dirname, '../', '/public/images')
});

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
    data.winning = req.cookies.user_id && (req.cookies.user_id == data.current_bidder);
    data.formatted_end_date = auctionModel.formatDate(data.end_date);
    data.ended = new Date () > new Date(data.end_date);
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
  var user_email = req.body.user_email;
  userModel.login(user_id, req.body.user_email, function() {
    res.status(403).json('Forbidden');
  });
  auctionModel.validateBid(req.params.id, userModel._id,
    function(err, data) {
      if (err) {
        if (err.stack) {
          res.json({message: err.message, error: err.stack});
        } else {
          // Did not pass validation
          res.status(409).json(err);
        }
      } else {
        res.cookie('user_id', userModel._id);
        auctionModel.saveBid(data, req.body._rev, userModel._id,
          function(err, data) {
            if (err) {
              res.json(err);
            } else {
              userModel.recordBid(data._id);
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
  userModel.login(req.cookies.user_id, req.body.user_email, function() {
    res.redirect('/users');
  });
  res.cookie('user_id', userModel._id);

  var auctionData = req.body;
  auctionData.auctioneer_id = userModel._id;
  auctionData.image_path = req.files.item_photo.name;
  auctionModel.create(auctionData);
  auctionModel.save(function(model_id) {
    // schedule auction closing
    schedule.scheduleJob(auctionModel.end_date, function(model_id) {
      console.log(model_id);
      couch.id('auction', model_id, function(err, data) {
        var auctionData = data;
        if (auctionData.current_bidder && auctionData.current_bid) {
          couch.id('user_account', auctionData.auctioneer_id, function(err, data) {[]
            var auctioneer_email = data.email;
            couch.id('user_account', auctionData.current_bidder, function(err, data) {
              var winner_email = data.email;
              console.log(auctioneer_email);
              console.log(winner_email);

              // send emails
              req.app.mailer.send('winner_email', {
                to: winner_email,
                subject: '[Roadshow] You won!',
                auctioneer_email: auctioneer_email,
                item_name: auctionData.auction_name,
                bid: auctionData.current_bid
              }, function () {});
              req.app.mailer.send('auctioneer_email', {
                to: auctioneer_email,
                subject: '[Roadshow] Your auction has ended!',
                winner_email: winner_email,
                item_name: auctionData.auction_name,
                bid: auctionData.current_bid
              }, function () {});

              // close auction
              auctionData.closed = true;
              console.log('Triggered!');
              couch.save('auction', auctionData, function(err) {
                if (err) {
                  return false;
                  console.log('Auction expired but failed to close. We done messed up');
                } else {
                  console.log('GREAT SUCCESS!!');
                }
              });
            });
          });
        }
      });
    }.bind(null, model_id));
    req.app.fuzzy_auctions.add(auctionModel.auction_name);
    res.redirect('/');
  });
});

function serializeJson(json) {
  return '?' +
    Object.keys(json).map(function(key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}

module.exports = router;
