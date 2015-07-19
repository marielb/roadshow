var AppView = require('./views/create_auction_view');
var AppModel = require('./models/create_auction_model');
var template = require('../../templates/create_auction.mustache');
console.log(template);
module.exports = new AppView({
  el: '#js-app-wrapper',
  template: template,
  model: new AppModel(window.data)
});
