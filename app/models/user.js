var uuid = require('node-uuid');
var couch = require('../couch.js');
var _ = require('underscore');

var userModel = {
  _id: null,
  email: '',

  login: function(user_id, user_email, callback) {
    var self = this;
    if (!user_id) {
      couch.all('user_account', {}, function(err, data) {
        // TODO: if err
        var found_email = false;
        for (var i = 0; i < data.rows.length; i++) {
          console.log(data.rows[i].doc.email);
          if (data.rows[i].doc.email == user_email) {
            // we already have a user for this
            found_email = true;
            callback(false);
            break;
          }
        }
        if (!found_email) {
          self._id = uuid.v4();
          self.email = user_email;
          self.save();
        }
      });
    } else {
      this._id = user_id;
    }
    //callback(true);
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
