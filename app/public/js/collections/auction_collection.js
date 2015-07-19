
/**
 * Auction collection
 */
'use strict';

var Model = require('../models/auction_model.js');
var Collection = require('tungstenjs/adaptors/backbone').Collection;
var AuctionCollection = Collection.extend({
  model: Model
});
module.exports = AuctionCollection;