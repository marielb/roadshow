var AppView = require('./views/auction_detail_view');
var AppModel = require('./models/auction_model');
var template = require('../../templates/partials/_auction_detail.mustache');
console.log(template);
module.exports = new AppView({
  el: '#js-auction-details',
  template: template,
  model: new AppModel(window.data.auction),
});
