var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads/'});

/* GET home page. */
router.get('/api/photo', function(req, res, next) {
  res.render('fileup', { title: 'Express' });
});

router.post('/api/photo',function(req,res){
   upload(req,res,function(err) {
       if(err) {
           return res.end("Error uploading file.");
       }
       res.end("File is uploaded");
   });
});

module.exports = router;
