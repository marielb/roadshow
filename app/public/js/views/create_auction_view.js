/**
* Create auction view
*/
'use strict';

var View = require('tungstenjs/adaptors/backbone').View;
var AuctionModel = require('../models/auction_model.js');
var NewAuctionView = require('../views/new_auction_view.js');
var _ = require('underscore');

var AppView = View.extend({
  childViews: {
    'js-new-auction': NewAuctionView
  },
  events: {
  },

  postInitialize: function() {
  	console.log('CreateAuctionView initialized!');
  },

}, {
  debugName: 'CreateAuctionView'
});

module.exports = AppView;