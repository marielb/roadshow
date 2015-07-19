/**
* Create auction view
*/
'use strict';

var View = require('tungstenjs/adaptors/backbone').View;
var AuctionModel = require('../models/auction_model.js');
var _ = require('underscore');

var AppView = View.extend({
  events: {
  	'change .js-item-photo-input': 'handleImageInput'
  },

  model: null,

  handleImageInput: function(e) {
  	console.log(e.target.files[0].name);
  	this.model = new AuctionModel({
  		image_name: e.target.files[0].name
  	});
  	this.model.set('image_name', e.target.files[0].name);
  	console.log(this.model);
  }
}, {
  debugName: 'CreateAuctionView'
});

module.exports = AppView;