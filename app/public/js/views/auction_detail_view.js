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
    this.initializeTick();
  },
    // calls a method on the model 'tick' which updates the model triggering a change event and re-render of the component
  initializeTick: function() {
    // since this is in a set interval we must use bind to be in context of this view
    setInterval(_.bind(this.model.tick, this.model), 1000);
  },

}, {
  debugName: 'AuctionDetailView'
});

module.exports = AppView;
