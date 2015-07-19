var couch = require('../couch.js');
var userModel = require('../models/user.js');

var auctionModel = {
  validateBid: function(auction_id, user_id, callback) {
    // Fetch the record from the DB before updating it
    couch.id('auction', auction_id, function(err, data) {
      if (err) {
        callback(err);
      } else if (user_id === data.auctioneer_id) {
        callback('You are not allowed to participate in your own auction!', data);
      } else if (new Date() > new Date(data.end_date)) {
        callback('This auction has been closed!', data);
      } else {
        callback(null, data);
      }
    });
  },

  saveBid: function(auction_data, revision, user_id, callback) {
    auction_data._rev = revision;
    auction_data.current_bidder = user_id;
    auction_data.current_bid = 
      auction_data.current_bid ? 
        parseInt(auction_data.current_bid) + parseInt(auction_data.step) : 
        auction_data.start_bid;
    auction_data.bid_count += 1;
    couch.save('auction', auction_data, function(err, doc) {
      if (err) {
        console.log('WAAHHH');
        console.log(err);
        callback(err)
      }
      callback(null, auction_data);
    });
  }
};

module.exports = auctionModel;
