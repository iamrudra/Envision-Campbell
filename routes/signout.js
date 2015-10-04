var express = require('express');
var router = express.Router();

/* PUT admin page. */
router.get('/signout', function(req, res, next) {
	  res.render('admin', { title: 'Admin' , error: 'User successfully logged out !'});
});

module.exports = router;