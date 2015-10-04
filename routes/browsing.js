var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/browsing', function(req, res, next) {
	  res.render('browsing', { title: 'Admin' });
});

router.post('/browsing', function(req, res, next) {
	console.log('body: ' + JSON.stringify(req.body));
	//res.redirect('/browsing');
});

module.exports = router;
