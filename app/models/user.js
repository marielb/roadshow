var uuid = require('node-uuid');
var couch = require('../couch.js');
var _ = require('underscore');

var userModel = {
  _id: null,
  email: '',

  login: function(user_id, user_email, callback) {
    this._id = user_id;
    var self = this;
    if (!user_id) {
      couch.all('user_account', {}, function(err, data) {
        // TODO: if err
        var user_exists = _.find(data.rows, function(user) {
          return user.doc.email == user_email;
        });
        if (!user_exists) {
          self._id = uuid.v4();
          self.email = user_email;
          self.save();
          callback(true);
        } else {
          console.log('logged out user entered existing email');
          callback(false);
        }
      });
    } else {
      callback(true);
    }
  },
  recordBid: function(auction_id) {
    var self = this;
    couch.id('user_account', this._id, function(err, data) {
      if (err) {
        console.log('sux bruh');
      } else {
        self.auctions = _.union(data.auctions, [auction_id]);
        self._rev = data._rev;
        self.email = data.email;
        self.save();
      }
    });
  },
  save: function() {
    couch.save('user_account', this, function(err, data) {
      // TODO: if err
    });
  }
};

module.exports = userModel;
