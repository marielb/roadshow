/**
 * Auction model
 */
'use strict';

var TungstenBackboneBase = require('tungstenjs/adaptors/backbone');

var Model = TungstenBackboneBase.Model;

var AuctionModel = Model.extend({
  idAttribute: '_id',
  urlRoot: '/auction',
  // called on an event by the view
  tick: function() {
    this.set('remaining_time', this._getFormattedTime());
  },
  _getFormattedTime: function() {
    var now = new Date();
    var endDate = new Date(this.get('end_date'));

    var diffSeconds = Math.round((endDate - now)/1000);

    return padZero(Math.round(diffSeconds/3600)) + ":" + padZero(Math.round((diffSeconds%3600) / 60)) + ":" + padZero(diffSeconds % 60);
  },
});

function padZero(x) {
  return x == 0 ? "00" : (x < 10) ? "0" + x : x;

}
module.exports = AuctionModel;
