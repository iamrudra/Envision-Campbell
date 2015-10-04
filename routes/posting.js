var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/posting', function(req, res, next) {
	  res.render('posting', { title: 'Admin' });
});

module.exports = router;
