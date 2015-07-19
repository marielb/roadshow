var express = require('express');
var router = express.Router();
var app = require('../app');

router.get('/', function(req, res, next) {
  req.app.mailer.send(req.query.template, {
    to: req.query.email,  
    subject: 'Roadshow Login',
    _id: req.query._id
  }, function (err) {
    if (err) {
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
  });
  switch (req.query.template) {
    case 'login_email':
      res.render('login', { message: { text: "A login email has been sent to your account" }});
      break;
  }
});

module.exports = router;