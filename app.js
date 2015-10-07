var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var expressValidator = require('express-validator');
var mysql = require('mysql');
var filenum = "";
var fileupload = "";
//for file upload
var multer          =       require('multer');
var upload      =   multer({ dest: './public/uploads/'});
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var user_browsing = require('./routes/user_browsing');
var browsing = require('./routes/browsing');
var posting = require('./routes/posting');
var signout = require('./routes/signout');
var document = require('./routes/document');
var fileup = require('./routes/fileup');
var es = require('./routes/esearch');
var app = express();

var accountSid = '<accountSid>'; 
var authToken = '<authToken>';

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 


var nodemailer = require('nodemailer');

//create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
 service: 'Gmail',
 auth: {
     user: 'cityconnect.ophack@gmail.com',
     pass: 'ctyconne'
 }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set port in environment for http server
app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/', signout);
app.use('/', admin);
app.use('/', posting);
app.use('/', browsing);
app.use('/', fileup);
app.use('/document',document);
app.use('/', es);
app.use('/user_browsing', user_browsing);

app.use(multer({ dest: './public/uploads/',
    rename: function (fieldname, filename) {
        return filename;
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
        filenum = file.originalname;
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
        console.log("---");
    	fileupload = file.path;
		console.log(file.originalname);
		var filePath = path.join(__dirname, fileupload);
		fs.readFile(filePath,function(err,data){
		    if (err){
		    	console.log(err);
		    }else{
		    	var base64data = new Buffer(data).toString('base64');
		        //console.log(base64data);
		        var json = '{\"file\":"'+base64data+'"}';
		        fs.writeFile("./uploads/json.file", json, function(err,data){
		        	if(!err){
		        		var exec = require('child_process').exec,child;
		        		var command = 'curl -X POST "localhost:9200/test/attachment/" -d @./uploads/json.file'
		        		child = exec(command,function(error,stout,stderr){
		        			if(error != null){
		        				console.log(error);
		        			}else{
		        				console.log("-----"+file.originalname);
		        				var PropertiesReader = require('properties-reader');
		        				var properties = PropertiesReader('./properties.file');
		        				var input = {
		        						file_name : file.originalname,
		        					    description : "Do not use this!!!",
		        					    fileid : file.filename+new Date(),
		        					    file_path : "/uploads/"+file.originalname,
		        					    file_title : file.originalname
		        				};
		        				console.log(input.file_path);
		        				console.log(" -- "+properties.get('domain.name'));
		        				var file_name = input.file_name;
		        			    var description = input.description;
		        			    var fileid = new Date().getTime().toString();
		        			    var filepath = input.file_path;

		        			    var sql="INSERT INTO FileInfo (filename,filepath,fileid,Description) values ('"+file_name+"','"+filepath+"','"+fileid+"','"+description+"') ";
		        				
		        			    var connection=getConnection();
		        				connection.query(sql, function(err, rows, fields) {
		        					if(err){
		        						console.log("ERROR: " + err.message);
		        					}
		        					else 
		        					{	// return err or result
		        						console.log("success");
		        					}
		        				});
		        				console.log("\nConnection closed..");
		        				connection.end();
		        				/*document.insertFileInfo(input, function(err, sucess){
		        					
		        				});*/
		        			}
		        		});
		        	}
		        });
		        
		    }
		});
    }
}));

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'ophack.cggze4xmpwt5.us-west-1.rds.amazonaws.com',
	    user     : 'root',
	    password : 'Opp_hack',
	    database : 'Ophack',
	    multipleStatements: true
	});
	return connection;
}

app.post('/api/photo',function(req,res){
   upload(req,res,function(err) {
       if(err) {
           return res.end("Error uploading file.");
       } else {
    	   
    	   //sms alerting .. uncomment nex section while integrating for demo
    	   console.log("File uploaded successfully...Sending notifications");
    	   client.messages.create({ 
    			to: "<>", 
    			from: "+1<>", 
    			body: "A new file has been uploaded. Please check the following URL://url /to/the/resource/",   
    		}, function(err, message) { 
    			console.log(message.sid); 
    		});
    	   
    	   var mailOptions = {
    			    from: 'cityconnect.ophack@gmail.com', // sender address
    			    to: 'cityconnect.ophack@gmail.com', // list of receivers
    			    subject: 'Important information for citizens of Campbell', // Subject line
    			    text: 'Hello beautiful citizens of the City of Campbell. We have a new document on the portal. Please check it by clicking on http://url/to/the/resource/ - Your opinion matters. Stay involved and stay updated. Greetings from CityConnect Team @ Campbell', // plaintext body
    			    html: '<b>Hello beautiful citizens of the City of Campbell. We have a new document on the portal. Please check it by clicking on <a href="http://url/to/the/resource/ target="_blank"">this</a> link - <br/>Your opinion matters. Stay involved and stay updated. <br/><br/>Greetings from <b>CityConnect Team @ Campbell</b></b>' // html body
    			};

    			// send mail with defined transport object
    			transporter.sendMail(mailOptions, function(error, info){
    			    if(error){
    			        console.log(error);
    			    }else{
    			        console.log('Message sent: ' + info.response);
    			    }
    			});
    	   //res.render('posting', { data: 'File uploaded successfully!' });
    	   res.redirect('/posting');
       }
       //res.end("File is uploaded");
   });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//start http server
http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
