var AppView = require('./views/auction_view');
var AppModel = require('./models/auction_model');
var template = require('../templates/create_auction.mustache');

module.exports = new AppView({
  el: '#js-app-wrapper',
  template: template,
  model: new AppModel(window.data)
});