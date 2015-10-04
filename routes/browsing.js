var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/browsing', function(req, res, next) {
	  res.render('browsing', { title: 'Admin' });
});

module.exports = router;
