var express = require('express');
var router = express.Router();
var fs = require('fs');

/* Open a page to create a new auction */
router.get('/', function(req, res, next) {
  res.render('create_auction', {
  });
});

/* Send the data to create a new auction*/
router.post('/', function(req, res, next) {
	// Image upload to /public/images
  fs.readFile(req.files.item_photo.path, function (err, data) {
	  var newPath = __dirname + "/images/";
	  fs.writeFile(newPath, data, function (err) {
		  res.redirect('/');
	  });
	});
});

module.exports = router;
