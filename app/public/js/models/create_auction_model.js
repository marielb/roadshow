/**
 * Auction model
 */
'use strict';

var TungstenBackboneBase = require('tungstenjs/adaptors/backbone');

var Model = TungstenBackboneBase.Model;
var AuctionModel = require('../models/auction_model.js');

var AppModel = Model.extend({
  relations: {
    auction: AuctionModel
  },
  initialize: function() {
    // this.listenTo(this.get('todoItems'), 'add remove reset change', this.setCount);
    // this.listenTo(this, 'addItem', function(title) {
    //   // @todo add code to clear toggle-all button
    //   this.get('todoItems').add({title: title});
    // });
  }
});
module.exports = AppModel;