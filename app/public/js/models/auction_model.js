/**
 * Auction model
 */
'use strict';

var TungstenBackboneBase = require('tungstenjs/adaptors/backbone');

var Model = TungstenBackboneBase.Model;
var AuctionModel = Model.extend({
  postInitialize: function() {
    console.log('AuctionModel init');
  }
});
module.exports = AuctionModel;