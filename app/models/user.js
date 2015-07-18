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
      return;
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
