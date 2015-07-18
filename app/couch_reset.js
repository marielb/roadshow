var couch = require('./couch.js');
var uuid = require('node-uuid');
var url = 'http://127.0.0.1:5984'

couch.dropDB('user_account', function(err, response) {
  if (err) {
    console.log('Error:');
    console.log(err);
    return;
  }
});
couch.dropDB('auction', function(err, response) {
  if (err) {
    console.log('Error:');
    console.log(err);
    return;
  }
});

couch.createDB('user_account', function(err, response) {
  var db = 'user_account';
  couch.save(db, {_id: uuid.v4(), email: 'daenerys@fireandblood.com'}, function() {});
  couch.save(db, {_id: uuid.v4(), email: 'jaime@hearmeroar.com'}, function() {});
});

couch.createDB('auction', function(err, response) {
  var db = 'auction';
  couch.save(db, {_id: uuid.v4(), auction_name: 'Dragon Egg', start_bid: 50000, step: 200, image_path: 'dragon_egg.jpg'}, function() {});
  couch.save(db, {_id: uuid.v4(), auction_name: 'Golden Hand', start_bid: 300, step: 12, image_path: 'golden_hand.jpg'}, function() {});
});

