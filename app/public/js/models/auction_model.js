/**
 * Auction model
 */
'use strict';

var TungstenBackboneBase = require('tungstenjs/adaptors/backbone');

var Model = TungstenBackboneBase.Model;
var AuctionModel = Model.extend({
  initialize: function() {
    console.log('AuctionModel init');
  }
});
module.exports = AuctionModel;