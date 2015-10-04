var express = require('express');
var router = express.Router();
var mysql=require('./mysql');

/* GET admin page. */
router.get('/admin', function(req, res, next) {
	console.log("ohhhh its get");
	  res.render('admin', { title: 'Admin' , error: ''});
});

/* POST admin page. */
router.post('/admin', function(req, res, next) {
	  
	    var input = JSON.parse(JSON.stringify(req.body));
		var sql="SELECT * FROM users WHERE username ='"+input.email+"';";
		  mysql.fetchData(function(err,rows){
	            if(err)
	            {   console.log("Error Selecting : %s ",err );}
	         
	            else if(rows.length === 0)
	            	{
	            	 res.render('admin',{page_title:"",error:"username or password is not correct"});
	            	}
	            else
	            	{
	            	if(rows[0].password === input.password)
	            		{
	            		res.render('posting', { title: '', error: ''});
	            		}
	            	else{
	            		res.render('admin',{page_title:"Customers - Node.js",error:"password is not correct"});
	            		}
	            	}  
		  },sql);
});

module.exports = router;
