var uuid = require('node-uuid');
var couch = require('../couch.js');

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
  save: function() {
    couch.save('user_account', this, function(err, data) {
      console.log(err);
      console.log(data);
    });
  }
};

module.exports = userModel;
