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
  },

  handleImageInput: function(e) {
  	this.model.set('image_name', e.target.files[0].name);
  	console.log(this.model);

    $('#js-canvas-holder').removeClass('canvas_holder_hidden');
    var context = document.getElementById('js-canvas').getContext('2d');
    var image = new Image;
    image.src = URL.createObjectURL(e.target.files[0]);
    image.onload = function() {
      context.drawImage(image, 20,20);
    }
  }
}, {
  debugName: 'NewAuctionView'
});

module.exports = AppView;