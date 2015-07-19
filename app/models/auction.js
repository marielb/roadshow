var couch = require('../couch.js');
var userModel = require('../models/user.js');
var uuid = require('node-uuid');
var fs = require('fs');
var path = require("path");
var schedule = require('node-schedule');

var auctionModel = {

  create: function(prop) {
    this._id = uuid.v4();
    this.auctioneer_id = prop.auctioneer_id;
    this.auction_name = prop.auction_name;
    this.end_date = this.calculateEndDate(prop.end_date);
    this.start_bid = prop.start_bid;
    this.step = prop.step;
    this.image_path = prop.image_path;
    this.bid_count = 0;
  },

  toJSON: function() {
    return {
      _id: this._id,
      auctioneer_id: this.auctioneer_id,
      auction_name: this.auction_name,
      end_date: this.end_date.toString(),
      start_bid: this.start_bid,
      step: this.step,
      image_path: this.image_path,
      bid_count: this.bid_count
    };
  },

  save: function(callback) {
    var self = this;
    couch.save('auction', this.toJSON(), function(err, data) {
      if (!err) {
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
      } else {
        return false
      }
      callback();
    });
  },

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
  },

  // helper date function
  // it expects time in 24 hour format "HH:MM"
  calculateEndDate: function (endTimeString) {
    var hour = parseInt(endTimeString.slice(0,2));
    var minute = parseInt(endTimeString.slice(3,5));
    var x = new Date();
    return new Date(x.getFullYear(), x.getMonth(), (((x.getHours()<=hour&&x.getMinutes()<minute)||x.getHours()<hour)?x.getDate():x.getDate()+1), hour, minute);
  },

  // helper date function
  // format TZ to human readable
  formatDate: function(tz) {
    var date = new Date(tz);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
};

module.exports = auctionModel;
