var express = require('express');
var router = express.Router();
var mysql=require('./mysql');


exports.insertFileInfo = function(input, callback){
	console.log("insert document called");
	var file_name = input.file_name;
    var description = input.description;
    var fileid = input.fileid;
    var filepath = input.file_path;
    var filetitle = input.file_title;
    
    var sql="INSERT INTO FileInfo (filename,filepath,fileid,Description,filetitle) values ('"+file_name+"','"+filepath+"','"+fileid+"','"+description+"','"+filetitle+"') ";
	mysql.fetchData(function(err,rows){
          if (err)
          {console.log("Error inserting : %s ",err );
          res.render('posting',{error : "document already exist"});
          }
          else{
          res.render('posting',{error : "document is successfully created !"});
          }
	},sql);
}

//create document and store metadata
router.post('/create', function(req, res, next) {
	console.log("create document called");
	
    var input = JSON.parse(JSON.stringify(req.body));
    var file_name = input.file_name;
    var description = input.description;
    var fileid = new Date().getTime().toString();
    var filepath = input.file_path;

    var sql="INSERT INTO FileInfo (filename,filepath,fileid,Description) values ('"+file_name+"','"+filepath+"','"+fileid+"','"+description+"') ";
	mysql.fetchData(function(err,rows){
          if (err)
          {console.log("Error inserting : %s ",err );
          res.render('posting',{error : "document already exist"});
          }
          else{
          res.render('posting',{error : "document is successfully created !"});
          }
	},sql);
});

router.post('/remove', function(req, res, next) {
	console.log("remove document called");
	
	var input = JSON.parse(JSON.stringify(req.body));	
	var fileid = input.doc;
	
	 var sql="DELETE FROM FileInfo WHERE fileid ='"+fileid+"'";
	 mysql.fetchData(function(err,rows){
	 if(err)
         { console.log("Error deleting : %s ",err );
           res.render('posting',{error:err});
         }
         else{
         res.redirect('/document/list');
         }
	 
	 },sql);
	
});

router.get('/list', function(req, res, next) {
	console.log("list documents called");
	 
		var sql="SELECT * FROM FileInfo";
		  mysql.fetchData(function(err,rows){
	            if(err)
	            {   console.log("Error Selecting : %s ",err );}
	         
	            else if(rows.length === 0)
	            	{
	            	 res.render('posting',{page_title:"",error:"Oppps its empty directory. Start creating Doccument !"});
	            	}
	            else{
	            	console.log(rows.length);
	            	res.render('browsing', { title: 'Admin' , error: 'User successfully logged out !', param: rows});
	            	}  
		  },sql);
});

router.get('/list/user', function(req, res, next) {
	console.log("list documents called");
	 
		var sql="SELECT * FROM FileInfo";
		  mysql.fetchData(function(err,rows){
	            if(err)
	            {   console.log("Error Selecting : %s ",err );}
	         
	            else if(rows.length === 0)
	            	{
	            	 res.render('posting',{page_title:"",error:"Oppps its empty directory. Start creating Doccument !"});
	            	}
	            else{
	            	console.log(rows.length);
	            	res.send(rows);
	            	}  
		  },sql);
});

router.post('/file', function(req, res, next) {
	console.log("list documents called");
	 	
	var input = JSON.parse(JSON.stringify(req.body));	
	var fileid = input.file_id;
	
		var sql="SELECT * FROM FileInfo where fileid = '"+fileid+"';";
		  mysql.fetchData(function(err,rows){
	            if(err)
	            {   console.log("Error Selecting : %s ",err );}
	         
	            else if(rows.length === 0)
	            	{
	            	 res.render('posting',{page_title:"",error:"No file found !"});
	            	}
	            else{
	            	console.log(rows.length);
	            	res.render('browsing', { title: 'Admin' , error: 'User successfully logged out !', param: rows});
	            	}  
		  },sql);
});

module.exports = router;