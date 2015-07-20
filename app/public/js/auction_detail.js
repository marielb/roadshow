var AppView = require('./views/auction_detail_app_view');
var AppModel = require('./models/auction_detail_model');
var template = require('../../templates/auction.mustache');
console.log(template);
module.exports = new AppView({
  el: '#js-app-wrapper',
  template: template,
  model: new AppModel(window.data),
});
