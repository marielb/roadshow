/**
 * Auction model
 */
'use strict';

var TungstenBackboneBase = require('tungstenjs/adaptors/backbone');

var Model = TungstenBackboneBase.Model;
var AuctionModel = require('./auction_model.js');

var AppModel = Model.extend({
  relations: {
    auction: AuctionModel
  },
});
module.exports = AppModel;
