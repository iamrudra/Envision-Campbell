var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads/'});

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
     pass: '<pass>'
 }
});

/* GET home page. */
router.get('/doc/upload', function(req, res, next) {
  res.render('fileup', { title: 'Express' });
});

router.post('/doc/upload',function(req,res){
   upload(req,res,function(err) {
       if(err) {
    	   res.render('posting', { data: 'File upload failed. Please try again later!' });
       } else {
    	   
    	   //sms alerting .. uncomment nex section while integrating for demo
    	   /*console.log("File uploaded successfully...Sending notifications");
    	   client.messages.create({ 
    			to: "<>", 
    			from: "+1<>", 
    			body: "A new file has been uploaded. Please check the following URL://url /to/the/resource/",   
    		}, function(err, message) { 
    			console.log(message.sid); 
    		});*/
    	   
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
   });
});

module.exports = router;
