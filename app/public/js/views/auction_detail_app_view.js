/**
* Create auction view
*/
'use strict';

var View = require('tungstenjs/adaptors/backbone').View;
var AuctionDetailView = require('./auction_detail_view.js');
var _ = require('underscore');

var AppView = View.extend({
  childViews: {
    'js-auction-details': AuctionDetailView
  },

  postInitialize: function() {
  	console.log('Auction Detail App View initialized!');
  },

}, {
  debugName: 'AuctionDetailAppView'
});

module.exports = AppView;
