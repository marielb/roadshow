var AppView = require('./views/auction_detail_view');
var AppModel = require('./models/auction_model');
var template = require('../../templates/auction.mustache');
console.log(template);
module.exports = new AppView({
  el: '#js-app-wrapper',
  template: template,
  model: new AppModel(window.data.auction)
});
