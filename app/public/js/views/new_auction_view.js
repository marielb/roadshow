/**
* Create auction view
*/
'use strict';

var View = require('tungstenjs/adaptors/backbone').View;
var AuctionModel = require('../models/auction_model.js');
var NewAuctionView = require('../views/new_auction_view.js');
var resizeImage = require('../vendor/resize.js');

var AppView = View.extend({
  events: {
  	'change .js-item-photo-input': 'handleImageInput',
    'click .js-crop': 'handleCrop'
  },

  postInitialize: function() {
    var self = this;
    this.reader = new FileReader();

    // Closure to capture the file information.
    var onloadReader = function(theFile) {
      self.model.set({
        image_name: theFile.name,
        image: theFile.target.result
      });

      // Kick everything off with the target image
      setTimeout(function() {
        resizeImage($('.js-resizable-image'));
      }, 100);
    };

    this.reader.onload = onloadReader;
  },

  handleCrop: function(e) {
    //Find the part of the image that is inside the crop box
    var crop_canvas;
    var $container =  $('.js-resizable-image').parent('.resize-container');
    var left = $('.overlay').offset().left - $container.offset().left;
    var top =  $('.overlay').offset().top - $container.offset().top;
    var width = $('.overlay').width();
    var height = $('.overlay').height();

    crop_canvas = document.createElement('canvas');
    crop_canvas.width = width;
    crop_canvas.height = height;

    crop_canvas.getContext('2d').drawImage(document.getElementById('js-resizable-image'), left, top, width, height, 0, 0, width, height);
    this.model.set({
      resized_image: crop_canvas.toDataURL("image/png"),
      step_3: true,
      step_2: false
    });

  },

  handleImageInput: function(e) {
    this.model.set('step_2', true);
    // Read in the image file as a data URL
    this.reader.readAsDataURL(e.target.files[0]);
  }

}, {
  debugName: 'NewAuctionView'
});

module.exports = AppView;