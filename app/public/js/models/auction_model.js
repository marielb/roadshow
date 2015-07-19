/**
 * Auction model
 */
'use strict';

var TungstenBackboneBase = require('tungstenjs/adaptors/backbone');

var Model = TungstenBackboneBase.Model;
var AuctionModel = Model.extend({
  idAttribute: '_id',
  urlRoot: '/auction',
});
module.exports = AuctionModel;
