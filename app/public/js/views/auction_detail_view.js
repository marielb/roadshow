/**
* View auction details view
*/
'use strict';

var View = require('tungstenjs/adaptors/backbone').View;
var AuctionModel = require('../models/auction_model.js');
var _ = require('underscore');

var AppView = View.extend({
  events: {
    'click .js-make-bid': 'handleMakeBid'
  },

  handleMakeBid: function(e) {
    console.log('Bid Made')
    console.log(this.model);
    e.preventDefault();
    this.model.save({}, {
      wait: true,
      success: function(model, response) {
        console.log(response);
      },
      error: function(model, response) {
        console.log('Error has occurred');
        console.log(response);
      }
    });
  },

  postInitialize: function() {
  	console.log('Auction Detail View initialized');
  },

}, {
  debugName: 'AuctionDetailView'
});

module.exports = AppView;
