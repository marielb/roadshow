/**
* Create auction view
*/
'use strict';

var View = require('tungstenjs/adaptors/backbone').View;
var AuctionModel = require('../models/auction_model.js');
var NewAuctionView = require('../views/new_auction_view.js');

var AppView = View.extend({
  events: {
  	'change .js-item-photo-input': 'handleImageInput'
  },

  postInitialize: function() {
    console.log('NewAuctionView initialized!');
    console.log(this.model);
  },

  handleImageInput: function(e) {
  	this.model.set('image_name', e.target.files[0].name);
  	console.log(this.model);
  }
}, {
  debugName: 'NewAuctionView'
});

module.exports = AppView;