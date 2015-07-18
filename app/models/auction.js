var client = require('../conn.js');

var auctionModel = {
  auctioneer_id: 5,
  start_bid: 10.99,
  step: 0.51,
  image_path: '',
  auction_name: '',

  save: function() {
    var sql = 'INSERT INTO auction (auctioneer_id, auction_name, image_path, start_bid, step) VALUES ' +
      '(' + this.auctioneer_id + ',' +
            '\'' + this.auction_name + '\',' +
            '\'' + this.image_path + '\',' +
            this.start_bid + ',' +
            this.step + ')';
    var query = client.query(sql);
    query.on('end', function() {
      console.log(this);
      console.log(query);
      client.end(); });
  },
  get: function(id) {
    var sql = 'SELECT auction.id, image_path, auction_name, step, end_date, FROM auction ' +
      'LEFT JOIN bids ON auction.id = bids.auction_id '
  }
};

module.exports = auctionModel;
