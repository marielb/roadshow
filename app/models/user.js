var uuid = require('node-uuid');
var couch = require('../couch.js');
var _ = require('underscore');

var userModel = {
  _id: null,
  email: '',

  login: function(user_id, email) {
    this._id = user_id;
    this.email = email;

    if (!user_id) {
      this._id = uuid.v4();
      this.save();
    } else {
      var self = this;
      couch.id('user_account', user_id, function(err, data) {
        if (!data._id) {
          self.save();
        }
      });
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
